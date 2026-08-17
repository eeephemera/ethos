'use client';

import { useEffect, useState } from 'react';

const KEY = 'ethos-cookie-consent';

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Уведомление об использовании cookie"
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
        Мы используем файлы cookie и Яндекс.Метрику для аналитики. Продолжая пользоваться сайтом,
        вы соглашаетесь с{' '}
        <a href="/privacy" style={{ color: '#155EEF', textDecoration: 'none', borderBottom: '1px solid rgba(21,94,239,0.35)' }}>
          Политикой конфиденциальности
        </a>.
      </p>
      <button
        onClick={accept}
        style={{
          flexShrink: 0,
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          color: '#fff',
          background: 'linear-gradient(135deg, #155EEF, #12A5E0)',
          border: 'none',
          padding: '11px 26px',
          borderRadius: '999px',
          cursor: 'pointer',
        }}
      >
        Принять
      </button>
    </div>
  );
}
