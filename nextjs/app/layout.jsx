import Script from 'next/script';
import CookieNotice from '../components/CookieNotice';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://aiethos.ru'),
  title: 'ETHOS — внедрение и поддержка Битрикс24, ИИ-агенты для бизнеса',
  description:
    'Официальный партнёр Битрикс24 enterprise-уровня. Внедрение под ключ, поддержка и доработки, ИИ-агенты: продажи, аналитика, автозаполнение карточек товаров с фото и SEO-текстами.',
  openGraph: {
    title: 'ETHOS — Битрикс24 и ИИ в одной системе роста',
    description: 'Внедрение и поддержка Битрикс24, ИИ-агенты, которые снимают рутину с ваших команд.',
    type: 'website',
    locale: 'ru_RU',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ETHOS',
  description:
    'Официальный партнёр Битрикс24 enterprise-уровня: внедрение, поддержка и доработка Битрикс24, разработка ИИ-агентов для продаж, маркетинга, аналитики и поддержки клиентов. ИИ автоматически заполняет карточки товаров на сайте: подбирает фото и пишет SEO-тексты.',
  areaServed: 'RU',
  knowsAbout: ['Битрикс24', 'CRM', 'ИИ-агенты', 'автоматизация бизнес-процессов', 'SEO-тексты для карточек товаров'],
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Интеграция Битрикс24 под ключ' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Поддержка и доработка Битрикс24' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Внедрение ИИ-агентов' } },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <CookieNotice />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
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
