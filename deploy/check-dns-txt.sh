#!/usr/bin/env bash
# Проверяет ACME-запись TXT на ВСЕХ авторитетных DNS-серверах домена.
#
# Зачем: Let's Encrypt проверяет домен с нескольких точек мира и опрашивает
# разные NS. Если запись разошлась не на все серверы, выпуск падает с
# «During secondary validation: NXDOMAIN». Публичный 8.8.8.8 при этом может
# уже отвечать правильно — и создаётся ложное ощущение, что всё готово.
#
# Использование (на сервере, во втором окне, пока certbot ждёт Enter):
#   bash deploy/check-dns-txt.sh www          # для www.aiethos.ru
#   bash deploy/check-dns-txt.sh              # для самого aiethos.ru
set -uo pipefail

DOMAIN="${DOMAIN:-aiethos.ru}"
SUB="${1:-}"
if [[ -n "$SUB" ]]; then NAME="_acme-challenge.$SUB.$DOMAIN"; else NAME="_acme-challenge.$DOMAIN"; fi

ok()  { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }
bad() { printf '\033[1;31m  ✗ %s\033[0m\n' "$*"; }

echo "Проверяю TXT: $NAME"
echo

mapfile -t NS < <(dig +short NS "$DOMAIN" | sed 's/\.$//' | sort)
if [[ ${#NS[@]} -eq 0 ]]; then bad "Не удалось получить список NS для $DOMAIN"; exit 1; fi

allgood=1
for ns in "${NS[@]}"; do
  val="$(dig +short TXT "$NAME" "@$ns" 2>/dev/null | tr -d '"' | grep -v '^$' | paste -sd'|' -)"
  if [[ -n "$val" ]]; then ok "$ns -> $val"; else bad "$ns -> записи нет"; allgood=0; fi
done

echo
pub="$(dig +short TXT "$NAME" @8.8.8.8 2>/dev/null | tr -d '"' | grep -v '^$' | paste -sd'|' -)"
[[ -n "$pub" ]] && ok "8.8.8.8 (Google) -> $pub" || bad "8.8.8.8 -> записи нет"
pub2="$(dig +short TXT "$NAME" @1.1.1.1 2>/dev/null | tr -d '"' | grep -v '^$' | paste -sd'|' -)"
[[ -n "$pub2" ]] && ok "1.1.1.1 (Cloudflare) -> $pub2" || bad "1.1.1.1 -> записи нет"

echo
if [[ $allgood -eq 1 && -n "$pub" && -n "$pub2" ]]; then
  echo -e "\033[1;32mВсе серверы отвечают — можно нажимать Enter в certbot.\033[0m"
else
  echo -e "\033[1;33mЕщё не везде. Подождите 2-5 минут и запустите проверку снова.\033[0m"
  echo "Если какой-то NS упорно молчит — запись создана не с тем именем."
  echo "Полное имя должно быть ровно: $NAME"
  echo "В панели Timeweb в поле «Хост» вводится только: ${NAME%".$DOMAIN"}"
fi
