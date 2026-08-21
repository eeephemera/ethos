'use client';

import { ymGoal } from './_ui';

/**
 * Нижняя панель действий на телефоне.
 *
 * Низ экрана — самое доступное место на телефоне: туда дотягивается большой
 * палец, не перехватывая устройство. Раньше там жили круглая кнопка голосового
 * гида (54 px) и баннер о cookie — то есть самое дорогое место занимала
 * озвучка сайта, а не действие, ради которого человек пришёл.
 *
 * Два действия, а не одно: звонок закрывает «хочу говорить сейчас», Telegram —
 * «неудобно звонить, напишу». Высота касания 48 px (минимум по рекомендациям
 * для пальца), скрывается на десктопе — там те же контакты есть в шапке.
 *
 * Живёт в layout, а не на конкретной странице: с любой страницы связаться
 * можно одинаково, и отступ снизу у body всегда совпадает с высотой панели.
 */
export default function MobileActionBar() {
  return (
    <nav className="mobile-bar" aria-label="Быстрая связь">
      <a className="mb-call" href="tel:+79256777027" onClick={() => ymGoal('phone')}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6.6 3.5h2.2l1.5 3.7-1.8 1.3a12 12 0 006.9 6.9l1.3-1.8 3.7 1.5v2.2a2 2 0 01-2.2 2A17.5 17.5 0 014.6 5.7a2 2 0 012-2.2z"
            stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"
          />
        </svg>
        Позвонить
      </a>
      <a
        className="mb-tg"
        href="https://t.me/Terraiib24"
        target="_blank"
        rel="noopener"
        onClick={() => ymGoal('telegram')}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 4.5L2.8 11.4l4.9 1.6L19 6.3l-9.1 8.6.3 5 2.7-3.6 4.6 3.4L21 4.5z" fill="currentColor" />
        </svg>
        Telegram
      </a>
    </nav>
  );
}
