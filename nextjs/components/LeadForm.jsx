'use client';
import React from 'react';
import { ymGoal, leadText, tgHref, waHref, PHONE, PHONE_HUMAN } from './_ui';
import { LEAD_TOPICS, contactKind } from '../lib/leadTopics';
import st from './LeadForm.module.css';

/**
 * Заявка: что нужно, задача, имя, телефон или Telegram — и «Отправить».
 *
 * Прежняя форма первого экрана (02.11, владелец: «сделать более понятную») не
 * спрашивала контакт: собирала «карточку сделки» из прочерков и уводила в
 * мессенджер, где человек сам должен был отправить текст. Там заявка и терялась:
 * уведомления в Telegram к тому же не доходили (бот писал сам себе, 403).
 * Теперь это обычная форма: поля с подписями, одна кнопка, честный итог —
 * «отправлено» только после ответа сервера, при сбое — мессенджеры и телефон.
 *
 * Контакт хранится на нашем сервере, в Telegram уходит только ссылка на него
 * (app/api/lead). Галочка согласия обязательна: форма собирает персональные данные.
 *
 * Цели Метрики (place — место формы, topic — тема):
 *   form_start  — начал заполнять (раз за показ);
 *   form_topic  — выбрал тему;
 *   form_submit — заявка принята сервером (главная конверсия);
 *   lead_b24 / lead_ai — та же заявка по направлению (тема или страница);
 *   form_error  — сервер не принял (сеть, лимит).
 *
 * Подсказка снаружи: prefillLead() из _ui.js шлёт событие ethos:lead —
 * форма ставит тему и задачу (кнопки «Хочу такое» в каталоге автоматизаций).
 */

const PLACEHOLDERS = {
  b24: 'Например: внедрить Битрикс24 в отдел продаж на 8 человек',
  ai: 'Например: ИИ должен отвечать на заявки из WhatsApp ночью',
  dash: 'Например: дашборд собственнику — выручка, конверсия, план-факт',
  cards: 'Например: 3 000 товаров без описаний и фото на сайте',
  auto: 'Например: считать зарплату менеджеров из Битрикс24 и 1С',
};

export default function LeadForm({ source, place, where, defaultTopic = null, primary = false }) {
  const [topic, setTopic] = React.useState(defaultTopic);
  const [task, setTask] = React.useState('');
  const [name, setName] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const [website, setWebsite] = React.useState('');
  const [state, setState] = React.useState('idle'); // idle | sending | sent | failed
  const [error, setError] = React.useState(null); // contact | consent
  const started = React.useRef(false);
  const contactRef = React.useRef(null);
  const consentRef = React.useRef(null);
  const ids = React.useId();

  const start = () => {
    if (started.current) return;
    started.current = true;
    ymGoal('form_start', { place });
  };

  const pickTopic = (key) => {
    start();
    if (key !== topic) ymGoal('form_topic', { place, topic: key });
    setTopic(key);
  };

  React.useEffect(() => {
    const onPrefill = (e) => {
      const d = e.detail || {};
      if (d.topic) setTopic(d.topic);
      if (d.task) setTask(d.task);
      setState('idle');
      if (primary && contactRef.current) {
        setTimeout(() => { try { contactRef.current.focus({ preventScroll: true }); } catch (err) {} }, 450);
      }
    };
    window.addEventListener('ethos:lead', onPrefill);
    return () => window.removeEventListener('ethos:lead', onPrefill);
  }, [primary]);

  const submit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    if (!contactKind(contact)) {
      setError('contact');
      if (contactRef.current) contactRef.current.focus();
      return;
    }
    if (!consent) {
      setError('consent');
      if (consentRef.current) consentRef.current.focus();
      return;
    }
    setError(null);
    setState('sending');
    let ok = false;
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, topic, task, name, contact, consent, website, page: window.location.pathname }),
      });
      ok = res.ok;
    } catch (err) {}
    const goal = { place, topic: topic || 'none', contact: contactKind(contact) };
    if (ok) {
      ymGoal('form_submit', goal);
      // Заявка по направлению: Битрикс24 и ИИ ведут разные исполнители (lib/requisites.js).
      // Тема «Битрикс24» или страница /bitrix24 без темы — lead_b24, остальные темы и /ai — lead_ai.
      const path = window.location.pathname;
      const dir = topic === 'b24' || (!topic && path === '/bitrix24') ? 'lead_b24'
        : topic || path === '/ai' ? 'lead_ai' : null;
      if (dir) ymGoal(dir, goal);
      setState('sent');
    } else {
      ymGoal('form_error', goal);
      setState('failed');
    }
  };

  const text = leadText(where, task.trim() ? 'задача: ' + task.trim() : null);
  const alt = (
    <p className={st.alt}>
      {state === 'failed' ? 'Напишите или позвоните: ' : 'Или сразу: '}
      <a href={tgHref(text)} target="_blank" rel="noopener" onClick={() => ymGoal('telegram', { place })}>Telegram</a>
      <span aria-hidden="true"> · </span>
      <a href={waHref(text)} target="_blank" rel="noopener" onClick={() => ymGoal('whatsapp', { place })}>WhatsApp</a>
      <span aria-hidden="true"> · </span>
      <a href={'tel:' + PHONE} onClick={() => ymGoal('phone', { place })} className={st.nowrap}>{PHONE_HUMAN}</a>
    </p>
  );

  if (state === 'sent') {
    const viaTg = contactKind(contact) === 'telegram';
    return (
      <div className={st.done} role="status" data-lead-form={primary ? 'main' : ''}>
        <span className={st.doneIcon} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <b className={st.doneTitle}>Заявка отправлена</b>
        <p className={st.doneText}>
          Ответим в течение рабочего дня {viaTg ? 'в Telegram' : 'по телефону'} — {contact.trim()}.
          Если срочно, звоните: <a href={'tel:' + PHONE} onClick={() => ymGoal('phone', { place: place + '_sent' })}>{PHONE_HUMAN}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className={st.form} onSubmit={submit} noValidate aria-label="Заявка" data-lead-form={primary ? 'main' : ''}>
      <fieldset className={st.group}>
        <legend className={st.label}>Что нужно</legend>
        <div className={st.chips}>
          {LEAD_TOPICS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={topic === t.key ? `${st.chip} ${st.chipOn}` : st.chip}
              aria-pressed={topic === t.key}
              onClick={() => pickTopic(t.key)}
            >{t.label}</button>
          ))}
        </div>
      </fieldset>

      <label className={st.label} htmlFor={ids + 'task'}>
        Задача <span className={st.opt}>— можно в двух словах</span>
      </label>
      <textarea
        id={ids + 'task'}
        className={st.input}
        rows={2}
        maxLength={2000}
        value={task}
        onChange={(e) => { start(); setTask(e.target.value); }}
        placeholder={PLACEHOLDERS[topic] || 'Например: заявки из WhatsApp теряются между менеджерами'}
      />

      <div className={st.pair}>
        <div>
          <label className={st.label} htmlFor={ids + 'name'}>Имя</label>
          <input
            id={ids + 'name'}
            className={st.input}
            type="text"
            autoComplete="given-name"
            maxLength={80}
            value={name}
            onChange={(e) => { start(); setName(e.target.value); }}
            placeholder="Как к вам обращаться"
          />
        </div>
        <div>
          <label className={st.label} htmlFor={ids + 'contact'}>Телефон или Telegram <span className={st.req} aria-hidden="true">*</span></label>
          <input
            id={ids + 'contact'}
            ref={contactRef}
            className={error === 'contact' ? `${st.input} ${st.bad}` : st.input}
            type="text"
            autoComplete="tel"
            maxLength={120}
            required
            aria-invalid={error === 'contact'}
            aria-describedby={error === 'contact' ? ids + 'err' : undefined}
            value={contact}
            onChange={(e) => { start(); setContact(e.target.value); if (error === 'contact') setError(null); }}
            placeholder="+7 900 000-00-00 или @ник"
          />
        </div>
      </div>

      <label className={st.check}>
        <input
          ref={consentRef}
          type="checkbox"
          checked={consent}
          aria-invalid={error === 'consent'}
          aria-describedby={error === 'consent' ? ids + 'err' : undefined}
          onChange={(e) => { start(); setConsent(e.target.checked); if (error === 'consent') setError(null); }}
        />
        <span>
          Согласен на обработку имени, контакта и текста заявки, чтобы мне ответили, — по{' '}
          <a href="/privacy" target="_blank" rel="noopener">политике конфиденциальности</a>
        </span>
      </label>

      {/* Ловушка для ботов: людям не видна и недоступна с клавиатуры. */}
      <input className={st.trap} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} />

      {error ? (
        <p className={st.err} id={ids + 'err'} role="alert">
          {error === 'contact'
            ? 'Укажите телефон (от 10 цифр) или ник в Telegram — например, @ivan_petrov.'
            : 'Отметьте согласие — без него мы не можем принять контакт.'}
        </p>
      ) : null}
      {state === 'failed' ? (
        <p className={st.err} role="alert">Не получилось отправить заявку. Ответим так же быстро в мессенджере или по телефону.</p>
      ) : null}

      <button type="submit" className={st.submit} disabled={state === 'sending'}>
        {state === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
      </button>
      <p className={st.note}>Ответим в течение рабочего дня. ТЗ не нужно — разберёмся на созвоне.</p>
      {alt}
    </form>
  );
}
