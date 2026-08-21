'use client';
import React from 'react';
import { s, ymGoal, setupHeaderAutoHide, observeInView } from './_ui';
import { R } from './_responsive';
import BlurImage from './BlurImage';

const FXCSS = ".mnfx0:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.mnfx1:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.mnfx2:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.mnfx3:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.mnfx4:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.mnfx5:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.mnfx6:hover{transform:translateY(-1px) !important; box-shadow:0 12px 26px -6px rgba(21,94,239,0.55), inset 0 1px 1px rgba(255,255,255,0.55) !important}\n.mnfx7:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.32) !important}\n.mnfx8:hover{border-color:var(--ink) !important}\n.mnfx9:hover{background:#0E4FD1 !important}\n.mnfx10:hover{transform:translateY(-2px) !important}\n.mnfx11:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.3) !important}\n.mnfx12:hover{border-color:var(--ink) !important}\n.mnfx13:hover{border-color:var(--ink) !important}\n.mnfx14:hover{transform:scale(1.06) !important}";

// Пункт меню. Раньше эта строка была скопирована в каждую ссылку шапки —
// шесть одинаковых полотен, в которых не видно, чем пункты отличаются.
const NAV_LINK = `font-size:var(--t15); font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`;
const NAV_LINK_M = `display:flex; align-items:center; min-height:48px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`;

const VOICE_SCRIPT = [
  { id: 'hero', label: 'О компании', text: 'ETHOS — сертифицированный интегратор Битрикс24. Мы внедряем, дорабатываем и поддерживаем Битрикс24 — и строим ИИ-агентов, которые снимают рутину с ваших команд.' },
  { id: 'services', label: 'Услуги', text: 'Работаем в двух направлениях. Если Битрикс24 ещё нет — внедряем систему под ключ: настраиваем процессы и воронки, подключаем интеграции, переносим данные и обучаем команду. Если Битрикс24 уже работает — берём систему на поддержку: техподдержка по SLA, доработки и аудит текущей настройки.' },
  { id: 'ai', label: 'ИИ-решения', text: 'Внедряем ИИ там, где он даёт результат. ИИ-агенты ведут сделки, обрабатывают заявки и отвечают клиентам. Автоматически заполняют карточки товаров на сайте: подбирают фото и пишут SEO-тексты. А ещё автоматизируют аналитику и отчётность.' },
  { id: 'why', label: 'Почему мы', text: 'Мы работаем как расширение вашей команды, а не подрядчик на разовый проект. Сертифицированный статус энтерпрайз, опыт сложных внедрений, одна команда для CRM и ИИ — и сопровождение результата после запуска.' },
  { id: 'process', label: 'Процесс', text: 'Наш процесс — четыре шага: аудит процессов, проектирование решения, внедрение с обучением команды и постоянная поддержка по мере роста бизнеса.' },
  { id: 'contact', label: 'Контакты', text: 'Обсудим ваш проект? Напишите нам в Телеграм или Вотсап — отвечаем в течение рабочего дня.' }
];

const PRODUCTS = [
  { name: 'Наушники Sony WH-1000XM5', price: '32 990', cat: 'Электроника', hue: '#C0334A', imgId: 'prod0',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=520&q=80',
    desc: 'Флагманские беспроводные наушники с активным шумоподавлением, звуком Hi-Res и автономностью до 30 часов. Идеальны для работы, дороги и путешествий.' },
  { name: 'Кроссовки Nike Air Zoom Pegasus 41', price: '11 490', cat: 'Обувь', hue: '#155EEF', imgId: 'prod1',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=520&q=80',
    desc: 'Лёгкие беговые кроссовки с амортизацией Air Zoom и дышащей сеткой. Отзывчивая подошва для ежедневных пробежек и длинных дистанций.' },
  { name: 'Умные часы Samsung Galaxy Watch', price: '24 990', cat: 'Гаджеты', hue: '#12A5E0', imgId: 'prod2',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=520&q=80',
    desc: 'Умные часы с AMOLED-экраном, датчиком пульса и ЭКГ, GPS и автономностью до 40 часов. Контроль сна, тренировок и уведомлений с запястья.' },
  { name: 'Городской рюкзак Xiaomi Commuter 20L', price: '3 290', cat: 'Аксессуары', hue: '#B8860B', imgId: 'prod3',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=520&q=80',
    desc: 'Рюкзак 20 л из водоотталкивающей ткани с отделением для ноутбука 14″. Эргономичные лямки и продуманная организация для работы и поездок.' }
];

// Слайдер платформы держится на одном фирменном синем. Раньше у каждого чипа
// был свой акцент (#155EEF, #B8860B, #12A5E0, #1F8A5B, #D9480F) — пять
// «главных» цветов в одном ряду, и цвет переставал что-либо означать.
const BRAND = '#155EEF';

const SLIDER_DATA = [
  { label: 'CRM и продажи', icon: 'M4 5h16l-5.5 7v5.5L9.5 20v-8L4 5z',
    items: ['Лиды, сделки, контакты', 'Воронки продаж', 'Роботы и триггеры', 'Счета и оплаты', 'Контакт-центр', 'Сквозная аналитика'] },
  { label: 'Задачи и проекты', icon: 'M5 4h14v3H5V4zm0 6.5h14v3H5v-3zM5 17h9v3H5v-3z',
    items: ['Задачи и чек-листы', 'Проекты и канбан', 'Смарт-процессы (СПА)', 'Диаграмма Ганта', 'Учёт времени'] },
  { label: 'ИИ-агенты', icon: 'M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2L12 2zm7 12l1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14z',
    items: ['Обработка заявок', 'Ответы клиентам 24/7', 'Заполнение сделок', 'Расшифровка звонков', 'Речевая аналитика'] },
  { label: 'Карточки товаров', icon: 'M6 7V6a6 6 0 0112 0v1h3l-1.5 13.5A2 2 0 0117.5 22h-11a2 2 0 01-2-1.5L3 7h3zm2 0h8V6a4 4 0 00-8 0v1z',
    items: ['Генерация карточек ИИ', 'Подбор фотографий', 'Заполнение характеристик', 'SEO-тексты и описания', 'До 1500 карточек в час', 'Выгрузка на сайт'] },
  { label: 'Аналитика', icon: 'M4 20V10h3.5v10H4zm6.25 0V4h3.5v16h-3.5zM16.5 20v-7H20v7h-3.5z',
    items: ['Данные из CRM, 1С и сайта', 'Сквозная и unit-аналитика', 'Контроль доходов и расходов', 'Дашборды под роль', 'План-факт и прогноз'] }
];

// Размер команды в форме первого экрана: короткие ключи уходят в /api/lead.
const HERO_SIZES = { s: '2–10 человек', m: '11–50 человек', l: 'больше 50 человек' };

const AI_ROLES = [
  { label: 'Продажи', desc: 'Квалифицирует лиды и ведёт сделки в CRM' },
  { label: 'Маркетинг', desc: 'Сегментирует базу и готовит рассылки' },
  { label: 'Аналитика', desc: 'Считает метрики и строит отчёты' },
  { label: 'Поддержка', desc: 'Отвечает на обращения клиентов 24/7' }
];

export default class MainPage extends React.Component {
  // Раскладка живёт в CSS-переменных (globals.css → «adaptive design tokens»),
  // а не в state: иначе SSR отдаёт десктопную сетку, а React при гидратации
  // не переписывает inline-стили — на телефоне вёрстка остаётся десктопной.
  state = {
    mobileMenuOpen: false,
    mounted: false,
    activeRole: 0,
    // Автосмена сцен: выключается, как только пользователь сам листнул —
    // иначе слайд уезжает, пока его ещё дочитывают.
    heroAuto: true,
    sliderAuto: true,
    cranePhase: 'grab',
    carryColor: 'var(--blue)',
    buildingBlocks: [],
    metricLeads: 482,
    metricHours: 36.4,
    metricAccuracy: 97,
    pulseStage: 'idle',
    pulseTarget: 'b24',
    flashTarget: null,
    sliderIdx: 0,
    productIdx: 0,
    prodPhase: 'search',
    typed: 0,
    // Форма-сделка на первом экране
    heroTask: '',
    heroSize: null,       // 's' | 'm' | 'l'
    heroChannel: 'tg',    // 'tg' | 'wa'
    heroSent: false,
    voiceOpen: false,
    voiceStatus: 'idle',
    voiceIndex: 0,
    ruVoiceList: [],
    voiceURI: (() => { try { return localStorage.getItem('orbita-voice-uri') || ''; } catch (e) { return ''; } })()
  };

  // Ссылки для анимации переноса сделки в CRM-канбане
  dragRef = React.createRef();
  workCountRef = React.createRef();
  workSumRef = React.createRef();
  succCountRef = React.createRef();
  succSumRef = React.createRef();
  headerRef = React.createRef();
  heroSceneRef = React.createRef();
  heroInputRef = React.createRef();
  platformRef = React.createRef();
  auroraRef = React.createRef();
  heroTrackRef = React.createRef();
  sliderTrackRef = React.createRef();

  // Обработчики свайпа создаются РОВНО ОДИН РАЗ.
  //
  // Раньше они собирались внутри renderVals(), то есть заново на каждый рендер.
  // Главная перерисовывается раз в 1.5 с (счётчики) и ещё чаще из-за анимации
  // крана — React подменял обработчики прямо посреди жеста, и накопленные в
  // замыкании ось и смещение обнулялись. Палец двигался, а слайд не листался.
  heroSwipe = this.makeSwipe(
    this.heroTrackRef,
    () => this.state.activeRole,
    AI_ROLES.length - 1,
    (d) => this.stepRole(d),
  );

  sliderSwipe = this.makeSwipe(
    this.sliderTrackRef,
    () => this.state.sliderIdx,
    SLIDER_DATA.length - 1,
    (d) => this.stepSlide(d),
  );

  componentDidMount() {
    this._offHeader = setupHeaderAutoHide(() => this.headerRef.current, () => this.state.mobileMenuOpen);
    // Закрыть мобильное меню, когда экран дорос до десктопного макета.
    // Это поведение, а не раскладка, поэтому его можно держать в JS.
    this._desktopMq = window.matchMedia('(min-width: 1180px)');
    this._onMqChange = (e) => {
      if (e.matches) { this.setState({ mobileMenuOpen: false }); return; }
      // Голосовой гид живёт только в десктопной шапке. Если окно сузилось при
      // открытой панели, она осталась бы висеть без кнопки, которая её закрывает.
      if (this.state.voiceOpen) { this.stopSpeech(); this.setState({ voiceOpen: false }); }
    };
    this._desktopMq.addEventListener('change', this._onMqChange);

    // Entrance reveal is driven by JS state (not a CSS @keyframes animation from
    // opacity:0) so content can never be stuck invisible if the document/tab
    // isn't visible/focused at load time (animation timelines can stall then).
    this.mountTimer = setTimeout(() => this.setState({ mounted: true }), 40);

    // Crane state machine: grab a block -> lift -> move across the arm -> lower
    // it onto the building -> release (joins the stack) -> return for the next
    // one. After release, a data pulse travels down the connector tree into the
    // destination chip (cause -> effect: task done -> result delivered). Timers
    // are chained (not setInterval); the full cycle takes 4.6s, then loops.
    this.runCycle = () => {
      const color = this.state.activeRole % 2 === 0 ? 'var(--blue)' : 'var(--violet)';
      this.setState({ cranePhase: 'grab', carryColor: color, pulseStage: 'idle' });

      const at = (ms, fn) => setTimeout(fn, ms);
      this.phaseTimers = [
        at(600, () => this.setState({ flashTarget: null })),
        at(700, () => this.setState({ cranePhase: 'lift' })),
        at(1500, () => this.setState({ cranePhase: 'move' })),
        at(2400, () => this.setState({ cranePhase: 'lower' })),
        at(3100, () => this.setState(s => ({
          cranePhase: 'release',
          buildingBlocks: s.buildingBlocks.length >= 5 ? [s.carryColor] : [...s.buildingBlocks, s.carryColor],
          pulseStage: 'stem',
          pulseTarget: s.carryColor === 'var(--blue)' ? 'b24' : 'ext'
        }))),
        // Роль переключается сама только пока включена автосмена. Как только
        // пользователь листнул вручную — сцена остаётся на выбранной роли.
        at(3400, () => this.setState(s => ({
          cranePhase: 'return',
          activeRole: s.heroAuto ? (s.activeRole + 1) % AI_ROLES.length : s.activeRole,
          pulseStage: 'branch'
        }))),
        at(3750, () => this.setState({ pulseStage: 'drop' })),
        at(4000, () => this.setState(s => ({ pulseStage: 'done', flashTarget: s.pulseTarget }))),
        at(4600, () => this.runCycle())
      ];
    };
    this.runCycle();

    this.loadVoices();
    this._onVoicesChanged = () => this.loadVoices();
    if (window.speechSynthesis && window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', this._onVoicesChanged);
    }

    this.startSliderTimer();

    this.setupKanbanDrag();

    this.startProductCycle();

    this.setupScrollReveal();

    this._onScroll = () => {
      if (this._checkReveal) this._checkReveal();
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();

    this.startMetricTimer();

    // Демо живут только пока они в кадре: за пределами вьюпорта и CSS-таймлайны,
    // и React-таймеры выключены. Раньше всё это крутилось всю дорогу.
    this._offHeroView = observeInView(this.heroSceneRef.current, (inView) => {
      if (inView) { this.runCycle(); this.startMetricTimer(); }
      else { (this.phaseTimers || []).forEach(clearTimeout); clearInterval(this.metricTimer); }
    });
    this._offPlatformView = observeInView(this.platformRef.current, (inView) => {
      if (inView) { this.startSliderTimer(); this.startProductCycle(); }
      else { clearInterval(this.sliderTimer); this.stopProductCycle(); }
    });
  }

  startMetricTimer() {
    clearInterval(this.metricTimer);
    this.metricTimer = setInterval(() => {
      this.setState(s => ({
        metricLeads: s.metricLeads + Math.floor(Math.random() * 3) + 1,
        metricHours: Math.round((s.metricHours + Math.random() * 0.3) * 10) / 10,
        metricAccuracy: 95 + Math.round(Math.random() * 4)
      }));
    }, 1500);
  }

  stopProductCycle() {
    clearTimeout(this._pcSearch); clearTimeout(this._pcNext); clearInterval(this._pcType);
  }

  // ---- CRM-канбан: курсор переносит сделку «Ромашка» из «В работе» в «Успех» ----
  // Движение карточки — чистый CSS (b24Carry). Здесь только синхронизируем
  // счётчики колонок с фазами анимации (через события animationstart/iteration).
  setupKanbanDrag() {
    const card = this.dragRef.current;
    if (!card) return;
    const D = 7000; // = длительность b24Carry
    const set = (ref, v) => { if (ref.current) ref.current.textContent = v; };
    const phase = (p) => {
      if (p === 0) {          // сделка ещё в «В работе»
        set(this.workCountRef, '2'); set(this.workSumRef, '₽1,22M');
        set(this.succCountRef, '1'); set(this.succSumRef, '₽2,10M');
      } else if (p === 1) {   // курсор уносит сделку — она в пути
        set(this.workCountRef, '1'); set(this.workSumRef, '₽740K');
        set(this.succCountRef, '1'); set(this.succSumRef, '₽2,10M');
      } else {                // сделка легла в «Успех»
        set(this.workCountRef, '1'); set(this.workSumRef, '₽740K');
        set(this.succCountRef, '2'); set(this.succSumRef, '₽2,58M');
      }
    };
    const cycle = () => {
      (this._dragTimers || []).forEach(clearTimeout);
      phase(0);
      this._dragTimers = [
        setTimeout(() => phase(1), D * 0.19),
        setTimeout(() => phase(2), D * 0.64)
      ];
    };
    card.addEventListener('animationstart', cycle);
    card.addEventListener('animationiteration', cycle);
    cycle();
  }

  setupScrollReveal() {
    if (typeof window === 'undefined') return;
    try { document.documentElement.setAttribute('data-reveal-ready', ''); } catch (e) {}
    this._revealTimer = setTimeout(() => {
      this._revealTargets = [].slice.call(document.querySelectorAll('[data-reveal], [data-reveal-children]'));
      this._checkReveal();
    }, 50);
    this._revealFailsafe = setTimeout(() => {
      (this._revealTargets || []).forEach((el) => el.setAttribute('data-shown', ''));
      this._revealTargets = [];
    }, 10000);
  }

  _checkReveal() {
    if (!this._revealTargets || !this._revealTargets.length) return;
    const vh = window.innerHeight || 800;
    const remaining = [];
    this._revealTargets.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.86) el.setAttribute('data-shown', '');
      else remaining.push(el);
    });
    this._revealTargets = remaining;
  }

  // ---- Ручное листание сцены ИИ-агента в первом экране ----------------------
  // Автосмена каждые 4,6 с не давала дочитать карточку роли. Теперь любое
  // ручное действие (стрелка, точка, свайп) переводит сцену в ручной режим;
  // вернуть автосмену можно кнопкой «play».
  setRole = (i, { manual = true } = {}) => {
    const next = ((i % AI_ROLES.length) + AI_ROLES.length) % AI_ROLES.length;
    (this.phaseTimers || []).forEach(clearTimeout);
    this.setState(
      (s) => ({ activeRole: next, heroAuto: manual ? false : s.heroAuto, buildingBlocks: [] }),
      () => this.runCycle()
    );
  };

  // Ручной шаг упирается в края (стрелка на краю действительно неактивна),
  // а автопоказ по-прежнему уходит на круг.
  stepRole = (delta) => {
    const i = Math.min(Math.max(this.state.activeRole + delta, 0), AI_ROLES.length - 1);
    if (i === this.state.activeRole) { this.setState({ heroAuto: false }); return; }
    this.setRole(i);
  };

  toggleHeroAuto = () => {
    this.setState((s) => ({ heroAuto: !s.heroAuto }), () => {
      if (this.state.heroAuto) { (this.phaseTimers || []).forEach(clearTimeout); this.runCycle(); }
    });
  };

  // ---- Platform slider ----
  startSliderTimer() {
    clearInterval(this.sliderTimer);
    if (!this.state.sliderAuto) return;
    this.sliderTimer = setInterval(() => {
      this.setState(s => ({ sliderIdx: (s.sliderIdx + 1) % SLIDER_DATA.length }));
    }, 9000);
  }

  setSlide(i, { manual = true } = {}) {
    const next = ((i % SLIDER_DATA.length) + SLIDER_DATA.length) % SLIDER_DATA.length;
    this.setState(
      (s) => ({ sliderIdx: next, sliderAuto: manual ? false : s.sliderAuto }),
      () => this.startSliderTimer()
    );
  }

  stepSlide = (delta) => {
    const i = Math.min(Math.max(this.state.sliderIdx + delta, 0), SLIDER_DATA.length - 1);
    if (i === this.state.sliderIdx) { this.setState({ sliderAuto: false }, () => this.startSliderTimer()); return; }
    this.setSlide(i);
  };

  toggleSliderAuto = () => {
    this.setState((s) => ({ sliderAuto: !s.sliderAuto }), () => this.startSliderTimer());
  };

  // ---- Свайп ---------------------------------------------------------------
  // Палец двигает трек в реальном времени, но БЕЗ setState: обработчик пишет
  // прямо в CSS-переменную --drag на DOM-узле. Компонент главной огромный,
  // и ре-рендер на каждый кадр движения гарантированно бы подтормаживал.
  // React владеет только --i (индекс) и никогда не трогает --drag, поэтому
  // фоновые ре-рендеры (счётчики, анимация крана) не сбивают жест.
  //
  // Вертикальный скролл не перехватываем: как только по первым ~8 px видно,
  // что жест вертикальный, он полностью отдаётся браузеру.
  makeSwipe(ref, getIndex, maxIndex, onStep) {
    let x0 = 0, y0 = 0, axis = null, width = 1, dxLast = 0;

    const el = () => ref.current;
    const setDrag = (px) => { const n = el(); if (n) n.style.setProperty('--drag', px + 'px'); };
    const setDragging = (on) => {
      const n = el();
      if (n) { if (on) n.setAttribute('data-dragging', '1'); else n.removeAttribute('data-dragging'); }
    };
    const release = () => { axis = null; dxLast = 0; setDragging(false); setDrag(0); };

    return {
      onTouchStart: (e) => {
        const t = e.touches[0];
        x0 = t.clientX; y0 = t.clientY; axis = null; dxLast = 0;
        width = e.currentTarget.getBoundingClientRect().width || 1;
      },
      onTouchMove: (e) => {
        const t = e.touches[0];
        const dx = t.clientX - x0;
        const dy = t.clientY - y0;
        if (axis === null) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
          axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          if (axis === 'x') setDragging(true);
        }
        if (axis !== 'x') return;
        // Сопротивление на краях — тактильная подсказка «дальше некуда».
        const i = getIndex();
        const atEdge = (dx > 0 && i === 0) || (dx < 0 && i === maxIndex);
        dxLast = atEdge ? dx * 0.3 : dx;
        setDrag(dxLast);
      },
      onTouchEnd: () => {
        if (axis !== 'x') { release(); return; }
        const ratio = dxLast / width;
        // Доводчик возвращаем ДО смены индекса, чтобы снап был анимированным.
        setDragging(false);
        setDrag(0);
        axis = null; dxLast = 0;
        if (ratio <= -0.18) onStep(1);
        else if (ratio >= 0.18) onStep(-1);
      },
      onTouchCancel: release,
    };
  }

  // Карточка товара: фаза поиска фото -> посимвольный стриминг описания -> готово -> следующий товар
  startProductCycle() {
    clearTimeout(this._pcSearch); clearTimeout(this._pcNext); clearInterval(this._pcType);
    this.setState({ prodPhase: 'search', typed: 0 });
    this._pcSearch = setTimeout(() => {
      this.setState({ prodPhase: 'type' });
      this._pcType = setInterval(() => {
        this.setState(s => {
          const full = PRODUCTS[s.productIdx % PRODUCTS.length].desc;
          if (s.typed >= full.length) { clearInterval(this._pcType); return { prodPhase: 'done' }; }
          return { typed: Math.min(s.typed + 2, full.length) };
        });
      }, 26);
    }, 1200);
    this._pcNext = setTimeout(() => {
      this.setState(s => ({ productIdx: s.productIdx + 1 }));
      this.startProductCycle();
    }, 7000);
  }

  // ---- Voice guide (Web Speech API, ru-RU) ----
  loadVoices() {
    if (!window.speechSynthesis) return;
    const ru = (window.speechSynthesis.getVoices() || []).filter(v => (v.lang || '').toLowerCase().startsWith('ru'));
    this._ruVoices = ru;
    this.setState({ ruVoiceList: ru.map(v => ({ uri: v.voiceURI, name: this.prettyVoiceName(v.name) })) });
  }

  prettyVoiceName(n) {
    return n.replace(/Microsoft\s+/i, '').replace(/Online\s*\(Natural\)/i, '(натуральный)').replace(/\s*-\s*Russian.*$/i, '').trim();
  }

  // Always the Google Russian voice; fall back to any ru voice only if
  // the browser doesn't ship one (Safari/Firefox).
  pickVoice() {
    const ru = this._ruVoices || [];
    if (!ru.length) return null;
    return ru.find(v => v.name.toLowerCase().includes('google')) || ru[0];
  }

  toggleVoice = () => {
    if (this.state.voiceOpen) this.stopSpeech();
    this.setState(s => ({ voiceOpen: !s.voiceOpen }));
  };

  stopVoice = () => this.stopSpeech();

  stopSpeech() {
    this._voiceStopped = true;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    this.setState({ voiceStatus: 'idle' });
  }

  playPause = () => {
    const st = this.state.voiceStatus;
    if (st === 'playing') {
      try { window.speechSynthesis.pause(); } catch (e) {}
      this.setState({ voiceStatus: 'paused' });
    } else if (st === 'paused') {
      try { window.speechSynthesis.resume(); } catch (e) {}
      this.setState({ voiceStatus: 'playing' });
    } else {
      this.playFrom(0);
    }
  };

  playFrom(i) {
    this._voiceStopped = true;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    this.setState({ voiceIndex: i, voiceStatus: 'playing' });
    // small delay so cancel() settles before speak() (Chrome quirk)
    setTimeout(() => { this._voiceStopped = false; this.speakSection(i); }, 120);
  }

  speakSection(i) {
    const sec = VOICE_SCRIPT[i];
    if (!sec || !window.speechSynthesis) { this.setState({ voiceStatus: 'idle' }); return; }
    const el = document.getElementById(sec.id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
    }
    const u = new SpeechSynthesisUtterance(sec.text);
    u.lang = 'ru-RU';
    if (!this._ruVoices || !this._ruVoices.length) this.loadVoices();
    const v = this.pickVoice();
    if (v) u.voice = v;
    u.rate = 0.97;
    u.pitch = 1;
    u.onend = () => {
      if (this._voiceStopped) return;
      const next = i + 1;
      if (next < VOICE_SCRIPT.length && this.state.voiceStatus !== 'idle') {
        this.setState({ voiceIndex: next });
        this.speakSection(next);
      } else {
        this.setState({ voiceStatus: 'idle' });
      }
    };
    window.speechSynthesis.speak(u);
  }

  componentWillUnmount() {
    if (this._offHeader) this._offHeader();
    if (this._offHeroView) this._offHeroView();
    if (this._offPlatformView) this._offPlatformView();
    clearInterval(this.sliderTimer);
    (this._dragTimers || []).forEach(clearTimeout);
    clearInterval(this.productTimer);
    try { window.speechSynthesis.cancel(); } catch (e) {}
    try { window.speechSynthesis.removeEventListener('voiceschanged', this._onVoicesChanged); } catch (e) {}
    if (this._desktopMq) this._desktopMq.removeEventListener('change', this._onMqChange);
    clearInterval(this.metricTimer);
    clearTimeout(this._pcSearch); clearTimeout(this._pcNext); clearInterval(this._pcType);
    clearTimeout(this.mountTimer);
    (this.phaseTimers || []).forEach(clearTimeout);
    clearTimeout(this._revealTimer);
    clearTimeout(this._revealFailsafe);
    if (this._revealIO) this._revealIO.disconnect();
    window.removeEventListener('scroll', this._onScroll);
  }

  // Content is ALWAYS opacity:1 (fully readable) — only a small translateY slide
  // is animated. That way, if a transition/animation timeline never progresses
  // (page rendered hidden/unfocused, e.g. during PPTX/print/thumbnail capture),
  // the worst case is text sitting ~14px off its final position, never invisible.
  entrance(delay) {
    return this.state.mounted
      ? 'opacity:1; transform:translateY(0); transition:transform 0.7s cubic-bezier(.16,1,.3,1) ' + delay + 's;'
      : 'opacity:1; transform:translateY(14px);';
  }

  // ---- Форма-сделка первого экрана -----------------------------------------
  // Одно поле — только задача. Контакт не спрашиваем: человека опознаёт сам
  // мессенджер, в который он уходит с текстом заявки. Ре-рендер на каждый
  // символ допустим — меняется только окно формы.
  onHeroTaskChange = (e) => {
    const val = e.target.value;
    // Цель «начал заполнять» — один раз за сессию просмотра, не на каждый символ.
    if (!this._heroStartSent && val.trim()) {
      this._heroStartSent = true;
      ymGoal('hero_form_start');
    }
    this.setState({ heroTask: val });
  };

  pickHeroSize = (key) => {
    if (this.state.heroSize !== key) ymGoal('hero_form_size');
    this.setState({ heroSize: key });
  };

  pickHeroChannel = (key) => this.setState({ heroChannel: key });

  heroLeadText() {
    const task = this.state.heroTask.trim();
    const lines = ['Заявка с первого экрана aiethos.ru', 'Задача: ' + task];
    if (this.state.heroSize) lines.push('Команда: ' + HERO_SIZES[this.state.heroSize]);
    lines.push('Нужен план на 30 дней.');
    return lines.join('\n');
  }

  // Telegram не умеет предзаполнять личный чат текстом — поэтому буфер обмена
  // (в WhatsApp текст подставляется прямо в ссылку wa.me).
  copyHeroText(text) {
    const fallback = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {}
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(fallback);
      } else {
        fallback();
      }
    } catch (e) { fallback(); }
  }

  submitHeroLead = () => {
    const task = this.state.heroTask.trim();
    // Кнопку не блокируем: заблокированная кнопка на первом экране читается
    // как неработающий сайт. Пустой клик возвращает фокус в поле — сноска под
    // кнопкой уже объясняет, чего не хватает.
    if (!task) {
      if (this.heroInputRef.current) this.heroInputRef.current.focus();
      return;
    }
    const { heroSize, heroChannel } = this.state;
    const text = this.heroLeadText();

    // Регистрация лида — fire-and-forget: интерфейс не ждёт ответа и не
    // ломается при ошибке сети (keepalive доносит запрос при уходе со страницы).
    try {
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, size: heroSize, channel: heroChannel, source: 'hero' }),
        keepalive: true,
      }).catch(() => {});
    } catch (e) {}

    ymGoal('hero_lead');
    // window.open — синхронно в обработчике клика, иначе Safari решит, что попап.
    if (heroChannel === 'wa') {
      ymGoal('whatsapp');
      window.open('https://wa.me/79285288598?text=' + encodeURIComponent(text), '_blank', 'noopener');
    } else {
      ymGoal('telegram');
      this.copyHeroText(text);
      window.open('https://t.me/Terraiib24', '_blank', 'noopener');
    }
    this.setState({ heroSent: true });
  };

  toggleMobileMenu = () => {
    this.setState(s => ({ mobileMenuOpen: !s.mobileMenuOpen }));
  };

  closeMobileMenu = () => {
    this.setState({ mobileMenuOpen: false });
  };



  renderVals() {
    const { mobileMenuOpen, activeRole, cranePhase, carryColor, buildingBlocks, metricLeads, metricHours, metricAccuracy, pulseStage, pulseTarget, flashTarget } = this.state;

    // Data pulse: once a block lands (task completed), a dot runs down the
    // static connector tree into the matching destination chip — blue results
    // sync into Битрикс24, violet ones go out through external channels. The
    // chip flashes a confirmation on arrival. Lines themselves never animate.
    const branchX = pulseTarget === 'ext' ? '75%' : '25%';
    const pulseColor = pulseTarget === 'ext' ? 'var(--violet)' : 'var(--blue)';
    let pulseLeft = '50%', pulseTop = '0px', pulseOpacity = 0, pulseTransition = 'opacity 0.25s ease';
    if (pulseStage === 'stem') { pulseTop = '10px'; pulseOpacity = 1; pulseTransition = 'top 0.28s ease, opacity 0.15s ease'; }
    else if (pulseStage === 'branch') { pulseLeft = branchX; pulseTop = '10px'; pulseOpacity = 1; pulseTransition = 'left 0.32s ease'; }
    else if (pulseStage === 'drop') { pulseLeft = branchX; pulseTop = '24px'; pulseOpacity = 1; pulseTransition = 'top 0.22s ease'; }
    else if (pulseStage === 'done') { pulseLeft = branchX; pulseTop = '24px'; pulseOpacity = 0; pulseTransition = 'opacity 0.35s ease'; }

    const b24Flash = flashTarget === 'b24';
    const extFlash = flashTarget === 'ext';
    const chipB24Bg = b24Flash ? 'rgba(21,94,239,0.13)' : 'rgba(21,94,239,0.06)';
    const chipB24Border = b24Flash ? 'rgba(21,94,239,0.55)' : 'rgba(21,94,239,0.22)';
    const chipB24Status = b24Flash ? '✓ данные записаны' : 'синхронизировано';
    const chipB24StatusColor = b24Flash ? 'var(--blue)' : 'var(--ink-faint)';
    const chipExtBg = extFlash ? 'rgba(18,165,224,0.13)' : 'rgba(18,165,224,0.06)';
    const chipExtBorder = extFlash ? 'rgba(18,165,224,0.55)' : 'rgba(18,165,224,0.22)';
    const chipExtStatus = extFlash ? '✓ ответ отправлен' : 'на сайте и в мессенджерах';
    const chipExtStatusColor = extFlash ? 'var(--violet)' : 'var(--ink-faint)';

    // ---- Форма-сделка первого экрана ----------------------------------------
    // Все производные считаются здесь и уходят в разметку готовыми строками —
    // как и у остальных блоков страницы.
    const heroTask = this.state.heroTask;
    const heroTrim = heroTask.trim();
    const heroSize = this.state.heroSize;
    const heroChannel = this.state.heroChannel;
    const heroHasTask = heroTrim.length > 0;
    // Порог квалификации: 14 символов — с этой длины фраза похожа на задачу.
    const heroQual = heroTrim.length >= 14;
    const heroRobot = heroQual && !!heroSize;
    const dealRow = (label, on, value, accent) => ({
      label,
      on,
      value: on ? value : '—',
      dot: on ? (accent ? '#9DCF00' : 'var(--blue)') : 'var(--line)',
      color: accent ? '#1F8A5B' : 'var(--ink)',
    });
    const heroDealRows = [
      dealRow('сделка', heroHasTask, heroTrim.length > 46 ? heroTrim.slice(0, 46) + '…' : heroTrim),
      dealRow('источник', heroHasTask, 'aiethos.ru · первый экран'),
      dealRow('компания', !!heroSize, heroSize ? HERO_SIZES[heroSize] : ''),
      dealRow('квалификация ИИ', heroQual, 'тёплый — есть задача и объём', true),
      dealRow('робот', heroRobot, 'назначен ответственный, готовит план'),
    ];
    const heroSizeBtns = [
      { key: 's', label: '2–10' },
      { key: 'm', label: '11–50' },
      { key: 'l', label: '50+' },
    ].map((b) => ({ ...b, active: heroSize === b.key, onClick: () => this.pickHeroSize(b.key) }));
    const heroChannelBtns = [
      { key: 'tg', label: 'Telegram' },
      { key: 'wa', label: 'WhatsApp' },
    ].map((b) => ({ ...b, active: heroChannel === b.key, onClick: () => this.pickHeroChannel(b.key) }));
    const heroFootnote = heroHasTask && heroSize
      ? 'Сделка уйдёт в Битрикс24 с этими полями — переписывать нечего.'
      : 'Опишите задачу и отметьте размер команды — карточка заполнится сама.';
    const heroSuccessText = heroChannel === 'wa'
      ? 'Открываем WhatsApp — текст заявки уже подставлен в сообщение. Отправьте его, и план на 30 дней придёт в течение рабочего дня.'
      : 'Открываем Telegram — текст заявки уже в буфере обмена. Вставьте его в чат, и план на 30 дней придёт в течение рабочего дня.';

    // Platform slider
    const sliderIdx = this.state.sliderIdx;
    const sliderAuto = this.state.sliderAuto;
    const sliderChips = SLIDER_DATA.map((d, i) => {
      const active = i === sliderIdx;
      return {
        label: d.label,
        onClick: () => this.setSlide(i),
        color: active ? '#fff' : 'var(--ink)',
        bg: active ? BRAND : '#FFFFFF',
        border: active ? BRAND : 'var(--line)',
        iconBg: active ? 'rgba(255,255,255,0.22)' : 'rgba(21,94,239,0.10)',
        icon: React.createElement('svg', { width: 13, height: 13, viewBox: '0 0 24 24' },
          React.createElement('path', { d: d.icon, fill: active ? '#fff' : BRAND })),
        // Полоска обратного отсчёта имеет смысл только пока слайды
        // переключаются сами — в ручном режиме она бы врала.
        progress: active && sliderAuto
          ? React.createElement('span', {
              key: 'p' + i,
              style: { position: 'absolute', left: 0, bottom: 0, height: '3px', background: 'rgba(255,255,255,0.55)', animation: 'sliderProgress 9s linear forwards' }
            })
          : null
      };
    });
    const slide = SLIDER_DATA[sliderIdx];
    const sliderList = React.createElement('ul',
      { key: 'slide-' + sliderIdx, style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' } },
      slide.items.map((it, j) => React.createElement('li', {
        key: j,
        style: {
          fontFamily: "var(--font-inter),sans-serif", fontSize: '16px', fontWeight: 500, color: 'var(--ink)',
          display: 'flex', alignItems: 'center', gap: '12px',
          opacity: 0, animation: 'sliderItemIn 0.4s ease forwards', animationDelay: (j * 0.28) + 's'
        }
      },
        React.createElement('span', { style: { width: '7px', height: '7px', borderRadius: '50%', background: BRAND, flexShrink: 0 } }),
        it
      ))
    );
    // Слайды больше не прячутся display:none — они лежат в горизонтальном
    // треке, который двигается transform'ом. Так работает и свайп пальцем,
    // и стрелки, и точки, а переход идёт на композиторе (без рефлоу).
    const _visKeys = ['crm', 'tasks', 'ai', 'cards', 'analytics'];
    const vis = {};
    const slideHidden = {};
    _visKeys.forEach((k, i) => {
      vis[k] = i === sliderIdx ? '' : 'pointer-events:none;';
      slideHidden[k] = i !== sliderIdx;
    });
    const sliderDots = SLIDER_DATA.map((d, i) => ({
      label: d.label,
      current: i === sliderIdx,
      onClick: () => this.setSlide(i),
    }));

    // Product-card generation: сначала ИИ ищет фото, затем стримит описание
    const product = PRODUCTS[this.state.productIdx % PRODUCTS.length];
    const pKey = 'p' + this.state.productIdx;
    const phase = this.state.prodPhase;
    const typed = this.state.typed;
    const searching = phase === 'search';
    const fadeStyle = { animation: 'sliderItemIn 0.4s ease both' };

    // Фото товара — через <BlurImage>: сначала base64-миниатюра, посчитанная
    // на сервере (см. lib/lqip.ts), затем кроссфейд в оригинал. Место в layout
    // держит рамка с aspect-ratio, поэтому CLS = 0 при любой скорости сети.
    const blur = (this.props.productBlur || {})[product.imgId] || {};
    const productImgEl = React.createElement('div', { key: pKey, style: { position: 'absolute', inset: 0, background: '#EEF2F6' } },
      React.createElement(BlurImage, {
        src: blur.src || product.img,
        alt: product.name,
        blurDataURL: blur.blurDataURL,
        fill: true,
        // Фиксированный размер (без vw) — Next берёт srcset из imageSizes,
        // и браузер тянет 180–384 px вместо гигантского deviceSize.
        sizes: '200px',
        background: '#EEF2F6',
        frameStyle: { opacity: searching ? 0 : 1, transition: 'opacity .5s ease' },
      }),
      searching ? React.createElement('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#EEF2F6', zIndex: 3 } },
        React.createElement('div', { style: { width: '28px', height: '28px', borderRadius: '50%', border: '3px solid #CDD5DE', borderTopColor: '#1F8A5B', animation: 'spin .8s linear infinite' } }),
        React.createElement('div', { style: { fontSize: 'var(--mock-xs)', fontWeight: 600, color: '#5A626E' } }, 'Подбираю фото…')
      ) : null
    );
    const productCatEl = searching ? null : React.createElement('div', { key: pKey + '-cat', style: Object.assign({ fontSize: 'var(--mock-xs)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: product.hue }, fadeStyle) }, product.cat);
    const productNameEl = searching ? null : React.createElement('div', { key: pKey + '-name', style: Object.assign({ fontFamily: "var(--font-manrope),sans-serif", fontWeight: 800, fontSize: '15px', lineHeight: 1.25, color: 'var(--ink)' }, fadeStyle) }, product.name);
    const productPriceEl = searching ? null : React.createElement('div', { key: pKey + '-price', style: Object.assign({ fontFamily: 'monospace', fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }, fadeStyle) }, '₽' + product.price);
    const productDescTyped = searching ? '' : product.desc.slice(0, typed);
    const productCaretDisplay = phase === 'type' ? 'inline' : 'none';
    const productStatus = phase === 'search' ? 'ИИ подбирает фото…' : phase === 'type' ? 'ИИ пишет SEO-описание…' : 'Карточка готова';
    const productBadgesDisplay = phase === 'done' ? 'flex' : 'none';

    // Voice guide panel
    const { voiceOpen, voiceStatus, voiceIndex } = this.state;
    const voiceSections = VOICE_SCRIPT.map((v, i) => {
      const active = voiceStatus !== 'idle' && i === voiceIndex;
      return {
        label: v.label,
        onPlay: () => this.playFrom(i),
        bg: active ? 'linear-gradient(135deg, rgba(21,94,239,0.1), rgba(18,165,224,0.1))' : '#F7F7F5',
        border: active ? 'rgba(21,94,239,0.35)' : 'var(--line)',
        dot: active ? 'var(--blue)' : '#C9CDD3',
        dotAnim: (active && voiceStatus === 'playing') ? 'pulseDot 1.2s ease-in-out infinite' : 'none',
        color: active ? 'var(--ink)' : 'var(--ink-soft)'
      };
    });
    const voicePrimaryLabel = voiceStatus === 'playing' ? 'Пауза' : voiceStatus === 'paused' ? 'Продолжить' : 'Слушать всё';
    const voiceStatusLabel = voiceStatus === 'playing' ? '· звучит' : voiceStatus === 'paused' ? '· пауза' : 'готов';
    const voiceStatusColor = voiceStatus === 'playing' ? 'var(--blue)' : 'var(--ink-faint)';

    // Crane geometry: trolley hovers at 24% (pile) while grabbing/lifting, and
    // at 78% (building) while moving/lowering/releasing; it slides back to 24%
    // ("return") to start the next pickup. Cable length is long over the pile
    // (fixed height) and long-but-shrinking over the building (as it grows
    // taller the hook doesn't need to reach as far down), short while transiting.
    const PICKUP_X = 24;
    const DROP_X = 78;
    const trolleyLeftPct = (cranePhase === 'grab' || cranePhase === 'lift') ? PICKUP_X
      : (cranePhase === 'move' || cranePhase === 'lower' || cranePhase === 'release') ? DROP_X
      : PICKUP_X;
    const lowerCable = Math.max(92 - buildingBlocks.length * 16, 24);
    const cableHeightPx = cranePhase === 'grab' ? 92
      : (cranePhase === 'lower' || cranePhase === 'release') ? lowerCable
      : 28;
    const isCarrying = cranePhase === 'grab' || cranePhase === 'lift' || cranePhase === 'move' || cranePhase === 'lower';

    const roles = AI_ROLES.map((r, i) => {
      const active = i === activeRole;
      return {
        label: r.label,
        onClick: () => this.setRole(i),
        current: active,
        bg: active ? 'linear-gradient(135deg, rgba(21,94,239,0.12), rgba(18,165,224,0.12))' : '#F7F7F5',
        border: active ? 'rgba(21,94,239,0.35)' : 'var(--line)',
        transform: active ? 'scale(1.06)' : 'scale(0.97)',
        opacity: active ? 1 : 0.55,
        shadow: active ? '0 8px 18px rgba(21,94,239,0.14)' : 'none',
        dot: active ? (i % 2 === 0 ? 'var(--blue)' : 'var(--violet)') : '#C9CDD3',
        textColor: active ? 'var(--ink)' : 'var(--ink-faint)'
      };
    });
    const [role0, role1, role2, role3] = roles;

    return {
      // Вся адаптивность — из CSS-переменных (globals.css). Значения одинаковы
      // на сервере и на клиенте, поэтому гидратация не ломает раскладку.
      ...R,
      heroPad: 'var(--hero-pad-main)',
      badgeWrap: 'wrap',
      badgeRadius: 'var(--badge-radius)',
      badgeDividerDisplay: 'var(--only-desktop-inline)',
      h1Size: R.h1SizeXl,
      servicesPad: 'var(--sec-pad)',
      aiPad: 'var(--dark-pad)',
      aiInnerPad: 'var(--dark-inner-pad)',
      aiCardPad1: 'var(--ai-card-pad)',
      aiCardPad2: 'var(--ai-card-pad)',
      aiCardPad3: 'var(--ai-card-pad)',
      whyPad: 'var(--sec-pad)',
      whyGap: 'var(--mig-gap)',
      processPad: 'var(--sec-pad)',
      contactSecPad: 'var(--contact-sec-pad)',

      mobileMenuRows: mobileMenuOpen ? '1fr' : '0fr',
      mobileMenuOpen,
      heroGridTemplateColumns: R.heroCols,
      heroVisualMarginTop: R.heroVisualMt,
      toggleMobileMenu: this.toggleMobileMenu,
      closeMobileMenu: this.closeMobileMenu,
      role0,
      role1,
      role2,
      role3,
      activeRoleLabel: AI_ROLES[activeRole].label,
      activeRoleDesc: AI_ROLES[activeRole].desc,
      trolleyLeftPct,
      cableHeightPx,
      isCarrying,
      carryColorCss: carryColor,
      buildingBlocks,
      pulseLeft,
      pulseTop,
      pulseOpacity,
      pulseColor,
      pulseTransition,
      chipB24Bg,
      chipB24Border,
      chipB24Status,
      chipB24StatusColor,
      chipExtBg,
      chipExtBorder,
      chipExtStatus,
      chipExtStatusColor,
      metricLeads: metricLeads.toLocaleString('ru-RU'),
      metricHours: metricHours.toFixed(1) + ' ч',
      metricAccuracy: metricAccuracy + '%',
      entranceBadge: this.entrance(0),
      entranceH1: this.entrance(0.08),
      entranceP: this.entrance(0.16),
      entranceCta: this.entrance(0.24),
      entranceCard: this.entrance(0.2),

      // Services fork
      servicesColumns: R.cols2,
      servicesH2Size: R.h2Size,
      servicesH2Wrap: 'normal',
      forkConnectorDisplay: 'var(--only-desktop-flex)',

      // AI section (dark, 4-up spec-sheet layout)
      aiColumns: R.cols4,
      aiDividerV: 'var(--divider-v)',
      aiDividerH: 'var(--divider-h)',

      // Why us
      whyColumns: 'var(--cols-why)',

      // Process timeline: обе версии в разметке, нужную показывает media query
      timelineDesktop: 'var(--only-desktop)',
      timelineMobile: 'var(--only-mobile)',

      // Final CTA
      contactColumns: R.cols2,
      contactPadding: 'var(--contact-pad)',
      scrollToContact: () => {
        ymGoal('cta_contact'); const el = document.getElementById('contact');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      },
      sliderChips,
      sliderList,
      vis,
      dragRef: this.dragRef,
      workCountRef: this.workCountRef,
      workSumRef: this.workSumRef,
      succCountRef: this.succCountRef,
      succSumRef: this.succSumRef,
      auroraRef: this.auroraRef,
      productImgEl,
      productCatEl,
      productNameEl,
      productPriceEl,
      productDescTyped,
      productCaretDisplay,
      productStatus,
      productBadgesDisplay,
      platformPad: 'var(--platform-pad)',
      platformCardPad: 'var(--platform-card-pad)',
      platformColumns: 'var(--cols-platform)',
      platformGap: 'var(--platform-gap)',
      platformSlotHeight: 'var(--platform-slot-h)',
      analyticsChartsDisplay: 'var(--only-desktop-flex)',

      // Управление слайдером платформы: свайп + стрелки + точки + пауза
      sliderIdx,
      sliderAuto,
      sliderDots,
      sliderSwipe: this.sliderSwipe,
      sliderTrackRef: this.sliderTrackRef,
      heroTrackRef: this.heroTrackRef,
      slideHidden,
      sliderPrev: () => this.stepSlide(-1),
      sliderNext: () => this.stepSlide(1),
      sliderToggleAuto: this.toggleSliderAuto,
      sliderAutoLabel: sliderAuto ? 'Остановить автопоказ' : 'Включить автопоказ',
      sliderPosLabel: (sliderIdx + 1) + ' / ' + SLIDER_DATA.length,
      sliderAtStart: sliderIdx === 0,
      sliderAtEnd: sliderIdx === SLIDER_DATA.length - 1,

      // Управление сценой ИИ-агента в первом экране
      heroAuto: this.state.heroAuto,
      heroSceneRef: this.heroSceneRef,
      heroTask,
      heroInputRef: this.heroInputRef,
      onHeroTaskChange: this.onHeroTaskChange,
      submitHeroLead: this.submitHeroLead,
      heroSent: this.state.heroSent,
      heroDealRows,
      heroSizeBtns,
      heroChannelBtns,
      heroFootnote,
      heroSuccessText,
      platformRef: this.platformRef,
      heroSwipe: this.heroSwipe,
      heroPrev: () => this.stepRole(-1),
      heroNext: () => this.stepRole(1),
      heroToggleAuto: this.toggleHeroAuto,
      heroAutoLabel: this.state.heroAuto ? 'Остановить автопоказ' : 'Включить автопоказ',
      heroPosLabel: 'Сцена ' + (activeRole + 1) + ' из ' + AI_ROLES.length,
      heroAtStart: activeRole === 0,
      heroAtEnd: activeRole === AI_ROLES.length - 1,

      // Voice guide
      voiceOpen,
      voiceSections,
      toggleVoice: this.toggleVoice,
      stopVoice: this.stopVoice,
      voicePrimaryAction: this.playPause,
      voicePrimaryLabel,
      voiceStatusLabel,
      voiceStatusColor
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: FXCSS }} />


<div style={s(`--bg:#FAFAF8; --paper:#FFFFFF; --ink:#14171C; --ink-soft:#3F4650; --ink-faint:#6B7280; --line:#E7E6E2; --blue:#155EEF; --violet:#12A5E0; --grad:linear-gradient(135deg, var(--blue), var(--violet)); font-family:var(--font-inter),sans-serif; background:var(--bg); color:var(--ink); min-height:100vh; position:relative; isolation:isolate; overflow-x:clip;`)}>


  <div aria-hidden="true" className="aurora" style={s(`position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;`)}>
    <div className="aurora-blob" style={s(`position:absolute; top:-12%; left:-8%; width:55vw; height:55vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(21,94,239,0.5), transparent 68%); filter:blur(80px); animation:driftBlobA 22s ease-in-out infinite alternate;`)}></div>
    <div className="aurora-blob" style={s(`position:absolute; top:10%; right:-14%; width:50vw; height:50vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(18,165,224,0.46), transparent 68%); filter:blur(85px); animation:driftBlobB 27s ease-in-out infinite alternate;`)}></div>
    <div className="aurora-blob" style={s(`position:absolute; bottom:-20%; left:20%; width:54vw; height:54vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(139,92,246,0.4), transparent 70%); filter:blur(95px); animation:driftBlobA 31s ease-in-out infinite alternate;`)}></div>
    <div className="aurora-blob" style={s(`position:absolute; top:36%; left:34%; width:38vw; height:38vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(45,212,191,0.3), transparent 70%); filter:blur(95px); animation:driftBlobB 24s ease-in-out infinite alternate;`)}></div>
  </div>

  <header ref={this.headerRef} className="site-header" style={s(`position:sticky; top:14px; z-index:50; margin:14px ${v.padX} 0; display:flex; align-items:center; justify-content:space-between; padding:12px 14px 12px 20px; background:linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.34)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.7); border-radius:22px; box-shadow:0 16px 40px -16px rgba(20,23,28,0.32), inset 0 1px 1px rgba(255,255,255,0.9);`)}>

    <div style={s(`display:flex; align-items:center; gap:12px;`)}>
      <svg width="36" height="36" viewBox="0 0 40 40" style={s(`display:block; flex-shrink:0;`)} aria-hidden="true">
        <defs>
          <linearGradient id="tgH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#155EEF"></stop><stop offset="1" stopColor="#12A5E0"></stop></linearGradient>
          <linearGradient id="tgHV" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#155EEF"></stop><stop offset="1" stopColor="#3BC5EC"></stop></linearGradient>
        </defs>
        <g style={s(`transform-box:view-box; transform-origin:20px 35.6px; animation:tropism 11s ease-in-out infinite;`)}>
          <g style={s(`transform-box:view-box; transform-origin:20px 35.6px; animation:segBase 4.5s ease-in-out infinite;`)}>
            <path d="M20 35.6 C20 32.6 19.8 30 20 27.4" fill="none" stroke="url(#tgHV)" strokeWidth="2.8" strokeLinecap="round"></path>
            <g style={s(`transform-box:view-box; transform-origin:20px 27.4px; animation:segMid 4.5s ease-in-out infinite -1.5s;`)}>
              <path d="M20 27.4 C20.2 24.6 19.7 21.6 20 18.4" fill="none" stroke="url(#tgHV)" strokeWidth="2.5" strokeLinecap="round"></path>
              <g style={s(`transform-box:view-box; transform-origin:20px 23px; animation:nastyL 6.3s ease-in-out infinite;`)}>
                <path d="M20 23.3 C13.7 22.6 9.7 18.4 9.5 12.9 C15.8 12.7 20 16.9 20 23.3 Z" fill="url(#tgH)" opacity="0.92"></path>
              </g>
              <g style={s(`transform-box:view-box; transform-origin:20px 18.4px; animation:segTip 4.5s ease-in-out infinite -3s;`)}>
                <path d="M20 18.4 C20.15 15.6 20.6 13 20.3 10.6" fill="none" stroke="url(#tgHV)" strokeWidth="2.2" strokeLinecap="round"></path>
                <g style={s(`transform-box:view-box; transform-origin:20.2px 18px; animation:nastyR 7.1s ease-in-out infinite -0.4s;`)}>
                  <path d="M20.2 18.8 C26.5 17.9 30.5 13.7 30.9 8.2 C24.6 8.2 20.2 12.4 20.2 18.8 Z" fill="url(#tgH)"></path>
                </g>
                <g style={s(`transform-box:view-box; transform-origin:20.3px 11px; animation:budNod 3.1s ease-in-out infinite;`)}>
                  <path d="M20.3 10.8 C20.1 8.5 21.3 6.9 23.4 6.5 C23.5 8.8 22.3 10.4 20.3 10.8 Z" fill="url(#tgH)"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; color:var(--ink);`)}>ETHOS</span>
    </div>

    <div style={s(`display:${v.navDisplay}; align-items:center; gap:22px;`)}>
      <a className="mnfx0" href="/bitrix24" style={s(NAV_LINK)}>Битрикс24</a>
      <a className="mnfx1" href="/ai" style={s(NAV_LINK)}>ИИ-решения</a>
      <a className="mnfx2" href="#process" style={s(NAV_LINK)}>Процесс</a>
      <a className="mnfx3" href="/contacts" style={s(NAV_LINK)}>Контакты</a>
      <a href="tel:+79256777027" onClick={() => ymGoal('phone')} style={s(`font-size:var(--t15); font-weight:700; color:var(--ink); text-decoration:none; white-space:nowrap;`)}>+7 925 677-70-27</a>
      <button className="mnfx6" onClick={v.scrollToContact} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:#fff; background:linear-gradient(135deg, #155EEF, #12A5E0); border:1px solid rgba(255,255,255,0.22); padding:12px 26px; border-radius:999px; cursor:pointer; box-shadow:0 8px 20px -6px rgba(21,94,239,0.45), inset 0 1px 1px rgba(255,255,255,0.55); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Получить консультацию</button>
      {/* Голосовой гид: фича остаётся, но больше не занимает низ экрана —
          самое доступное место на телефоне. На мобильном контейнер меню
          скрыт целиком, поэтому там гида нет вовсе. */}
      <button
        className="mnfx14"
        onClick={v.toggleVoice}
        aria-label="Голосовой гид"
        aria-expanded={v.voiceOpen}
        style={s(`width:40px; height:40px; flex-shrink:0; border-radius:50%; border:1px solid ${v.voiceOpen ? 'var(--blue)' : 'var(--line)'}; background:${v.voiceOpen ? 'var(--blue)' : 'var(--paper)'}; color:${v.voiceOpen ? '#fff' : 'var(--ink-soft)'}; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s ease, border-color 0.2s ease, color 0.2s ease;`)}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9.5v5h3.2L12 18.6V5.4L7.2 9.5H4z" fill="currentColor"></path><path d="M15 8.5c1 .9 1.6 2.1 1.6 3.5S16 14.6 15 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></path><path d="M17.5 6c1.8 1.5 2.9 3.6 2.9 6s-1.1 4.5-2.9 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></path></svg>
      </button>
    </div>

    <button onClick={v.toggleMobileMenu} aria-label="Меню" aria-expanded={v.mobileMenuOpen} aria-controls="main-mobile-menu" style={s(`display:${v.hamburgerDisplay}; width:42px; height:42px; border-radius:10px; border:1px solid var(--line); background:var(--paper); flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer;`)}>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
    </button>

    <div id="main-mobile-menu" style={s(`position:absolute; top:calc(100% + 8px); left:0; right:0; display:grid; grid-template-rows:${v.mobileMenuRows}; transition:grid-template-rows 0.38s cubic-bezier(.16,1,.3,1); z-index:49;`)}>
     <div style={s(`overflow:hidden; min-height:0;`)}>
      <div style={s(`display:flex; flex-direction:column; padding:14px 24px 22px; gap:2px; background:#FFFFFF; border:1px solid var(--line); border-radius:20px; box-shadow:0 24px 48px -16px rgba(20,23,28,0.3);`)}>
        <a href="/bitrix24" onClick={v.closeMobileMenu} style={s(NAV_LINK_M)}>Битрикс24</a>
        <a href="/ai" onClick={v.closeMobileMenu} style={s(NAV_LINK_M)}>ИИ-решения</a>
        <a href="#process" onClick={v.closeMobileMenu} style={s(NAV_LINK_M)}>Процесс</a>
        <a href="/contacts" onClick={v.closeMobileMenu} style={s(NAV_LINK_M)}>Контакты</a>
        <a href="tel:+79256777027" onClick={() => { ymGoal('phone'); v.closeMobileMenu(); }} style={s(`display:flex; align-items:center; min-height:48px; font-size:var(--t16); font-weight:700; color:var(--blue); text-decoration:none; border-top:1px solid var(--line); margin-top:6px; padding-top:6px;`)}>+7 925 677-70-27</a>
        <button onClick={v.scrollToContact} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t15); font-weight:600; color:#fff; background:var(--blue); border:none; min-height:48px; padding:14px 22px; border-radius:999px; cursor:pointer; margin-top:6px;`)}>Получить консультацию</button>
      </div>
     </div>
    </div>

    {(v.voiceOpen) && (
      <div style={s(`position:absolute; top:calc(100% + 10px); right:0; width:296px; z-index:51; background:#FFFFFF; border:1px solid var(--line); border-radius:18px; box-shadow:0 28px 56px -18px rgba(20,23,28,0.3); padding:18px;`)}>
        <div style={s(`display:flex; align-items:center; justify-content:space-between; gap:8px;`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); color:var(--ink);`)}>Голосовой гид</div>
          <div style={s(`font-size:var(--t13); font-weight:600; color:${v.voiceStatusColor};`)}>{v.voiceStatusLabel}</div>
        </div>
        <div style={s(`font-size:var(--t13); color:var(--ink-soft); margin-top:4px; line-height:1.5;`)}>Озвучу содержание сайта раздел за разделом.</div>
        <div style={s(`display:flex; flex-direction:column; gap:6px; margin-top:14px;`)}>
          {(v.voiceSections||[]).map((vs, $index) => (<React.Fragment key={$index}>
            <button onClick={vs.onPlay} style={s(`display:flex; align-items:center; gap:10px; background:${vs.bg}; border:1px solid ${vs.border}; border-radius:10px; padding:9px 12px; cursor:pointer; text-align:left; font-family:var(--font-inter),sans-serif; transition:background 0.2s ease, border-color 0.2s ease;`)}>
              <span style={s(`width:6px; height:6px; border-radius:50%; background:${vs.dot}; flex-shrink:0; animation:${vs.dotAnim};`)}></span>
              <span style={s(`font-size:var(--t13); font-weight:600; color:${vs.color};`)}>{vs.label}</span>
            </button>
          </React.Fragment>))}
        </div>
        <div style={s(`display:flex; gap:8px; margin-top:14px;`)}>
          <button onClick={v.voicePrimaryAction} style={s(`flex:1; font-family:var(--font-inter),sans-serif; font-size:var(--t13); font-weight:600; color:#fff; background:var(--grad); border:none; border-radius:10px; padding:11px 12px; cursor:pointer;`)}>{v.voicePrimaryLabel}</button>
          <button className="mnfx13" onClick={v.stopVoice} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t13); font-weight:600; color:var(--ink-soft); background:transparent; border:1px solid var(--line); border-radius:10px; padding:11px 14px; cursor:pointer; transition:border-color 0.2s ease;`)}>Стоп</button>
        </div>
      </div>
    )}
  </header>

  <section id="hero" data-screen-label="Hero" style={s(`position:relative; padding:${v.heroPad}; max-width:var(--wrap); margin:0 auto; overflow:visible;`)}>

    <div style={s(`position:relative; z-index:1; display:grid; grid-template-columns:${v.heroGridTemplateColumns}; gap:var(--hero-gap); align-items:center;`)}>

      {/* -------- левая колонка: оффер -------- */}
      <div>
        <div style={s(`display:inline-flex; align-items:center; flex-wrap:${v.badgeWrap}; row-gap:8px; gap:10px; background:var(--paper); border:1px solid var(--line); border-radius:${v.badgeRadius}; box-shadow:0 8px 24px -14px rgba(20,23,28,0.18); padding:6px 16px 6px 6px; ${v.entranceBadge}`)}>
          <div style={s(`width:26px; height:26px; border-radius:8px; background:repeating-linear-gradient(45deg, #ECEBE7, #ECEBE7 4px, #F6F6F4 4px, #F6F6F4 8px); border:1px dashed #C9CDD3; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:8px; color:#8A8F99;`)}>Б24</div>
          <span style={s(`font-size:var(--t14); font-weight:600; color:var(--ink); min-width:0;`)}>Сертифицированный интегратор Битрикс24</span>
        </div>

        <h1 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h1Size}; line-height:1.06; letter-spacing:-0.03em; margin:var(--hero-h1-mt) 0 0; color:var(--ink); ${v.entranceH1}`)}>
          Битрикс24 и ИИ —<br />
          <span style={s(`color:var(--blue);`)}>в одной системе роста</span>
        </h1>

        <p style={s(`font-size:19px; line-height:1.6; color:var(--ink-soft); max-width:calc(620px * var(--t-scale)); margin:var(--hero-p-mt) 0 0; ${v.entranceP}`)}>
          Сертифицированный интегратор Битрикс24: <a href="/bitrix24" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>внедряем Битрикс24 под ключ</a>, дорабатываем и поддерживаем систему — и строим <a href="/ai" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>ИИ-агентов для бизнеса</a>, которые снимают рутину с ваших команд.
        </p>

        <div style={s(`margin-top:var(--hero-accent-mt); padding:14px 18px; border-left:2px solid var(--blue); background:var(--paper); font-size:var(--t15); line-height:1.55; color:var(--ink); max-width:calc(560px * var(--t-scale)); ${v.entranceCta}`)}>
          <span className="hero-accent-d">Опишите задачу справа — увидите, как её примет ваш будущий Битрикс24.</span>
          <span className="hero-accent-m">Опишите задачу ниже — увидите, как её примет ваш будущий Битрикс24.</span>
        </div>

        <div style={s(`display:${v.onlyDesktopFlex}; gap:20px; flex-wrap:wrap; margin-top:26px; font-family:monospace; font-size:12px; color:var(--ink-faint); ${v.entranceCta}`)}>
          <span>план в течение рабочего дня</span>
          <span>без звонков</span>
          <span>без ТЗ на входе</span>
        </div>
      </div>

      {/* -------- окно «ИИ-агент · активен»: форма, собирающая сделку -------- */}
      <div style={s(`background:var(--paper); border:1px solid var(--line); border-radius:22px; overflow:hidden; box-shadow:0 40px 70px -34px rgba(20,23,28,0.3); ${v.entranceCard}`)}>

        <div style={s(`display:flex; align-items:center; gap:8px; padding:0 16px; height:44px; border-bottom:1px solid var(--line); background:#FBFBF9;`)}>
          <span style={s(`width:8px; height:8px; border-radius:50%; background:#E2E1DC;`)}></span>
          <span style={s(`width:8px; height:8px; border-radius:50%; background:#E2E1DC;`)}></span>
          <span style={s(`width:8px; height:8px; border-radius:50%; background:#E2E1DC;`)}></span>
          <span style={s(`margin-left:auto; font-size:12px; font-weight:600; color:var(--ink-soft); display:flex; align-items:center; gap:6px;`)}>
            <span style={s(`width:7px; height:7px; border-radius:50%; background:#9DCF00; flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
            ИИ-агент · активен
          </span>
        </div>

        {v.heroSent ? (
          <div style={s(`padding:44px 28px 48px; text-align:center;`)}>
            <div style={s(`width:46px; height:46px; border-radius:12px; background:var(--grad); margin:0 auto; display:flex; align-items:center; justify-content:center; box-shadow:0 12px 26px -8px rgba(21,94,239,0.5);`)}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </div>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; color:var(--ink); margin-top:18px;`)}>Сделка создана</div>
            <p style={s(`font-size:var(--t15); line-height:1.6; color:var(--ink-soft); margin:12px auto 0; max-width:360px;`)}>{v.heroSuccessText}</p>
          </div>
        ) : (
          <>
            <div style={s(`display:flex; align-items:center; gap:10px; padding:16px 20px; border-bottom:1px solid #F0EFEB;`)}>
              <span aria-hidden="true" style={s(`font-family:monospace; font-size:15px; font-weight:700; color:var(--blue); flex-shrink:0;`)}>&gt;</span>
              <label className="vh-label" htmlFor="hero-task">Опишите задачу, которую нужно автоматизировать</label>
              <input
                id="hero-task"
                ref={v.heroInputRef}
                className="hero-input"
                type="text"
                value={v.heroTask}
                onChange={v.onHeroTaskChange}
                placeholder="Заявки из WhatsApp теряются между менеджерами"
                autoComplete="off"
                style={s(`flex:1; min-width:0; border:none; outline:none; background:transparent; font-family:var(--font-inter),sans-serif; color:var(--ink); padding:0;`)}
              />
            </div>

            <div aria-live="polite" style={s(`padding:14px 20px 4px;`)}>
              <div style={s(`font-family:monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-faint);`)}>Карточка сделки собирается</div>
              <div style={s(`margin-top:4px;`)}>
                {v.heroDealRows.map((row, i) => (
                  <div key={row.label} style={s(`display:flex; align-items:baseline; gap:10px; padding:9px 0; border-bottom:${i === 4 ? 'none' : '1px solid #F5F4F1'};`)}>
                    <span style={s(`width:6px; height:6px; border-radius:50%; background:${row.dot}; flex-shrink:0; align-self:center; transition:background 0.25s ease;`)}></span>
                    <span style={s(`font-family:monospace; font-size:11px; color:var(--ink-faint); width:118px; flex-shrink:0;`)}>{row.label}</span>
                    {row.on
                      ? <span className="hero-fill" style={s(`font-size:13px; font-weight:600; color:${row.color}; min-width:0; overflow-wrap:anywhere;`)}>{row.value}</span>
                      : <span style={s(`font-size:13px; font-weight:600; color:#B9BCC2;`)}>—</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={s(`padding:8px 20px 18px;`)} role="radiogroup" aria-label="Размер команды">
              <div style={s(`font-family:monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-faint);`)}>Размер команды</div>
              <div style={s(`display:flex; gap:8px; margin-top:10px;`)}>
                {v.heroSizeBtns.map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    role="radio"
                    aria-checked={b.active}
                    onClick={b.onClick}
                    className="hero-size-btn"
                    style={s(`flex:1; border-radius:10px; font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; cursor:pointer; background:${b.active ? '#EEF3FE' : 'var(--paper)'}; border:1px solid ${b.active ? 'var(--blue)' : '#E2E1DC'}; color:${b.active ? 'var(--blue)' : 'var(--ink-soft)'}; transition:background 0.2s ease, border-color 0.2s ease, color 0.2s ease;`)}
                  >{b.label}</button>
                ))}
              </div>
            </div>

            <div style={s(`border-top:1px solid #F0EFEB; background:#FBFBF9; padding:18px 20px 20px;`)}>
              <div style={s(`display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;`)} role="radiogroup" aria-label="Куда прислать план">
                <span style={s(`font-family:monospace; font-size:11px; color:var(--ink-faint);`)}>куда прислать план</span>
                <div style={s(`display:flex; gap:8px;`)}>
                  {v.heroChannelBtns.map((b) => (
                    <button
                      key={b.key}
                      type="button"
                      role="radio"
                      aria-checked={b.active}
                      onClick={b.onClick}
                      className="hero-pill"
                      style={s(`padding:0 16px; border-radius:999px; font-family:var(--font-inter),sans-serif; font-size:var(--t13); font-weight:600; cursor:pointer; background:${b.active ? 'var(--ink)' : 'var(--paper)'}; border:1px solid ${b.active ? 'var(--ink)' : '#E2E1DC'}; color:${b.active ? '#fff' : 'var(--ink-soft)'}; transition:background 0.2s ease, border-color 0.2s ease, color 0.2s ease;`)}
                    >{b.label}</button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={v.submitHeroLead} className="mnfx7" style={s(`display:block; width:100%; height:52px; margin-top:14px; border:none; border-radius:14px; background:var(--grad); color:#fff; font-family:var(--font-inter),sans-serif; font-size:var(--t16); font-weight:600; cursor:pointer; box-shadow:0 12px 28px -8px rgba(21,94,239,0.5); transition:transform 0.25s ease, box-shadow 0.25s ease;`)}>Получить план на 30 дней</button>

              <div style={s(`font-size:12px; line-height:1.5; color:var(--ink-faint); text-align:center; margin-top:12px;`)}>{v.heroFootnote}</div>
              <div style={s(`font-size:12px; line-height:1.5; color:var(--ink-faint); text-align:center; margin-top:6px;`)}>
                Нажимая кнопку, вы соглашаетесь с <a href="/privacy" style={s(`color:var(--ink-faint); text-decoration:none; border-bottom:1px solid var(--line);`)}>политикой конфиденциальности</a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* строка доверия на телефоне — после окна, чтобы не разрывать путь к форме */}
      <div style={s(`display:${v.onlyMobile};`)}>
        <div style={s(`display:flex; gap:14px 20px; flex-wrap:wrap; font-family:monospace; font-size:12px; color:var(--ink-faint);`)}>
          <span>план в течение рабочего дня</span>
          <span>без звонков</span>
          <span>без ТЗ на входе</span>
        </div>
      </div>

    </div>
  </section>

  <section ref={v.platformRef} className="fxpause" id="platform" data-screen-label="Platform slider" style={s(`padding:${v.platformPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`text-align:center; max-width:calc(720px * var(--t-scale)); margin:0 auto;`)}>
      <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Платформа</div>
      <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; letter-spacing:-0.02em; line-height:1.12; color:var(--ink); margin:16px 0 0;`)}>Что вы получаете с&nbsp;Битрикс24</h2>
    </div>

    <div style={s(`display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:36px;`)}>
      {(v.sliderChips||[]).map((chip, $index) => (<React.Fragment key={$index}>
        <button onClick={chip.onClick} style={s(`position:relative; overflow:hidden; display:flex; align-items:center; gap:8px; font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:${chip.color}; background:${chip.bg}; border:1px solid ${chip.border}; border-radius:999px; padding:10px 18px 10px 12px; cursor:pointer; transition:background 0.2s ease, border-color 0.2s ease, color 0.2s ease;`)}>
          <span style={s(`display:flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:${chip.iconBg}; flex-shrink:0;`)}>{chip.icon}</span>
          <span style={s(`white-space:nowrap;`)}>{chip.label}</span>
          {chip.progress}
        </button>
      </React.Fragment>))}
    </div>

    <div data-reveal style={s(`margin-top:28px; background:linear-gradient(160deg, rgba(255,255,255,0.7), rgba(255,255,255,0.46)); backdrop-filter:blur(26px) saturate(180%); -webkit-backdrop-filter:blur(26px) saturate(180%); border:1px solid rgba(255,255,255,0.72); border-radius:24px; box-shadow:0 30px 60px -30px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9); padding:${v.platformCardPad}; display:grid; grid-template-columns:${v.platformColumns}; gap:${v.platformGap}; align-items:start;`)}>
      <div style={s(`display:flex; flex-direction:column; gap:20px; min-width:0;`)}>
        {v.sliderList}
        <button className="mnfx9" onClick={v.scrollToContact} style={s(`align-self:flex-start; font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:#fff; background:var(--blue); border:none; padding:12px 26px; border-radius:999px; cursor:pointer; transition:background 0.2s ease;`)}>Обсудить внедрение</button>
      </div>
      {/* Слайды лежат в горизонтальном треке: свайп пальцем тянет его в
          реальном времени, стрелки и точки переключают, автопоказ
          выключается при первом ручном действии. */}
      <div
        role="group"
        aria-roledescription="карусель"
        aria-label="Возможности Битрикс24"
        style={s(`position:relative; min-width:0;`)}
      >
        <div {...v.sliderSwipe} className="carousel-clip" style={s(`border-radius:16px;`)}>
        <div ref={v.sliderTrackRef} className="carousel-track" style={{ '--i': v.sliderIdx }}>


        <div aria-hidden={v.slideHidden.crm} className="carousel-slide" style={s(v.vis.crm)}>
          <div style={s(`height:${v.platformSlotHeight}; background:#fff; border:1px solid var(--line); border-radius:16px; overflow:hidden; box-shadow:0 22px 44px -30px rgba(20,23,28,0.28); display:flex; flex-direction:column;`)}>
            <div style={s(`display:flex; align-items:center; gap:8px; padding:11px 16px; border-bottom:1px solid var(--line); background:#fff;`)}>
              <span style={s(`width:22px; height:22px; border-radius:6px; background:#155EEF; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="12" height="12" viewBox="0 0 24 24"><path d="M4 5h16l-5.5 7v5.5L9.5 20v-8L4 5z" fill="#fff"></path></svg></span>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t13); color:var(--ink);`)}>Сделки · Канбан</span>
              <span style={s(`display:inline-flex; align-items:center; font-size:var(--mock-sm); font-weight:600; color:var(--ink-faint); background:#F1F3F5; border-radius:6px; padding:3px 8px;`)}>Мои сделки</span>
              <span style={s(`margin-left:auto; font-size:var(--mock-11); color:var(--ink-faint);`)}>Итого</span>
              <span style={s(`font-family:monospace; font-size:var(--t13); font-weight:800; color:var(--ink); animation:mkCountPulse 3.4s ease-in-out infinite;`)}>₽4,78M</span>
            </div>
            <div style={s(`position:relative; flex:1; display:${v.onlyDesktopFlex}; gap:10px; padding:14px; background:#EEF2F6; min-height:0;`)}>

              
              <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; min-width:0;`)}>
                <div style={s(`border-radius:8px; background:#E3E8EE; padding:7px 10px;`)}>
                  <div style={s(`display:flex; align-items:center; justify-content:space-between;`)}><span style={s(`font-size:var(--mock-11); font-weight:700; color:#5A626E;`)}>Новые</span><span style={s(`font-size:var(--mock-sm); font-weight:700; color:#8A8F99;`)}>2</span></div>
                  <div style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; color:#5A626E; margin-top:2px;`)}>₽1,46M</div>
                </div>
                <div style={s(`background:#fff; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #9AA2AE; animation:sliderItemIn .5s ease both; animation-delay:.1s;`)}>
                  <div style={s(`font-size:var(--mock-11); font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>ТД «Восток»</div>
                  <div style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽260 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#B8860B;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>ТВ</span><span style={s(`width:5px;height:5px;border-radius:50%;background:#D6DAE0;`)}></span><span style={s(`width:5px;height:5px;border-radius:50%;background:#D6DAE0;`)}></span></div>
                </div>
                <div style={s(`background:#fff; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #9AA2AE; animation:sliderItemIn .5s ease both; animation-delay:.2s;`)}>
                  <div style={s(`font-size:var(--mock-11); font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>Аптека, сеть</div>
                  <div style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽1 200 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#7A6FF0;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>АС</span><span style={s(`width:5px;height:5px;border-radius:50%;background:#D6DAE0;`)}></span></div>
                </div>
              </div>

              
              <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; min-width:0;`)}>
                <div style={s(`border-radius:8px; background:#DCE8FF; padding:7px 10px;`)}>
                  <div style={s(`display:flex; align-items:center; justify-content:space-between;`)}><span style={s(`font-size:var(--mock-11); font-weight:700; color:#155EEF;`)}>В работе</span><span ref={v.workCountRef} style={s(`font-size:var(--mock-sm); font-weight:700; color:#155EEF;`)}>2</span></div>
                  <div ref={v.workSumRef} style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; color:#155EEF; margin-top:2px;`)}>₽1,22M</div>
                </div>
                <div style={s(`background:#fff; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #155EEF;`)}>
                  <div style={s(`font-size:var(--mock-11); font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>СтройДом</div>
                  <div style={s(`font-family: monospace; font-size:var(--mock-11); font-weight: 700; color: var(--ink-soft); margin-top: 4px; position: relative`)}>₽740 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#155EEF;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>СД</span><span style={s(`width:5px;height:5px;border-radius:50%;background:#3DDC84;`)}></span></div>
                </div>
              </div>

              
              <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; min-width:0;`)}>
                <div style={s(`border-radius:8px; background:#DCF3E6; padding:7px 10px;`)}>
                  <div style={s(`display:flex; align-items:center; justify-content:space-between;`)}><span style={s(`font-size:var(--mock-11); font-weight:700; color:#1F8A5B;`)}>Успех</span><span ref={v.succCountRef} style={s(`font-size:var(--mock-sm); font-weight:700; color:#1F8A5B;`)}>1</span></div>
                  <div ref={v.succSumRef} style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; color:#1F8A5B; margin-top:2px;`)}>₽2,10M</div>
                </div>
                <div style={s(`background:#EBF7F0; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.06); border-left:3px solid #1F8A5B;`)}>
                  <div style={s(`font-size:var(--mock-11); font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>IT-Парк</div>
                  <div style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:800; color:#1F8A5B; margin-top:4px;`)}>₽2 100 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#1F8A5B;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>IP</span><span style={s(`width:14px;height:14px;border-radius:50%;background:#1F8A5B;display:flex;align-items:center;justify-content:center;`)}><svg width="8" height="8" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span></div>
                </div>
              </div>

              
              <div ref={v.dragRef} style={s(`position:absolute; left:calc(34px + 2*(100% - 48px)/3); width:calc((100% - 48px)/3); top:141px; background:#fff; border-radius:8px; padding:9px 10px; border-left:3px solid #12A5E0; box-shadow:0 2px 6px rgba(20,23,28,.12); transform:translate(calc(-100% - 10px),0); pointer-events:none; z-index:7; animation:b24Carry 7s cubic-bezier(.6,.02,.35,1) infinite; will-change:transform,opacity;`)}>
                <div style={s(`display:flex; align-items:center; gap:5px;`)}>
                  <span style={s(`font-size:var(--mock-11); font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;`)}>ООО «Ромашка»</span>
                  <span style={s(`width:6px;height:6px;border-radius:50%;background:#3DDC84;flex-shrink:0;`)}></span>
                </div>
                <div style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽480 000</div>
                <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}>
                  <span style={s(`width:16px;height:16px;border-radius:50%;background:#12A5E0;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>РМ</span>
                  <span style={s(`font-size:var(--mock-xs); color:var(--ink-faint); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>перетаскивание</span>
                </div>
                
                <div style={s(`position:absolute; right:14px; bottom:-2px; z-index:8; pointer-events:none; filter:drop-shadow(0 3px 4px rgba(0,0,0,.32)); animation:b24Press 7s cubic-bezier(.6,.02,.35,1) infinite;`)}>
                  <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l6 16 2.4-6.4L19 9 4 2z" fill="#1B1F24" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"></path></svg>
                </div>
              </div>

            </div>

              <div style={s(`display:${v.onlyMobile}; padding:14px; background:#EEF2F6;`)}>
                <div style={s(`display:flex; flex-direction:column; gap:10px;`)}>

                  <div style={s(`border-radius:8px; background:#DCE8FF; padding:9px 12px; display:flex; align-items:center; justify-content:space-between; gap:10px;`)}>
                    <span style={s(`font-size:var(--mock-11); font-weight:700; color:#155EEF;`)}>В работе · 1</span>
                    <span style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:700; color:#155EEF;`)}>₽740K</span>
                  </div>
                  <div style={s(`background:#fff; border-radius:8px; padding:11px 12px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #155EEF;`)}>
                    <div style={s(`font-size:var(--mock-12); font-weight:700; color:var(--ink);`)}>СтройДом</div>
                    <div style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽740 000</div>
                  </div>

                  <div style={s(`display:flex; align-items:center; gap:8px; color:var(--blue); padding:2px 0;`)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    <span style={s(`font-size:var(--mock-11); font-weight:600;`)}>ИИ-агент закрыл сделку и перенёс её дальше</span>
                  </div>

                  <div style={s(`border-radius:8px; background:#DCF3E6; padding:9px 12px; display:flex; align-items:center; justify-content:space-between; gap:10px;`)}>
                    <span style={s(`font-size:var(--mock-11); font-weight:700; color:#1F8A5B;`)}>Успех · 2</span>
                    <span style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:700; color:#1F8A5B;`)}>₽2,58M</span>
                  </div>
                  <div style={s(`background:#fff; border-radius:8px; padding:11px 12px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #12A5E0;`)}>
                    <div style={s(`display:flex; align-items:center; gap:6px;`)}>
                      <span style={s(`font-size:var(--mock-12); font-weight:700; color:var(--ink); flex:1;`)}>ООО «Ромашка»</span>
                      <span style={s(`width:16px; height:16px; border-radius:50%; background:#1F8A5B; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="9" height="9" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                    </div>
                    <div style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽480 000</div>
                  </div>
                  <div style={s(`background:#EBF7F0; border-radius:8px; padding:11px 12px; box-shadow:0 1px 3px rgba(20,23,28,.06); border-left:3px solid #1F8A5B;`)}>
                    <div style={s(`font-size:var(--mock-12); font-weight:700; color:var(--ink);`)}>IT-Парк</div>
                    <div style={s(`font-family:monospace; font-size:var(--mock-11); font-weight:800; color:#1F8A5B; margin-top:4px;`)}>₽2 100 000</div>
                  </div>

                </div>
              </div>
          </div>
        </div>

        
        <div aria-hidden={v.slideHidden.tasks} className="carousel-slide" style={s(v.vis.tasks)}>
          <div style={s(`height:${v.platformSlotHeight}; background:#fff; border:1px solid var(--line); border-radius:16px; overflow:hidden; box-shadow:0 22px 44px -30px rgba(20,23,28,0.28); display:flex; flex-direction:column;`)}>
            <div style={s(`display:flex; align-items:center; gap:8px; padding:11px 16px; border-bottom:1px solid var(--line); background:#fff;`)}>
              <span style={s(`width:22px; height:22px; border-radius:6px; background:#B8860B; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="12" height="12" viewBox="0 0 24 24"><path d="M5 4h14v3H5V4zm0 6.5h14v3H5v-3zM5 17h9v3H5v-3z" fill="#fff"></path></svg></span>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t13); color:var(--ink);`)}>Задачи · Запуск сайта</span>
              <span style={s(`display:inline-flex; align-items:center; font-size:var(--mock-sm); font-weight:600; color:var(--ink-faint); background:#F1F3F5; border-radius:6px; padding:3px 8px;`)}>Проект</span>
              <span style={s(`margin-left:auto; font-family:monospace; font-size:var(--mock-12); font-weight:800; color:#B8860B;`)}>3/4</span>
            </div>
            <div style={s(`padding:12px 16px 0;`)}>
              <div style={s(`height:6px; background:#F0EDE4; border-radius:3px; overflow:hidden;`)}><div style={s(`height:100%; width:75%; background:#B8860B; border-radius:3px; transform-origin:left; animation:mkGrow 1.2s cubic-bezier(.2,.7,.3,1) both; animation-delay:0.4s;`)}></div></div>
            </div>

            
            <div style={s(`margin:14px 16px 0; background:#FBFAF6; border:1px solid #F0EDE4; border-radius:10px; padding:11px 12px;`)}>
              <div style={s(`display:flex; align-items:center; gap:6px; margin-bottom:10px;`)}><svg width="12" height="12" viewBox="0 0 24 24"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#B8860B"></path></svg><span style={s(`font-size:var(--mock-11); font-weight:700; color:#B8860B;`)}>Смарт-процесс · Согласование договора</span></div>
              {/* «Согласование» не влезало в свою колонку и обрезалось на
                  телефоне. Взяли короткое «Виза» — это тот же этап на языке
                  документооборота, — и запретили тексту переполнять чип. */}
              <div style={s(`display:flex; gap:5px;`)}>
                <div style={s(`flex:1; min-width:0; display:flex; align-items:center; justify-content:center; gap:3px; font-size:var(--mock-xs); font-weight:700; color:#fff; background:#B8860B; border-radius:6px; padding:6px 4px;`)}><svg width="8" height="8" viewBox="0 0 24 24" style={s(`flex-shrink:0;`)}><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg><span style={s(`overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`)}>Заявка</span></div>
                <div style={s(`flex:1; min-width:0; text-align:center; font-size:var(--mock-xs); font-weight:700; color:#8A6D0F; background:#F5EAC9; border:1.5px solid #B8860B; border-radius:6px; padding:5px 4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; animation:mkPulseGold 2.2s ease-in-out infinite;`)}>Виза</div>
                <div style={s(`flex:1; min-width:0; text-align:center; font-size:var(--mock-xs); font-weight:600; color:#A99B76; background:#F0EDE4; border-radius:6px; padding:6px 4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`)}>Счёт</div>
                <div style={s(`flex:1; min-width:0; text-align:center; font-size:var(--mock-xs); font-weight:600; color:#A99B76; background:#F0EDE4; border-radius:6px; padding:6px 4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`)}>Отгрузка</div>
              </div>
            </div>

            <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; padding:14px 16px; min-height:0;`)}>
              <div style={s(`display:flex; align-items:center; gap:10px; background:#FBFAF6; border:1px solid #F0EDE4; border-radius:9px; padding:9px 11px;`)}><span style={s(`width:18px; height:18px; border-radius:5px; background:#B8860B; flex-shrink:0; display:flex; align-items:center; justify-content:center; animation:mkPop 0.4s ease both; animation-delay:0.3s;`)}><svg width="10" height="10" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span style={s(`font-size:var(--mock-12); color:var(--ink); flex:1;`)}>Собрать требования</span><span style={s(`width:20px; height:20px; border-radius:50%; background:#7A6FF0; color:#fff; font-size:8px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}>МС</span></div>
              <div style={s(`display:flex; align-items:center; gap:10px; background:#FBFAF6; border:1px solid #F0EDE4; border-radius:9px; padding:9px 11px;`)}><span style={s(`width:18px; height:18px; border-radius:5px; background:#B8860B; flex-shrink:0; display:flex; align-items:center; justify-content:center; animation:mkPop 0.4s ease both; animation-delay:0.7s;`)}><svg width="10" height="10" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span><span style={s(`font-size:var(--mock-12); color:var(--ink); flex:1;`)}>Дизайн-макет</span><span style={s(`width:20px; height:20px; border-radius:50%; background:#C0334A; color:#fff; font-size:8px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}>АК</span></div>
              <div style={s(`display:flex; align-items:center; gap:10px; border:1px solid #EDEFF2; border-radius:9px; padding:9px 11px;`)}><span style={s(`width:18px; height:18px; border-radius:5px; border:2px solid #D6D2C6; flex-shrink:0; animation:mkPulseBlue 2.4s ease-in-out infinite;`)}></span><span style={s(`font-size:var(--mock-12); color:var(--ink); flex:1;`)}>Вёрстка страниц</span><span style={s(`font-size:var(--mock-xs); font-weight:600; color:#B8860B; background:#F5EFDF; border-radius:5px; padding:2px 6px; flex-shrink:0;`)}>сегодня</span></div>
            </div>
          </div>
        </div>

        
        <div aria-hidden={v.slideHidden.ai} className="carousel-slide" style={s(v.vis.ai)}>
          <div style={s(`height:${v.platformSlotHeight}; background:#0E1420; border:1px solid #1E2836; border-radius:16px; overflow:hidden; box-shadow:0 22px 44px -30px rgba(20,23,28,0.5); display:flex; flex-direction:column;`)}>
            <div style={s(`display:flex; align-items:center; gap:9px; padding:12px 16px; border-bottom:1px solid #1E2836;`)}>
              <span style={s(`width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,#12A5E0,#155EEF); display:flex; align-items:center; justify-content:center;`)}><svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2L12 2z" fill="#fff"></path></svg></span>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t13); color:#fff;`)}>ИИ-агент · Поддержка</span>
              <span style={s(`margin-left:auto; display:flex; align-items:center; gap:5px;`)}><span style={s(`width:7px; height:7px; border-radius:50%; background:#3DDC84; animation:mkBlink 1.8s ease-in-out infinite;`)}></span><span style={s(`font-size:var(--mock-11); color:#7C8A9C;`)}>онлайн</span></span>
            </div>
            {/* Полноценный живой диалог на 18-секундном цикле: клиент пишет →
                агент «печатает» → отвечает → клиент просит трек → агент
                присылает номер. Раньше переписка обрывалась на многоточии,
                и было непонятно, чем всё закончилось. */}
            <div style={s(`flex:1; display:flex; flex-direction:column; gap:9px; padding:14px 16px; min-height:0; justify-content:flex-end; overflow:hidden;`)}>
              <div style={s(`align-self:flex-end; max-width:80%; background:#243244; border-radius:14px 14px 4px 14px; padding:9px 12px; animation:chatMsg1 18s linear infinite;`)}><div style={s(`font-size:var(--mock-12); color:#DDE5EF; line-height:1.45;`)}>Здравствуйте! Мой заказ ещё не приехал 😕</div></div>

              <div style={s(`align-self:flex-start; display:flex; align-items:center; gap:4px; background:#1A2432; border-radius:12px 12px 12px 4px; padding:10px 13px; animation:chatType1 18s linear infinite;`)}>
                <span style={s(`width:6px; height:6px; border-radius:50%; background:#7C8A9C; animation:mkBlink 1.2s ease-in-out infinite;`)}></span>
                <span style={s(`width:6px; height:6px; border-radius:50%; background:#7C8A9C; animation:mkBlink 1.2s ease-in-out infinite 0.2s;`)}></span>
                <span style={s(`width:6px; height:6px; border-radius:50%; background:#7C8A9C; animation:mkBlink 1.2s ease-in-out infinite 0.4s;`)}></span>
              </div>

              <div style={s(`align-self:flex-start; max-width:84%; background:linear-gradient(135deg,#12A5E0,#155EEF); border-radius:14px 14px 14px 4px; padding:9px 12px; animation:chatMsg2 18s linear infinite;`)}><div style={s(`font-size:var(--mock-12); color:#fff; line-height:1.45;`)}>Проверил по CRM: заказ №4821 в пути, доставка сегодня до 19:00. Прислать трек-номер?</div></div>

              <div style={s(`align-self:flex-end; max-width:80%; background:#243244; border-radius:14px 14px 4px 14px; padding:9px 12px; animation:chatMsg3 18s linear infinite;`)}><div style={s(`font-size:var(--mock-12); color:#DDE5EF; line-height:1.45;`)}>Да, пришлите пожалуйста</div></div>

              <div style={s(`align-self:flex-start; display:flex; align-items:center; gap:4px; background:#1A2432; border-radius:12px 12px 12px 4px; padding:10px 13px; animation:chatType2 18s linear infinite;`)}>
                <span style={s(`width:6px; height:6px; border-radius:50%; background:#7C8A9C; animation:mkBlink 1.2s ease-in-out infinite;`)}></span>
                <span style={s(`width:6px; height:6px; border-radius:50%; background:#7C8A9C; animation:mkBlink 1.2s ease-in-out infinite 0.2s;`)}></span>
                <span style={s(`width:6px; height:6px; border-radius:50%; background:#7C8A9C; animation:mkBlink 1.2s ease-in-out infinite 0.4s;`)}></span>
              </div>

              <div style={s(`align-self:flex-start; max-width:88%; background:linear-gradient(135deg,#12A5E0,#155EEF); border-radius:14px 14px 14px 4px; padding:9px 12px; animation:chatMsg4 18s linear infinite;`)}>
                <div style={s(`font-size:var(--mock-12); color:#fff; line-height:1.45;`)}>Трек-номер <b style={s(`font-family:monospace; letter-spacing:0.02em;`)}>RU482100317</b> — отслеживание по ссылке. Курьер позвонит за час.</div>
                <div style={s(`display:flex; align-items:center; gap:6px; margin-top:7px; padding-top:7px; border-top:1px solid rgba(255,255,255,0.25);`)}>
                  <span style={s(`width:14px; height:14px; border-radius:50%; background:rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="8" height="8" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#155EEF" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                  <span style={s(`font-size:var(--mock-sm); color:rgba(255,255,255,0.92);`)}>обращение закрыто · без оператора</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div aria-hidden={v.slideHidden.cards} className="carousel-slide" style={s(v.vis.cards)}>
          <div style={s(`height:${v.platformSlotHeight}; background:#fff; border:1px solid var(--line); border-radius:16px; overflow:hidden; box-shadow:0 22px 44px -30px rgba(20,23,28,0.28); display:flex; flex-direction:column;`)}>
            <div style={s(`display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid var(--line);`)}>
              <span style={s(`width:9px; height:9px; border-radius:50%; background:#1F8A5B;`)}></span>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t13); color:var(--ink);`)}>Генератор карточек</span>
              <span style={s(`margin-left:auto; display:inline-flex; align-items:center; gap:5px; background:#EBF7F0; border-radius:999px; padding:3px 9px;`)}><svg width="10" height="10" viewBox="0 0 24 24" style={s(`animation:mkDrift 2.2s ease-in-out infinite;`)}><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10z" fill="#1F8A5B"></path></svg><span style={s(`font-size:var(--mock-sm); font-weight:700; color:#1F8A5B;`)}>ИИ генерирует</span></span>
            </div>
            <div style={s(`flex:1; display:flex; gap:14px; padding:16px; min-height:0;`)}>
              <div style={s(`width:38%; border-radius:12px; overflow:hidden; position:relative; flex-shrink:0; background:#EEF2F6;`)}>
                {v.productImgEl}
              </div>
              <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; min-width:0;`)}>
                <div style={s(`display:flex; align-items:center; gap:6px;`)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" style={s(`flex-shrink:0; animation:mkDrift 2.2s ease-in-out infinite;`)}><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10z" fill="#1F8A5B"></path></svg>
                  <span style={s(`font-size:var(--mock-sm); font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#1F8A5B;`)}>{v.productStatus}</span>
                </div>
                {v.productCatEl}
                {v.productNameEl}
                {v.productPriceEl}
                {/* Описание жёстко ограничено по строкам: на телефоне карточка
                    фиксированной высоты, и без этого хвост текста обрезался
                    прямо посреди буквы. */}
                <div style={s(`flex:1; min-height:0; overflow:hidden; font-size:var(--mock-11); line-height:1.55; color:var(--ink-soft); display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:var(--card-desc-lines); box-orient:vertical;`)}>{v.productDescTyped}<span style={s(`display:${v.productCaretDisplay}; color:#1F8A5B; font-weight:800; animation:mkBlink 1s step-end infinite;`)}>▋</span></div>
                <div style={s(`display:${v.productBadgesDisplay}; flex-wrap:wrap; gap:6px; flex-shrink:0;`)}><span style={s(`font-size:var(--mock-sm); font-weight:600; color:#1F8A5B; background:#EBF7F0; border-radius:6px; padding:4px 8px;`)}>SEO-текст ✓</span><span style={s(`font-size:var(--mock-sm); font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 8px;`)}>alt-теги ✓</span><span style={s(`font-size:var(--mock-sm); font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 8px;`)}>характеристики ✓</span></div>
              </div>
            </div>
          </div>
        </div>

        
        <div aria-hidden={v.slideHidden.analytics} className="carousel-slide" style={s(v.vis.analytics)}>
          <div style={s(`height:${v.platformSlotHeight}; background:#fff; border:1px solid var(--line); border-radius:16px; overflow:hidden; box-shadow:0 22px 44px -30px rgba(20,23,28,0.28); display:flex; flex-direction:column;`)}>
            <div style={s(`position:relative; display:flex; align-items:center; gap:8px; padding:12px 16px; border-bottom:1px solid var(--line); overflow:hidden;`)}>
              <span style={s(`width:9px; height:9px; border-radius:50%; background:#D9480F;`)}></span>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t13); color:var(--ink);`)}>Аналитика и финансы · Дашборд</span>
              {/* Статус переключается с «синхронизация» на «обновлено» —
                  дашборд читается как живая витрина, а не скриншот. */}
              <span style={s(`position:relative; margin-left:auto; display:block; width:118px; height:14px; flex-shrink:0;`)}>
                <span style={s(`position:absolute; right:0; top:0; display:inline-flex; align-items:center; gap:5px; font-family:monospace; font-size:var(--mock-sm); color:var(--ink-faint); white-space:nowrap; animation:dashStatusA 14s linear infinite;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#155EEF; animation:pulseDot 1s ease-in-out infinite;`)}></span>синхронизация…</span>
                <span style={s(`position:absolute; right:0; top:0; display:inline-flex; align-items:center; gap:5px; font-family:monospace; font-size:var(--mock-sm); color:#1F8A5B; white-space:nowrap; animation:dashStatusB 14s linear infinite;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#3DDC84;`)}></span>обновлено</span>
              </span>
              <span aria-hidden="true" style={s(`position:absolute; inset:0; pointer-events:none; background:linear-gradient(90deg, transparent, rgba(21,94,239,0.14), transparent); animation:dashSweep 14s linear infinite;`)}></span>
            </div>


            <div style={s(`padding:13px 16px 0;`)}>
              <div style={s(`font-size:var(--mock-sm); font-weight:700; letter-spacing:0.03em; text-transform:uppercase; color:var(--ink-faint);`)}>Данные собираются из разных систем</div>
              <div style={s(`display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;`)}>
                {[
                  { label: 'Битрикс24 CRM', hue: '#155EEF', d: 0 },
                  { label: '1С', hue: '#B8860B', d: 0.5 },
                  { label: 'Сайт', hue: '#12A5E0', d: 1 },
                  { label: 'Телефония', hue: '#C0334A', d: 1.5 },
                ].map((src) => (
                  <span key={src.label} style={s(`display:inline-flex; align-items:center; gap:5px; font-size:var(--mock-sm); font-weight:600; color:var(--ink); background:#F4F6F8; border:1px solid #E7EAEE; border-radius:7px; padding:4px 8px; animation:dashChip 14s linear infinite; animation-delay:${src.d}s;`)}>
                    {/* Спиннер уступает место галочке — источник подключился. */}
                    <span style={s(`position:relative; width:9px; height:9px; flex-shrink:0;`)}>
                      <span style={s(`position:absolute; inset:0; border-radius:50%; border:1.5px solid ${src.hue}33; border-top-color:${src.hue}; animation:dashSpin 14s linear infinite; animation-delay:${src.d}s;`)}></span>
                      <span style={s(`position:absolute; inset:0; display:flex; align-items:center; justify-content:center; border-radius:50%; background:#1F8A5B; animation:dashCheck 14s linear infinite; animation-delay:${src.d}s;`)}><svg width="6" height="6" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                    </span>
                    {src.label}
                  </span>
                ))}
              </div>
            </div>

            
            <div style={s(`padding:12px 16px 0;`)}>
              <div style={s(`font-size:var(--mock-sm); font-weight:700; letter-spacing:0.03em; text-transform:uppercase; color:var(--ink-faint);`)}>Финансы под контролем</div>
              {/* Каждая цифра существует в двух версиях: они сменяют друг друга
                  после «пересчёта», поэтому дашборд буквально меняется. */}
              <div style={s(`display:flex; gap:8px; margin-top:8px;`)}>
                {[
                  { label: 'Доход', bg: '#EBF7F0', bd: '#C7EAD5', lc: '#1F8A5B', vc: '#166F49', a: '₽2,42M', b: '₽2,68M' },
                  { label: 'Расход', bg: '#FBECE7', bd: '#F3D3C6', lc: '#D9480F', vc: '#B23A0C', a: '₽1,11M', b: '₽1,17M' },
                  { label: 'Прибыль', bg: '#E9F1FF', bd: '#CADDFB', lc: '#155EEF', vc: '#0E4FD1', a: '₽1,31M', b: '₽1,51M', up: '▲ 18%', up2: '▲ 24%' },
                ].map((m) => (
                  <div key={m.label} style={s(`flex:1; min-width:0; background:${m.bg}; border:1px solid ${m.bd}; border-radius:10px; padding:8px 10px;`)}>
                    <div style={s(`font-size:var(--mock-xs); font-weight:700; text-transform:uppercase; letter-spacing:0.03em; color:${m.lc};`)}>{m.label}</div>
                    <div style={s(`position:relative; height:19px; margin-top:2px;`)}>
                      <div style={s(`position:absolute; left:0; top:0; white-space:nowrap; font-family:monospace; font-size:var(--t14); font-weight:800; color:${m.vc}; animation:dashValA 14s linear infinite;`)}>{m.a}{m.up ? <span style={s(`font-size:var(--mock-sm); color:#1F8A5B;`)}> {m.up}</span> : null}</div>
                      <div style={s(`position:absolute; left:0; top:0; white-space:nowrap; font-family:monospace; font-size:var(--t14); font-weight:800; color:${m.vc}; animation:dashValB 14s linear infinite;`)}>{m.b}{m.up2 ? <span style={s(`font-size:var(--mock-sm); color:#1F8A5B;`)}> {m.up2}</span> : null}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={s(`display:flex; height:6px; margin-top:8px; border-radius:3px; overflow:hidden; background:#EEF0F2;`)}>
                <div style={s(`width:54%; background:linear-gradient(90deg,#1F8A5B,#25A869); transform-origin:left; animation:dashSplit 14s cubic-bezier(.2,.7,.3,1) infinite;`)}></div>
                <div style={s(`width:46%; background:linear-gradient(90deg,#F0A27E,#D9480F); transform-origin:left; animation:dashSplit 14s cubic-bezier(.2,.7,.3,1) infinite; animation-delay:0.2s;`)}></div>
              </div>
            </div>

            
            <div style={s(`flex:1; display:${v.analyticsChartsDisplay}; gap:12px; padding:14px 16px; min-height:0;`)}>
              <div style={s(`flex:1; display:flex; flex-direction:column; background:#FAFAF8; border:1px solid #EEF0F2; border-radius:11px; padding:11px; min-width:0;`)}>
                <div style={s(`font-size:var(--mock-sm); font-weight:700; color:var(--ink-soft);`)}>Выручка по месяцам</div>
                {/* Столбцы отрастают заново на каждом прогоне — видно, что
                    выручка пересчиталась, а не нарисована один раз. */}
                <div style={s(`flex:1; display:flex; align-items:flex-end; gap:6px; margin-top:10px;`)}>
                  {[
                    { h: 40, d: 0 }, { h: 58, d: 0.14 }, { h: 48, d: 0.28 }, { h: 74, d: 0.42 },
                    { h: 95, d: 0.56, last: true },
                  ].map((b, i) => (
                    <div key={i} style={s(`flex:1; height:${b.h}%; background:${b.last ? 'linear-gradient(135deg,#12A5E0,#155EEF)' : 'linear-gradient(#F0A27E,#D9480F)'}; border-radius:4px 4px 0 0; transform-origin:bottom; animation:mkRiseLoop 14s cubic-bezier(.2,.7,.3,1) infinite; animation-delay:${b.d}s;`)}></div>
                  ))}
                </div>
              </div>
              <div style={s(`flex:1; display:flex; flex-direction:column; background:#FAFAF8; border:1px solid #EEF0F2; border-radius:11px; padding:11px; min-width:0;`)}>
                <div style={s(`font-size:var(--mock-sm); font-weight:700; color:var(--ink-soft);`)}>Источники сделок</div>
                <div style={s(`flex:1; display:flex; align-items:center; justify-content:center; gap:10px;`)}>
                  <div style={s(`width:66px; height:66px; border-radius:50%; background:conic-gradient(#155EEF 0turn 0.42turn, #12A5E0 0.42turn 0.68turn, #B8860B 0.68turn 0.86turn, #C0334A 0.86turn 1turn); animation:dashDonut 14s cubic-bezier(.2,.9,.3,1) infinite; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}>
                    <div style={s(`position:relative; width:38px; height:38px; border-radius:50%; background:#FAFAF8; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:var(--mock-11); font-weight:800; color:var(--ink);`)}>
                      <span style={s(`position:absolute; animation:dashValA 14s linear infinite;`)}>1240</span>
                      <span style={s(`position:absolute; animation:dashValB 14s linear infinite;`)}>1312</span>
                    </div>
                  </div>
                  <div style={s(`display:flex; flex-direction:column; gap:5px;`)}>
                    <div style={s(`display:flex; align-items:center; gap:5px; animation:dashLegend 14s linear infinite;`)}><span style={s(`width:7px; height:7px; border-radius:2px; background:#155EEF;`)}></span><span style={s(`font-size:var(--mock-xs); color:var(--ink-soft);`)}>CRM 42%</span></div>
                    <div style={s(`display:flex; align-items:center; gap:5px; animation:dashLegend 14s linear infinite; animation-delay:0.1s;`)}><span style={s(`width:7px; height:7px; border-radius:2px; background:#12A5E0;`)}></span><span style={s(`font-size:var(--mock-xs); color:var(--ink-soft);`)}>Сайт 26%</span></div>
                    <div style={s(`display:flex; align-items:center; gap:5px; animation:dashLegend 14s linear infinite; animation-delay:0.2s;`)}><span style={s(`width:7px; height:7px; border-radius:2px; background:#B8860B;`)}></span><span style={s(`font-size:var(--mock-xs); color:var(--ink-soft);`)}>1С 18%</span></div>
                    <div style={s(`display:flex; align-items:center; gap:5px;`)}><span style={s(`width:7px; height:7px; border-radius:2px; background:#C0334A;`)}></span><span style={s(`font-size:var(--mock-xs); color:var(--ink-soft);`)}>Звонки 14%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
        </div>

        <div style={s(`display:flex; align-items:center; justify-content:center; gap:14px; margin-top:18px; flex-wrap:wrap;`)}>
          <button type="button" className="swipe-btn" onClick={v.sliderPrev} disabled={v.sliderAtStart} aria-label="Предыдущий экран" style={s(`opacity:${v.sliderAtStart ? 0.4 : 1}; cursor:${v.sliderAtStart ? 'default' : 'pointer'};`)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </button>

          <div style={s(`display:flex; align-items:center; gap:7px;`)}>
            {(v.sliderDots||[]).map((d, i) => (
              <button key={i} type="button" className="swipe-dot" aria-current={d.current} aria-label={'Экран ' + (i + 1) + ': ' + d.label} onClick={d.onClick}></button>
            ))}
          </div>

          <button type="button" className="swipe-btn" onClick={v.sliderNext} disabled={v.sliderAtEnd} aria-label="Следующий экран" style={s(`opacity:${v.sliderAtEnd ? 0.4 : 1}; cursor:${v.sliderAtEnd ? 'default' : 'pointer'};`)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </button>

          <button type="button" className="swipe-btn" onClick={v.sliderToggleAuto} aria-label={v.sliderAutoLabel} title={v.sliderAutoLabel} style={s(`width:34px; height:34px;`)}>
            {v.sliderAuto
              ? <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor"></rect><rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor"></rect></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.6v12.8L19 12 8 5.6z" fill="currentColor"></path></svg>}
          </button>

          <span aria-live="polite" style={s(`font-family:monospace; font-size:var(--mock-11); color:var(--ink-faint); flex-basis:100%; text-align:center;`)}>// экран {v.sliderPosLabel} — листайте свайпом или стрелками</span>
        </div>

      </div>
    </div>
  </section>

  <section id="services" data-screen-label="Services" style={s(`position:relative; padding:${v.servicesPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal>
      <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Услуги</div>
      <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.servicesH2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink); white-space:${v.servicesH2Wrap};`)}>С какой бы точки вы ни начали — мы ведём к результату</h2>
      <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:680px;`)}>Работаем в двух направлениях: разворачиваем Битрикс24 с нуля или усиливаем то, что уже работает.</p>
    </div>

    <div style={s(`display:${v.forkConnectorDisplay}; align-items:center; margin-top:72px;`)}>
      <div style={s(`flex:1; height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px);`)}></div>
      <div style={s(`flex-shrink:0; font-size:var(--t13); font-weight:600; color:var(--ink-soft); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:9px 20px; margin:0 18px; white-space:nowrap;`)}>Ваш бизнес сегодня</div>
      <div style={s(`flex:1; height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px);`)}></div>
    </div>

    <div data-reveal-children="130" style={s(`display:grid; grid-template-columns:${v.servicesColumns}; gap:32px; margin-top:24px; align-items:stretch;`)}>
      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(26px) saturate(180%); -webkit-backdrop-filter:blur(26px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:48px; box-shadow:0 24px 48px -20px rgba(20,23,28,0.22), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-size:var(--t13); font-weight:700; color:var(--blue);`)}>Если Битрикс24 ещё нет</div>
        <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:25px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Интеграция Битрикс24</h3>
        <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Внедряем систему под ключ: от аудита процессов до полной настройки CRM под задачи именно вашего бизнеса.</p>
        <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:26px;`)}>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink);`)}>Настройка процессов и воронок</span></div>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink);`)}>Интеграции с сайтом, телефонией, сервисами</span></div>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink);`)}>Перенос данных и обучение команды</span></div>
        </div>
        <a href="/bitrix24" style={s(`margin-top:auto; padding-top:28px; display:inline-flex; align-items:center; gap:8px; font-size:var(--t15); font-weight:600; color:var(--ink); text-decoration:none;`)}><span style={s(`border-bottom:1px solid var(--ink); padding-bottom:2px;`)}>Подробнее о внедрении →</span></a>
      </div>

      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(26px) saturate(180%); -webkit-backdrop-filter:blur(26px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:48px; box-shadow:0 24px 48px -20px rgba(20,23,28,0.22), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-size:var(--t13); font-weight:700; color:var(--violet);`)}>Если Битрикс24 уже работает</div>
        <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:25px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Поддержка Битрикс24</h3>
        <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Сопровождаем систему, которая уже в работе: от текущих задач и техподдержки до сложных доработок и апгрейдов.</p>
        <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:26px;`)}>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink);`)}>Техническая поддержка и SLA</span></div>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink);`)}>Доработки и нестандартные сценарии</span></div>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink);`)}>Аудит и оптимизация текущей настройки</span></div>
        </div>
        <a href="/bitrix24#sla" style={s(`margin-top:auto; padding-top:28px; display:inline-flex; align-items:center; gap:8px; font-size:var(--t15); font-weight:600; color:var(--ink); text-decoration:none;`)}><span style={s(`border-bottom:1px solid var(--ink); padding-bottom:2px;`)}>Поддержка и SLA →</span></a>
      </div>
    </div>
  </section>

  <section id="ai" data-screen-label="AI" style={s(`position:relative; background:var(--ink); padding:${v.aiPad}; overflow:hidden;`)}>
    <div style={s(`position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:760px; height:760px; border-radius:50%; background:var(--grad); opacity:0.2; filter:blur(130px); pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; max-width:var(--wrap); margin:0 auto; padding:${v.aiInnerPad};`)}>
      <div data-reveal style={s(`max-width:680px;`)}>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; display:inline-block;`)}>Внедрение ИИ</div>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(32px,4vw,46px); line-height:1.14; letter-spacing:-0.02em; margin:16px 0 0; color:#fff;`)}>ИИ, который берёт на себя реальную работу</h2>
        <p style={s(`font-size:var(--t18); line-height:1.6; color:rgba(255,255,255,0.65); margin:20px 0 0;`)}>Не пилотный проект ради галочки — рабочие ИИ-системы, встроенные в процессы бизнеса и Битрикс24.</p>
      </div>

      <div data-reveal-children="90" style={s(`display:grid; grid-template-columns:${v.aiColumns}; margin-top:80px; background:linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(255,255,255,0.16); border-radius:24px; overflow:hidden; box-shadow:0 24px 60px -20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);`)}>
        <div style={s(`padding:${v.aiCardPad1}; border-right:${v.aiDividerV}; border-bottom:${v.aiDividerH};`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:rgba(255,255,255,0.32); margin-top:24px;`)}>01</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:21px; margin:16px 0 0; color:#fff;`)}>ИИ-агенты для процессов</h3>
          <p style={s(`font-size:var(--t15); line-height:1.65; color:rgba(255,255,255,0.6); margin:12px 0 0;`)}>Проектируем и внедряем агентов, которые ведут сделки, обрабатывают заявки, отвечают клиентам и берут на себя рутину в CRM и за её пределами.</p>
        </div>
        <div style={s(`padding:${v.aiCardPad2}; border-right:${v.aiDividerV}; border-bottom:${v.aiDividerH};`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:rgba(255,255,255,0.32); margin-top:24px;`)}>02</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:21px; margin:16px 0 0; color:#fff;`)}>Карточки товаров с ИИ</h3>
          <p style={s(`font-size:var(--t15); line-height:1.65; color:rgba(255,255,255,0.6); margin:12px 0 0;`)}>ИИ сам заполняет карточки товаров на сайте: подбирает фотографии, пишет описания и SEO-тексты. Каталог остаётся полным и единообразным без ручной рутины.</p>
        </div>
        <div style={s(`padding:${v.aiCardPad2}; border-right:${v.aiDividerV}; border-bottom:${v.aiDividerH};`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:rgba(255,255,255,0.32); margin-top:24px;`)}>03</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:21px; margin:16px 0 0; color:#fff;`)}>Аналитика и отчётность</h3>
          <p style={s(`font-size:var(--t15); line-height:1.65; color:rgba(255,255,255,0.6); margin:12px 0 0;`)}>Автоматизируем сбор данных и построение отчётов: ИИ считает метрики, находит паттерны и объясняет их простым языком.</p>
        </div>
        <div style={s(`padding:${v.aiCardPad3};`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:rgba(255,255,255,0.32); margin-top:24px;`)}>04</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:21px; margin:16px 0 0; color:#fff;`)}>ИИ везде, где даёт результат</h3>
          <p style={s(`font-size:var(--t15); line-height:1.65; color:rgba(255,255,255,0.6); margin:12px 0 0;`)}>Внедряем точечно: там, где это реально ускоряет процессы и снижает нагрузку на команду — без переусложнения ради технологии самой по себе.</p>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-top:36px;`)}>
        <p style={s(`font-size:var(--t15); color:rgba(255,255,255,0.55); margin:0; max-width:calc(560px * var(--t-scale));`)}>Сценарии по ролям, кейсы и ответы на частые вопросы — на отдельной странице об ИИ-решениях.</p>
        <a className="mnfx10" href="/ai" style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:var(--ink); background:#fff; border:none; padding:13px 28px; border-radius:999px; cursor:pointer; text-decoration:none; white-space:nowrap; transition:transform 0.2s ease;`)}>Все сценарии ИИ →</a>
      </div>

      {/* Живая сцена работы агента. Раньше стояла на первом экране; по ТЗ
          первый экран отдан форме заявки, а демо — здесь, среди описания
          ИИ-решений, где оно объясняет, а не отвлекает. Разметка и таймеры
          перенесены как есть (пауза вне вьюпорта через observeInView). */}
      <div data-reveal style={s(`max-width:460px; margin:72px auto 0;`)}>
        <div
          ref={v.heroSceneRef}
          className="fxpause"
          role="group"
          aria-roledescription="карусель"
          aria-label="Сцены работы ИИ-агента"
          style={s(`margin-top:56px; position:relative; width:100%; max-width:460px;`)}
        >
          <div {...v.heroSwipe} ref={v.heroTrackRef} className="carousel-drag" style={s(`position:relative; touch-action:pan-y;`)}>
            <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(26px) saturate(180%); -webkit-backdrop-filter:blur(26px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; overflow:hidden; box-shadow:0 40px 70px -24px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9); ${v.entranceCard}`)}>

              <div style={s(`display:flex; align-items:center; gap:8px; padding:0 16px; height:44px; border-bottom:1px solid var(--line); background:#FBFBF9;`)}>
                <span style={s(`width:8px; height:8px; border-radius:50%; background:#E2E1DC;`)}></span>
                <span style={s(`width:8px; height:8px; border-radius:50%; background:#E2E1DC;`)}></span>
                <span style={s(`width:8px; height:8px; border-radius:50%; background:#E2E1DC;`)}></span>
                <span style={s(`margin-left:auto; font-size:var(--mock-12); font-weight:600; color:var(--ink-soft); display:flex; align-items:center; gap:6px;`)}>
                  <span style={s(`width:7px; height:7px; border-radius:50%; background:#9DCF00; flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
                  ИИ-агент · активен
                </span>
              </div>

              <div style={s(`padding:26px 24px 24px; display:flex; flex-direction:column; gap:22px;`)}>

                <div aria-live="polite" style={s(`text-align:center;`)}>
                  <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t16); color:var(--ink); transition:opacity 0.2s ease;`)}>{v.activeRoleLabel}</div>
                  <div style={s(`font-size:var(--mock-12); color:var(--ink-faint); margin-top:4px; max-width:230px; margin-left:auto; margin-right:auto;`)}>{v.activeRoleDesc}</div>
                </div>

                <div style={s(`position:relative; height:134px;`)}>
                  <div style={s(`position:absolute; left:6%; top:5px; width:14px; height:11px; background:var(--ink-faint); border-radius:2px;`)}></div>
                  <div style={s(`position:absolute; left:13%; top:10px; width:5px; height:104px; background:var(--ink-faint); border-radius:2px;`)}></div>
                  <div style={s(`position:absolute; left:8%; width:80%; top:8px; height:5px; background:var(--ink-faint); border-radius:2px;`)}></div>
                  <div style={s(`position:absolute; left:5%; right:5%; top:120px; height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px);`)}></div>

                  <div style={s(`position:absolute; left:24%; bottom:14px; width:22px; height:13px; background:var(--line); border-radius:3px; transform:translateX(-50%);`)}></div>
                  <div style={s(`position:absolute; left:24%; bottom:1px; width:22px; height:13px; background:var(--line); border-radius:3px; transform:translateX(-50%);`)}></div>

                  <div style={s(`position:absolute; left:${v.trolleyLeftPct}%; top:0; transform:translateX(-50%); transition:left 0.8s cubic-bezier(.4,0,.2,1); display:flex; flex-direction:column; align-items:center; z-index:3;`)}>
                    <div style={s(`width:22px; height:17px; margin-top:1px; border-radius:5px; background:var(--grad); box-shadow:0 6px 14px -4px rgba(21,94,239,0.45); display:flex; align-items:center; justify-content:center; gap:4px; flex-shrink:0;`)}>
                      <span style={s(`width:4px; height:4px; border-radius:50%; background:#fff;`)}></span>
                      <span style={s(`width:4px; height:4px; border-radius:50%; background:#fff;`)}></span>
                    </div>
                    <div style={s(`width:2px; height:${v.cableHeightPx}px; background:var(--ink-faint); transition:height 0.5s ease;`)}></div>
                    <div style={s(`width:12px; height:11px; border-radius:0 0 6px 6px; border:2px solid var(--ink-soft); border-top:none; background:var(--paper); margin-top:-1px; flex-shrink:0;`)}></div>
                    {(v.isCarrying) && (<>
                      <div style={s(`width:22px; height:20px; border-radius:6px; background:${v.carryColorCss}; box-shadow:0 8px 16px -4px rgba(20,23,28,0.35); margin-top:1px;`)}></div>
                    </>)}
                  </div>

                  <div style={s(`position:absolute; left:78%; bottom:1px; transform:translateX(-50%); display:flex; flex-direction:column-reverse; gap:2px; z-index:2;`)}>
                    {(v.buildingBlocks||[]).map((blk, $index) => (<React.Fragment key={$index}>
                      <div style={s(`width:28px; height:14px; border-radius:3px; background:${blk}; box-shadow:0 2px 5px rgba(20,23,28,0.18);`)}></div>
                    </React.Fragment>))}
                  </div>
                </div>

                {/* Роли кликабельны: можно сразу перейти к нужной сцене,
                    не дожидаясь автосмены. */}
                <div style={s(`display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px;`)}>
                  {[v.role0, v.role1, v.role2, v.role3].map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={r.onClick}
                      aria-pressed={r.current}
                      aria-label={'Показать сцену: ' + r.label}
                      style={s(`display:flex; flex-direction:column; align-items:center; gap:6px; padding:10px 4px; border-radius:12px; background:${r.bg}; border:1px solid ${r.border}; transform:${r.transform}; opacity:${r.opacity}; box-shadow:${r.shadow}; cursor:pointer; font-family:var(--font-inter),sans-serif; transition:transform 0.35s cubic-bezier(.16,1,.3,1), opacity 0.35s ease, background 0.35s ease, border-color 0.35s ease;`)}
                    >
                      <div style={s(`width:7px; height:7px; border-radius:50%; background:${r.dot};`)}></div>
                      <div style={s(`font-size:var(--mock-11); font-weight:700; color:${r.textColor}; text-align:center; line-height:1.2;`)}>{r.label}</div>
                    </button>
                  ))}
                </div>

                <div style={s(`display:flex; gap:10px;`)}>
                  <div style={s(`flex:1; background:#F7F7F5; border-radius:12px; padding:12px 12px;`)}>
                    <div style={s(`font-family:monospace; font-size:var(--mock-xs); letter-spacing:0.04em; color:var(--ink-faint); text-transform:uppercase;`)}>Заявок обработано</div>
                    <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t18); margin-top:4px; color:var(--ink);`)}>{v.metricLeads}</div>
                  </div>
                  <div style={s(`flex:1; background:#F7F7F5; border-radius:12px; padding:12px 12px;`)}>
                    <div style={s(`font-family:monospace; font-size:var(--mock-xs); letter-spacing:0.04em; color:var(--ink-faint); text-transform:uppercase;`)}>Часов сэкономлено</div>
                    <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t18); margin-top:4px; color:var(--ink);`)}>{v.metricHours}</div>
                  </div>
                  <div style={s(`flex:1; background:#F7F7F5; border-radius:12px; padding:12px 12px;`)}>
                    <div style={s(`font-family:monospace; font-size:var(--mock-xs); letter-spacing:0.04em; color:var(--ink-faint); text-transform:uppercase;`)}>Точность</div>
                    <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t18); margin-top:4px; color:var(--ink);`)}>{v.metricAccuracy}</div>
                  </div>
                </div>

                <div>
                  <div style={s(`position:relative; height:30px;`)}>
                    <div style={s(`position:absolute; left:50%; top:0; width:1px; height:10px; background:var(--line);`)}></div>
                    <div style={s(`position:absolute; left:25%; right:25%; top:10px; height:1px; background:var(--line);`)}></div>
                    <div style={s(`position:absolute; left:25%; top:10px; width:1px; height:14px; background:var(--line);`)}></div>
                    <div style={s(`position:absolute; left:75%; top:10px; width:1px; height:14px; background:var(--line);`)}></div>
                    <div style={s(`position:absolute; width:7px; height:7px; border-radius:50%; background:${v.pulseColor}; box-shadow:0 0 10px ${v.pulseColor}; transform:translate(-50%,-50%); left:${v.pulseLeft}; top:${v.pulseTop}; opacity:${v.pulseOpacity}; transition:${v.pulseTransition}; z-index:2;`)}></div>
                  </div>
                  <div style={s(`display:flex; justify-content:space-between; gap:12px;`)}>
                    <div style={s(`flex:1; display:flex; align-items:center; gap:8px; background:${v.chipB24Bg}; border:1px solid ${v.chipB24Border}; border-radius:10px; padding:8px 10px; transition:background 0.35s ease, border-color 0.35s ease;`)}>
                      <div style={s(`width:20px; height:20px; border-radius:6px; background:repeating-linear-gradient(45deg, #ECEBE7, #ECEBE7 3px, #F6F6F4 3px, #F6F6F4 6px); border:1px dashed #C9CDD3; flex-shrink:0;`)}></div>
                      <div>
                        <div style={s(`font-size:var(--mock-11); font-weight:700; color:var(--ink);`)}>Битрикс24</div>
                        <div style={s(`font-size:var(--mock-xs); color:${v.chipB24StatusColor}; transition:color 0.35s ease;`)}>{v.chipB24Status}</div>
                      </div>
                    </div>
                    <div style={s(`flex:1; display:flex; align-items:center; gap:8px; background:${v.chipExtBg}; border:1px solid ${v.chipExtBorder}; border-radius:10px; padding:8px 10px; transition:background 0.35s ease, border-color 0.35s ease;`)}>
                      <div style={s(`width:20px; height:20px; border-radius:6px; background:var(--grad); opacity:0.75; flex-shrink:0;`)}></div>
                      <div>
                        <div style={s(`font-size:var(--mock-11); font-weight:700; color:var(--ink);`)}>Без Битрикс24</div>
                        <div style={s(`font-size:var(--mock-xs); color:${v.chipExtStatusColor}; transition:color 0.35s ease;`)}>{v.chipExtStatus}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Управление сценой: стрелки, точки и пауза. Раньше сцена
              переключалась сама каждые 4,6 с — дочитать карточку роли было
              невозможно. Теперь листается пальцем и кнопками, а автопоказ
              выключается при первом же ручном действии. */}
          <div style={s(`display:flex; align-items:center; justify-content:center; gap:14px; margin-top:18px;`)}>
            <button type="button" className="swipe-btn" onClick={v.heroPrev} disabled={v.heroAtStart} aria-label="Предыдущая сцена" style={s(`opacity:${v.heroAtStart ? 0.4 : 1}; cursor:${v.heroAtStart ? 'default' : 'pointer'};`)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>

            <div style={s(`display:flex; align-items:center; gap:7px;`)}>
              {[v.role0, v.role1, v.role2, v.role3].map((r, i) => (
                <button key={i} type="button" className="swipe-dot" aria-current={r.current} aria-label={'Сцена ' + (i + 1) + ': ' + r.label} onClick={r.onClick}></button>
              ))}
            </div>

            <button type="button" className="swipe-btn" onClick={v.heroNext} disabled={v.heroAtEnd} aria-label="Следующая сцена" style={s(`opacity:${v.heroAtEnd ? 0.4 : 1}; cursor:${v.heroAtEnd ? 'default' : 'pointer'};`)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </button>

            <button type="button" className="swipe-btn" onClick={v.heroToggleAuto} aria-label={v.heroAutoLabel} title={v.heroAutoLabel} style={s(`width:34px; height:34px;`)}>
              {v.heroAuto
                ? <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor"></rect><rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor"></rect></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.6v12.8L19 12 8 5.6z" fill="currentColor"></path></svg>}
            </button>
          </div>

          <div style={s(`font-size:var(--t13); color:rgba(255,255,255,0.55); margin-top:14px; text-align:center;`)}>{v.heroPosLabel} · листайте свайпом или стрелками</div>
        </div>
      </div>

    </div>
  </section>

  {/* Отдельный продукт, а не услуга: генератор карточек продаётся сам по себе.
      Ссылка пока ведёт на разбор с цифрами внутри /ai — как появится своя
      страница, здесь меняется один href. Битой ссылки в индексе не будет. */}
  <section data-screen-label="Продукт — генератор карточек" style={s(`padding:0 ${v.padX}; max-width:var(--wrap); margin:0 auto;`)}>
    <a className="mnfx10" data-reveal href="/ai#content" style={s(`display:grid; grid-template-columns:${v.cols2}; gap:28px; align-items:center; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; text-decoration:none; position:relative; overflow:hidden; box-shadow:0 30px 60px -34px rgba(20,23,28,0.26), inset 0 1px 1px rgba(255,255,255,0.9); transition:transform 0.25s ease;`)}>
      <span aria-hidden="true" style={s(`position:absolute; top:-140px; right:-100px; width:360px; height:360px; border-radius:50%; background:var(--grad); opacity:0.12; filter:blur(90px); pointer-events:none;`)}></span>

      <span style={s(`position:relative; z-index:1; display:block; min-width:0;`)}>
        <span style={s(`display:inline-flex; align-items:center; gap:8px; font-family:monospace; font-size:var(--mock-12); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#1F8A5B; background:#EBF7F0; border-radius:999px; padding:5px 12px;`)}>
          <span style={s(`width:6px; height:6px; border-radius:50%; background:#1F8A5B; flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>Готовый продукт
        </span>
        <span style={s(`display:block; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(21px,2.6vw,28px); line-height:1.2; letter-spacing:-0.02em; color:var(--ink); margin-top:14px;`)}>ИИ-генератор карточек товаров</span>
        <span style={s(`display:block; font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin-top:12px; max-width:calc(560px * var(--t-scale));`)}>Отдельное решение, которое мы продаём как продукт: по названию и прайсу заполняет карточку целиком — характеристики, продающее описание, SEO-текст, — само находит фото и проверяет его ИИ-зрением. Работает в боевом интернет-магазине стройматериалов.</span>
      </span>

      <span style={s(`position:relative; z-index:1; display:block; min-width:0;`)}>
        <span style={s(`display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:10px;`)}>
          {[
            ['19 763', 'карточки за месяц'],
            ['1 557/ч', 'пиковая скорость'],
            ['98,6%', 'без ручных правок'],
            ['~25 с', 'на одну карточку'],
          ].map(([n, l]) => (
            <span key={l} style={s(`display:block; background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:14px 16px;`)}>
              <span style={s(`display:block; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; color:var(--ink);`)}>{n}</span>
              <span style={s(`display:block; font-size:var(--mock-12); color:var(--ink-faint); margin-top:3px;`)}>{l}</span>
            </span>
          ))}
        </span>
        <span style={s(`display:inline-flex; align-items:center; gap:8px; font-size:var(--t15); font-weight:600; color:var(--ink); margin-top:18px;`)}>
          <span style={s(`border-bottom:1px solid var(--ink); padding-bottom:2px;`)}>Как это работает</span>
          <span aria-hidden="true">→</span>
        </span>
      </span>
    </a>
  </section>

  <section id="why" data-screen-label="Why us" style={s(`padding:${v.whyPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.whyColumns}; gap:${v.whyGap};`)}>
      <div>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>Почему мы</div>
        <p style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:clamp(26px,3vw,32px); line-height:1.35; letter-spacing:-0.01em; margin:20px 0 0; color:var(--ink);`)}>Мы работаем как расширение вашей команды — а не подрядчик на разовый проект.</p>
      </div>
      <div style={s(`display:flex; flex-direction:column;`)}>
        <div style={s(`display:flex; gap:24px; padding:26px 0; border-top:1px solid var(--line);`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--ink-faint); flex-shrink:0; width:26px;`)}>01</div>
          <div><div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink);`)}>Статус</div><div style={s(`font-size:var(--t15); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Сертифицированный интегратор Битрикс24: внедряем, дорабатываем и поддерживаем систему как основной профиль работы, а не как одну услугу из списка.</div></div>
        </div>
        <div style={s(`display:flex; gap:24px; padding:26px 0; border-top:1px solid var(--line);`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--ink-faint); flex-shrink:0; width:26px;`)}>02</div>
          <div><div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink);`)}>Опыт</div><div style={s(`font-size:var(--t15); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Берёмся за нетиповые и сложные внедрения там, где решения «из коробки» уже не работают.</div></div>
        </div>
        <div style={s(`display:flex; gap:24px; padding:26px 0; border-top:1px solid var(--line);`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--ink-faint); flex-shrink:0; width:26px;`)}>03</div>
          <div><div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink);`)}>Формат</div><div style={s(`font-size:var(--t15); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Одна команда для CRM и ИИ: не два разных подрядчика, а один связный процесс.</div></div>
        </div>
        <div style={s(`display:flex; gap:24px; padding:26px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--ink-faint); flex-shrink:0; width:26px;`)}>04</div>
          <div><div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink);`)}>Ответственность</div><div style={s(`font-size:var(--t15); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Сопровождаем результат после запуска, а не закрываем проект актом и пропадаем.</div></div>
        </div>
      </div>
    </div>
  </section>

  <section id="process" data-screen-label="Process" style={s(`padding:${v.processPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:calc(640px * var(--t-scale));`)}>
      <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Как мы работаем</div>
      <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(32px,4vw,46px); line-height:1.14; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Понятный процесс от первого разговора до поддержки</h2>
    </div>

    <div style={s(`display:${v.timelineDesktop};`)}>
      <div style={s(`position:relative; margin-top:100px;`)}>
        <div style={s(`position:absolute; left:0; right:0; top:50%; height:1px; background:var(--line); transform:translateY(-50%);`)}></div>
        <div style={s(`position:relative; display:grid; grid-template-columns:repeat(4,1fr); gap:24px;`)}>

          <div style={s(`position:relative; height:190px;`)}>
            <div style={s(`position:absolute; bottom:calc(50% + 22px); left:0; right:24px;`)}>
              <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--blue);`)}>01</div>
              <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:6px;`)}>Аудит</div>
              <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Разбираемся в процессах бизнеса и текущей системе — находим, что действительно нужно менять.</div>
            </div>
            <div style={s(`position:absolute; top:50%; left:0; width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--blue); transform:translate(0,-50%); z-index:1;`)}></div>
          </div>

          <div style={s(`position:relative; height:190px;`)}>
            <div style={s(`position:absolute; top:calc(50% + 22px); left:0; right:24px;`)}>
              <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet);`)}>02</div>
              <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:6px;`)}>Решение</div>
              <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Проектируем архитектуру: CRM, интеграции, ИИ-агенты — конкретный план, не абстракция.</div>
            </div>
            <div style={s(`position:absolute; top:50%; left:0; width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--violet); transform:translate(0,-50%); z-index:1;`)}></div>
          </div>

          <div style={s(`position:relative; height:190px;`)}>
            <div style={s(`position:absolute; bottom:calc(50% + 22px); left:0; right:24px;`)}>
              <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--blue);`)}>03</div>
              <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:6px;`)}>Внедрение</div>
              <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Настраиваем и запускаем — с обучением команды и без остановки текущей работы.</div>
            </div>
            <div style={s(`position:absolute; top:50%; left:0; width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--blue); transform:translate(0,-50%); z-index:1;`)}></div>
          </div>

          <div style={s(`position:relative; height:190px;`)}>
            <div style={s(`position:absolute; top:calc(50% + 22px); left:0; right:0;`)}>
              <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet);`)}>04</div>
              <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:6px;`)}>Поддержка</div>
              <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Остаёмся на связи: сопровождаем, дорабатываем, расширяем по мере роста бизнеса.</div>
            </div>
            <div style={s(`position:absolute; top:50%; left:0; width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--violet); transform:translate(0,-50%); z-index:1;`)}></div>
          </div>

        </div>
      </div>
    </div>

    <div style={s(`display:${v.timelineMobile};`)}>
      <div style={s(`display:flex; flex-direction:column; margin-top:56px;`)}>
        <div style={s(`display:flex; gap:20px;`)}>
          <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
            <div style={s(`width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--blue); flex-shrink:0;`)}></div>
            <div style={s(`width:1px; flex:1; background:var(--line); margin-top:6px;`)}></div>
          </div>
          <div style={s(`padding-bottom:32px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--blue);`)}>01</div>
            <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:4px;`)}>Аудит</div>
            <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Разбираемся в процессах бизнеса и текущей системе — находим, что действительно нужно менять.</div>
          </div>
        </div>
        <div style={s(`display:flex; gap:20px;`)}>
          <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
            <div style={s(`width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--violet); flex-shrink:0;`)}></div>
            <div style={s(`width:1px; flex:1; background:var(--line); margin-top:6px;`)}></div>
          </div>
          <div style={s(`padding-bottom:32px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet);`)}>02</div>
            <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:4px;`)}>Решение</div>
            <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Проектируем архитектуру: CRM, интеграции, ИИ-агенты — конкретный план, не абстракция.</div>
          </div>
        </div>
        <div style={s(`display:flex; gap:20px;`)}>
          <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
            <div style={s(`width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--blue); flex-shrink:0;`)}></div>
            <div style={s(`width:1px; flex:1; background:var(--line); margin-top:6px;`)}></div>
          </div>
          <div style={s(`padding-bottom:32px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--blue);`)}>03</div>
            <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:4px;`)}>Внедрение</div>
            <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Настраиваем и запускаем — с обучением команды и без остановки текущей работы.</div>
          </div>
        </div>
        <div style={s(`display:flex; gap:20px;`)}>
          <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
            <div style={s(`width:12px; height:12px; border-radius:50%; background:var(--paper); border:3px solid var(--violet); flex-shrink:0;`)}></div>
          </div>
          <div>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet);`)}>04</div>
            <div style={s(`font-size:var(--t17); font-weight:700; color:var(--ink); margin-top:4px;`)}>Поддержка</div>
            <div style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin-top:6px;`)}>Остаёмся на связи: сопровождаем, дорабатываем, расширяем по мере роста бизнеса.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" data-screen-label="Final CTA" style={s(`padding:${v.contactSecPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48)); backdrop-filter:blur(28px) saturate(180%); -webkit-backdrop-filter:blur(28px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:28px; padding:${v.contactPadding}; display:grid; grid-template-columns:${v.contactColumns}; gap:56px; position:relative; overflow:hidden; box-shadow:0 50px 90px -50px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
      <div style={s(`position:absolute; top:-140px; right:-140px; width:420px; height:420px; border-radius:50%; background:var(--grad); opacity:0.08; filter:blur(100px); pointer-events:none;`)}></div>

      <div style={s(`position:relative; z-index:1;`)}>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(30px,3.6vw,42px); letter-spacing:-0.02em; line-height:1.15; color:var(--ink); margin:0;`)}>Обсудим ваш проект?</h2>
        <p style={s(`font-size:var(--t17); line-height:1.6; color:var(--ink-soft); margin:18px 0 0; max-width:calc(420px * var(--t-scale));`)}>Позвоните или напишите напрямую — обсудим интеграцию, поддержку или ИИ без лишних форм и общих фраз.</p>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:36px;`)}>
          <div style={s(`width:26px; height:26px; border-radius:8px; background:repeating-linear-gradient(45deg, #ECEBE7, #ECEBE7 4px, #F6F6F4 4px, #F6F6F4 8px); border:1px dashed #C9CDD3; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:8px; color:#8A8F99; flex-shrink:0;`)}>Б24</div>
          <span style={s(`font-size:var(--t14); font-weight:600; color:var(--ink-soft);`)}>Сертифицированный интегратор Битрикс24</span>
        </div>
      </div>

      <div style={s(`position:relative; z-index:1; display:flex; flex-direction:column; justify-content:center; gap:24px; min-height:260px;`)}>
        <div style={s(`display:flex; flex-direction:column; gap:12px;`)}>
          {/* CTA звал «Позвоните», а телефона на сайте не было вовсе.
              Теперь номер кликабельный и стоит первым. */}
          <a href="tel:+79256777027" onClick={() => ymGoal("phone")} style={s(`display:flex; align-items:center; justify-content:center; gap:10px; font-family:var(--font-manrope),sans-serif; font-size:20px; font-weight:800; letter-spacing:-0.01em; color:var(--ink); background:#fff; border:1px solid var(--line); border-radius:12px; padding:15px 28px; text-decoration:none;`)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={s(`flex-shrink:0;`)} aria-hidden="true"><path d="M6.6 3h3l1.5 4-2 1.4a13 13 0 006.5 6.5l1.4-2 4 1.5v3A2 2 0 0119 19.5 16.5 16.5 0 014.5 5 2 2 0 016.6 3z" fill="var(--blue)"></path></svg>
            +7 925 677-70-27
          </a>
          <a className="mnfx11" href="https://t.me/Terraiib24" target="_blank" rel="noopener" onClick={() => ymGoal("telegram")} style={s(`display:flex; align-items:center; justify-content:center; font-family:var(--font-inter),sans-serif; font-size:var(--t16); font-weight:600; color:#fff; background:var(--grad); border-radius:12px; padding:16px 28px; text-decoration:none; box-shadow:0 10px 24px rgba(21,94,239,0.22); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Написать в Telegram</a>
          <a className="mnfx12" href="https://wa.me/79285288598" target="_blank" rel="noopener" onClick={() => ymGoal("whatsapp")} style={s(`display:flex; align-items:center; justify-content:center; font-family:var(--font-inter),sans-serif; font-size:var(--t16); font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); border-radius:12px; padding:16px 28px; text-decoration:none; transition:border-color 0.2s ease;`)}>Написать в WhatsApp</a>
        </div>
        <div style={s(`font-size:var(--t13); color:var(--ink-faint);`)}>Отвечаем в течение рабочего дня · <a href="/contacts" style={s(`color:var(--ink-soft); text-decoration:none; border-bottom:1px solid var(--line);`)}>почта и реквизиты</a></div>
      </div>
    </div>
  </section>

  {/* Раньше три группы — знак, пять ссылок и реквизиты ИП — стояли одной
      строкой: на 1180–1400px они сходились почти вплотную и все были набраны
      13px серым. Теперь это колонки с заголовками, а реквизиты набраны
      основным цветом текста: для B2B это сигнал доверия, а не сноска. */}
  <footer style={s(`padding:0 ${v.padX} 48px; max-width:var(--wrap); margin:0 auto; border-top:1px solid var(--line); padding-top:44px;`)}>

    <div style={s(`display:grid; grid-template-columns:${v.cols4}; gap:32px 28px;`)}>

      <div>
        <div style={s(`display:flex; align-items:center; gap:10px;`)}>
      <svg width="28" height="28" viewBox="0 0 40 40" style={s(`display:block; flex-shrink:0;`)} aria-hidden="true">
        <defs>
          <linearGradient id="tgF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#155EEF"></stop><stop offset="1" stopColor="#12A5E0"></stop></linearGradient>
          <linearGradient id="tgFV" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#155EEF"></stop><stop offset="1" stopColor="#3BC5EC"></stop></linearGradient>
        </defs>
        <g style={s(`transform-box:view-box; transform-origin:20px 35.6px; animation:tropism 11s ease-in-out infinite;`)}>
          <g style={s(`transform-box:view-box; transform-origin:20px 35.6px; animation:segBase 4.5s ease-in-out infinite;`)}>
            <path d="M20 35.6 C20 32.6 19.8 30 20 27.4" fill="none" stroke="url(#tgFV)" strokeWidth="2.8" strokeLinecap="round"></path>
            <g style={s(`transform-box:view-box; transform-origin:20px 27.4px; animation:segMid 4.5s ease-in-out infinite -1.5s;`)}>
              <path d="M20 27.4 C20.2 24.6 19.7 21.6 20 18.4" fill="none" stroke="url(#tgFV)" strokeWidth="2.5" strokeLinecap="round"></path>
              <g style={s(`transform-box:view-box; transform-origin:20px 23px; animation:nastyL 6.3s ease-in-out infinite;`)}>
                <path d="M20 23.3 C13.7 22.6 9.7 18.4 9.5 12.9 C15.8 12.7 20 16.9 20 23.3 Z" fill="url(#tgF)" opacity="0.92"></path>
              </g>
              <g style={s(`transform-box:view-box; transform-origin:20px 18.4px; animation:segTip 4.5s ease-in-out infinite -3s;`)}>
                <path d="M20 18.4 C20.15 15.6 20.6 13 20.3 10.6" fill="none" stroke="url(#tgFV)" strokeWidth="2.2" strokeLinecap="round"></path>
                <g style={s(`transform-box:view-box; transform-origin:20.2px 18px; animation:nastyR 7.1s ease-in-out infinite -0.4s;`)}>
                  <path d="M20.2 18.8 C26.5 17.9 30.5 13.7 30.9 8.2 C24.6 8.2 20.2 12.4 20.2 18.8 Z" fill="url(#tgF)"></path>
                </g>
                <g style={s(`transform-box:view-box; transform-origin:20.3px 11px; animation:budNod 3.1s ease-in-out infinite;`)}>
                  <path d="M20.3 10.8 C20.1 8.5 21.3 6.9 23.4 6.5 C23.5 8.8 22.3 10.4 20.3 10.8 Z" fill="url(#tgF)"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
          <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t17); color:var(--ink);`)}>ETHOS</span>
        </div>
        <p style={s(`font-size:var(--t14); line-height:1.6; color:var(--ink-soft); margin:12px 0 0; max-width:260px;`)}>
          Сертифицированный интегратор Битрикс24 и разработчик ИИ-агентов для бизнеса.
        </p>
      </div>

      <div>
        <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--ink); margin-bottom:14px;`)}>Услуги</div>
        <div style={s(`display:flex; flex-direction:column; gap:10px;`)}>
          <a href="/bitrix24" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Внедрение Битрикс24</a>
          <a href="/ai" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>ИИ-решения</a>
          <a href="#services" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Поддержка и доработки</a>
          <a href="#process" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Как мы работаем</a>
        </div>
      </div>

      <div>
        <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--ink); margin-bottom:14px;`)}>Контакты</div>
        <div style={s(`display:flex; flex-direction:column; gap:10px;`)}>
          <a href="tel:+79256777027" onClick={() => ymGoal('phone')} style={s(`font-size:var(--t16); font-weight:700; color:var(--ink); text-decoration:none;`)}>+7 925 677-70-27</a>
          <a href="mailto:magomedov_zak_05@mail.ru" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none; overflow-wrap:anywhere;`)}>magomedov_zak_05@mail.ru</a>
          <a href="https://t.me/Terraiib24" target="_blank" rel="noopener" onClick={() => ymGoal('telegram')} style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Telegram</a>
          <a href="/contacts" style={s(`font-size:var(--t14); color:var(--blue); text-decoration:none;`)}>Все контакты и реквизиты</a>
        </div>
      </div>

      <div>
        <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--ink); margin-bottom:14px;`)}>Реквизиты</div>
        <div style={s(`display:flex; flex-direction:column; gap:6px; font-size:var(--t14); line-height:1.6; color:var(--ink);`)}>
          <div>ИП Магомедов Закир Асланович</div>
          <div>ИНН 054210247290</div>
          <div>ОГРНИП 326050000095170</div>
        </div>
      </div>

    </div>

    <div style={s(`display:flex; flex-wrap:wrap; align-items:center; gap:10px 22px; margin-top:36px; padding-top:22px; border-top:1px solid var(--line); font-size:var(--t13); color:var(--ink-soft);`)}>
      <span>© 2026 ETHOS</span>
      <a href="/privacy" style={s(`color:var(--ink-soft); text-decoration:none; border-bottom:1px solid var(--line);`)}>Политика конфиденциальности</a>
    </div>

  </footer>


</div>


      </>
    );
  }
}
