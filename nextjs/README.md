# ETHOS / aiethos.ru — сайт на Next.js

Три страницы, портированные один-в-один из дизайна (Design Components):

| Роут         | Компонент                     | Что это                                   |
|--------------|-------------------------------|-------------------------------------------|
| `/`          | `components/MainPage.jsx`      | Главная (ETHOS Liquid Glass)              |
| `/bitrix24`  | `components/Bitrix24Page.jsx`  | Внедрение и поддержка Битрикс24           |
| `/ai`        | `components/AiPage.jsx`        | Внедрение ИИ и автоматизация              |

App Router, без сторонних UI-библиотек. Стили — инлайновые, как в исходном дизайне
(хелпер `s()` в `components/_ui.js` превращает CSS-строку в объект стилей React).
Ховер-состояния вынесены в CSS-классы (`FXCSS` в каждом компоненте). `@keyframes`,
scroll-reveal и анти-overflow правило — в `app/globals.css`.

## Адаптивность

Все переключения раскладки живут в CSS-переменных — блок «adaptive design tokens»
в `app/globals.css`, доступ к ним через `components/_responsive.js`.

Так сделано намеренно. Раньше раскладка считалась в JS из `window.innerWidth` и
хранилась в state: на сервере `window` нет, поэтому SSR всегда отдавал десктопную
сетку, а React при гидратации не переписывает несовпавшие inline-стили — на
телефоне вёрстка навсегда оставалась десктопной и текст уезжал за экран. Теперь
разметка на сервере и на клиенте одинаковая, правильная раскладка появляется с
первого кадра, CLS = 0.

**Правило:** ничего, что влияет на раскладку, не должно зависеть от `window` при
первом рендере. Нужен новый брейкпоинт — добавляйте переменную в `:root`, а не
условие в JS.

## Карусели на главной

Первый экран (сцены ИИ-агента) и слайдер «Что вы получаете с Битрикс24»
листаются свайпом, стрелками и точками; автопоказ выключается при первом же
ручном действии. Позиция трека собирается в CSS из `--i` (индекс, пишет React) и
`--drag` (палец, пишется напрямую в DOM без setState) — см. `.carousel-*` в
`app/globals.css`.

## Картинки

Blur-up поверх `next/image`: `components/BlurImage.tsx` + `lib/lqip.ts`.
Подробности и примеры для статических и удалённых картинок — в
[`components/BLUR-UP.md`](./components/BLUR-UP.md).

## Запуск

```bash
cd nextjs
npm install
npm run dev        # http://localhost:3000
```

## Прод

```bash
npm run build
npm start          # или деплой на Vercel (настройки по умолчанию)
```

`npm run build` заодно проверяет типы: `.ts`/`.tsx` (blur-up) типизируются
строго, `.jsx` — с `checkJs: false`. Пакет `typescript` лежит в
`devDependencies`, поэтому на сервере ставим зависимости с `--include=dev`
(так и делает `deploy/deploy.sh`).

## SEO

- Пер-страничные `title` / `description` / OpenGraph — в `metadata` каждого роута
  (`app/*/page.jsx`).
- JSON-LD (schema.org): `Service` + `BreadcrumbList` + `FAQPage` на `/bitrix24` и `/ai`,
  плюс site-wide `ProfessionalService` в `app/layout.jsx`.
- `metadataBase` = `https://aiethos.ru` (правится в `app/layout.jsx`) — от него
  строятся canonical и og:url.

## Что заменить перед продом

- Плейсхолдер логотипа Битрикс24 («Б24») — на официальный знак партнёра
- Ссылки Telegram / WhatsApp (`t.me` / `wa.me` в компонентах — проп по умолчанию)
- OG-изображение (сейчас не задано) в `app/layout.jsx`

## Деплой на сервер (aiethos.ru)

Вариант со статикой (быстрее) описан в корневом `../deploy/DEPLOY.md`.
Для Next.js на своём сервере: `npm run build`, затем `npm start` под PM2 +
nginx как reverse-proxy на порт 3000, HTTPS через certbot.
