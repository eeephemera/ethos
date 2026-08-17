import type { MetadataRoute } from 'next';

/** Веб-манифест: до этого /manifest.json отдавал 404. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ETHOS — интегратор ИИ и Битрикс24',
    short_name: 'ETHOS',
    description:
      'Внедрение ИИ и Битрикс24: ИИ-агенты, автозаполнение карточек товаров, интеграции с 1С и базами данных.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF8',
    theme_color: '#155EEF',
    lang: 'ru',
    icons: [
      { src: '/icon.png', sizes: '256x256', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
