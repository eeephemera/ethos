#!/usr/bin/env bash
# Перевыпускает TLS-сертификат так, чтобы он покрывал И aiethos.ru, И www.aiethos.ru.
#
# Зачем: если A-запись www существует, а сертификат её не покрывает, посетители
# https://www.aiethos.ru видят «Подключение не защищено» и уходят. У владельца,
# который заходит без www, при этом всё работает.
#
# Запускать НА СЕРВЕРЕ от root:
#   CERTBOT_EMAIL="you@example.com" bash deploy/fix-www-cert.sh
set -uo pipefail

DOMAIN="${DOMAIN:-aiethos.ru}"
WWW="www.$DOMAIN"
EMAIL="${CERTBOT_EMAIL:-}"

log()  { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }
bad()  { printf '\033[1;31m  ✗ %s\033[0m\n' "$*"; }

if [[ $EUID -ne 0 ]]; then echo "Запустите от root." >&2; exit 1; fi

log "Проверяю, что оба домена указывают на этот сервер"
myip="$(curl -fsS --max-time 10 https://api.ipify.org 2>/dev/null || echo '')"
for h in "$DOMAIN" "$WWW"; do
  ip="$(getent ahostsv4 "$h" | awk '{print $1}' | head -1)"
  if [[ -z "$ip" ]]; then
    bad "$h не резолвится — сначала добавьте A-запись на $myip"; exit 1
  elif [[ -n "$myip" && "$ip" != "$myip" ]]; then
    bad "$h -> $ip, а сервер $myip. Исправьте A-запись."; exit 1
  else
    ok "$h -> $ip"
  fi
done

log "Текущие домены в сертификате"
openssl x509 -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" -noout -ext subjectAltName 2>/dev/null \
  | tail -1 | sed 's/^/  /' || echo "  сертификата пока нет"

# ---------------------------------------------------------------------------
# Попытка 1: HTTP-01 через плагин nginx (быстро и с автопродлением).
# Заодно это проверка, достаёт ли Let's Encrypt до сервера после fix-mtu.sh.
# ---------------------------------------------------------------------------
log "Попытка 1: автоматический выпуск (HTTP-01)"
args=(--nginx -d "$DOMAIN" -d "$WWW" --expand --agree-tos --non-interactive --redirect)
[[ -n "$EMAIL" ]] && args+=(-m "$EMAIL") || args+=(--register-unsafely-without-email)

if certbot "${args[@]}"; then
  ok "Сертификат выпущен автоматически — автопродление будет работать"
  systemctl reload nginx
  log "Итог"
  openssl x509 -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" -noout -ext subjectAltName | tail -1 | sed 's/^/  /'
  exit 0
fi

# ---------------------------------------------------------------------------
# Запасной вариант: DNS-01 вручную (когда LE не достаёт до порта 80).
# ---------------------------------------------------------------------------
bad "Автоматический выпуск не прошёл — Let's Encrypt не достучался до порта 80."
cat <<TXT

Выпустите через DNS — этот способ не требует доступности порта 80 извне:

  certbot certonly --manual --preferred-challenges dns --expand \\
    --agree-tos -m ${EMAIL:-<ваш-email>} -d $DOMAIN -d $WWW

Certbot попросит TXT-записи с РАЗНЫМИ именами (не с одинаковым!).
В панели Timeweb в поле «Хост» вводится только левая часть:

  для $DOMAIN      ->  хост:  _acme-challenge
  для $WWW  ->  хост:  _acme-challenge.www

Подтверждение для $DOMAIN может не запрашиваться вовсе: Let's Encrypt
кэширует успешные проверки примерно на 30 дней. Тогда запись будет одна.

Добавьте столько записей, сколько попросят, дождитесь распространения:

  dig +short TXT _acme-challenge.$DOMAIN @8.8.8.8
  dig +short TXT _acme-challenge.www.$DOMAIN @8.8.8.8

и только потом нажимайте Enter. После выпуска подключите к nginx:

  certbot install --nginx -d $DOMAIN

TXT
exit 1
