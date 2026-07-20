# Терра / aiethos.ru — сайт на Next.js

Три страницы, портированные один-в-один из дизайна (Design Components):

| Роут         | Компонент                     | Что это                                   |
|--------------|-------------------------------|-------------------------------------------|
| `/`          | `components/MainPage.jsx`      | Главная (Терра Liquid Glass)              |
| `/bitrix24`  | `components/Bitrix24Page.jsx`  | Внедрение и поддержка Битрикс24           |
| `/ai`        | `components/AiPage.jsx`        | Внедрение ИИ и автоматизация              |

App Router, без сторонних UI-библиотек. Стили — инлайновые, как в исходном дизайне
(хелпер `s()` в `components/_ui.js` превращает CSS-строку в объект стилей React).
Ховер-состояния вынесены в CSS-классы (`FXCSS` в каждом компоненте). `@keyframes`,
scroll-reveal и анти-overflow правило — в `app/globals.css`.

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

> ⚠️ Порт собран автоматической конвертацией дизайна в React и провалидирован
> рендером, но `npm run build` в этой среде не запускался. Перед деплоем выполните
> `npm run build` — это финальная проверка SSR/типов.

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
