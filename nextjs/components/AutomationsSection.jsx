'use client';
import React from 'react';
import { ymGoal, prefillLead } from './_ui';
import st from './AiExtras.module.css';

/**
 * «Что ещё автоматизируем» на /ai — список владельца от 02.11 одной таблицей.
 *
 * Шестнадцать задач — не шестнадцать блоков: четыре колонки по смыслу, строка — одна
 * фраза. Щелчок по строке подставляет её в форму заявки и ведёт к ней (prefillLead):
 * человек нашёл свою задачу — ему остаётся оставить контакт. Ссылка → у задач, для
 * которых на странице есть свой раздел.
 *
 * Instagram не называем: Meta признана в РФ экстремистской, упоминание требует
 * оговорки — пишем «соцсети клиента».
 *
 * Цель Метрики: auto_pick (item — задача, group — колонка).
 */

const GROUPS = [
  {
    key: 'sales',
    title: 'Продажи и клиенты',
    items: [
      { t: 'Распределяем диалоги между менеджерами по нагрузке' },
      { t: 'Автонапоминание клиенту после 15 минут тишины в чате' },
      { t: 'Метка «VIP» по соцсетям клиента: от 10 тыс. подписчиков — в приоритет' },
      { t: 'Отзывы на Яндекс Картах и ВКонтакте: ИИ сразу предлагает ответ' },
    ],
  },
  {
    key: 'analytics',
    title: 'Аналитика и контроль',
    items: [
      { t: 'Дашборды собственнику, РОПу и руководителю', href: '#dashboards', topic: 'dash' },
      { t: 'Честная конверсия по каждому менеджеру', topic: 'dash' },
      { t: 'Еженедельный разбор жалоб — вам и собственнику', topic: 'dash' },
      { t: 'ИИ следит за конкурентами: цены, ассортимент, акции' },
    ],
  },
  {
    key: 'ops',
    title: 'Склад, учёт, документы',
    items: [
      { t: 'Актуальные остатки на складе в реальном времени' },
      { t: 'Себестоимость сборных товаров — например, букетов' },
      { t: 'Бухгалтерия и расчёт зарплат' },
      { t: 'Документы по шаблонам компании: КП, договоры, акты' },
    ],
  },
  {
    key: 'team',
    title: 'Команда и запуск',
    items: [
      { t: 'Вакансии с hh.ru: ИИ отбирает подходящие отклики' },
      { t: 'Найм: от отклика до собеседования без ручной рутины' },
      { t: 'Голосовой ИИ-помощник руководителя — с доступом к базе, 1С и Битрикс24', href: '#assistant', topic: 'ai' },
      { t: 'Интернет-магазин под ключ — собираем целиком с помощью ИИ', topic: 'cards' },
    ],
  },
];

export default function AutomationsSection() {
  // На телефоне колонки — аккордеон (открыта одна группа): все 16 строк — два экрана
  // прокрутки. На широком экране CSS показывает всё, кнопка заголовка там не нужна.
  const [open, setOpen] = React.useState(0);

  const pick = (group, item) => {
    ymGoal('auto_pick', { item: item.t.slice(0, 60), group: group.key });
    prefillLead({ topic: item.topic || 'auto', task: 'Хочу: ' + item.t });
  };

  return (
    <section id="more" data-screen-label="Что ещё автоматизируем" className={st.section}>
      <div data-reveal className={st.moreHead}>
        <div>
          <div className={st.kicker}>Что ещё автоматизируем</div>
          <h2 className={st.h2}>Сделаем и это — нажмите на&nbsp;свою задачу</h2>
        </div>
        <p className={st.lead}>Типовые задачи, которые закрываем ИИ и автоматизацией. Щелчок по строке — и она окажется в заявке, останется оставить контакт.</p>
      </div>

      <div className={st.moreGrid} data-reveal-children="90">
        {GROUPS.map((g, gi) => (
          <div key={g.key} className={st.moreCol} data-open={open === gi ? '' : undefined}>
            <h3 className={st.moreTitle}>
              <button
                type="button"
                className={st.moreToggle}
                aria-expanded={open === gi}
                aria-controls={'more-' + g.key}
                onClick={() => setOpen(open === gi ? -1 : gi)}
              >
                {g.title}
                <span className={st.moreCount}>{g.items.length}</span>
              </button>
            </h3>
            <ul className={st.moreList} id={'more-' + g.key}>
              {g.items.map((it) => (
                <li key={it.t}>
                  <button type="button" className={st.moreItem} onClick={() => pick(g, it)}>
                    <span className={st.morePlus} aria-hidden="true">+</span>
                    <span className={st.moreText}>{it.t}</span>
                  </button>
                  {it.href ? (
                    <a className={st.moreLink} href={it.href} onClick={() => ymGoal('nav', { to: it.href, place: 'more' })} aria-label={'Подробнее: ' + it.t}>подробнее ↓</a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
