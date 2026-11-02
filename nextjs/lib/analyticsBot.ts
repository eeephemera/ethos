import 'server-only';
import { topicLabel } from './leadTopics';
import { listLeads, viewUrl } from './leads';
import {
  MetrikaError, PERIODS, goalReaches, goals, overview, periodLabel, periodStart, saveMetrikaToken,
  sources, topPages, topParam, type Period,
} from './metrika';
import { chatIds, tg } from './telegram';

/**
 * Бот аналитики aiethos.ru (02.11, владелец: «кнопки для аналитики — тыкать и смотреть
 * Метрику, все кнопки»). Тот же бот, что присылает заявки; слушает только чаты из
 * TG_CHAT_ID. Одно сообщение-панель: период сверху, отчёты кнопками, щелчок меняет
 * текст того же сообщения — чат не засыпается отчётами.
 *
 * Метрика видит только посетителей, нажавших «Принять» cookie, — так и подписано в отчётах.
 * Заявки — из файлов на сервере (lib/leads.ts): их видно всегда, и без Метрики. Контакт
 * в Telegram не уходит — только ссылка на заявку, как в уведомлении.
 */

type View = 'over' | 'goals' | 'btn' | 'pages' | 'src' | 'leads';

const VIEWS: { key: View; label: string }[] = [
  { key: 'over', label: '📈 Обзор' },
  { key: 'goals', label: '🎯 Цели' },
  { key: 'btn', label: '🖱 Кнопки' },
  { key: 'pages', label: '📄 Страницы' },
  { key: 'src', label: '🔗 Источники' },
  { key: 'leads', label: '📨 Заявки' },
];

const esc = (s: unknown) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
const num = (n: number) => Math.round(n).toLocaleString('ru-RU');

function keyboard(view: View, p: Period) {
  const periods = PERIODS.map((x) => ({
    text: (x === p ? '• ' : '') + (x === 'today' ? 'Сегодня' : periodLabel(x)),
    callback_data: `r:${view}:${x}`,
  }));
  const views = VIEWS.map((v) => ({ text: (v.key === view ? '• ' : '') + v.label, callback_data: `r:${v.key}:${p}` }));
  return {
    inline_keyboard: [
      periods,
      [views[0], views[1]],
      [views[2], views[3]],
      [views[4], views[5]],
      [{ text: '🔄 Обновить', callback_data: `r:${view}:${p}` }],
    ],
  };
}

const HOW_TO_TOKEN = [
  'Чтобы бот видел Метрику, нужен токен (один раз):',
  '1. oauth.yandex.ru → «Создать приложение» → «Для доступа к API или отладки».',
  '   Доступ: «Яндекс.Метрика» → «Получение статистики, чтение параметров своих и доверенных счётчиков».',
  '2. В приложении скопируйте ClientID и откройте',
  '   oauth.yandex.ru/authorize?response_type=token&amp;client_id=ClientID → «Разрешить».',
  '3. Пришлите боту: <code>/token ваш_токен</code> — сообщение с токеном бот удалит.',
].join('\n');

function metrikaFail(e: unknown) {
  if (e instanceof MetrikaError) {
    if (e.message === 'no_token') return '⚠️ Метрика ещё не подключена.\n\n' + HOW_TO_TOKEN;
    if (e.status === 401 || e.status === 403) return '⚠️ Метрика не принимает токен (' + e.status + '). Пришлите новый: <code>/token …</code>';
    return '⚠️ Метрика ответила ошибкой ' + e.status + '. Попробуйте «Обновить» через минуту.';
  }
  return '⚠️ Метрика не ответила (сеть). Попробуйте «Обновить» через минуту.';
}

const CONSENT_NOTE = '<i>Метрика считает только тех, кто нажал «Принять» cookie.</i>';

async function report(view: View, p: Period): Promise<string> {
  const head = (t: string) => `<b>${t} · ${periodLabel(p)}</b>\n`;

  if (view === 'leads') {
    const leads = await listLeads(periodStart(p).getTime());
    const b24 = leads.filter((l) => l.topic === topicLabel('b24')).length;
    const lines = [head('📨 Заявки с формы'), `Всего: <b>${leads.length}</b> · Битрикс24: ${b24} · ИИ и другое: ${leads.length - b24}`];
    if (leads.length) {
      lines.push('');
      for (const l of leads.slice(0, 8)) {
        const when = new Date(l.at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        const link = viewUrl(l.id);
        lines.push(`${esc(when)} · ${esc(l.topic || 'без темы')}${l.task ? ' — ' + esc(l.task.slice(0, 60)) : ''}${link ? ` · <a href="${esc(link)}">контакт</a>` : ''}`);
      }
      if (leads.length > 8) lines.push(`…и ещё ${leads.length - 8}`);
    }
    lines.push('', '<i>Заявки — из базы сайта, видны все, без Метрики.</i>');
    return lines.join('\n');
  }

  try {
    if (view === 'over') {
      const [o, reach] = await Promise.all([overview(p), goalReaches(p)]);
      const r = (ident: string) => reach.find((x) => x.goal.ident === ident)?.reaches ?? 0;
      const sec = Math.round(o.duration);
      const leads = await listLeads(periodStart(p).getTime());
      return [
        head('📈 Обзор'),
        `Визиты: <b>${num(o.visits)}</b> · Посетители: ${num(o.users)} · Просмотры: ${num(o.pageviews)}`,
        `Отказы: ${Math.round(o.bounce)}% · Время на сайте: ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`,
        '',
        '<b>Заявки и контакты</b>',
        `Заявка с формы: <b>${r('form_submit')}</b> (Битрикс24: ${r('lead_b24')}, ИИ: ${r('lead_ai')}) · начали заполнять: ${r('form_start')}`,
        `Telegram: ${r('telegram')} · WhatsApp: ${r('whatsapp')} · Телефон: ${r('phone')} · Почта: ${r('email')}`,
        `Кнопки «к заявке»: ${r('cta_contact')} · Переход на Карточки·AI: ${r('open_kartochki')}`,
        `Заявок в базе сайта: <b>${leads.length}</b>`,
        '',
        CONSENT_NOTE,
      ].join('\n');
    }
    if (view === 'goals') {
      const reach = (await goalReaches(p)).filter((x) => x.reaches > 0).sort((a, b) => b.reaches - a.reaches);
      const lines = [head('🎯 Цели (достижения)')];
      if (!reach.length) lines.push('За период целей нет.');
      reach.forEach((x) => lines.push(`${num(x.reaches)} — ${esc(x.goal.name)}${x.goal.ident ? ` <code>${esc(x.goal.ident)}</code>` : ''}`));
      const zero = (await goals()).length - reach.length;
      if (zero > 0) lines.push('', `<i>Без срабатываний: ${zero} целей.</i>`);
      lines.push(CONSENT_NOTE);
      return lines.join('\n');
    }
    if (view === 'btn') {
      const [btns, pkgs] = await Promise.all([topParam(p, 'text', 15), topParam(p, 'package', 5)]);
      const lines = [head('🖱 Кнопки (ui_click)')];
      if (!btns.length) lines.push('Нажатий за период нет.');
      btns.forEach((b: { name: string; n: number }, i: number) => lines.push(`${i + 1}. ${esc(b.name)} — <b>${num(b.n)}</b>`));
      if (pkgs.length) {
        lines.push('', '<b>Пакеты Битрикс24</b>');
        pkgs.forEach((b: { name: string; n: number }) => lines.push(`${esc(b.name)} — ${num(b.n)}`));
      }
      lines.push('', CONSENT_NOTE);
      return lines.join('\n');
    }
    if (view === 'pages') {
      const rows = await topPages(p);
      const lines = [head('📄 Страницы (просмотры)')];
      if (!rows.length) lines.push('Просмотров за период нет.');
      rows.forEach((r: { name: string; n: number }) => lines.push(`${num(r.n)} — ${esc(r.name)}`));
      lines.push('', CONSENT_NOTE);
      return lines.join('\n');
    }
    const rows = await sources(p);
    const lines = [head('🔗 Источники (визиты)')];
    if (!rows.length) lines.push('Визитов за период нет.');
    rows.forEach((r: { name: string; n: number }) => lines.push(`${num(r.n)} — ${esc(r.name)}`));
    lines.push('', CONSENT_NOTE);
    return lines.join('\n');
  } catch (e) {
    console.error('[bot] metrika report failed:', view, p, e instanceof MetrikaError ? e.status + ' ' + e.message : e);
    return head(VIEWS.find((v) => v.key === view)!.label) + '\n' + metrikaFail(e);
  }
}

async function sendPanel(chatId: string | number, view: View = 'over', p: Period = '7') {
  await tg('sendMessage', {
    chat_id: chatId,
    text: await report(view, p),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    reply_markup: keyboard(view, p),
  });
}

export async function handleUpdate(update: any) {
  const allowed = chatIds();

  const cq = update.callback_query;
  if (cq) {
    const chatId = String(cq.message?.chat?.id ?? '');
    if (!allowed.includes(chatId)) return;
    const [, v, per] = String(cq.data || '').split(':');
    const view = (VIEWS.some((x) => x.key === v) ? v : 'over') as View;
    const p = (PERIODS.includes(per as Period) ? per : '7') as Period;
    await tg('answerCallbackQuery', { callback_query_id: cq.id, text: 'Считаю…' });
    const r = await tg('editMessageText', {
      chat_id: chatId,
      message_id: cq.message.message_id,
      text: await report(view, p),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: keyboard(view, p),
    });
    // «message is not modified» — отчёт не изменился, это не ошибка.
    if (!r.ok && !/not modified/.test(r.body?.description || '')) console.error('[bot] edit failed:', r.status, JSON.stringify(r.body));
    return;
  }

  const msg = update.message;
  if (!msg?.text) return;
  const chatId = String(msg.chat.id);
  if (!allowed.includes(chatId)) {
    // Чужой чат: бот молчит, но id и ник — в журнал (без текста): так добавляют нового
    // получателя заявок — человек пишет боту /start, id берётся отсюда в TG_CHAT_ID.
    console.log(`[bot] unknown chat id=${chatId} @${msg.from?.username || '-'} ${msg.from?.first_name || ''}`.trim());
    return;
  }
  const text = msg.text.trim();

  // Токен Метрики — только от владельца (первый чат в TG_CHAT_ID); сообщение с токеном удаляем.
  if (/^\/token(@\w+)?\s+/i.test(text)) {
    await tg('deleteMessage', { chat_id: chatId, message_id: msg.message_id });
    if (chatId !== allowed[0]) {
      await tg('sendMessage', { chat_id: chatId, text: 'Токен Метрики подключает владелец.' });
      return;
    }
    const token = text.replace(/^\/token(@\w+)?\s+/i, '').trim();
    if (!/^[\w.-]{20,}$/.test(token)) {
      await tg('sendMessage', { chat_id: chatId, text: 'Похоже, это не токен. Пришлите: /token ваш_токен' });
      return;
    }
    await saveMetrikaToken(token);
    let check = '';
    try { check = `Метрика отвечает: целей в счётчике — ${(await goals()).length}.`; }
    catch (e) { check = metrikaFail(e); }
    await tg('sendMessage', { chat_id: chatId, text: '✅ Токен сохранён на сервере, сообщение с ним удалено.\n' + check, parse_mode: 'HTML' });
    await sendPanel(chatId);
    return;
  }

  if (/^\/(start|menu|stats|analytics)\b/i.test(text) || /^(меню|аналитика|статистика)$/i.test(text)) {
    await sendPanel(chatId);
    return;
  }

  if (/^\/help\b/i.test(text)) {
    await tg('sendMessage', {
      chat_id: chatId,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      text: '<b>Бот aiethos.ru</b>\nПрисылает заявки с сайта и показывает аналитику.\n/menu — панель аналитики\n\n' + HOW_TO_TOKEN,
    });
  }
}
