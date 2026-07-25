#!/usr/bin/env bash
# Диагностика доступности aiethos.ru снаружи.
# Запускать НА СЕРВЕРЕ:  bash deploy/diagnose-network.sh
#
# Отвечает на вопрос «почему у одних сайт открывается, а у других нет».
set -uo pipefail

DOMAIN="${DOMAIN:-aiethos.ru}"
ok()   { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }
bad()  { printf '\033[1;31m  ✗ %s\033[0m\n' "$*"; }
info() { printf '  · %s\n' "$*"; }
hdr()  { printf '\n\033[1;34m== %s ==\033[0m\n' "$*"; }

hdr "1. Приложение и nginx"
systemctl is-active --quiet ethos && ok "ethos.service работает" || bad "ethos.service НЕ работает"
systemctl is-active --quiet nginx && ok "nginx работает" || bad "nginx НЕ работает"
curl -fsS --max-time 8 -o /dev/null http://127.0.0.1:3000/ \
  && ok "Next.js отвечает на 127.0.0.1:3000" || bad "Next.js НЕ отвечает на :3000"

hdr "2. Порты слушаются"
ss -tlnp 2>/dev/null | grep -E ':(80|443)\b' || bad "Порты 80/443 никто не слушает!"

hdr "3. DNS"
for h in "$DOMAIN" "www.$DOMAIN"; do
  ips="$(getent ahostsv4 "$h" 2>/dev/null | awk '{print $1}' | sort -u | tr '\n' ' ')"
  if [[ -n "$ips" ]]; then ok "$h -> $ips"; else bad "$h НЕ резолвится (нет A-записи)"; fi
done
myip="$(curl -fsS --max-time 8 https://api.ipify.org 2>/dev/null || echo '')"
info "Публичный IP сервера: ${myip:-неизвестен}"

hdr "4. TLS-сертификат"
if [[ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
  ok "Сертификат найден"
  openssl x509 -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" -noout -subject -enddate 2>/dev/null | sed 's/^/  /'
  info "Домены в сертификате:"
  openssl x509 -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" -noout -ext subjectAltName 2>/dev/null | tail -1 | sed 's/^/  /'
  # цепочка: телефоны падают, если промежуточный сертификат не отдаётся
  chain="$(openssl s_client -connect 127.0.0.1:443 -servername "$DOMAIN" -showcerts </dev/null 2>/dev/null | grep -c 'BEGIN CERTIFICATE')"
  if [[ "${chain:-0}" -ge 2 ]]; then
    ok "Цепочка сертификатов полная ($chain шт.) — телефоны примут"
  else
    bad "Отдаётся только $chain сертификат — на телефонах будет ошибка! Нужен fullchain.pem"
  fi
else
  bad "Сертификата нет"
fi

hdr "5. Firewall"
if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q '^Status: active'; then
  ufw status | sed 's/^/  /'
else
  ok "ufw выключен (не блокирует)"
fi
iptables -S INPUT 2>/dev/null | grep -vE '^-P|ACCEPT' | head -5 | sed 's/^/  DROP-правило: /' || true

hdr "6. MTU (частая причина «не грузится на мобильном/VPN»)"
mtu="$(ip link show eth0 2>/dev/null | grep -o 'mtu [0-9]*' | awk '{print $2}')"
info "MTU на eth0: ${mtu:-?}"
if iptables -t mangle -C POSTROUTING -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu 2>/dev/null; then
  ok "MSS clamping включён"
else
  bad "MSS clamping ВЫКЛЮЧЕН — включить: bash deploy/fix-mtu.sh"
fi

hdr "7. Ответ сайта локально"
curl -sS -o /dev/null -w '  http  -> %{http_code}\n' --max-time 10 -H "Host: $DOMAIN" http://127.0.0.1/ 2>&1
curl -ksS -o /dev/null -w '  https -> %{http_code}\n' --max-time 10 --resolve "$DOMAIN:443:127.0.0.1" "https://$DOMAIN/" 2>&1

hdr "ИТОГ"
cat <<TXT
  Если всё выше зелёное — сервер настроен правильно, и проблема во ВНЕШНЕЙ
  маршрутизации до IP ${myip:-этого сервера} (сеть провайдера Timeweb).

  Проверьте доступность снаружи (откройте в браузере):
    https://check-host.net/check-http?host=https://$DOMAIN
    https://check-host.net/check-tcp?host=$DOMAIN:443

  Много «Connection timed out» из разных стран = проблема провайдера.
  Тогда: написать в поддержку Timeweb (приложив отчёт check-host) и просить
  проверить анонс/фильтрацию IP, либо заменить IP-адрес.
TXT
