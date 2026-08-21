import Script from 'next/script';
import { Inter, Manrope } from 'next/font/google';
import CookieNotice from '../components/CookieNotice';
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
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* Метрика — сторонний домен на 271 КБ; ранний коннект экономит
            DNS + TLS, когда скрипт всё-таки начнёт грузиться. */}
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }} />
      </head>
      <body>
        {children}
        <CookieNotice />
        <MobileActionBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Yandex.Metrika counter — lazyOnload: счётчик не конкурирует
            с отрисовкой и не портит INP на слабых телефонах. */}
        <Script id="yandex-metrika" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `
          (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=110919394', 'ym');
          ym(110919394, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        ` }} />
        <noscript><div><img src="https://mc.yandex.ru/watch/110919394" style={{ position: 'absolute', left: '-9999px' }} alt="" /></div></noscript>
        {/* /Yandex.Metrika counter */}
      </body>
    </html>
  );
}
