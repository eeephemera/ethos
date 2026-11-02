import { contactKind } from '../../../../lib/leadTopics';
import { loadLead, signatureOk } from '../../../../lib/leads';

/**
 * Контакт из заявки — по закрытой ссылке из уведомления в Telegram (lib/leads.ts).
 * Без верной подписи — 404, как будто заявки нет. Страница не кэшируется и не
 * индексируется; телефон и Telegram — ссылками, чтобы ответить в одно касание.
 */

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const HEADERS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
  'Referrer-Policy': 'no-referrer',
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const k = new URL(req.url).searchParams.get('k') || '';
  const lead = signatureOk(id, k) ? await loadLead(id) : null;
  if (!lead) return new Response('Not found', { status: 404, headers: HEADERS });

  const contact = lead.contact || '';
  const kind = contactKind(contact);
  const nick = contact.replace(/^(https?:\/\/)?(t\.me\/|telegram\.me\/)/i, '').replace(/^@/, '');
  const href = kind === 'phone'
    ? 'tel:+' + contact.replace(/\D/g, '').replace(/^8(?=\d{10}$)/, '7')
    : kind === 'telegram' ? 'https://t.me/' + nick : '';
  const when = new Date(lead.at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const row = (label: string, value: string | null) =>
    value ? `<p><span>${label}</span>${value}</p>` : '';

  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Заявка ${esc(lead.id)}</title>
<style>body{margin:0;font:16px/1.5 system-ui,sans-serif;background:#FAFAF8;color:#14171C}
main{max-width:520px;margin:0 auto;padding:28px 18px}h1{font-size:22px;margin:0 0 4px}
small{color:#6B7280}p{margin:14px 0 0}p span{display:block;font-size:13px;color:#6B7280}
a.btn{display:block;margin-top:22px;padding:14px;border-radius:12px;background:#155EEF;color:#fff;text-align:center;text-decoration:none;font-weight:600}
.task{white-space:pre-wrap}</style></head><body><main>
<h1>Заявка с сайта</h1><small>${esc(when)} МСК · ${esc(lead.source)}${lead.page ? ' · ' + esc(lead.page) : ''}</small>
${row('Имя', lead.name ? esc(lead.name) : null)}
${row('Контакт', esc(contact))}
${row('Тема', lead.topic ? esc(lead.topic) : null)}
${lead.task ? `<p class="task"><span>Задача</span>${esc(lead.task)}</p>` : ''}
${href ? `<a class="btn" href="${esc(href)}">${kind === 'phone' ? 'Позвонить' : 'Написать в Telegram'}</a>` : ''}
</main></body></html>`;

  return new Response(html, { headers: { ...HEADERS, 'Content-Type': 'text/html; charset=utf-8' } });
}
