// Согласие на Яндекс Метрику — общий ключ для баннера (клиент) и layout (сервер).
// Модуль без 'use client', поэтому константы доходят до серверного layout как
// обычные значения, а не клиентские ссылки.

export const CONSENT_KEY = 'ethos-metrika-consent'; // 'granted' | 'denied'
export const CONSENT_ATTR = 'data-metrika-consent';

// Браузер сотрудника (02.11: «нас не считать»): ссылка aiethos.ru/?team=1 ставит метку,
// Метрика в этом браузере не грузится никогда и баннер не спрашивает; ?team=0 — снять.
// Фильтр по IP в Метрике есть, но у телефонов и VPN адрес меняется — метка надёжнее.
export const TEAM_KEY = 'ethos-team';

// Выполняется в <head> до первой отрисовки: тем, кто уже выбрал, баннер прячет
// CSS по атрибуту на <html> — без мигания, хотя сервер рендерит баннер всем.
// Без шаблонных строк: при next build SWC склеивал `...('${KEY}');` + `...`
// и терял `');` — скрипт падал с SyntaxError (проверено на Next 15).
export const CONSENT_HEAD_SCRIPT =
  'try{var c=localStorage.getItem(' + JSON.stringify(CONSENT_KEY) + ');' +
  'if(localStorage.getItem(' + JSON.stringify(TEAM_KEY) + ')==="1"||/[?&]team=1/.test(location.search))c="denied";' +
  'if(c==="granted"||c==="denied")document.documentElement.setAttribute(' +
  JSON.stringify(CONSENT_ATTR) + ',c)}catch(e){}';
