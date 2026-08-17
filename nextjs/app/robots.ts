import type { MetadataRoute } from 'next';

/**
 * robots.txt — до этого отдавал 404.
 *
 * Формально отсутствие файла краулинг не блокирует, но для Яндекса это
 * стандартная точка входа при первом обходе, и без него негде объявить sitemap.
 *
 * `/privacy` намеренно НЕ закрыт в robots: страница уже отдаёт
 * `noindex, follow` мета-тегом. Если запретить обход, робот не увидит noindex
 * и сможет показать голый URL в выдаче — типовая ловушка.
 *
 * AI-краулеры (GPTBot, ClaudeBot, PerplexityBot) не закрываем: они дают
 * цитирование в AI-выдаче, а это для нас канал, а не угроза.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://aiethos.ru/sitemap.xml',
    host: 'https://aiethos.ru',
  };
}
