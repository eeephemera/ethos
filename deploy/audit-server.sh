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

hdr "Один домен в нескольких конфигах (причина «открывается не тот сайт»)"
# ВАЖНО: sites-enabled — это симлинки, поэтому grep -r по каталогу их не читает.
# Перечисляем файлы явно и печатаем «домен -> в каких конфигах встречается».
tmp="$(mktemp)"
for f in /etc/nginx/sites-enabled/*; do
  [[ -e "$f" ]] || continue
  grep -hoP 'server_name\s+\K[^;]+' "$f" 2>/dev/null | tr ' ' '\n' | grep -v '^$' \
    | sort -u | while read -r d; do echo "$d $(basename "$f")"; done
done > "$tmp"
found=0
while read -r dom; do
  files="$(awk -v d="$dom" '$1==d {printf "%s ", $2}' "$tmp")"
  warn "$dom объявлен в: $files"; found=1
done < <(awk '{print $1}' "$tmp" | sort | uniq -d)
[[ $found -eq 0 ]] && ok "Пересечений нет"
info_ports="$(awk '{print $1}' "$tmp" | sort -u | wc -l)"
echo "  (всего уникальных доменов: $info_ports; пересечение на РАЗНЫХ портах — не конфликт)"
rm -f "$tmp"

hdr "Кто объявлен default_server"
ds="$(for f in /etc/nginx/sites-enabled/*; do [[ -e "$f" ]] && grep -Hn "default_server" "$f" 2>/dev/null; done)"
if [[ -n "$ds" ]]; then echo "$ds" | sed 's/^/  /'
else ok "default_server не задан (неизвестный домен попадёт в первый по алфавиту конфиг)"; fi

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

hdr "Память и диск (несколько проектов на одной машине)"
free -h  | sed 's/^/  /'
df -h /  | sed 's/^/  /'
swap_used_mb="$(free -m | awk '/^Swap:/{print $3}')"
mem_avail_mb="$(free -m | awk '/^Mem:/{print $7}')"
if [[ "${swap_used_mb:-0}" -gt 200 ]]; then
  warn "Задействовано ${swap_used_mb}MB swap — оперативной памяти не хватает."
  echo "      Приложения работают медленнее и рискуют быть убитыми при пике."
fi
if [[ "${mem_avail_mb:-9999}" -lt 400 ]]; then
  warn "Свободно всего ${mem_avail_mb}MB — критично мало."
fi
echo "  Топ-5 процессов по памяти:"
ps -eo rss,comm --sort=-rss 2>/dev/null | head -6 \
  | awk 'NR==1{next} {printf "      %6.0f MB  %s\n", $1/1024, $2}'
