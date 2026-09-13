// Согласие на Яндекс Метрику — общий ключ для баннера (клиент) и layout (сервер).
// Модуль без 'use client', поэтому константы доходят до серверного layout как
// обычные значения, а не клиентские ссылки.

export const CONSENT_KEY = 'ethos-metrika-consent'; // 'granted' | 'denied'
export const CONSENT_ATTR = 'data-metrika-consent';

// Выполняется в <head> до первой отрисовки: тем, кто уже выбрал, баннер прячет
// CSS по атрибуту на <html> — без мигания, хотя сервер рендерит баннер всем.
// Без шаблонных строк: при next build SWC склеивал `...('${KEY}');` + `...`
// и терял `');` — скрипт падал с SyntaxError (проверено на Next 15).
export const CONSENT_HEAD_SCRIPT =
  'try{var c=localStorage.getItem(' + JSON.stringify(CONSENT_KEY) + ');' +
  'if(c==="granted"||c==="denied")document.documentElement.setAttribute(' +
  JSON.stringify(CONSENT_ATTR) + ',c)}catch(e){}';
