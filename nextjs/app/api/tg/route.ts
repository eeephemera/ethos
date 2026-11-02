import { after } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { handleUpdate } from '../../../lib/analyticsBot';

/**
 * Вебхук Telegram для бота аналитики (lib/analyticsBot.ts).
 *
 * Telegram шлёт сюда обновления с заголовком X-Telegram-Bot-Api-Secret-Token — он должен
 * совпасть с TG_WEBHOOK_SECRET из /etc/ethos.env, иначе 404, как будто адреса нет.
 * Отвечаем сразу, работа — после ответа (after): отчёты Метрики идут секунду-две, а Telegram
 * повторяет обновление, если вебхук долго молчит.
 *
 * Подключение (один раз, на сервере): setWebhook с url https://aiethos.ru/api/tg,
 * secret_token = TG_WEBHOOK_SECRET, allowed_updates = message, callback_query.
 */

function secretOk(got: string) {
  const want = process.env.TG_WEBHOOK_SECRET || '';
  if (!want || got.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function POST(req: Request) {
  if (!secretOk(req.headers.get('x-telegram-bot-api-secret-token') || '')) {
    return new Response('Not found', { status: 404 });
  }
  let update: unknown;
  try {
    update = await req.json();
  } catch {
    return new Response('ok');
  }
  after(async () => {
    try {
      await handleUpdate(update);
    } catch (e) {
      console.error('[bot] update failed:', e);
    }
  });
  return new Response('ok');
}
