import 'server-only';
import { getBlurImageData, type BlurImageData } from './lqip';

/**
 * Демо-товары для анимации «ИИ собирает карточку» на главной.
 *
 * URL-ы удалённые, поэтому статический импорт с автоматическим
 * `placeholder="blur"` тут не работает — плейсхолдеры считаются на сервере
 * (см. lib/lqip.ts) и уезжают в клиентский компонент готовыми пропсами.
 */
export const PRODUCT_IMAGES = [
  {
    id: 'prod0',
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=520&q=80',
    width: 520,
    height: 347,
  },
  {
    id: 'prod1',
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=520&q=80',
    width: 520,
    height: 347,
  },
  {
    id: 'prod2',
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=520&q=80',
    width: 520,
    height: 347,
  },
  {
    id: 'prod3',
    src: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=520&q=80',
    width: 520,
    height: 347,
  },
] as const;

/**
 * Каталог для демо «ИИ собирает карточку» на странице /ai.
 *
 * Товары намеренно другие, чем на главной: страницы стоят рядом в навигации,
 * и одинаковая анимация с теми же фото читалась бы как копипаста.
 */
export const AI_PRODUCT_IMAGES = [
  // Каждое фото проверено глазами и соответствует тексту карточки:
  // дрель-шуруповёрт DeWalt, склад металлопроката, системный блок в стекле.
  {
    id: 'ai0',
    src: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=520&q=80',
    width: 520,
    height: 347,
  },
  {
    id: 'ai1',
    src: 'https://images.unsplash.com/photo-1671022442106-c787685d9fed?auto=format&fit=crop&w=520&q=80',
    width: 520,
    height: 347,
  },
  {
    id: 'ai2',
    src: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=520&q=80',
    width: 520,
    height: 780,
  },
] as const;

export type ProductImageId = (typeof PRODUCT_IMAGES)[number]['id'];
export type ProductBlurMap = Record<string, BlurImageData>;

/**
 * Считает LQIP для всех демо-картинок разом.
 *
 * Вызывается из Server Component страницы. Внутри — кэш по URL на время жизни
 * процесса, так что реальная работа (скачать + sharp) происходит один раз,
 * а не на каждый запрос. Сеть недоступна — вернётся `blurDataURL: null`,
 * страница соберётся и отрисуется как обычно.
 */
export async function getProductBlurMap(): Promise<ProductBlurMap> {
  return blurMapFor(PRODUCT_IMAGES);
}

/** То же самое для демо-каталога на /ai. */
export async function getAiProductBlurMap(): Promise<ProductBlurMap> {
  return blurMapFor(AI_PRODUCT_IMAGES);
}

async function blurMapFor(
  list: ReadonlyArray<{ id: string; src: string; width: number; height: number }>,
): Promise<ProductBlurMap> {
  const entries = await Promise.all(
    list.map(async (p) => [p.id, await getBlurImageData(p.src, p.width, p.height)] as const),
  );
  return Object.fromEntries(entries);
}
