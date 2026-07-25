#!/usr/bin/env bash
# Показывает всё, что занимает порты и обслуживает домены на сервере.
# Нужен, когда на одной машине живёт несколько проектов (ethos, domostroy, ...).
#
# Запускать НА СЕРВЕРЕ:  bash deploy/audit-server.sh
set -uo pipefail

hdr() { printf '\n\033[1;34m== %s ==\033[0m\n' "$*"; }
warn(){ printf '\033[1;33m  ! %s\033[0m\n' "$*"; }
ok()  { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }

hdr "Кто слушает порты (80/443 и локальные приложения)"
ss -tlnp 2>/dev/null | awk 'NR==1 || /:80 |:443 |:3[0-9]{3} |:8[0-9]{3} |:5[0-9]{3} /' | sed 's/^/  /'

hdr "Активные nginx-сайты"
for f in /etc/nginx/sites-enabled/*; do
  [[ -e "$f" ]] || continue
  echo "  --- $(basename "$f") ---"
  grep -hE '^\s*(server_name|listen|proxy_pass|root)' "$f" 2>/dev/null \
    | sed 's/^\s*/      /' | sort -u
done

hdr "Дубли server_name (главная причина «открывается не тот сайт»)"
dupes="$(grep -rhoP 'server_name\s+\K[^;]+' /etc/nginx/sites-enabled/ 2>/dev/null \
  | tr ' ' '\n' | grep -v '^$' | sort | uniq -d)"
if [[ -n "$dupes" ]]; then
  warn "Один домен объявлен в нескольких конфигах:"; echo "$dupes" | sed 's/^/      /'
else
  ok "Дублей нет"
fi

hdr "Кто объявлен default_server"
grep -rn "default_server" /etc/nginx/sites-enabled/ 2>/dev/null | sed 's/^/  /' \
  || ok "default_server не задан (неизвестный домен попадёт в первый конфиг)"

hdr "Сервисы приложений (systemd)"
systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null \
  | grep -viE 'systemd|dbus|cron|ssh|nginx|rsyslog|polkit|udev|getty|networkd|resolved|journal|snapd|unattended|multipathd|qemu|chrony|timesync' \
  | awk '{print "  " $1}'

hdr "Порт 3000 — не занят ли чужим приложением"
p3000="$(ss -tlnp 2>/dev/null | grep ':3000 ' || true)"
if [[ -z "$p3000" ]]; then
  warn "Порт 3000 свободен — ethos не запущен?"
elif echo "$p3000" | grep -q "next-server\|node"; then
  ok "Порт 3000 занят Node-приложением:"; echo "$p3000" | sed 's/^/      /'
else
  warn "Порт 3000 занят чем-то другим:"; echo "$p3000" | sed 's/^/      /'
fi

hdr "Docker (если используется)"
if command -v docker >/dev/null 2>&1; then
  docker ps --format '  {{.Names}}\t{{.Image}}\t{{.Ports}}' 2>/dev/null || warn "docker есть, но не отвечает"
else
  echo "  docker не установлен"
fi

hdr "TLS-сертификаты"
ls -1 /etc/letsencrypt/live/ 2>/dev/null | grep -v README | sed 's/^/  /' || echo "  нет"

hdr "Память и диск (два проекта на одной машине)"
free -h  | sed 's/^/  /'
df -h /  | sed 's/^/  /'
