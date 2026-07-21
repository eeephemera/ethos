#!/usr/bin/env bash
# Watchdog: restart ethos if the Node server stops answering on its local port.
# systemd's Restart= handles a crashed process; this covers a hung-but-alive one.
set -uo pipefail

URL="http://127.0.0.1:3000/"
TRIES=3

for i in $(seq 1 "$TRIES"); do
  if curl -fsS --max-time 10 -o /dev/null "$URL"; then
    exit 0   # healthy
  fi
  sleep 3
done

echo "ethos healthcheck failed after $TRIES tries — restarting ethos.service"
systemctl restart ethos
