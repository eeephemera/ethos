import type { Metadata } from 'next';

/**
 * Своя 404 вместо англоязычной заглушки Next.js на русскоязычном сайте.
 * Заодно закрывает находку аудита про два тега <title> в <head> на
 * несуществующих URL: собственная metadata перебивает дефолтную.
 */
export const metadata: Metadata = {
  title: 'Страница не найдена — ETHOS',
  robots: { index: false, follow: true },
};

const wrap: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '48px 24px',
  background: '#FAFAF8',
  color: '#14171C',
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  textAlign: 'center',
};

const links: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  justifyContent: 'center',
  marginTop: '22px',
};

const primary: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#fff',
  background: 'linear-gradient(135deg, #155EEF, #12A5E0)',
  borderRadius: '14px',
  padding: '14px 26px',
  textDecoration: 'none',
  boxShadow: '0 10px 24px rgba(21,94,239,0.24)',
};

const secondary: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#14171C',
  border: '1px solid #E7E6E2',
  borderRadius: '14px',
  padding: '14px 26px',
  textDecoration: 'none',
};

export default function NotFound() {
  return (
    <main style={wrap}>
      <div
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(56px, 14vw, 96px)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #155EEF, #12A5E0)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        404
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(22px, 5vw, 30px)',
          letterSpacing: '-0.02em',
          margin: '8px 0 0',
        }}
      >
        Такой страницы нет
      </h1>
      <p style={{ fontSize: '16px', lineHeight: 1.6, color: '#535C69', margin: 0, maxWidth: '440px' }}>
        Возможно, ссылка устарела или в адресе опечатка. Загляните на главную — или напишите нам,
        подскажем, где искать.
      </p>
      <div style={links}>
        <a href="/" style={primary}>
          На главную
        </a>
        <a href="/contacts" style={secondary}>
          Контакты
        </a>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center', marginTop: '28px' }}>
        <a href="/bitrix24" style={{ fontSize: '14px', color: '#535C69', textDecoration: 'none' }}>
          Внедрение Битрикс24
        </a>
        <a href="/ai" style={{ fontSize: '14px', color: '#535C69', textDecoration: 'none' }}>
          ИИ-решения
        </a>
      </div>
    </main>
  );
}
