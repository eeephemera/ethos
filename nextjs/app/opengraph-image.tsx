import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * OG-картинка 1200×630 для всех страниц.
 *
 * До этого `og:image` не было ни на одной странице, а единственные каналы связи
 * компании — Telegram и WhatsApp: отправленная туда ссылка разворачивалась в
 * карточку без изображения. Это резало CTR ровно там, где идёт основной трафик.
 *
 * Шрифты читаются с диска (assets/*.ttf), а не тянутся из сети: satori не умеет
 * woff2, а сборка не должна зависеть от доступности Google. Картинка рендерится
 * на этапе сборки — в рантайме это статический файл.
 */
export const alt = 'ETHOS — интегратор ИИ и Битрикс24 для бизнеса';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BLUE = '#155EEF';
const CYAN = '#12A5E0';
const INK = '#14171C';

export default async function OpengraphImage() {
  const [manrope, inter] = await Promise.all([
    readFile(join(process.cwd(), 'assets', 'Manrope-ExtraBold.ttf')),
    readFile(join(process.cwd(), 'assets', 'Inter-Regular.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#FAFAF8',
          position: 'relative',
        }}
      >
        {/* мягкие блики фирменных цветов — как на самом сайте */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: BLUE,
            opacity: 0.16,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -260,
            left: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: CYAN,
            opacity: 0.14,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 30,
              fontFamily: 'Manrope',
            }}
          >
            E
          </div>
          <div style={{ fontSize: 34, fontFamily: 'Manrope', color: INK, letterSpacing: -0.5 }}>ETHOS</div>
          <div style={{ fontSize: 22, fontFamily: 'Inter', color: '#8A8F99', marginTop: 6 }}>
            · интегратор ИИ и Битрикс24
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 68,
              fontFamily: 'Manrope',
              color: INK,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            У вас есть боль —
          </div>
          <div
            style={{
              fontSize: 68,
              fontFamily: 'Manrope',
              color: BLUE,
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            решаем её с помощью ИИ
          </div>
          <div style={{ fontSize: 27, fontFamily: 'Inter', color: '#535C69', marginTop: 26, maxWidth: 900 }}>
            ИИ-агенты, автозаполнение карточек товаров, интеграции с Битрикс24, 1С и вашей базой данных
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {['Пилот за 2–3 недели', '1000+ карточек в час', 'Диагностика бесплатно'].map((chip) => (
            <div
              key={chip}
              style={{
                fontSize: 22,
                fontFamily: 'Inter',
                color: INK,
                background: '#fff',
                border: '1px solid #E7E6E2',
                borderRadius: 999,
                padding: '12px 24px',
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Manrope', data: manrope, weight: 800, style: 'normal' },
        { name: 'Inter', data: inter, weight: 400, style: 'normal' },
      ],
    },
  );
}
