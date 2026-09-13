import { Inter, Manrope } from 'next/font/google';
import CookieNotice from '../components/CookieNotice';
import { CONSENT_HEAD_SCRIPT } from '../components/consent';
import MobileActionBar from '../components/MobileActionBar';
import './globals.css';

// Шрифты через next/font: Next скачивает их на этапе сборки и раздаёт со своего
// домена. Раньше был `@import` внутри CSS — блокирующая цепочка
// HTML → CSS → CSS Google → файлы шрифтов, минимум два лишних round-trip до
// первой отрисовки текста, плюс зависимость российской аудитории от
// доступности Google и передача IP посетителей Google мимо политики.
// Набор начертаний сокращён до реально используемых.
const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
});

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-manrope',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
});

export const metadata = {
  metadataBase: new URL('https://aiethos.ru'),
  title: 'ETHOS — интегратор ИИ и Битрикс24 для бизнеса',
  description:
    'Интегратор ИИ и Битрикс24: внедрение под ключ, поддержка и доработки, ИИ-агенты для продаж и аналитики, автозаполнение карточек товаров. Диагностика бесплатно.',
  openGraph: {
    title: 'ETHOS — Битрикс24 и ИИ в одной системе роста',
    // Это текст, который видно в превью ссылки в Telegram и WhatsApp —
    // основных каналах обращений. Поэтому здесь не список услуг, а выгода.
    description:
      'Внедрение и поддержка Битрикс24, ИИ-агенты и автозаполнение карточек товаров: снимаем рутину с команды и повышаем эффективность сотрудников.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ETHOS',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/icon.png', shortcut: '/favicon.ico', apple: '/apple-icon.png' },
};

export const viewport = {
  themeColor: '#155EEF',
  colorScheme: 'light',
};

// Organization + WebSite: базовые сущности бренда. Без них «ETHOS» ни с чем не
// связан за пределами домена — а брендовую выдачу ещё и делит с американской
// AIEthos. Реквизиты ИП здесь же: для B2B это сигнал доверия, для 152-ФЗ —
// обязательное указание оператора персональных данных.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://aiethos.ru/#organization',
      name: 'ETHOS',
      legalName: 'Индивидуальный предприниматель Магомедов Закир Асланович',
      url: 'https://aiethos.ru',
      logo: 'https://aiethos.ru/icon.png',
      image: 'https://aiethos.ru/opengraph-image',
      email: 'magomedov_zak_05@mail.ru',
      telephone: '+7-925-677-70-27',
      taxID: '054210247290',
      identifier: [
        { '@type': 'PropertyValue', propertyID: 'ИНН', value: '054210247290' },
        { '@type': 'PropertyValue', propertyID: 'ОГРНИП', value: '326050000095170' },
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'RU',
        addressRegion: 'Республика Дагестан',
        addressLocality: 'Дербент',
      },
      areaServed: 'RU',
      description:
        'Интегратор ИИ и Битрикс24: внедрение, поддержка и доработка Битрикс24, разработка ИИ-агентов для продаж, маркетинга, аналитики и поддержки клиентов, автозаполнение карточек товаров и SEO-текстов.',
      knowsAbout: [
        'Битрикс24',
        'CRM',
        'ИИ-агенты',
        'автоматизация бизнес-процессов',
        'SEO-тексты для карточек товаров',
        'интеграция с 1С',
        'PostgreSQL',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: '+7-925-677-70-27',
          email: 'magomedov_zak_05@mail.ru',
          availableLanguage: 'Russian',
          areaServed: 'RU',
        },
      ],
      makesOffer: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Интеграция Битрикс24 под ключ' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Поддержка и доработка Битрикс24' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Внедрение ИИ-агентов' } },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://aiethos.ru/#website',
      url: 'https://aiethos.ru',
      name: 'ETHOS',
      inLanguage: 'ru-RU',
      publisher: { '@id': 'https://aiethos.ru/#organization' },
    },
  ],
};

// Предзагрузка соседних страниц. Их всего три, поэтому переход по главному
// пути пользователя после этого ощущается мгновенным.
const speculationRules = {
  prefetch: [{ source: 'list', urls: ['/bitrix24', '/ai', '/contacts'], eagerness: 'moderate' }],
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: атрибут согласия на <html> ставит скрипт ниже до гидрации.
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Уже выбравшим (Принять/Отклонить) баннер скрывается до первой отрисовки.
            preconnect к mc.yandex.ru убран намеренно: до согласия браузер не должен
            соединяться с Метрикой (152-ФЗ). */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_HEAD_SCRIPT }} />
        {/* Без JS Метрика не загрузится вовсе — спрашивать не о чем. */}
        <noscript dangerouslySetInnerHTML={{ __html: '<style>.cookie-notice{display:none!important}</style>' }} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }} />
      </head>
      <body>
        {children}
        <CookieNotice />
        <MobileActionBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* Яндекс Метрика подключается в CookieNotice — только после «Принять».
            Noscript-пиксель не ставим: он собирал бы данные без согласия. */}
      </body>
    </html>
  );
}
