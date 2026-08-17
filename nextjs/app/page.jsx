import MainPage from '../components/MainPage';
import { getProductBlurMap } from '../lib/productImages';

export const metadata = {
  title: "ETHOS — интегратор ИИ и Битрикс24 для бизнеса",
  description: "Интегратор ИИ и Битрикс24: внедрение под ключ, поддержка и доработки, ИИ-агенты для продаж и аналитики, автозаполнение карточек товаров. Диагностика бесплатно.",
  alternates: { canonical: '/' },
  openGraph: {
    title: "ETHOS — Битрикс24 и ИИ в одной системе роста",
    // Именно это видно в превью ссылки в Telegram и WhatsApp — основных
    // каналах обращений. Поэтому здесь выгода, а не перечень услуг.
    description: "Внедрение и поддержка Битрикс24, ИИ-агенты и автозаполнение карточек товаров: снимаем рутину с команды и повышаем эффективность сотрудников.",
    type: 'website', locale: 'ru_RU', url: '/',
  },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "ETHOS",
    "description": "Сертифицированный интегратор Битрикс24: внедрение, поддержка и доработка Битрикс24, разработка ИИ-агентов для продаж, маркетинга, аналитики и поддержки клиентов. ИИ автоматически заполняет карточки товаров на сайте: подбирает фото и пишет SEO-тексты.",
    "areaServed": "RU",
    "knowsAbout": ["Битрикс24", "CRM", "ИИ-агенты", "автоматизация бизнес-процессов", "SEO-тексты для карточек товаров"],
    "makesOffer": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Интеграция Битрикс24 под ключ" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Поддержка и доработка Битрикс24" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Внедрение ИИ-агентов" } }
    ]
  };

/**
 * Server Component.
 *
 * Blur-плейсхолдеры для удалённых картинок считаются здесь, на сервере: sharp
 * — нативный модуль, ему нечего делать в браузерном бандле. Клиентский
 * MainPage получает готовые base64 и настоящие размеры пропсами и рисует их
 * через <BlurImage> без единого layout shift.
 */
export default async function Page() {
  const productBlur = await getProductBlurMap();

  return (
    <>
      <MainPage productBlur={productBlur} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
