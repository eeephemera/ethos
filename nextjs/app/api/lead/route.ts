import { NextResponse } from 'next/server';
import { contactKind, topicLabel } from '../../../lib/leadTopics';
import { newLeadId, saveLead, viewUrl, type Lead } from '../../../lib/leads';

/**
 * Приём заявки с сайта.
 *
 * Два вида заявок:
 *   • форма aiethos.ru (components/LeadForm.jsx) — тема, задача, имя и контакт;
 *   • форма kartochki-ai-lab.ru (nginx того сайта шлёт сюда) — только задача, контакта нет:
 *     посетитель сам пишет нам в Telegram.
 *
 * Заявка с контактом пишется файлом на сервер (lib/leads.ts), в Telegram уходят тема,
 * задача и закрытая ссылка на контакт — сам контакт в зарубежный сервис не передаём
 * (политика, разделы 7–8). Ответ формы — только после записи: посетитель видит
 * «отправлено», когда заявка действительно у нас.
 *
 * Секреты — только в env сервера (/etc/ethos.env):
 *   TG_BOT_TOKEN — токен бота; TG_CHAT_ID — ЧЕЙ-ТО чат (человек или группа), не id самого
 *   бота: бот сам себе не пишет — так с 21.10 по 02.11 все уведомления падали с 403.
 *   LEAD_VIEW_SECRET — ключ подписи ссылки (необязателен, иначе — токен бота).
 */

const SIZE_LABELS: Record<string, string> = {
  s: '2–10 человек',
  m: '11–50 человек',
  l: 'больше 50 человек',
};

const SOURCE_LABELS: Record<string, string> = {
  hero: 'главная · первый экран',
  main_contact: 'главная · внизу страницы',
  ai_contact: 'страница «ИИ-решения»',
  b24_contact: 'страница «Битрикс24»',
  contacts: 'страница «Контакты»',
  kartochki: 'сайт Карточки·AI',
};

// Защита от залпа: не больше 5 заявок с одного адреса за 10 минут (память процесса).
const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooMany(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > PER_WINDOW;
}

const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);

async function notify(lines: string[]) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    });
    // fetch не бросает на HTTP-ошибках: неверный токен или chat_id иначе
    // остались бы молчаливым отказом, который не найти по логам.
    if (!res.ok) console.error('[lead] telegram notify failed:', res.status, await res.text());
  } catch (e) {
    console.error('[lead] telegram notify failed:', e);
  }
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Ловушка для ботов: поле скрыто от людей. Отвечаем «ок», чтобы бот не подбирал обход.
  if (clip(data.website, 200)) return NextResponse.json({ ok: true });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
  if (tooMany(ip)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });

  const source = clip(data.source, 40) || 'site';
  const where = SOURCE_LABELS[source] || source;
  const task = clip(data.task, 2000);
  const contact = clip(data.contact, 120);
  const name = clip(data.name, 80);
  const topic = topicLabel(clip(data.topic, 20));

  // Заявка без контакта — прежняя форма (Карточки·AI): задача обязательна.
  if (!contact) {
    if (!task) return NextResponse.json({ ok: false }, { status: 400 });
    const size = SIZE_LABELS[String(data.size)] ?? null;
    const channel = data.channel === 'wa' ? 'WhatsApp' : 'Telegram';
    console.log(`[lead] source=${source} channel=${channel} size=${size ?? '—'} task=${task}`);
    const lines = [`Новая заявка с сайта (${where})`, `Задача: ${task}`];
    if (size) lines.push(`Команда: ${size}`);
    lines.push(`Посетитель напишет сам в ${channel}`);
    await notify(lines);
    return NextResponse.json({ ok: true });
  }

  if (!contactKind(contact)) return NextResponse.json({ ok: false, error: 'contact' }, { status: 400 });
  // Согласие на обработку контакта — галочка формы; без неё контакт не принимаем.
  if (data.consent !== true) return NextResponse.json({ ok: false, error: 'consent' }, { status: 400 });

  const lead: Lead = {
    id: newLeadId(),
    at: new Date().toISOString(),
    source,
    topic,
    task,
    name: name || null,
    contact,
    page: clip(data.page, 120) || null,
  };
  const saved = await saveLead(lead);
  // В журнал — без контакта; не записалось на диск — целиком, чтобы заявка не пропала.
  console.log(saved
    ? `[lead] id=${lead.id} source=${source} topic=${topic ?? '—'} task_len=${task.length}`
    : `[lead] UNSAVED ${JSON.stringify(lead)}`);

  const link = saved ? viewUrl(lead.id) : null;
  const lines = [`Новая заявка с aiethos.ru (${where})`];
  if (topic) lines.push(`Тема: ${topic}`);
  if (task) lines.push(`Задача: ${task}`);
  lines.push(link
    ? `Имя и контакт: ${link}`
    : 'Имя и контакт — в журнале сервера (journalctl -u ethos), заявка не записалась файлом');
  await notify(lines);

  return NextResponse.json({ ok: true });
}
