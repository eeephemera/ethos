import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Хранилище заявок с формы.
 *
 * Имя и контакт посетителя не уходят в Telegram: Telegram — зарубежный сервис, а
 * трансграничной передачи персональных данных у операторов нет (политика, раздел 8).
 * Заявка целиком лежит файлом на нашем сервере в России, в уведомление идут тема,
 * задача и закрытая ссылка на страницу с контактом (подпись HMAC — без неё 404).
 *
 * Каталог — LEADS_DIR, по умолчанию .data/leads рядом с приложением (в .gitignore).
 * Срок хранения — год (политика, раздел 12): старые файлы удаляются при каждой новой
 * заявке. Запись не удалась (права, диск) — заявка целиком уходит в журнал процесса,
 * чтобы не потеряться.
 */

export type Lead = {
  id: string;
  at: string;
  source: string;
  topic: string | null;
  task: string;
  name: string | null;
  contact: string | null;
  page: string | null;
};

export const SITE_URL = 'https://aiethos.ru';
const KEEP_DAYS = 365;

const dir = () => process.env.LEADS_DIR || path.join(process.cwd(), '.data', 'leads');

// Ключ подписи ссылки — отдельный секрет или токен бота: оба есть только в env сервера.
const secret = () => process.env.LEAD_VIEW_SECRET || process.env.TG_BOT_TOKEN || '';

// 12 шестнадцатеричных знаков: имя файла без «-» в начале (с ним спотыкаются ls и rm),
// угадывать незачем — без подписи страница заявки всё равно 404.
export function newLeadId() {
  return randomBytes(6).toString('hex');
}

export function sign(id: string) {
  const key = secret();
  return key ? createHmac('sha256', key).update(id).digest('base64url').slice(0, 22) : '';
}

export function signatureOk(id: string, k: string) {
  const want = sign(id);
  if (!want || !k || k.length !== want.length) return false;
  return timingSafeEqual(Buffer.from(want), Buffer.from(k));
}

export function viewUrl(id: string) {
  const k = sign(id);
  return k ? `${SITE_URL}/api/lead/${id}?k=${k}` : null;
}

const ID_RE = /^[a-f0-9]{12}$/;

async function dropOld(folder: string) {
  const edge = Date.now() - KEEP_DAYS * 864e5;
  for (const file of await readdir(folder)) {
    if (!file.endsWith('.json')) continue;
    const full = path.join(folder, file);
    try {
      if ((await stat(full)).mtimeMs < edge) await unlink(full);
    } catch {}
  }
}

/** true — заявка записана файлом; false — не удалось (вызывающий пишет её в журнал). */
export async function saveLead(lead: Lead) {
  try {
    const folder = dir();
    await mkdir(folder, { recursive: true, mode: 0o700 });
    await writeFile(path.join(folder, `${lead.id}.json`), JSON.stringify(lead), { mode: 0o600 });
    dropOld(folder).catch(() => {});
    return true;
  } catch (e) {
    console.error('[lead] save failed:', e);
    return false;
  }
}

/** Заявки не старше sinceMs, свежие первыми (отчёт «Заявки» в боте аналитики). */
export async function listLeads(sinceMs: number): Promise<Lead[]> {
  const folder = dir();
  let files: string[] = [];
  try { files = (await readdir(folder)).filter((f) => f.endsWith('.json')); } catch { return []; }
  const out: Lead[] = [];
  for (const f of files) {
    try {
      const lead: Lead = JSON.parse(await readFile(path.join(folder, f), 'utf8'));
      if (Date.parse(lead.at) >= sinceMs) out.push(lead);
    } catch {}
  }
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

export async function loadLead(id: string): Promise<Lead | null> {
  if (!ID_RE.test(id)) return null;
  try {
    return JSON.parse(await readFile(path.join(dir(), `${id}.json`), 'utf8'));
  } catch {
    return null;
  }
}
