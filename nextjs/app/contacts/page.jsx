import ContactsPage from '../../components/ContactsPage';

export const metadata = {
  title: 'Контакты и реквизиты — ETHOS, интегратор ИИ и Битрикс24',
  description:
    'Телефон, e-mail и мессенджеры ETHOS, реквизиты ИП: ИНН, ОГРНИП, адрес. Отвечаем в течение рабочего дня. Диагностика процессов — бесплатно.',
  alternates: { canonical: '/contacts' },
  openGraph: {
    title: 'Контакты ETHOS — интегратор ИИ и Битрикс24',
    description: 'Телефон, e-mail, мессенджеры и полные реквизиты. Отвечаем в течение рабочего дня.',
    type: 'website',
    locale: 'ru_RU',
    url: '/contacts',
  },
};

// Организация с полными реквизитами и способами связи — базовый сигнал доверия
// и для поиска, и для AI-ассистентов. Хлебные крошки — абсолютными URL,
// иначе Google отбрасывает разметку целиком.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://aiethos.ru/#organization',
      name: 'ETHOS',
      legalName: 'Индивидуальный предприниматель Магомедов Закир Асланович',
      url: 'https://aiethos.ru',
      email: 'magomedov_zak_05@mail.ru',
      telephone: '+7-925-677-70-27',
      taxID: '054210247290',
      vatID: '054210247290',
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
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: '+7-925-677-70-27',
          email: 'magomedov_zak_05@mail.ru',
          availableLanguage: 'Russian',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://aiethos.ru/' },
        { '@type': 'ListItem', position: 2, name: 'Контакты', item: 'https://aiethos.ru/contacts' },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <ContactsPage />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
