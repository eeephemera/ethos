# Деплой aiethos.ru на сервер

Сайт — Next.js (App Router). Все страницы статические, но раздаются через
`next start` (Node) за nginx-реверс-прокси. HTTPS — Let's Encrypt (certbot).

- **Сервер:** `72.56.5.23`
- **Домен:** `aiethos.ru`
- **Репозиторий:** https://github.com/eeephemera/ethos.git
- **Ветка:** `claude/deploy-ethos-server-nigp2j`

---

## ⚠️ Сначала — DNS

На момент подготовки `aiethos.ru` указывал на `83.217.220.10`, а не на сервер
`72.56.5.23`. **HTTPS не выпустится**, пока A-запись не будет указывать на сервер.

В панели управления доменом задайте:

| Тип | Имя   | Значение      |
|-----|-------|---------------|
| A   | `@`   | `72.56.5.23`  |
| A   | `www` | `72.56.5.23`  |

Подождите распространения DNS (обычно минуты, максимум пара часов). Проверить:

```bash
dig +short aiethos.ru        # должно вернуть 72.56.5.23
```

---

## Деплой одной командой

Зайдите на сервер и выполните:

```bash
ssh root@72.56.5.23

apt-get update && apt-get install -y git
git clone https://github.com/eeephemera/ethos.git /opt/ethos
cd /opt/ethos
git checkout claude/deploy-ethos-server-nigp2j

# email нужен для автоматического выпуска сертификата (можно опустить и выпустить вручную)
CERTBOT_EMAIL="you@example.com" bash deploy/deploy.sh
```

Скрипт `deploy/deploy.sh`:

1. Ставит Node.js 22, nginx, git, certbot.
2. Собирает приложение (`npm ci && npm run build`).
3. Ставит и запускает systemd-сервис `ethos` (слушает `127.0.0.1:3000`).
4. Ставит nginx-конфиг реверс-прокси для `aiethos.ru`.
5. Если DNS уже указывает на сервер — выпускает HTTPS-сертификат и включает редирект на https.

Повторный запуск безопасен: подтянет свежий код, пересоберёт и перезапустит.

---

## Что происходит под капотом

| Компонент       | Файл                          | Назначение                                |
|-----------------|-------------------------------|-------------------------------------------|
| systemd         | `deploy/ethos.service`        | Держит `npm run start` живым на порту 3000 |
| nginx           | `deploy/nginx-aiethos.conf`   | Реверс-прокси 80/443 → 127.0.0.1:3000     |
| certbot         | (ставится скриптом)           | Сертификат Let's Encrypt + авто-редирект  |

---

## Полезные команды

```bash
# логи приложения
journalctl -u ethos -f

# перезапуск после ручных изменений
systemctl restart ethos

# проверка, что Node-сервер отвечает локально
curl -I http://127.0.0.1:3000

# проверка/перезагрузка nginx
nginx -t && systemctl reload nginx

# выпустить сертификат вручную (после настройки DNS)
certbot --nginx -d aiethos.ru -d www.aiethos.ru

# обновить сайт до свежего коммита
cd /opt/ethos && bash deploy/deploy.sh
```

---

## HTTPS: сертификат выпущен через DNS-01

На этом сервере публичный IP `72.56.5.23` доступен по порту 80 **не из всех
регионов** (проверка `check-host.net` показала таймауты из США/Азии/части ЕС —
особенность сети провайдера). Поэтому обычная проверка Let's Encrypt по HTTP
(`--nginx` / HTTP-01) **не проходит** — валидатор LE не достаёт до сервера.

Сертификат выпущен методом **DNS-01** (подтверждение через TXT-запись, порт 80
не нужен):

```bash
# 1) запросить сертификат — certbot покажет значение для TXT-записи
certbot certonly --manual --preferred-challenges dns \
  --agree-tos -m <email> -d aiethos.ru

# 2) в DNS-панели добавить TXT-запись:
#      Хост: _acme-challenge     Значение: <выданное certbot>
#    дождаться распространения:  dig +short TXT _acme-challenge.aiethos.ru @8.8.8.8
# 3) вернуться в certbot и нажать Enter

# 4) подключить сертификат к nginx (редирект http->https)
certbot install --nginx -d aiethos.ru
```

⚠️ **Продление не автоматическое** (DNS-01 вручную). Сертификат действует 90
дней — перед истечением повторить шаги 1–3 (значение TXT будет новым). Автопродление
можно настроить через `--manual-auth-hook` с API DNS-провайдера (Timeweb) — при
необходимости.

---

## Обновление сайта (после изменений в коде)

`deploy.sh` теперь **не трогает** nginx-конфиг и сертификат, если Certbot уже
настроил HTTPS, поэтому его можно запускать повторно. Но для чистого обновления
кода достаточно:

```bash
cd /opt/ethos && git pull
cd nextjs && npm ci && npm run build
systemctl restart ethos
```
