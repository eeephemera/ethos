'use client';
import React from 'react';
import { ymGoal, prefillLead } from './_ui';
import st from './AiExtras.module.css';

/**
 * «Дашборды» на /ai (02.11, владелец: «добавить отдельно — строим дашборды, аналитику»).
 *
 * Три вкладки — три человека, для которых строим панель: собственник, РОП, руководитель.
 * Макет — пример данных (так и подписан), а не замер: цифр клиентов на сайте нет.
 * Строки — то, что реально собираем: конверсия по менеджерам, остатки склада, жалобы.
 *
 * Цели Метрики: dash_role — открыл вкладку; cta_contact (place=dashboards) — «Хочу дашборд».
 */

const ROLES = [
  {
    key: 'owner',
    tab: 'Собственнику',
    who: 'собственника',
    title: 'Деньги и план — на одном экране',
    text: 'Выручка, маржа, план-факт и дебиторка по дням. Видно, где проседаете, без звонков бухгалтеру и РОПу.',
    kpis: [
      ['Выручка, месяц', '12,4 млн ₽', '94% плана'],
      ['Маржа', '31%', '+2 п.п.'],
      ['Дебиторка', '2,1 млн ₽', '6 клиентов'],
    ],
    chartTitle: 'Выручка по неделям, млн ₽',
    bars: [['1 нед', 2.6], ['2 нед', 3.1], ['3 нед', 2.9], ['4 нед', 3.8]],
    plan: 3.3,
  },
  {
    key: 'rop',
    tab: 'РОПу',
    who: 'РОПа',
    title: 'Честная конверсия по каждому менеджеру',
    text: 'Считаем от заявки до оплаты, а не от «взятых в работу»: видно, кто доводит сделки, а кто держит лидов без касания.',
    kpis: [
      ['Заявок за неделю', '412', 'из 6 каналов'],
      ['Первый ответ', '6 мин', 'медиана'],
      ['Без касания 15+ мин', '9', 'ушли пуши'],
    ],
    chartTitle: 'Конверсия в оплату по менеджерам, %',
    bars: [['Анна', 24], ['Игорь', 19], ['Мария', 15], ['Олег', 9]],
    plan: 17,
  },
  {
    key: 'head',
    tab: 'Руководителю',
    who: 'руководителя',
    title: 'Склад, жалобы и команда — без ручных отчётов',
    text: 'Актуальные остатки, жалобы за неделю, отзывы без ответа и отклики на вакансии — сводка утром в Telegram.',
    kpis: [
      ['Ниже минимума на складе', '37 поз.', 'заказать'],
      ['Жалоб за неделю', '12', '−4 к прошлой'],
      ['Отзывов без ответа', '3', 'ответы готовы'],
    ],
    chartTitle: 'Жалобы по темам за неделю',
    bars: [['Доставка', 5], ['Качество', 3], ['Сроки', 3], ['Сервис', 1]],
    plan: null,
  },
];

const SOURCES = ['Битрикс24', '1С', 'Сайт', 'Телефония', 'Google/Яндекс Таблицы'];

const fmt = (n) => String(n).replace('.', ',');

// Самый высокий столбец — 85 % высоты: над ним ещё подпись значения.
const SCALE = 0.85;

export default function DashboardsSection() {
  const [idx, setIdx] = React.useState(0);
  const role = ROLES[idx];
  const top = Math.max(...role.bars.map((b) => b[1]));
  const max = Math.max(top, role.plan || 0);

  const pick = (i) => {
    if (i !== idx) ymGoal('dash_role', { role: ROLES[i].key });
    setIdx(i);
  };

  return (
    <section id="dashboards" data-screen-label="Дашборды" className={st.section}>
      <div className={st.dashGrid} data-reveal>
        <div className={st.dashText}>
          <div className={st.kicker}>Дашборды и аналитика</div>
          <h2 className={st.h2}>Строим дашборды под&nbsp;роль — собственнику, РОПу и&nbsp;вам</h2>
          <p className={st.lead}>Собираем данные из CRM, 1С, сайта и телефонии в одну панель. Каждый видит свои цифры, а не общую простыню отчётов.</p>

          <div className={st.tabs} role="tablist" aria-label="Для кого дашборд">
            {ROLES.map((r, i) => (
              <button
                key={r.key}
                type="button"
                role="tab"
                id={'dash-tab-' + r.key}
                aria-selected={i === idx}
                aria-controls="dash-panel"
                className={i === idx ? `${st.tab} ${st.tabOn}` : st.tab}
                onClick={() => pick(i)}
              >{r.tab}</button>
            ))}
          </div>
          <p className={st.roleTitle}>{role.title}</p>
          <p className={st.roleText}>{role.text}</p>

          <div className={st.sources}>
            <span className={st.sourcesLabel}>Источники:</span>
            {SOURCES.map((x) => <span key={x} className={st.source}>{x}</span>)}
          </div>

          <button
            type="button"
            className={st.ghostBtn}
            onClick={() => {
              ymGoal('cta_contact', { place: 'dashboards', topic: role.key });
              prefillLead({ topic: 'dash', task: 'Хочу дашборд ' + role.who + ': ' });
            }}
          >Хочу такой дашборд</button>
        </div>

        <div id="dash-panel" role="tabpanel" aria-labelledby={'dash-tab-' + role.key} className={st.board} key={role.key}>
          <div className={st.boardHead}>
            <span className={st.dots} aria-hidden="true"><i /><i /><i /></span>
            <span className={st.boardName}>Дашборд {role.who}</span>
            <span className={st.sample}>пример данных</span>
          </div>
          <div className={st.kpis}>
            {role.kpis.map(([l, n, d]) => (
              <div key={l} className={st.kpi}>
                <div className={st.kpiLabel}>{l}</div>
                <div className={st.kpiNum}>{n}</div>
                <div className={st.kpiNote}>{d}</div>
              </div>
            ))}
          </div>
          <div className={st.chart}>
            <div className={st.chartTitle}>
              {role.chartTitle}
              {role.plan ? <span className={st.planKey}> · пунктир — {role.key === 'rop' ? 'отдел ' + role.plan + '%' : 'план ' + fmt(role.plan)}</span> : null}
            </div>
            <div className={st.bars}>
              {role.plan ? (
                <div className={st.plan} style={{ bottom: `calc(22px + (100% - 22px) * ${((role.plan / max) * SCALE).toFixed(3)})` }} />
              ) : null}
              {role.bars.map(([l, n], i) => (
                <div key={l} className={st.barCol}>
                  <span className={st.barVal}>{fmt(n)}</span>
                  <span
                    className={n === top ? `${st.bar} ${st.barTop}` : st.bar}
                    style={{ height: (n / max) * SCALE * 100 + '%', animationDelay: i * 0.08 + 's' }}
                  />
                  <span className={st.barLabel}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
