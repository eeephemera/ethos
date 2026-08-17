/**
 * LQIP (Low Quality Image Placeholder) для blur-up.
 *
 * ЗАЧЕМ. `next/image` умеет `placeholder="blur"` из коробки, но только для
 * статических импортов: на этапе сборки Next сам прогоняет файл через sharp и
 * вшивает крошечный base64. Для картинок, чей URL известен лишь в рантайме
 * (CMS, прайс поставщика, S3), такого плейсхолдера нет — Next физически не
 * может его посчитать заранее. Этот модуль закрывает ровно этот случай.
 *
 * ГДЕ ВЫПОЛНЯЕТСЯ. Только на сервере (Server Component / route handler).
 * `sharp` — нативный модуль, в браузерный бандл он не попадает и не должен.
 * Помечаем модуль `server-only`, чтобы случайный импорт из клиентского
 * компонента падал на сборке, а не в проде.
 *
 * АЛЬТЕРНАТИВА. Библиотека `plaiceholder` делает то же самое поверх sharp.
 * Здесь sharp используется напрямую: на одну зависимость меньше, а весь
 * пайплайн (размер, формат, качество, кэш, деградация) остаётся под контролем.
 */
import 'server-only';
import { deflateSync } from 'node:zlib';
import sharp from 'sharp';
import { rgbaToThumbHash, thumbHashToRGBA } from 'thumbhash';

/** Данные, которых достаточно, чтобы отрисовать картинку без единого CLS. */
export type BlurImageData = {
  src: string;
  /** base64 data URL для `placeholder="blur"`; null — если посчитать не вышло. */
  blurDataURL: string | null;
  /** Собственные размеры пикселей: держат место в layout до загрузки. */
  width: number;
  height: number;
};

type LqipOptions = {
  /** Ширина миниатюры в пикселях. 16–24 — золотая середина: ~300–800 байт. */
  size?: number;
  /** Таймаут на скачивание оригинала, мс. */
  timeoutMs?: number;
};

/**
 * Кэш на время жизни процесса.
 *
 * Один и тот же URL встречается на нескольких страницах и при каждом
 * ре-рендере на сервере. Без кэша это означало бы повторное скачивание
 * оригинала и повторную работу sharp на каждый запрос.
 *
 * Кэшируем именно Promise, а не результат: два параллельных запроса к одному
 * URL схлопываются в одну загрузку (single-flight), а не в две.
 */
const cache = new Map<string, Promise<BlurImageData>>();

/**
 * Считает blur-плейсхолдер и настоящие размеры удалённой картинки.
 *
 * Никогда не бросает исключение: недоступная картинка не должна ронять
 * страницу. В худшем случае вернётся `blurDataURL: null` — тогда компонент
 * покажет нейтральную заливку, а защита от CLS всё равно сработает, потому
 * что размеры передаются отдельно (`fallbackWidth`/`fallbackHeight`).
 */
export function getBlurImageData(
  src: string,
  fallbackWidth = 1200,
  fallbackHeight = 800,
  options: LqipOptions = {},
): Promise<BlurImageData> {
  const key = `${src}|${options.size ?? 20}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const task = computeBlurImageData(src, fallbackWidth, fallbackHeight, options).catch(
    (error: unknown) => {
      // Неудачу не кэшируем навсегда — следующий рендер попробует ещё раз.
      cache.delete(key);
      console.warn(`[lqip] не удалось построить плейсхолдер для ${src}:`, error);
      return { src, blurDataURL: null, width: fallbackWidth, height: fallbackHeight };
    },
  );

  cache.set(key, task);
  return task;
}

async function computeBlurImageData(
  src: string,
  fallbackWidth: number,
  fallbackHeight: number,
  { size = 20, timeoutMs = 8000 }: LqipOptions,
): Promise<BlurImageData> {
  const buffer = await fetchImage(src, timeoutMs);
  const image = sharp(buffer, { failOn: 'none' });
  const meta = await image.metadata();

  // EXIF-ориентация 5..8 меняет местами стороны — иначе получим перевёрнутый
  // aspect-ratio и как раз тот layout shift, от которого уходим.
  const swap = typeof meta.orientation === 'number' && meta.orientation >= 5;
  const width = (swap ? meta.height : meta.width) ?? fallbackWidth;
  const height = (swap ? meta.width : meta.height) ?? fallbackHeight;

  // WebP на 16–24 px даёт заметно меньший base64, чем JPEG, при той же картинке.
  // `rotate()` без аргументов применяет EXIF-ориентацию.
  const thumb = await image
    .rotate()
    .resize(size, size, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 55, effort: 4, smartSubsample: true })
    .toBuffer();

  return {
    src,
    blurDataURL: `data:image/webp;base64,${thumb.toString('base64')}`,
    width,
    height,
  };
}

async function fetchImage(src: string, timeoutMs: number): Promise<Buffer> {
  const response = await fetch(src, {
    signal: AbortSignal.timeout(timeoutMs),
    // Плейсхолдеры считаем один раз на сборке/первом рендере, дальше — из кэша.
    cache: 'force-cache',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}

/* ==========================================================================
   Вариант 2: ThumbHash
   --------------------------------------------------------------------------
   Если превью уже лежит в CMS/БД строкой (ThumbHash ~25 байт, BlurHash ~30),
   скачивать и жать оригинал не нужно вовсе: строка разворачивается в data URL
   на месте. Это дешевле любого sharp-пайплайна и работает даже там, где
   оригинал недоступен серверу рендера.

   ThumbHash предпочтительнее BlurHash: он компактнее, передаёт альфа-канал и
   сохраняет пропорции, а декодирование — чистая математика без зависимостей
   от canvas.
   ========================================================================== */

/** Кодирует картинку в ThumbHash — эту строку и стоит хранить в БД/CMS. */
export async function imageToThumbHash(input: Buffer | string): Promise<string> {
  const buffer = typeof input === 'string' ? await fetchImage(input, 8000) : input;
  // ThumbHash принимает максимум 100×100 RGBA.
  const { data, info } = await sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize(100, 100, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const hash = rgbaToThumbHash(info.width, info.height, data);
  return Buffer.from(hash).toString('base64');
}

/**
 * Разворачивает ThumbHash обратно в data URL для `placeholder="blur"`.
 *
 * Работает и на сервере, и на клиенте: PNG собирается вручную из RGBA, без
 * canvas и без нативных модулей.
 */
export function thumbHashToDataURL(base64Hash: string): string | null {
  try {
    const hash = Uint8Array.from(Buffer.from(base64Hash, 'base64'));
    const { w, h, rgba } = thumbHashToRGBA(hash);
    return `data:image/png;base64,${encodePng(w, h, rgba).toString('base64')}`;
  } catch (error) {
    console.warn('[lqip] некорректный ThumbHash:', error);
    return null;
  }
}

/**
 * Минимальный кодировщик PNG (truecolour + alpha, без фильтрации).
 *
 * Картинка ~32×32 px, поэтому «нулевой» фильтр и store-режим deflate дают
 * приемлемые 2–4 КБ, зато код обходится без единой зависимости.
 */
function encodePng(width: number, height: number, rgba: Uint8Array): Buffer {
  // Каждой строке сканирования предшествует байт типа фильтра (0 = None).
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * width * 4, width * 4).copy(raw, rowStart + 1);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // бит на канал
  ihdr[9] = 6; // тип цвета: truecolour with alpha
  // 10–12: compression / filter / interlace — все нулевые (стандартные).

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function pngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, crc]);
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
