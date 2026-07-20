# Ethos — aiethos.ru

Лендинг «Терра» (внедрение и поддержка Битрикс24, ИИ-агенты для бизнеса) на Next.js.

## Структура

```
nextjs/     — приложение Next.js (App Router). Три страницы: /, /bitrix24, /ai
deploy/     — всё для деплоя на сервер (systemd, nginx, certbot, скрипт)
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

## Деплой на сервер

См. [`deploy/DEPLOY.md`](deploy/DEPLOY.md). Коротко — на сервере:

```bash
git clone https://github.com/eeephemera/ethos.git /opt/ethos
cd /opt/ethos && git checkout claude/deploy-ethos-server-nigp2j
CERTBOT_EMAIL="you@example.com" bash deploy/deploy.sh
```
