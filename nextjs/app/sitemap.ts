import type { MetadataRoute } from 'next';

/**
 * sitemap.xml — до этого отдавал 404.
 *
 * При четырёх страницах он не влияет на полноту обхода, но даёт быструю
 * переиндексацию после правок и данные в Search Console и Яндекс.Вебмастере.
 *
 * `/privacy` не включён: страница закрыта `noindex`, и держать её в карте
 * означало бы просить робота проиндексировать то, что мы сами запретили.
 */
const PAGES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/bitrix24', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/ai', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/contacts', priority: 0.6, changeFrequency: 'monthly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `https://aiethos.ru${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
