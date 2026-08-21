import { NextResponse } from 'next/server';

/**
 * Приём лида с формы первого экрана.
 *
 * Клиент шлёт запрос fire-and-forget и уходит в мессенджер, не дожидаясь
 * ответа, — поэтому эндпоинт обязан отвечать быстро и никогда не ронять
 * заявку из-за проблем с уведомлением: сначала фиксируем лид в логе процесса
 * (journalctl -u ethos), потом пытаемся уведомить в Telegram.
 *
 * Секреты — только в переменных окружения на сервере:
 *   TG_BOT_TOKEN — токен бота (@BotFather);
 *   TG_CHAT_ID   — чат/канал, куда слать уведомления.
 * Без них эндпоинт просто пишет лид в лог — форма продолжает работать.
 */

const SIZE_LABELS: Record<string, string> = {
  s: '2–10 человек',
  m: '11–50 человек',
  l: 'больше 50 человек',
};

export async function POST(req: Request) {
  let data: { task?: unknown; size?: unknown; channel?: unknown; source?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const task = String(data.task ?? '').trim().slice(0, 2000);
  if (!task) return NextResponse.json({ ok: false }, { status: 400 });

  const size = SIZE_LABELS[String(data.size)] ?? null;
  const channel = data.channel === 'wa' ? 'WhatsApp' : 'Telegram';
  const source = String(data.source ?? '').slice(0, 40) || 'site';

  // Лид фиксируется в логе всегда — даже если Telegram недоступен.
  console.log(`[lead] source=${source} channel=${channel} size=${size ?? '—'} task=${task}`);

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (token && chatId) {
    const lines = [`Новая заявка с aiethos.ru (${source})`, `Задача: ${task}`];
    if (size) lines.push(`Команда: ${size}`);
    lines.push(`Канал связи: ${channel}`);
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }),
        signal: AbortSignal.timeout(5000),
      });
      // fetch не бросает на HTTP-ошибках: неверный токен или chat_id иначе
      // остались бы молчаливым отказом, который не найти по логам.
      if (!res.ok) console.error('[lead] telegram notify failed:', res.status, await res.text());
    } catch (e) {
      console.error('[lead] telegram notify failed:', e);
    }
  }

  return NextResponse.json({ ok: true });
}
