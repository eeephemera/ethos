'use client';
import { useEffect } from 'react';
import { ymGoal } from './_ui';

/**
 * Цель Метрики ui_click — нажатие на ЛЮБУЮ кнопку или ссылку сайта (02.11, владелец:
 * «цели при нажатии на кнопки, чтобы они отображались»).
 *
 * Свои цели есть у главных действий (form_submit, telegram, phone, cta_contact…), но
 * кнопок на страницах — сотни, и заводить цель на каждую в Метрике нельзя. Поэтому одна
 * общая цель с параметрами: text — надпись кнопки, href — куда ведёт, section — раздел
 * страницы (id или data-screen-label). В Метрике: отчёт «Параметры визитов» → ui_click.
 *
 * Слушатель один на документ (capture), поэтому видит и кнопки, отрисованные позже.
 * До согласия на cookie Метрики нет — ymGoal ничего не делает.
 */
export default function ClickGoals() {
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target && e.target.closest ? e.target.closest('a, button') : null;
      if (!el) return;
      const text = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      const box = el.closest('section, header, footer, nav, form, [role="dialog"]');
      const section = box
        ? box.id || box.getAttribute('data-screen-label') || box.getAttribute('aria-label') || box.tagName.toLowerCase()
        : 'page';
      ymGoal('ui_click', { text: text || '(без текста)', href: el.getAttribute('href') || '', section });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
