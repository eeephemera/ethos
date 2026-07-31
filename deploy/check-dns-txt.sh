#!/usr/bin/env bash
# Проверяет ACME-запись TXT на ВСЕХ авторитетных DNS-серверах домена.
#
# Зачем: Let's Encrypt проверяет домен с нескольких точек мира и опрашивает
# разные NS. Если запись разошлась не на все серверы, выпуск падает с
# «During secondary validation: NXDOMAIN». Публичный 8.8.8.8 при этом может
# уже отвечать правильно — и создаётся ложное ощущение, что всё готово.
#
# Использование (на сервере, во втором окне, пока certbot ждёт Enter):
#   bash deploy/check-dns-txt.sh www <значение-из-certbot>
#   bash deploy/check-dns-txt.sh "" <значение-из-certbot>    # для самого aiethos.ru
#
# Второй аргумент обязателен при ПОВТОРНОМ выпуске: certbot каждый раз выдаёт
# новое значение, а резолверы ещё до истечения TTL отдают старое. Без сверки
# легко нажать Enter слишком рано и снова получить отказ.
set -uo pipefail

DOMAIN="${DOMAIN:-aiethos.ru}"
SUB="${1:-}"
EXPECT="${2:-}"
if [[ -n "$SUB" ]]; then NAME="_acme-challenge.$SUB.$DOMAIN"; else NAME="_acme-challenge.$DOMAIN"; fi

ok()  { printf '\033[1;32m  ✓ %s\033[0m\n' "$*"; }
bad() { printf '\033[1;31m  ✗ %s\033[0m\n' "$*"; }

echo "Проверяю TXT: $NAME"
[[ -n "$EXPECT" ]] && echo "Ожидаемое значение: $EXPECT" || echo "(значение не задано — проверяю только наличие записи)"
echo

# Считаем сервер готовым, только если он отдаёт ИМЕННО ожидаемое значение.
match() { [[ -z "$EXPECT" ]] && return 0; [[ "$1" == *"$EXPECT"* ]]; }

mapfile -t NS < <(dig +short NS "$DOMAIN" | sed 's/\.$//' | sort)
if [[ ${#NS[@]} -eq 0 ]]; then bad "Не удалось получить список NS для $DOMAIN"; exit 1; fi

allgood=1
check_one() { # <ярлык> <сервер>
  local label="$1" srv="$2" val
  val="$(dig +short TXT "$NAME" "@$srv" 2>/dev/null | tr -d '"' | grep -v '^$' | paste -sd'|' -)"
  if [[ -z "$val" ]]; then bad "$label -> записи нет"; return 1; fi
  if match "$val"; then ok "$label -> $val"; return 0; fi
  bad "$label -> СТАРОЕ значение: $val"; return 1
}

for ns in "${NS[@]}"; do check_one "$ns" "$ns" || allgood=0; done
echo
check_one "8.8.8.8 (Google)"     8.8.8.8 || allgood=0
check_one "1.1.1.1 (Cloudflare)" 1.1.1.1 || allgood=0

echo
if [[ $allgood -eq 1 ]]; then
  echo -e "\033[1;32mВсе серверы отвечают — можно нажимать Enter в certbot.\033[0m"
else
  echo -e "\033[1;33mЕщё не готово. Подождите 2-5 минут и запустите проверку снова.\033[0m"
  echo "«СТАРОЕ значение» = запись обновлена, но не истёк TTL (600с). Просто ждите."
  echo "Если какой-то NS упорно молчит — запись создана не с тем именем."
  echo "Полное имя должно быть ровно: $NAME"
  echo "В панели Timeweb в поле «Хост» вводится только: ${NAME%".$DOMAIN"}"
fi
