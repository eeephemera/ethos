import 'server-only';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Отчёты Яндекс Метрики для бота аналитики (lib/analyticsBot.ts).
 *
 * Токен OAuth с правом «Яндекс.Метрика: получение статистики» (metrika:read): METRIKA_TOKEN
 * в env или файл .data/metrika-token, который владелец заполняет командой /token в боте —
 * так токен не проходит ни через код, ни через чужие руки. Не бросает наружу: ошибка
 * возвращается текстом для бота.
 */

export const COUNTER = 110919394;
const API = 'https://api-metrika.yandex.net';

const tokenFile = () => process.env.METRIKA_TOKEN_FILE || path.join(process.cwd(), '.data', 'metrika-token');

export async function metrikaToken(): Promise<string> {
  if (process.env.METRIKA_TOKEN) return process.env.METRIKA_TOKEN;
  try { return (await readFile(tokenFile(), 'utf8')).trim(); } catch { return ''; }
}

export async function saveMetrikaToken(token: string) {
  await mkdir(path.dirname(tokenFile()), { recursive: true, mode: 0o700 });
  await writeFile(tokenFile(), token.trim(), { mode: 0o600 });
  goalsCache = null;
}

export class MetrikaError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function api(p: string, params: Record<string, string | number> = {}) {
  const token = await metrikaToken();
  if (!token) throw new MetrikaError(0, 'no_token');
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const res = await fetch(`${API}${p}${qs.size ? '?' + qs : ''}`, {
    headers: { Authorization: `OAuth ${token}` },
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  });
  if (!res.ok) throw new MetrikaError(res.status, (await res.text()).slice(0, 300));
  return res.json();
}

// Период отчёта: today | 7 | 30 (дней, включая сегодня).
export type Period = 'today' | '7' | '30';
export const PERIODS: Period[] = ['today', '7', '30'];
export const periodLabel = (p: Period) => (p === 'today' ? 'сегодня' : p === '7' ? '7 дней' : '30 дней');
export const periodStart = (p: Period) => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
  d.setHours(0, 0, 0, 0);
  if (p !== 'today') d.setDate(d.getDate() - (Number(p) - 1));
  return d;
};
const dates = (p: Period) => ({ date1: p === 'today' ? 'today' : `${Number(p) - 1}daysAgo`, date2: 'today' });

async function data(p: Period, params: Record<string, string | number>) {
  return api('/stat/v1/data', { ids: COUNTER, lang: 'ru', accuracy: 'full', ...dates(p), ...params });
}

// Цели счётчика: идентификатор JS-события → id и название. Кэш 10 минут.
export type Goal = { id: number; name: string; ident: string | null };
let goalsCache: { at: number; list: Goal[] } | null = null;

export async function goals(): Promise<Goal[]> {
  if (goalsCache && Date.now() - goalsCache.at < 10 * 60 * 1000) return goalsCache.list;
  const j = await api(`/management/v1/counter/${COUNTER}/goals`);
  const list: Goal[] = (j.goals || []).map((g: any) => ({
    id: g.id,
    name: g.name,
    ident: (g.conditions || []).find((c: any) => c.url)?.url ?? null,
  }));
  goalsCache = { at: Date.now(), list };
  return list;
}

export async function overview(p: Period) {
  const j = await data(p, {
    metrics: 'ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate,ym:s:avgVisitDurationSeconds',
  });
  const [visits, users, pageviews, bounce, duration] = j.totals || [0, 0, 0, 0, 0];
  return { visits, users, pageviews, bounce, duration };
}

/** Достижения всех целей за период: [{goal, reaches}] — по 20 метрик в запросе (лимит API). */
export async function goalReaches(p: Period) {
  const list = await goals();
  const out: { goal: Goal; reaches: number }[] = [];
  for (let i = 0; i < list.length; i += 20) {
    const chunk = list.slice(i, i + 20);
    const j = await data(p, { metrics: chunk.map((g) => `ym:s:goal${g.id}reaches`).join(',') });
    chunk.forEach((g, k) => out.push({ goal: g, reaches: Math.round((j.totals || [])[k] || 0) }));
  }
  return out;
}

/** Топ значений параметра визита (key — ключ из ymGoal: text у ui_click, place, package…). */
export async function topParam(p: Period, key: string, limit = 15) {
  const j = await data(p, {
    dimensions: 'ym:s:paramsLevel2',
    metrics: 'ym:s:paramsNumber',
    filters: `ym:s:paramsLevel1=='${key.replace(/'/g, '')}'`,
    sort: '-ym:s:paramsNumber',
    limit,
  });
  return (j.data || []).map((r: any) => ({ name: r.dimensions[0]?.name ?? '—', n: Math.round(r.metrics[0] || 0) }));
}

export async function topPages(p: Period, limit = 10) {
  const j = await data(p, {
    dimensions: 'ym:pv:URLPath',
    metrics: 'ym:pv:pageviews',
    sort: '-ym:pv:pageviews',
    limit,
  });
  return (j.data || []).map((r: any) => ({ name: r.dimensions[0]?.name ?? '—', n: Math.round(r.metrics[0] || 0) }));
}

export async function sources(p: Period, limit = 10) {
  const j = await data(p, {
    dimensions: 'ym:s:lastTrafficSource',
    metrics: 'ym:s:visits',
    sort: '-ym:s:visits',
    limit,
  });
  return (j.data || []).map((r: any) => ({ name: r.dimensions[0]?.name ?? '—', n: Math.round(r.metrics[0] || 0) }));
}
