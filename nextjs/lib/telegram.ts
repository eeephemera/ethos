import 'server-only';
import https from 'node:https';

/**
 * Вызов Telegram Bot API.
 *
 * С сервера aiethos.ru api.telegram.org доступен только по IPv6: A-запись резолвер не отдаёт
 * (ENOTFOUND по IPv4, замер 02.11), а fetch Node на первом соединении после рестарта висел
 * до тайм-аута. Поэтому node:https с family 6, а если IPv6 нет (локально) — как получится.
 * Не бросает: status 0 — сеть, иначе HTTP-код ответа Telegram.
 */
export type TgResult = { ok: boolean; status: number; body: any };

function once(token: string, method: string, data: string, family: 0 | 6, timeoutMs: number): Promise<TgResult> {
  return new Promise((resolve) => {
    const req = https.request(
      {
        host: 'api.telegram.org',
        path: `/bot${token}/${method}`,
        method: 'POST',
        family,
        timeout: timeoutMs,
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      },
      (res) => {
        let raw = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let body: any = null;
          try { body = JSON.parse(raw); } catch {}
          resolve({ ok: res.statusCode === 200 && !!body?.ok, status: res.statusCode || 0, body });
        });
      },
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', () => resolve({ ok: false, status: 0, body: null }));
    req.end(data);
  });
}

export async function tg(method: string, payload: object, timeoutMs = 8000): Promise<TgResult> {
  const token = process.env.TG_BOT_TOKEN;
  if (!token) return { ok: false, status: 0, body: null };
  const data = JSON.stringify(payload);
  const r = await once(token, method, data, 6, timeoutMs);
  return r.status ? r : once(token, method, data, 0, timeoutMs);
}

/** Чаты, которым бот пишет и которых слушает: TG_CHAT_ID через запятую, первый — владелец. */
export function chatIds(): string[] {
  return (process.env.TG_CHAT_ID || '').split(',').map((c) => c.trim()).filter(Boolean);
}
