# Ethos — aiethos.ru

Лендинг «ETHOS» (внедрение и поддержка Битрикс24, ИИ-агенты для бизнеса) на Next.js.

## Структура

```
nextjs/     — приложение Next.js (App Router). Три страницы: /, /bitrix24, /ai
deploy/     — конфиги и скрипты сервера (systemd, nginx) — для справки, не запускать
```

## Локальный запуск

```bash
cd nextjs
npm install
npm run dev        # http://localhost:3000
```

## Прод-сборка

```bash
cd nextjs
npm run build
npm start
```

## Выкатка на сервер

Сайт на сервер выкладываем мы, владельцы сайта. Свои правки присылайте
Pull Request'ом в `main`. Перед отправкой `npm run build` в `nextjs/` должен
проходить без ошибок.

Скрипты из `deploy/` не запускайте и сами на сервер ничего не выкладывайте.
