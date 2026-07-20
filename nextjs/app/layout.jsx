import './globals.css';

export const metadata = {
  metadataBase: new URL('https://aiethos.ru'),
  title: 'Терра — внедрение и поддержка Битрикс24, ИИ-агенты для бизнеса',
  description:
    'Официальный партнёр Битрикс24 enterprise-уровня. Внедрение под ключ, поддержка и доработки, ИИ-агенты: продажи, аналитика, автозаполнение карточек товаров с фото и SEO-текстами.',
  openGraph: {
    title: 'Терра — Битрикс24 и ИИ в одной системе роста',
    description: 'Внедрение и поддержка Битрикс24, ИИ-агенты, которые снимают рутину с ваших команд.',
    type: 'website',
    locale: 'ru_RU',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Терра',
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
