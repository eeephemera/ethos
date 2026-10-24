// Реквизиты исполнителей ETHOS.
//
// ETHOS — общий бренд двух ИП: ИИ-решения оказывает ИП Магомедов (он же владелец
// сайта), Битрикс24 — ИП Симонян. Отсюда берут данные страница контактов, подвалы,
// политика конфиденциальности и разметка schema.org — реквизиты правьте только
// здесь, иначе страницы разойдутся между собой.

export const IP_AI = {
  key: 'ai',
  direction: 'ИИ-решения',
  person: 'Магомедов Закир Асланович',
  fullName: 'Индивидуальный предприниматель Магомедов Закир Асланович',
  shortName: 'ИП Магомедов З. А.',
  inn: '054210247290',
  ogrnip: '326050000095170',
  region: 'Республика Дагестан',
  city: 'Дербент',
  address: 'Республика Дагестан, г. Дербент',
  registered: '22 июня 2026 г.',
  taxRegime: 'УСН',
  activity: 'Разработка компьютерного программного обеспечения (ОКВЭД 62.01)',
  msp: 'Микропредприятие',
};

export const IP_B24 = {
  key: 'b24',
  direction: 'Битрикс24',
  person: 'Симонян Виолетта Андреевна',
  fullName: 'Индивидуальный предприниматель Симонян Виолетта Андреевна',
  shortName: 'ИП Симонян В. А.',
  inn: '500324213700',
  ogrnip: '325508100140492',
  region: 'Москва',
  city: 'Москва',
  address: 'г. Москва',
  registered: '13 марта 2025 г.',
  taxRegime: 'УСН',
  // 62.01 — дополнительный код (основной — 47.91), поэтому на сайте строка
  // называется «Вид деятельности», а не «Основной вид деятельности».
  activity: 'Разработка компьютерного программного обеспечения (ОКВЭД 62.01)',
  msp: 'Микропредприятие',
};

// Порядок вывода везде: сначала ИИ-решения, потом Битрикс24.
export const PROVIDERS = [IP_AI, IP_B24];

// Владелец сайта — тот, на кого оформлены домен и хостинг (149-ФЗ, ст. 10).
export const SITE_OWNER = IP_AI;

// Узел schema.org для исполнителя: subOrganization бренда и provider услуги.
export function providerJsonLd(p) {
  return {
    '@type': 'Organization',
    '@id': `https://aiethos.ru/#ip-${p.key}`,
    name: p.shortName,
    legalName: p.fullName,
    taxID: p.inn,
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'ИНН', value: p.inn },
      { '@type': 'PropertyValue', propertyID: 'ОГРНИП', value: p.ogrnip },
    ],
    address: { '@type': 'PostalAddress', addressCountry: 'RU', addressRegion: p.region, addressLocality: p.city },
  };
}
