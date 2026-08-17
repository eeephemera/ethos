'use client';
import React from 'react';
import { s, ymGoal, setupHeaderAutoHide } from './_ui';
import { R } from './_responsive';

// Страница контактов и реквизитов.
//
// До неё единственными контактами на сайте были Telegram и WhatsApp, а в политике
// стояло «реквизиты будут указаны после регистрации». Для B2B со средним чеком в
// сотни тысяч это главный барьер: покупатель не пишет в мессенджер компании,
// у которой не видно юрлица. Плюс указание оператора персданных требуется
// по 152-ФЗ — сайт собирает обращения и ставит Метрику с Вебвизором.

const TG = 'https://t.me/Terraiib24';
const WA = 'https://wa.me/79285288598';
const PHONE = '+79256777027';
const PHONE_HUMAN = '+7 925 677-70-27';
const EMAIL = 'magomedov_zak_05@mail.ru';

const REQUISITES = [
  ['Полное наименование', 'Индивидуальный предприниматель Магомедов Закир Асланович'],
  ['ИНН', '054210247290'],
  ['ОГРНИП', '326050000095170'],
  ['Адрес', 'Республика Дагестан, г. Дербент'],
  ['Дата регистрации', '22 июня 2026 г.'],
  ['Налоговый режим', 'УСН'],
  ['Основной вид деятельности', 'Разработка компьютерного программного обеспечения (ОКВЭД 62.01)'],
  ['Реестр МСП', 'Микропредприятие'],
];

export default class ContactsPage extends React.Component {
  state = { mounted: false };

  headerRef = React.createRef();

  componentDidMount() {
    this._offHeader = setupHeaderAutoHide(() => this.headerRef.current, () => false);
    this.mountTimer = setTimeout(() => this.setState({ mounted: true }), 40);
  }

  componentWillUnmount() {
    if (this._offHeader) this._offHeader();
    clearTimeout(this.mountTimer);
  }

  entrance(delay) {
    return this.state.mounted
      ? 'opacity:1; transform:translateY(0); transition:transform 0.7s cubic-bezier(.16,1,.3,1) ' + delay + 's;'
      : 'opacity:1; transform:translateY(14px);';
  }

  render() {
    const v = R;
    return (
      <div style={s(`--bg:#FAFAF8; --paper:#FFFFFF; --ink:#14171C; --ink-soft:#535C69; --ink-faint:#8A8F99; --line:#E7E6E2; --blue:#155EEF; --violet:#12A5E0; --grad:linear-gradient(135deg, var(--blue), var(--violet)); font-family:var(--font-inter),sans-serif; background:var(--bg); color:var(--ink); min-height:100vh; position:relative; isolation:isolate; overflow-x:clip;`)}>

        <div aria-hidden="true" style={s(`position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;`)}>
          <div style={s(`position:absolute; top:-12%; left:-8%; width:55vw; height:55vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(21,94,239,0.4), transparent 68%); filter:blur(80px); animation:driftBlobA 22s ease-in-out infinite alternate;`)}></div>
          <div style={s(`position:absolute; top:10%; right:-14%; width:50vw; height:50vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(18,165,224,0.36), transparent 68%); filter:blur(85px); animation:driftBlobB 27s ease-in-out infinite alternate;`)}></div>
        </div>

        <header ref={this.headerRef} className="site-header" style={s(`position:sticky; top:14px; z-index:50; margin:14px ${v.padX} 0; display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 18px; background:linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.34)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.7); border-radius:22px; box-shadow:0 16px 40px -16px rgba(20,23,28,0.32), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <a href="/" style={s(`display:inline-flex; align-items:center; gap:10px; text-decoration:none; color:var(--ink);`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={s(`flex-shrink:0;`)} aria-hidden="true"><path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t17); letter-spacing:-0.01em;`)}>ETHOS</span>
          </a>
          <span style={s(`font-size:var(--t13); color:var(--ink-faint);`)}>Контакты и реквизиты</span>
        </header>

        <main style={s(`padding:${v.secPad}; max-width:1000px; margin:0 auto;`)}>
          <nav aria-label="Хлебные крошки" style={s(`display:flex; align-items:center; gap:8px; font-size:var(--t13); color:var(--ink-faint); ${this.entrance(0)}`)}>
            <a href="/" style={s(`color:var(--ink-faint); text-decoration:none;`)}>Главная</a>
            <span aria-hidden="true">→</span>
            <span style={s(`color:var(--ink-soft); font-weight:500;`)}>Контакты</span>
          </nav>

          <h1 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h1Size}; line-height:1.08; letter-spacing:-0.03em; margin:22px 0 0; color:var(--ink); ${this.entrance(0.08)}`)}>Как с нами связаться</h1>
          <p style={s(`font-size:var(--t18); line-height:1.65; color:var(--ink-soft); max-width:calc(620px * var(--t-scale)); margin:20px 0 0; ${this.entrance(0.16)}`)}>
            Отвечаем в течение рабочего дня. Опишите задачу в двух словах — на бесплатной диагностике разберём её, покажем сценарий и назовём сроки пилота.
          </p>

          <div style={s(`display:grid; grid-template-columns:${v.cols2}; gap:16px; margin-top:40px; ${this.entrance(0.24)}`)}>
            <a href={'tel:' + PHONE} onClick={() => ymGoal('phone')} style={s(`display:flex; align-items:center; gap:14px; background:linear-gradient(160deg, rgba(255,255,255,0.75), rgba(255,255,255,0.52)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:18px; padding:22px 24px; text-decoration:none; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
              <span style={s(`width:42px; height:42px; border-radius:12px; background:var(--grad); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M6.6 3h3l1.5 4-2 1.4a13 13 0 006.5 6.5l1.4-2 4 1.5v3A2 2 0 0119 19.5 16.5 16.5 0 014.5 5 2 2 0 016.6 3z" fill="#fff"></path></svg></span>
              <span style={s(`min-width:0;`)}>
                <span style={s(`display:block; font-family:monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Телефон</span>
                <span style={s(`display:block; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:19px; color:var(--ink); margin-top:4px;`)}>{PHONE_HUMAN}</span>
              </span>
            </a>

            <a href={'mailto:' + EMAIL} onClick={() => ymGoal('email')} style={s(`display:flex; align-items:center; gap:14px; background:linear-gradient(160deg, rgba(255,255,255,0.75), rgba(255,255,255,0.52)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:18px; padding:22px 24px; text-decoration:none; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
              <span style={s(`width:42px; height:42px; border-radius:12px; background:var(--ink); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M3 6.5h18v11H3v-11z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"></path><path d="M3.5 7l8.5 6 8.5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
              <span style={s(`min-width:0;`)}>
                <span style={s(`display:block; font-family:monospace; font-size:11px; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Почта</span>
                <span style={s(`display:block; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t16); color:var(--ink); margin-top:4px; overflow-wrap:anywhere;`)}>{EMAIL}</span>
              </span>
            </a>
          </div>

          <div style={s(`display:flex; gap:12px; flex-wrap:wrap; margin-top:16px; ${this.entrance(0.28)}`)}>
            <a href={TG} target="_blank" rel="noopener" onClick={() => ymGoal('telegram')} style={s(`flex:1; min-width:200px; display:flex; align-items:center; justify-content:center; gap:9px; font-size:var(--t15); font-weight:600; color:#fff; background:var(--grad); border-radius:14px; padding:16px 24px; text-decoration:none; box-shadow:0 10px 24px rgba(21,94,239,0.22);`)}>Написать в Telegram</a>
            <a href={WA} target="_blank" rel="noopener" onClick={() => ymGoal('whatsapp')} style={s(`flex:1; min-width:200px; display:flex; align-items:center; justify-content:center; gap:9px; font-size:var(--t15); font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); border-radius:14px; padding:16px 24px; text-decoration:none;`)}>Написать в WhatsApp</a>
          </div>

          <div style={s(`display:flex; align-items:center; gap:10px; margin-top:22px; background:rgba(31,138,91,0.07); border:1px solid rgba(31,138,91,0.2); border-radius:12px; padding:14px 16px; ${this.entrance(0.3)}`)}>
            <span style={s(`width:7px; height:7px; border-radius:50%; background:#1F8A5B; flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
            <span style={s(`font-size:var(--t14); font-weight:600; color:#1F8A5B;`)}>Диагностика процессов и оценка проекта — бесплатно</span>
          </div>

          <section style={s(`margin-top:56px;`)}>
            <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Реквизиты</div>
            <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.14; letter-spacing:-0.02em; margin:14px 0 0; color:var(--ink);`)}>С кем вы заключаете договор</h2>
            <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:14px 0 0; max-width:calc(620px * var(--t-scale));`)}>
              Работаем по договору с фиксированным составом работ, сроками и сметой. Данные можно проверить в{' '}
              <a href="https://egrul.nalog.ru/" target="_blank" rel="noopener" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>реестре ФНС</a> по ИНН или ОГРНИП.
            </p>

            <div style={s(`margin-top:28px; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:${v.migCardPad}; box-shadow:0 24px 50px -30px rgba(20,23,28,0.22), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
              <dl style={s(`margin:0; display:flex; flex-direction:column; gap:0;`)}>
                {REQUISITES.map(([k, val], i) => (
                  <div key={k} style={s(`display:flex; flex-wrap:wrap; gap:6px 20px; padding:14px 0; ${i ? 'border-top:1px solid var(--line);' : ''}`)}>
                    <dt style={s(`flex:0 0 220px; min-width:0; font-size:var(--t135); color:var(--ink-faint);`)}>{k}</dt>
                    <dd style={s(`flex:1; min-width:0; margin:0; font-size:var(--t15); font-weight:600; color:var(--ink); overflow-wrap:anywhere;`)}>{val}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p style={s(`font-size:var(--t135); line-height:1.6; color:var(--ink-faint); margin:18px 0 0;`)}>
              Сертификаты и подтверждающие документы предоставляем по запросу.{' '}
              <a href="/privacy" style={s(`color:var(--ink-faint); text-decoration:none; border-bottom:1px solid var(--line);`)}>Политика конфиденциальности</a>
            </p>
          </section>
        </main>

        <footer style={s(`padding:0 ${v.padX} 48px; max-width:1000px; margin:0 auto; display:flex; flex-direction:${v.footerDirection}; align-items:${v.footerAlign}; justify-content:space-between; gap:20px; border-top:1px solid var(--line); padding-top:32px;`)}>
          <div style={s(`font-size:var(--t13); color:var(--ink-faint); line-height:1.6;`)}>
            ИП Магомедов З. А. · ИНН 054210247290 · ОГРНИП 326050000095170<br />
            © 2026 ETHOS. Все права защищены.
          </div>
          <div style={s(`display:flex; gap:20px; flex-wrap:wrap;`)}>
            <a href="/" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Главная</a>
            <a href="/bitrix24" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Битрикс24</a>
            <a href="/ai" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>ИИ-решения</a>
          </div>
        </footer>
      </div>
    );
  }
}
