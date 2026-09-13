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

const buttonBase = {
  flexShrink: 0,
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  padding: '11px 22px',
  borderRadius: '999px',
  cursor: 'pointer',
};

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

  return (
    <div
      role="dialog"
      className="cookie-notice"
      aria-label="Согласие на использование cookie"
      style={{
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '16px',
        zIndex: 80,
        maxWidth: '760px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '14px 20px',
        background: '#FFFFFF',
        border: '1px solid #E7E6E2',
        borderRadius: '16px',
        boxShadow: '0 20px 48px -18px rgba(20,23,28,0.32)',
        padding: '16px 20px',
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      <p style={{ margin: 0, flex: '1 1 320px', fontSize: '14px', lineHeight: 1.55, color: '#535C69' }}>
        Хотим использовать cookie и Яндекс.Метрику, чтобы понимать посещаемость сайта. Метрика
        включится только с вашего согласия. Подробнее — в{' '}
        <a href="/privacy" style={{ color: '#155EEF', textDecoration: 'none', borderBottom: '1px solid rgba(21,94,239,0.35)' }}>
          Политике конфиденциальности
        </a>.
      </p>
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => choose('denied')}
          style={{ ...buttonBase, color: '#2C333D', background: '#F2F1ED', border: '1px solid #E7E6E2' }}
        >
          Отклонить
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          style={{ ...buttonBase, color: '#fff', background: 'linear-gradient(135deg, #155EEF, #12A5E0)', border: 'none' }}
        >
          Принять
        </button>
      </div>
    </div>
  );
}
