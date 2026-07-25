#!/usr/bin/env bash
# Включает MSS clamping — лечит «сайт бесконечно грузится / не открывается»
# у клиентов с нестандартным MTU: мобильный интернет, VPN, PPPoE, некоторые
# корпоративные сети.
#
# Симптом: TCP-соединение устанавливается, но большие пакеты (TLS-handshake,
# HTML страницы) молча теряются по пути -> таймаут. У кого MTU обычный —
# сайт открывается нормально. Отсюда «у меня работает, у друзей нет».
#
# Запускать НА СЕРВЕРЕ от root:  bash deploy/fix-mtu.sh
set -euo pipefail

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

if [[ $EUID -ne 0 ]]; then echo "Запустите от root." >&2; exit 1; fi

RULE=(-p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu)

log "Включаю MSS clamping (IPv4)"
if iptables -t mangle -C POSTROUTING "${RULE[@]}" 2>/dev/null; then
  echo "  уже включено"
else
  iptables -t mangle -A POSTROUTING "${RULE[@]}"
  echo "  правило добавлено"
fi

log "Включаю MSS clamping (IPv6)"
if ip6tables -t mangle -C POSTROUTING "${RULE[@]}" 2>/dev/null; then
  echo "  уже включено"
else
  ip6tables -t mangle -A POSTROUTING "${RULE[@]}" 2>/dev/null && echo "  правило добавлено" \
    || echo "  IPv6 недоступен — пропускаю"
fi

log "Сохраняю правила, чтобы пережили перезагрузку"
export DEBIAN_FRONTEND=noninteractive
if ! command -v netfilter-persistent >/dev/null 2>&1; then
  # не задавать интерактивных вопросов при установке
  echo iptables-persistent iptables-persistent/autosave_v4 boolean false | debconf-set-selections
  echo iptables-persistent iptables-persistent/autosave_v6 boolean false | debconf-set-selections
  apt-get install -y iptables-persistent >/dev/null 2>&1 || true
fi
if command -v netfilter-persistent >/dev/null 2>&1; then
  netfilter-persistent save >/dev/null 2>&1 && echo "  сохранено через netfilter-persistent"
else
  mkdir -p /etc/iptables
  iptables-save  > /etc/iptables/rules.v4 2>/dev/null || true
  ip6tables-save > /etc/iptables/rules.v6 2>/dev/null || true
  echo "  сохранено в /etc/iptables/"
fi

log "Готово. Текущее правило:"
iptables -t mangle -S POSTROUTING | grep TCPMSS || echo "  (не найдено)"

cat <<'TXT'

Проверьте с телефона (мобильный интернет, не Wi-Fi): https://aiethos.ru
Если по-прежнему не открывается — проблема во внешней маршрутизации,
запустите: bash deploy/diagnose-network.sh
TXT
