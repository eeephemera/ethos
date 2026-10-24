'use client';

import { useEffect, useState } from 'react';
import { YM_ID } from './_ui';
import { CONSENT_ATTR, CONSENT_KEY } from './consent';

// Яндекс Метрика загружается ТОЛЬКО после «Принять». Позиция Роскомнадзора:
// cookie и IP — персональные данные, поэтому счётчик до согласия и формула
// «продолжая пользоваться сайтом, вы соглашаетесь» — нарушение ст. 9 152-ФЗ.
// Отказ запоминается: повторно не спрашиваем, сайт работает как обычно.
//
// Баннер рендерится и на сервере — он есть в HTML, его видят автопроверки без
// JS. Уже выбравшим его прячет атрибут на <html> (см. CONSENT_HEAD_SCRIPT).

let metrikaStarted = false;

function startMetrika() {
  if (metrikaStarted) return;
  metrikaStarted = true;
  // Официальный сниппет Метрики: очередь вызовов до загрузки tag.js.
  window.ym = window.ym || function () {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = Date.now();
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}`;
  document.head.appendChild(script);
  window.ym(YM_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

export default function CookieNotice() {
  // Первый рендер (сервер и гидрация) — всегда с баннером, разметка совпадает.
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    let value = null;
    try {
      value = localStorage.getItem(CONSENT_KEY);
    } catch {
      /* хранилище недоступно — спросим заново */
    }
    if (value === 'granted') startMetrika();
    if (value === 'granted' || value === 'denied') setDecided(true);
  }, []);

  const choose = (value) => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* приватный режим — выбор действует до перезагрузки */
    }
    document.documentElement.setAttribute(CONSENT_ATTR, value);
    if (value === 'granted') startMetrika();
    setDecided(true);
  };

  if (decided) return null;

  // Вид — классами в globals.css (.cookie-notice): на телефоне баннер
  // сжимается до строки текста с кнопками в ряд. Полный вариант закрывал
  // вместе с нижней панелью около трети экрана, в том числе кнопку первого
  // экрана на /bitrix24.
  return (
    <div role="dialog" className="cookie-notice" aria-label="Согласие на использование cookie">
      <p className="cookie-text cookie-long">
        Хотим использовать cookie и Яндекс.Метрику, чтобы понимать посещаемость сайта. Метрика
        включится только с вашего согласия. Подробнее — в{' '}
        <a href="/privacy">Политике конфиденциальности</a>.
      </p>
      <p className="cookie-text cookie-short">
        Яндекс.Метрика и cookie — только с вашего согласия. <a href="/privacy">Подробнее</a>
      </p>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn cookie-btn-no" onClick={() => choose('denied')}>
          Отклонить
        </button>
        <button type="button" className="cookie-btn cookie-btn-yes" onClick={() => choose('granted')}>
          Принять
        </button>
      </div>
    </div>
  );
}
