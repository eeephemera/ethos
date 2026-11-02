// Темы заявки: кнопки формы (components/LeadForm.jsx) и подпись в уведомлении
// (app/api/lead/route.ts) — один список, чтобы ключ и текст не разошлись.
export const LEAD_TOPICS = [
  { key: 'b24', label: 'Битрикс24' },
  { key: 'ai', label: 'ИИ-агент' },
  { key: 'dash', label: 'Дашборды' },
  { key: 'cards', label: 'Карточки товаров' },
  { key: 'auto', label: 'Другая автоматизация' },
];

export const topicLabel = (key) => (LEAD_TOPICS.find((t) => t.key === key) || {}).label || null;

// Контакт: телефон (от 10 цифр) или Telegram (@ник, t.me/ник, ник 5–32 знака).
export function contactKind(value) {
  const v = String(value || '').trim();
  if (!v) return null;
  if (v.replace(/\D/g, '').length >= 10 && /^[+\d\s()\-.]+$/.test(v)) return 'phone';
  const nick = v.replace(/^(https?:\/\/)?(t\.me\/|telegram\.me\/)/i, '').replace(/^@/, '');
  if (/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(nick)) return 'telegram';
  return null;
}
