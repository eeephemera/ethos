import MainPage from '../components/MainPage';

export const metadata = {
  title: "ETHOS — внедрение и поддержка Битрикс24, ИИ-агенты для бизнеса",
  description: "Официальный партнёр Битрикс24 enterprise-уровня. Внедрение под ключ, поддержка и доработки, ИИ-агенты: продажи, аналитика, автозаполнение карточек товаров с фото и SEO-текстами.",
  alternates: { canonical: '/' },
  openGraph: {
    title: "ETHOS — Битрикс24 и ИИ в одной системе роста",
    description: "Внедрение и поддержка Битрикс24, ИИ-агенты, которые снимают рутину с ваших команд.",
    type: 'website', locale: 'ru_RU', url: '/',
  },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "ETHOS",
    "description": "Официальный партнёр Битрикс24 enterprise-уровня: внедрение, поддержка и доработка Битрикс24, разработка ИИ-агентов для продаж, маркетинга, аналитики и поддержки клиентов. ИИ автоматически заполняет карточки товаров на сайте: подбирает фото и пишет SEO-тексты.",
    "areaServed": "RU",
    "knowsAbout": ["Битрикс24", "CRM", "ИИ-агенты", "автоматизация бизнес-процессов", "SEO-тексты для карточек товаров"],
    "makesOffer": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Интеграция Битрикс24 под ключ" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Поддержка и доработка Битрикс24" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Внедрение ИИ-агентов" } }
    ]
  };

export default function Page() {
  return (
    <>
      <MainPage />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
