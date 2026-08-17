'use client';
import React from 'react';
import { s, ymGoal, setupHeaderAutoHide } from './_ui';
import { R } from './_responsive';
import BlurImage from './BlurImage';

// Боли по ролям. Порядок = приоритет показа: сверху то, с чем приходят чаще
// и что быстрее окупается. Менять очерёдность — переставить элементы массива,
// нумерация 01…06 проставляется автоматически.
const ROLE_CASES = [
  {
    role: 'Руководитель',
    title: 'Отчёты и контроль',
    text: 'ИИ присылает сводки по продажам, разбирает звонки менеджеров по чек-листу, отвечает на вопросы цифрами из CRM.',
    more: '#analytics',
    result: 'картина бизнеса — без ручных отчётов',
  },
  {
    role: 'Контент',
    title: 'Контент и карточки товаров',
    text: 'ИИ заполняет карточки товаров, пишет описания и SEO-тексты в едином стиле — по прайсу, фото или артикулу.',
    more: '#content',
    result: 'весь каталог описан и находится в поиске',
  },
  {
    role: 'HR и обучение',
    title: 'Онбординг и обучение',
    text: 'Внутренний ИИ-помощник отвечает новичкам на вопросы по продуктам и процессам, ведёт по плану онбординга, подсказывает регламенты — старшие сотрудники не отвлекаются.',
    more: null,
    result: 'новичок выходит на результат быстрее',
  },
  {
    role: 'Бэк-офис',
    title: 'Документы и бэк-офис',
    text: 'ИИ готовит договоры и счета по шаблонам, сверяет реквизиты, разносит первичку, отвечает сотрудникам на вопросы по регламентам компании.',
    more: null,
    result: 'документы за минуты, без ошибок в реквизитах',
  },
  {
    role: 'Продажи',
    title: 'Продажи и обработка заявок',
    text: 'ИИ-агент отвечает на заявки за секунды в любое время, задаёт уточняющие вопросы, называет цены и сроки, готовит КП — и создаёт сделку в CRM с полной историей.',
    more: null,
    result: 'ни одна заявка не ждёт до утра',
  },
  {
    role: 'Поддержка',
    title: 'Поддержка клиентов',
    text: 'ИИ отвечает по базе знаний и статусам заказов: «где моя доставка», «как вернуть», «не работает». Типовые обращения закрывает сам, сложные — передаёт человеку с контекстом.',
    more: null,
    result: 'поддержка не растёт вместе с потоком',
  },
];

// Демо-каталог для анимации «ИИ собирает карточку». Товары другие, чем на
// главной: страницы стоят рядом в навигации, и повтор читался бы как копипаста.
const DEMO_PRODUCTS = [
  {
    imgId: 'ai0',
    img: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=520&q=80',
    cat: 'Инструмент',
    hue: '#D9480F',
    sku: 'арт. DCD-778 · «шурупов. деволт 18в 2акб»',
    name: 'Дрель-шуруповёрт аккумуляторный DeWalt, 18 В, 2 АКБ',
    price: '12 900',
    priceNote: '',
    specs: ['момент до 65 Н·м', 'патрон 13 мм', '2 АКБ 2,0 А·ч'],
    desc: 'Аккумуляторная дрель-шуруповёрт на платформе 18 В: крутящий момент до 65 Н·м и две механические скорости — 0–600 об/мин для закручивания и 0–2000 об/мин для сверления. Быстрозажимной патрон 13 мм, 15 ступеней регулировки момента, подсветка рабочей зоны. В комплекте два аккумулятора 2,0 А·ч и зарядное устройство — смена идёт без простоев.',
  },
  {
    imgId: 'ai1',
    img: 'https://images.unsplash.com/photo-1671022442106-c787685d9fed?auto=format&fit=crop&w=520&q=80',
    cat: 'Металлопрокат',
    hue: '#5A626E',
    sku: 'арт. 20Б1-С245 · «балка двутавр 20 12м»',
    name: 'Балка двутавровая 20Б1, сталь С245, длина 12 м',
    price: '1 490',
    priceNote: 'за м. п.',
    specs: ['высота 200 мм', '21,3 кг/м', 'ГОСТ Р 57837-2017'],
    desc: 'Горячекатаный двутавр с параллельными гранями полок: высота профиля 200 мм, ширина полки 100 мм, масса погонного метра 21,3 кг. Сталь С245 по ГОСТ 27772 сваривается без ограничений и сохраняет вязкость при отрицательных температурах. Стандартная длина 12 м, режем в размер под проект. Отгрузка со склада, сертификат качества на каждую партию.',
  },
  {
    imgId: 'ai2',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=520&q=80',
    cat: 'Компьютеры',
    hue: '#155EEF',
    sku: 'арт. PC-GX770 · «комп игровой ryzen 7 4070»',
    name: 'Системный блок игровой, Ryzen 7 7700X / RTX 4070 / 32 ГБ',
    price: '174 900',
    priceNote: '',
    specs: ['Ryzen 7 7700X, 8 ядер', 'RTX 4070 12 ГБ', '32 ГБ DDR5 · SSD 1 ТБ'],
    desc: 'Процессор AMD Ryzen 7 7700X: 8 ядер, 16 потоков, частота до 5,4 ГГц. Видеокарта GeForce RTX 4070 с 12 ГБ GDDR6X тянет современные игры в разрешении 2K на высоких настройках. Оперативная память 32 ГБ DDR5-5600 двумя модулями, накопитель NVMe SSD 1 ТБ со скоростью чтения до 7000 МБ/с. Блок питания 750 Вт с сертификатом 80 PLUS Gold, корпус с закалённым стеклом и шестью вентиляторами. Гарантия 3 года.',
  },
];

const FXCSS = ".aifx0:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx1:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx2:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx3:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx4:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx5:hover{background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx6:hover{transform:translateY(-1px) !important; box-shadow:0 12px 26px -6px rgba(21,94,239,0.55), inset 0 1px 1px rgba(255,255,255,0.55) !important}\n.aifx7:hover{color:var(--ink) !important}\n.aifx8:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.32) !important}\n.aifx9:hover{border-color:var(--ink) !important}\n.aifx10:hover{transform:translateY(-2px) !important}\n.aifx11:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.32) !important}\n.aifx12:hover{border-color:var(--ink) !important}\n.aifx13:hover{transform:translateY(-3px) !important}\n.aifx14:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.3) !important}\n.aifx15:hover{border-color:var(--ink) !important}";

export default class AiPage extends React.Component {
  // В state больше нет `isMobile`: вся раскладка переехала в CSS-переменные
  // (см. globals.css → «adaptive design tokens»). Состояние здесь только то,
  // что одинаково на сервере и на клиенте, — иначе гидратация ломает вёрстку.
  state = {
    mobileMenuOpen: false,
    mounted: false,
    openFaq: 0,
    // Анимация «ИИ собирает карточку»: подбор фото → посимвольный ввод → готово
    prodIdx: 0,
    prodPhase: 'search',
    prodTyped: 0,
  };

  progressRef = React.createRef();
  headerRef = React.createRef();
  contentRef = React.createRef();
  memRef = React.createRef();

  componentDidMount() {
    this._offHeader = setupHeaderAutoHide(() => this.headerRef.current, () => this.state.mobileMenuOpen);
    // Меню закрываем, когда экран дорос до десктопного макета: это поведение,
    // а не раскладка, поэтому его можно держать в JS.
    this._desktopMq = window.matchMedia('(min-width: 1180px)');
    this._onMqChange = (e) => { if (e.matches) this.setState({ mobileMenuOpen: false }); };
    this._desktopMq.addEventListener('change', this._onMqChange);

    this.mountTimer = setTimeout(() => this.setState({ mounted: true }), 40);

    // Скролл-прогресс + reveal
    this._onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (this.progressRef.current) {
        const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
        this.progressRef.current.style.width = Math.max(0, Math.min(1, y / max)) * 100 + '%';
      }
      if (this._checkReveal) this._checkReveal();
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });

    try { document.documentElement.setAttribute('data-reveal-ready', ''); } catch (e) {}
    this._revealTimer = setTimeout(() => {
      this._revealTargets = [].slice.call(document.querySelectorAll('[data-reveal], [data-reveal-children]'));
      this._checkReveal();
    }, 50);
    this._revealFailsafe = setTimeout(() => {
      (this._revealTargets || []).forEach((el) => el.setAttribute('data-shown', ''));
      this._revealTargets = [];
    }, 10000);

    this._onScroll();

    // Анимация карточки крутится только пока секция на экране: посимвольный
    // ввод — это setState каждые 28 мс, гонять его на всю длинную страницу
    // впустую незачем (батарея на телефоне и лишние рендеры).
    // Ролик «Лента знаний» стартует с нулевого кадра при появлении на экране.
    // Иначе таймлайн крутится с загрузки страницы, и человек, долиставший до
    // секции позже, попадает в случайную точку — в том числе в первые 2,6 с,
    // где полосы времени ещё пустые и блок выглядит сломанным.
    if ('IntersectionObserver' in window && this.memRef.current) {
      this._memIO = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        e.target.setAttribute('data-run', '1');
        this._memIO.disconnect();
      }, { rootMargin: '0px 0px -15% 0px' });
      this._memIO.observe(this.memRef.current);
    } else if (this.memRef.current) {
      this.memRef.current.setAttribute('data-run', '1');
    }

    // Страховка: если наблюдатель по какой-то причине не сработает, ролик
    // останется замороженным на нулевом кадре — а это ровно та «сломанная»
    // картинка, от которой мы уходим. Через 10 секунд запускаем принудительно.
    this._memFailsafe = setTimeout(() => {
      if (this.memRef.current) this.memRef.current.setAttribute('data-run', '1');
    }, 10000);

    if ('IntersectionObserver' in window && this.contentRef.current) {
      this._contentIO = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? this.startProductCycle() : this.stopProductCycle()),
        { rootMargin: '120px' },
      );
      this._contentIO.observe(this.contentRef.current);
    } else {
      this.startProductCycle();
    }
  }

  // ---- Демо «ИИ собирает карточку» ----------------------------------------
  startProductCycle = () => {
    if (this._prodRunning) return;
    this._prodRunning = true;
    this.runProductStep();
  };

  stopProductCycle = () => {
    this._prodRunning = false;
    clearTimeout(this._prodSearch);
    clearTimeout(this._prodNext);
    clearInterval(this._prodType);
  };

  runProductStep() {
    clearTimeout(this._prodSearch); clearTimeout(this._prodNext); clearInterval(this._prodType);
    this.setState({ prodPhase: 'search', prodTyped: 0 });

    this._prodSearch = setTimeout(() => {
      this.setState({ prodPhase: 'type' });
      this._prodType = setInterval(() => {
        this.setState((st) => {
          const full = DEMO_PRODUCTS[st.prodIdx % DEMO_PRODUCTS.length].desc;
          if (st.prodTyped >= full.length) { clearInterval(this._prodType); return { prodPhase: 'done' }; }
          return { prodTyped: Math.min(st.prodTyped + 3, full.length) };
        });
      }, 28);
    }, 1400);

    this._prodNext = setTimeout(() => {
      if (!this._prodRunning) return;
      this.setState((st) => ({ prodIdx: st.prodIdx + 1 }));
      this.runProductStep();
    }, 11000);
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

  componentWillUnmount() {
    if (this._offHeader) this._offHeader();
    if (this._desktopMq) this._desktopMq.removeEventListener('change', this._onMqChange);
    if (this._contentIO) this._contentIO.disconnect();
    if (this._memIO) this._memIO.disconnect();
    clearTimeout(this._memFailsafe);
    this.stopProductCycle();
    window.removeEventListener('scroll', this._onScroll);
    clearTimeout(this.mountTimer);
    clearTimeout(this._revealTimer);
    clearTimeout(this._revealFailsafe);
  }

  entrance(delay) {
    return this.state.mounted
      ? 'opacity:1; transform:translateY(0); transition:transform 0.7s cubic-bezier(.16,1,.3,1) ' + delay + 's;'
      : 'opacity:1; transform:translateY(14px);';
  }

  toggleMobileMenu = () => this.setState(s => ({ mobileMenuOpen: !s.mobileMenuOpen }));
  closeMobileMenu = () => this.setState({ mobileMenuOpen: false });

  renderVals() {
    const { mobileMenuOpen, openFaq, prodIdx, prodPhase, prodTyped } = this.state;

    const prod = DEMO_PRODUCTS[prodIdx % DEMO_PRODUCTS.length];
    const prodBlur = (this.props.productBlur || {})[prod.imgId] || {};
    const prodSearching = prodPhase === 'search';
    const prodKey = 'demo' + prodIdx;

    const vals = {
      prod,
      prodBlur,
      prodKey,
      prodSearching,
      prodDone: prodPhase === 'done',
      prodTypedText: prodSearching ? '' : prod.desc.slice(0, prodTyped),
      prodCaret: prodPhase === 'type' ? 'inline-block' : 'none',
      prodStatus: prodPhase === 'search' ? 'ИИ подбирает фото…' : prodPhase === 'type' ? 'ИИ пишет SEO-описание…' : 'Карточка готова — можно выгружать',
      prodStatusColor: prodPhase === 'done' ? '#1F8A5B' : 'var(--violet)',
      prodBadges: prodPhase === 'done' ? 'flex' : 'none',
      prodStep: (prodIdx % DEMO_PRODUCTS.length) + 1,
      prodTotal: DEMO_PRODUCTS.length,
      contentRef: this.contentRef,
      memRef: this.memRef,
      // Раскладка целиком приходит из CSS-переменных — значения одинаковы
      // при SSR и на клиенте, поэтому гидратация ничего не ломает.
      ...R,
      contactColumns: R.cols2,
      // Раскрытие меню на 0fr→1fr вместо max-height: анимация точно по высоте
      // контента, без «ватного» хвоста и без риска обрезать длинный список.
      mobileMenuRows: mobileMenuOpen ? '1fr' : '0fr',
      mobileMenuOpen,
      toggleMobileMenu: this.toggleMobileMenu,
      closeMobileMenu: this.closeMobileMenu,

      heroPlayState: (true) ? 'running' : 'paused',
      tgHref: 'https://t.me/Terraiib24',
      waHref: 'https://wa.me/79285288598',

      entranceBadge: this.entrance(0),
      entranceH1: this.entrance(0.08),
      entranceP: this.entrance(0.16),
      entranceCta: this.entrance(0.24),
      entranceCard: this.entrance(0.2),

      progressRef: this.progressRef,

      scrollToContact: () => {
        ymGoal('cta_contact'); const el = document.getElementById('contact');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      },
      scrollToContactMobile: () => {
        this.closeMobileMenu();
        ymGoal('cta_contact'); const el = document.getElementById('contact');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }
    };

    for (let i = 0; i < 8; i++) {
      vals['faqRows' + i] = openFaq === i ? '1fr' : '0fr';
      vals['faqIcon' + i] = openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)';
      vals['faqBg' + i] = openFaq === i ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)';
      vals['toggleFaq' + i] = () => this.setState(s => ({ openFaq: s.openFaq === i ? -1 : i }));
    }

    return vals;
  }

  render() {
    const v = this.renderVals();
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: FXCSS }} />


<div style={s(`--bg:#FAFAF8; --paper:#FFFFFF; --ink:#14171C; --ink-soft:#535C69; --ink-faint:#8A8F99; --line:#E7E6E2; --blue:#155EEF; --violet:#12A5E0; --grad:linear-gradient(135deg, var(--blue), var(--violet)); font-family:var(--font-inter),sans-serif; background:var(--bg); color:var(--ink); min-height:100vh; position:relative; isolation:isolate; overflow-x:clip;`)}>

  <div ref={v.progressRef} style={s(`position:fixed; top:0; left:0; height:3px; width:0; z-index:70; background:linear-gradient(90deg, var(--blue), var(--violet)); box-shadow:0 0 14px rgba(21,94,239,0.55); pointer-events:none;`)}></div>

  <div aria-hidden="true" style={s(`position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;`)}>
    <div style={s(`position:absolute; top:-12%; left:-8%; width:55vw; height:55vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(21,94,239,0.5), transparent 68%); filter:blur(80px); animation:driftBlobA 22s ease-in-out infinite alternate;`)}></div>
    <div style={s(`position:absolute; top:10%; right:-14%; width:50vw; height:50vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(18,165,224,0.46), transparent 68%); filter:blur(85px); animation:driftBlobB 27s ease-in-out infinite alternate;`)}></div>
    <div style={s(`position:absolute; bottom:-20%; left:20%; width:54vw; height:54vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(139,92,246,0.4), transparent 70%); filter:blur(95px); animation:driftBlobA 31s ease-in-out infinite alternate;`)}></div>
  </div>

  <header ref={this.headerRef} className="site-header" style={s(`position:sticky; top:14px; z-index:50; margin:14px ${v.padX} 0; display:flex; align-items:center; justify-content:space-between; padding:12px 14px 12px 20px; background:linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.34)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.7); border-radius:22px; box-shadow:0 16px 40px -16px rgba(20,23,28,0.32), inset 0 1px 1px rgba(255,255,255,0.9);`)}>

    <a href="/" style={s(`display:flex; align-items:center; gap:12px; text-decoration:none;`)}>
      <img src="/logo.png" alt="" width="36" height="36" style={s(`display:block; flex-shrink:0;`)} />
      <span style={s(`display:flex; align-items:baseline; gap:8px;`)}>
        <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; color:var(--ink);`)}>ETHOS</span>
        <span style={s(`font-size:12px; font-weight:600; color:var(--ink-faint); white-space:nowrap;`)}>· ИИ-решения</span>
      </span>
    </a>

    <div style={s(`display:${v.navDisplay}; align-items:center; gap:24px;`)}>
      <a className="aifx0" href="#agents" style={s(`font-size:var(--t15); font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Сценарии</a>
      <a className="aifx1" href="#assistant" style={s(`font-size:var(--t15); font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>ИИ-ассистент</a>
      <a className="aifx2" href="#data" style={s(`font-size:var(--t15); font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Ваши данные</a>
      <a className="aifx3" href="#process" style={s(`font-size:var(--t15); font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Внедрение</a>
      <a className="aifx4" href="#faq" style={s(`font-size:var(--t15); font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>FAQ</a>
      <a className="aifx5" href="/bitrix24" style={s(`font-size:var(--t15); font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Битрикс24</a>
      <a href="/ai" aria-current="page" style={s(`font-size:var(--t15); font-weight:600; color:var(--blue); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--blue),var(--blue)); background-repeat:no-repeat; background-position:0 100%; background-size:100% 1.5px; padding-bottom:3px;`)}>ИИ-решения</a>
      <button className="aifx6" onClick={v.scrollToContact} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:#fff; background:linear-gradient(135deg, #155EEF, #12A5E0); border:1px solid rgba(255,255,255,0.22); padding:12px 26px; border-radius:999px; cursor:pointer; box-shadow:0 8px 20px -6px rgba(21,94,239,0.45), inset 0 1px 1px rgba(255,255,255,0.55); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Получить консультацию</button>
    </div>

    <button onClick={v.toggleMobileMenu} aria-label="Меню" aria-expanded={v.mobileMenuOpen} aria-controls="ai-mobile-menu" style={s(`display:${v.hamburgerDisplay}; width:42px; height:42px; border-radius:10px; border:1px solid var(--line); background:var(--paper); flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer;`)}>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
    </button>

    <div id="ai-mobile-menu" style={s(`position:absolute; top:calc(100% + 8px); left:0; right:0; display:grid; grid-template-rows:${v.mobileMenuRows}; transition:grid-template-rows 0.38s cubic-bezier(.16,1,.3,1); z-index:49;`)}>
     <div style={s(`overflow:hidden; min-height:0;`)}>
      <div style={s(`display:flex; flex-direction:column; padding:14px 24px 22px; gap:2px; background:#FFFFFF; border:1px solid var(--line); border-radius:20px; box-shadow:0 24px 48px -16px rgba(20,23,28,0.3);`)}>
        <a href="/" style={s(`display:inline-flex; align-items:center; gap:8px; font-size:var(--t16); font-weight:600; color:var(--ink-soft); text-decoration:none; padding-bottom:14px; border-bottom:1px solid var(--line);`)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={s(`flex-shrink:0; display:block;`)}><path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Главная</span></a>
        <a href="#agents" onClick={v.closeMobileMenu} style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`)}>Сценарии</a>
        <a href="#assistant" onClick={v.closeMobileMenu} style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`)}>ИИ-ассистент</a>
        <a href="#content" onClick={v.closeMobileMenu} style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`)}>Карточки товаров</a>
        <a href="#analytics" onClick={v.closeMobileMenu} style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`)}>Аналитика</a>
        <a href="#data" onClick={v.closeMobileMenu} style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`)}>Ваши данные</a>
        <a href="#process" onClick={v.closeMobileMenu} style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`)}>Внедрение</a>
        <a href="#faq" onClick={v.closeMobileMenu} style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink); text-decoration:none;`)}>FAQ</a>
        <a href="/bitrix24" style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:600; color:var(--ink-soft); text-decoration:none;`)}>Битрикс24 →</a>
        <a href="/ai" aria-current="page" style={s(`display:flex; align-items:center; min-height:44px; font-size:var(--t16); font-weight:700; color:var(--blue); text-decoration:none;`)}>ИИ-решения · вы здесь</a>
        <button onClick={v.scrollToContactMobile} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t15); font-weight:600; color:#fff; background:var(--blue); border:none; padding:14px 22px; border-radius:999px; cursor:pointer; margin-top:6px;`)}>Получить консультацию</button>
      </div>
     </div>
    </div>
  </header>

  <section id="hero" data-screen-label="Hero — ИИ-агенты" style={s(`position:relative; padding:${v.heroPad}; max-width:var(--wrap); margin:0 auto; overflow:visible;`)}>
    <div style={s(`position:absolute; top:-140px; right:-100px; width:540px; height:540px; border-radius:50%; background:var(--violet); opacity:0.14; filter:blur(95px); animation:driftBlobA 17s ease-in-out infinite alternate; z-index:0; pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; display:grid; grid-template-columns:${v.heroCols}; gap:${v.heroGap}; align-items:center;`)}>
      <div>
        <nav aria-label="Хлебные крошки" style={s(`display:flex; align-items:center; gap:8px; font-size:var(--t13); color:var(--ink-faint); ${v.entranceBadge}`)}>
          <a className="aifx7" href="/" style={s(`color:var(--ink-faint); text-decoration:none;`)}>Главная</a>
          <span aria-hidden="true">→</span>
          <span style={s(`color:var(--ink-soft); font-weight:500;`)}>ИИ-решения</span>
        </nav>

        <div style={s(`display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.32)); backdrop-filter:blur(18px) saturate(180%); -webkit-backdrop-filter:blur(18px) saturate(180%); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:6px 16px; box-shadow:0 1px 2px rgba(20,23,28,0.05); margin-top:22px; ${v.entranceBadge}`)}>
          <span style={s(`width:7px; height:7px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
          <span style={s(`font-size:var(--t14); font-weight:600; color:var(--ink);`)}>Работает на ваших данных · 24/7</span>
        </div>

        <h1 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h1Size}; line-height:1.07; letter-spacing:-0.03em; margin:26px 0 0; color:var(--ink); ${v.entranceH1}`)}>
          У вас есть боль —{' '}
          <span style={s(`background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent;`)}>мы решаем её с помощью ИИ</span>
        </h1>

        <p style={s(`font-size:var(--t18); line-height:1.65; color:var(--ink-soft); max-width:calc(540px * var(--t-scale)); margin:22px 0 0; ${v.entranceP}`)}>
          Заявки остывают за ночь. Каталог месяцами без описаний. Отчёты собираются руками. Поддержка тонет в однотипных вопросах. Приходите с тем, что болит, — разберём задачу и закроем её ИИ: с пилотом и цифрами «до/после».
        </p>

        <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); max-width:calc(540px * var(--t-scale)); margin:14px 0 0; ${v.entranceP}`)}>
          Не уверены, какой сценарий брать первым? <b style={s(`color:var(--ink); font-weight:600;`)}>Поможем определиться</b> — посмотрим процессы и данные и покажем, что окупится быстрее всего.
        </p>

        <div style={s(`display:flex; align-items:center; gap:18px; margin-top:34px; flex-wrap:wrap; ${v.entranceCta}`)}>
          <button className="aifx8" onClick={v.scrollToContact} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t16); font-weight:600; color:#fff; background:linear-gradient(135deg, #155EEF, #12A5E0); border:1px solid rgba(255,255,255,0.22); padding:16px 30px; border-radius:16px; cursor:pointer; box-shadow:0 12px 28px -6px rgba(21,94,239,0.45), inset 0 1px 1px rgba(255,255,255,0.6); transition:transform 0.25s ease, box-shadow 0.25s ease;`)}>Решить мою боль</button>
          <a className="aifx9" href="#agents" style={s(`font-size:var(--t16); font-weight:600; color:var(--ink); display:inline-flex; align-items:center; gap:8px; padding:16px 2px; text-decoration:none; border-bottom:1px solid transparent; transition:border-color 0.25s ease;`)}>Что автоматизируем ↓</a>
        </div>

        <div style={s(`display:flex; gap:18px 24px; flex-wrap:wrap; margin-top:38px; ${v.entranceCta}`)}>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink-soft);`)}>Пилот за 2–3 недели</span></div>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--violet); flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink-soft);`)}>Подключаемся к вашей БД: PostgreSQL, MySQL, 1С</span></div>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#1F8A5B; flex-shrink:0;`)}></span><span style={s(`font-size:var(--t14); color:var(--ink-soft);`)}>Данные под вашим контролем</span></div>
        </div>
      </div>

      <div style={s(`margin-top:${v.heroVisualMt}; ${v.entranceCard}`)}>
        <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(26px) saturate(180%); -webkit-backdrop-filter:blur(26px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:10px; box-shadow:0 40px 70px -24px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <div style={s(`height:${v.chatHeight}; background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden; display:flex; flex-direction:column;`)}>
            <div style={s(`display:flex; flex-wrap:wrap; align-items:center; gap:6px 10px; padding:11px 16px; border-bottom:1px solid var(--line); background:#fff;`)}>
              <span style={s(`width:30px; height:30px; border-radius:50%; background:var(--grad); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 10px -2px rgba(21,94,239,0.5);`)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="#fff"></path><circle cx="18.5" cy="17.5" r="2.1" fill="#fff" opacity="0.85"></circle></svg></span>
              <span style={s(`display:flex; flex-direction:column; min-width:0;`)}>
                <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t13); color:var(--ink); white-space:nowrap;`)}>ИИ-агент · Продажи</span>
                <span style={s(`position:relative; height:14px; display:block;`)}>
                  <span style={s(`position:absolute; left:0; top:0; display:inline-flex; align-items:center; gap:5px; font-size:var(--mock-sm); color:#1F8A5B; animation:aiHdrOnline 20s linear infinite; animation-play-state:${v.heroPlayState}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:#3DDC84; flex-shrink:0;`)}></span>онлайн · после 18:00</span>
                  <span style={s(`position:absolute; left:0; top:0; font-size:var(--mock-sm); color:var(--ink-faint); animation:aiHdrTyping 20s linear infinite; animation-play-state:${v.heroPlayState}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;`)}>проверяет остатки…</span>
                </span>
              </span>
              <span style={s(`margin-left:auto; display:inline-flex; align-items:center; gap:6px; font-size:var(--mock-sm); font-weight:600; color:var(--ink-faint); background:#F1F3F5; border-radius:6px; padding:3px 8px; white-space:nowrap;`)}>Telegram · 19:42</span>
            </div>

            <div style={s(`position:relative; flex:1; display:flex; flex-direction:column; justify-content:flex-end; gap:9px; padding:16px; background:#EEF2F6; min-height:0; overflow:hidden;`)}>

              <div style={s(`align-self:flex-start; max-width:82%; animation:aiMsg1 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:#fff; border:1px solid var(--line); border-radius:14px 14px 14px 4px; padding:10px 13px; box-shadow:0 1px 3px rgba(20,23,28,.07);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:var(--ink);`)}>Добрый день. Нужен кабель ВВГнг-LS 3×2,5, объём 1 200 м. Есть на складе?</div>
                </div>
                <div style={s(`font-size:var(--mock-xs); color:var(--ink-faint); margin:4px 0 0 6px;`)}>Клиент · 19:42</div>
              </div>

              <div style={s(`align-self:flex-end; max-width:82%; animation:aiMsg2 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:linear-gradient(135deg, #155EEF, #12A5E0); border-radius:14px 14px 4px 14px; padding:10px 13px; box-shadow:0 6px 16px -6px rgba(21,94,239,0.55);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:#fff;`)}>Добрый день! Проверил по 1С: на складе 860 м, ещё ~400 м придут в четверг. Могу поставить резерв на весь объём — подойдёт?</div>
                </div>
                <div style={s(`font-size:var(--mock-xs); color:var(--ink-faint); margin:4px 6px 0 0; text-align:right;`)}>Агент · 19:43</div>
              </div>

              <div style={s(`align-self:flex-start; max-width:82%; animation:aiMsg3 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:#fff; border:1px solid var(--line); border-radius:14px 14px 14px 4px; padding:10px 13px; box-shadow:0 1px 3px rgba(20,23,28,.07);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:var(--ink);`)}>Ставьте резерв. И нужны счёт и сертификаты соответствия — закупка под госконтракт</div>
                </div>
                <div style={s(`font-size:var(--mock-xs); color:var(--ink-faint); margin:4px 0 0 6px;`)}>Клиент · 19:47</div>
              </div>

              <div style={s(`align-self:flex-end; max-width:82%; animation:aiMsg4 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:linear-gradient(135deg, #155EEF, #12A5E0); border-radius:14px 14px 4px 14px; padding:10px 13px; box-shadow:0 6px 16px -6px rgba(21,94,239,0.55);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:#fff;`)}>Резерв поставил до пятницы. Счёт и сертификаты подготовит менеджер завтра с утра и пришлёт сюда. Подскажите, пожалуйста, ИНН организации</div>
                </div>
                <div style={s(`font-size:var(--mock-xs); color:var(--ink-faint); margin:4px 6px 0 0; text-align:right;`)}>Агент · 19:47</div>
              </div>

              <div style={s(`align-self:center; width:94%; animation:aiEvent 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`display:flex; align-items:center; gap:9px; background:#EBF7F0; border:1px solid rgba(31,138,91,0.3); border-radius:10px; padding:9px 13px;`)}>
                  <span style={s(`width:18px; height:18px; border-radius:50%; background:#1F8A5B; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="9" height="9" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                  <span style={s(`font-size:11.5px; font-weight:600; color:#1F8A5B; min-width:0;`)}>Лид в Битрикс24 · резерв 1 260 м в 1С · задача менеджеру: счёт и сертификаты</span>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div style={s(`display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px;`)}>
          <span style={s(`display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--ink-soft); background:linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.4)); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:7px 14px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>Telegram · WhatsApp · сайт</span>
          <span style={s(`display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--ink-soft); background:linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.4)); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:7px 14px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite; animation-delay:.4s;`)}></span>Остатки и резерв — из 1С</span>
          <span style={s(`display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--ink-soft); background:linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.4)); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:7px 14px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite; animation-delay:.8s;`)}></span>Ночью и в выходные</span>
        </div>
        <div style={s(`font-family:monospace; font-size:11px; color:var(--ink-faint); margin-top:12px; text-align:center;`)}>// менеджеры ушли в 18:00 — ИИ проверил остатки, поставил резерв и оставил менеджеру готовый лид</div>
      </div>
    </div>
  </section>

  <section id="agents" data-screen-label="Сценарии ИИ-агентов по ролям" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:calc(740px * var(--t-scale));`)}>
      <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Боли по ролям</div>
      <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>С чем к нам приходят чаще всего</h2>
      <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Где-то хватает простой ИИ-автоматизации: распознать документ, сгенерировать текст, разобрать звонок. Где-то нужен ИИ-агент, который сам ведёт диалог и выполняет действия в системах. Узнали свою задачу — с неё и начнём.</p>
    </div>

    <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:24px; margin-top:56px;`)}>
      {ROLE_CASES.map((c, i) => (
        <div key={c.role} style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--blue);`)}>{String(i + 1).padStart(2, '0')} · {c.role}</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>{c.title}</h3>
          <p style={s(`font-size:var(--t15); line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>{c.text}{c.more ? <> <a href={c.more} style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>Подробнее ниже</a>.</> : null}</p>
          <div style={s(`display:flex; align-items:baseline; gap:8px; margin-top:16px;`)}><span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Итог</span><span style={s(`font-size:var(--t135); color:var(--ink);`)}>{c.result}</span></div>
        </div>
      ))}
    </div>
  </section>

  <section id="assistant" data-screen-label="Голосовой ИИ-ассистент внутри системы" style={s(`position:relative; background:var(--ink); padding:${v.darkPad}; overflow:hidden;`)}>
    <div style={s(`position:absolute; top:-180px; right:-120px; width:680px; height:680px; border-radius:50%; background:var(--grad); opacity:0.22; filter:blur(130px); pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; max-width:var(--wrap); margin:0 auto; padding:${v.darkInnerPad};`)}>
      <div data-reveal style={s(`max-width:calc(760px * var(--t-scale));`)}>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; display:inline-block;`)}>ИИ-ассистент</div>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(26px,4vw,46px); line-height:1.14; letter-spacing:-0.02em; margin:16px 0 0; color:#fff;`)}>Скажите вслух — система сделает</h2>
        <p style={s(`font-size:var(--t18); line-height:1.6; color:rgba(255,255,255,0.68); margin:20px 0 0;`)}>Не чат-бот сбоку, а универсальный боец внутри вашего контура. Он живёт в CRM, 1С и на складе, слышит задачу голосом и сам выполняет её: заводит документы, находит цифры, создаёт сотрудников, проводит расходы. Пока вы за рулём, на объекте или у стойки — работа уже сделана.</p>
        <p style={s(`font-size:var(--t16); line-height:1.6; color:rgba(255,255,255,0.5); margin:14px 0 0;`)}>Главное — скорость доступа к данным. Вопрос, на который аналитик отвечает полдня, ассистент закрывает за секунды и снимает с команды поток «посмотри, посчитай, заведи».</p>
      </div>

      <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; margin-top:56px; align-items:start;`)}>

        {/* Демо: голос → расшифровка → действие в системе → подтверждение.
            Четыре команды крутятся по кругу, каждая со своим коридором в CSS. */}
        <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(255,255,255,0.16); border-radius:22px; padding:clamp(18px,3.4vw,28px); box-shadow:0 24px 60px -20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);`)}>
          <div style={s(`display:flex; align-items:center; gap:12px;`)}>
            <span style={s(`width:38px; height:38px; border-radius:50%; background:var(--grad); display:flex; align-items:center; justify-content:center; flex-shrink:0; animation:vaPulse 2.6s ease-out infinite;`)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="#fff"></rect><path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"></path></svg>
            </span>
            <span style={s(`display:flex; flex-direction:column; min-width:0;`)}>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:700; font-size:var(--t14); color:#fff;`)}>ИИ-ассистент · слушает</span>
              <span style={s(`font-size:11px; color:rgba(255,255,255,0.45);`)}>Битрикс24 · 1С · склад · почта</span>
            </span>
            <span aria-hidden="true" style={s(`margin-left:auto; display:flex; align-items:center; gap:3px; height:22px;`)}>
              <span style={s(`width:3px; height:100%; border-radius:2px; background:rgba(94,159,255,0.85); transform-origin:center; animation:vaWave 1.1s ease-in-out infinite;`)}></span>
              <span style={s(`width:3px; height:100%; border-radius:2px; background:rgba(94,159,255,0.85); transform-origin:center; animation:vaWave 1.1s ease-in-out infinite -0.15s;`)}></span>
              <span style={s(`width:3px; height:100%; border-radius:2px; background:rgba(94,159,255,0.85); transform-origin:center; animation:vaWave 1.1s ease-in-out infinite -0.3s;`)}></span>
              <span style={s(`width:3px; height:100%; border-radius:2px; background:rgba(94,159,255,0.85); transform-origin:center; animation:vaWave 1.1s ease-in-out infinite -0.45s;`)}></span>
              <span style={s(`width:3px; height:100%; border-radius:2px; background:rgba(94,159,255,0.85); transform-origin:center; animation:vaWave 1.1s ease-in-out infinite -0.6s;`)}></span>
            </span>
          </div>

          <div style={s(`position:relative; height:190px; margin-top:18px;`)}>
            {[
              { anim: 'vaCmd1', say: '«Сделай КП для «Восхода» на 200 метров ВВГнг 3×2,5»', act: 'Собрал КП по прайсу и шаблону, подставил скидку по договору', done: 'КП №1841 → на согласование РОПу', sys: 'Битрикс24 · Документы' },
              { anim: 'vaCmd2', say: '«Сколько отдел заработал на опте в июле?»', act: 'Поднял сделки из CRM и проводки из 1С, свёл по направлению', done: '₽8,4 млн · 62 сделки · +18% к июню', sys: 'CRM + 1С · ответ за 4 с' },
              { anim: 'vaCmd3', say: '«Оформи Ивана Петрова менеджером с понедельника»', act: 'Создал учётку и почту, выдал права, назначил план онбординга', done: 'Сотрудник заведён, 6 задач поставлено', sys: 'Битрикс24 · HR · доступы' },
              { anim: 'vaCmd4', say: '«Запиши расход: зерно на 18 400, чек сфоткал»', act: 'Распознал чек, разнёс по статье «Сырьё», приложил скан', done: 'Расход проведён · остаток бюджета ₽64 200', sys: '1С · Касса' },
            ].map((c, i) => (
              <div key={i} style={s(`position:absolute; inset:0; display:flex; flex-direction:column; gap:10px; animation:${c.anim} 24s linear infinite;`)}>
                <div style={s(`display:flex; gap:10px; align-items:flex-start;`)}>
                  <span style={s(`width:22px; height:22px; border-radius:50%; background:rgba(94,159,255,0.2); border:1px solid rgba(94,159,255,0.45); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" fill="#8FC0FF"></rect><path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3" stroke="#8FC0FF" strokeWidth="2" strokeLinecap="round"></path></svg></span>
                  <span style={s(`font-size:var(--t135); line-height:1.5; color:#fff; font-weight:600;`)}>{c.say}</span>
                </div>
                <div style={s(`display:flex; gap:10px; align-items:flex-start; padding-left:32px;`)}>
                  <span style={s(`font-family:monospace; font-size:var(--mock-sm); letter-spacing:0.05em; text-transform:uppercase; color:rgba(255,255,255,0.38); flex-shrink:0; margin-top:2px;`)}>→</span>
                  <span style={s(`font-size:12.5px; line-height:1.5; color:rgba(255,255,255,0.66);`)}>{c.act}</span>
                </div>
                <div style={s(`margin-top:auto; display:flex; align-items:center; gap:9px; background:rgba(31,138,91,0.14); border:1px solid rgba(31,138,91,0.38); border-radius:10px; padding:10px 13px;`)}>
                  <span style={s(`width:17px; height:17px; border-radius:50%; background:#1F8A5B; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="9" height="9" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                  <span style={s(`font-size:12px; font-weight:600; color:#7BE0AC; min-width:0;`)}>{c.done}</span>
                  <span style={s(`margin-left:auto; font-family:monospace; font-size:var(--mock-xs); color:rgba(255,255,255,0.4); white-space:nowrap; flex-shrink:0;`)}>{c.sys}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={s(`display:grid; grid-template-columns:${v.cols2}; gap:14px;`)}>
            {[
              { t: 'Документы под диктовку', d: 'КП, счёт, договор, акт — по вашим шаблонам и прайсу. Агент сам подставляет реквизиты и скидку по договору, человек только подтверждает.' },
              { t: 'Ответы цифрами за секунды', d: 'Выручка, конверсия, остатки, дебиторка. Вопрос голосом — ответ из CRM, 1С и базы данных, без очереди к аналитику.' },
              { t: 'Номенклатура и склад', d: '«Заведи кресло Оптима, 12 400» — карточка создана, характеристики заполнены, остаток оприходован.' },
              { t: 'Расходы и первичка', d: 'Сфотографировали чек — агент распознал, разнёс по статье и приложил скан к проводке.' },
              { t: 'Онбординг сотрудника', d: 'Создаёт учётку и почту, выдаёт права по роли, ставит задачи наставнику и напоминает про документы.' },
              { t: 'Отчёты по расписанию', d: 'Собирает сводку к нужному часу и присылает в Telegram или на почту — уже с выводами, а не таблицей.' },
            ].map((c, i) => (
              <div key={i} style={s(`background:rgba(255,255,255,0.055); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:18px 18px 20px;`)}>
                <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); color:#fff;`)}>{c.t}</div>
                <div style={s(`font-size:var(--t13); line-height:1.55; color:rgba(255,255,255,0.6); margin-top:8px;`)}>{c.d}</div>
              </div>
            ))}
          </div>

          <div style={s(`display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap; margin-top:24px;`)}>
            <p style={s(`font-size:var(--t145); line-height:1.6; color:rgba(255,255,255,0.55); margin:0; max-width:calc(520px * var(--t-scale));`)}>Границы задаёте вы: что ассистент делает сам, а что — только после подтверждения. Каждое действие подписано его именем, откат в один клик.</p>
            <button className="aifx10" onClick={v.scrollToContact} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:var(--ink); background:#fff; border:none; padding:13px 28px; border-radius:999px; cursor:pointer; transition:transform 0.2s ease;`)}>Хочу такого ассистента</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="wiki" data-screen-label="Самообучающаяся база знаний" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:calc(760px * var(--t-scale));`)}>
      <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>Корпоративная память</div>
      <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Система, которая умнеет от каждого разговора</h2>
      <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Обычный бот знает ровно то, что в него заложили на запуске, и с каждым месяцем всё сильнее отстаёт от реальности. Мы строим иначе: ИИ ведёт корпоративную вики сам. Каждый вопрос, на который он не смог ответить, становится зафиксированным пробелом. Ответ живого сотрудника агент подхватывает, оформляет в статью — и в следующий раз отвечает уже сам.</p>
      <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Идея не наша: её сформулировал Андрей Карпатый в заметке <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" target="_blank" rel="noopener" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>llm-wiki</a>. Смысл в том, что узкое место базы знаний — не чтение и не размышление, а <b style={s(`color:var(--ink); font-weight:600;`)}>бухгалтерия</b>: перекрёстные ссылки, единый стиль, поиск противоречий. Ровно то, что человек забрасывает первым, а модель тянет без усталости.</p>
      <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Поэтому у нас три слоя: неизменяемые первоисточники, которые ИИ только читает; сама вики, которую он пишет и переписывает; и правила вашей компании, по которым он это делает. Знания перестают жить в головах и переписках — и остаются в компании, даже когда Марина в отпуске или уходит.</p>
    </div>

    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; margin-top:56px; align-items:start;`)}>

      {/* СЦЕНА «Лента знаний»: один вопрос задаётся дважды.
          Первый раз ответа нет — подключается эксперт, статья медленно
          опускается в пустой слот, оранжевая полоса времени ползёт 7 секунд.
          Второй раз тот же вопрос закрывается за кадр, зелёная полоса —
          огрызок рядом с оранжевой.

          Смысл несёт сравнение ДЛИН двух полос: эту операцию человек
          декодирует без чтения, легенды и осей. Кто смотрит с начала —
          проживает контраст собственным временем ожидания.

          Механика взята из биологии (массив спейсеров CRISPR + первичный
          и вторичный иммунный ответ), но вся лексика офисная. Ни вируса,
          ни насекомых: метафора не должна ставить клиента в роль заразы.

          Всё на CSS, один таймлайн 24 с, ноль ре-рендеров React. */}
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; box-shadow:0 30px 60px -30px rgba(20,23,28,0.25), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`display:flex; align-items:center; gap:10px; flex-wrap:wrap;`)}>
          <span style={s(`position:relative; width:22px; height:22px; flex-shrink:0;`)}>
            <span style={s(`position:absolute; inset:0; border-radius:50%; border:2px solid rgba(18,165,224,0.25); border-top-color:var(--violet); animation:wikiRing 3.2s linear infinite;`)}></span>
          </span>
          <span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Лента знаний</span>
          <span style={s(`position:relative; margin-left:auto; display:block; width:126px; height:15px; flex-shrink:0;`)}>
            <span style={s(`position:absolute; right:0; top:0; font-family:monospace; font-size:var(--mock-sm); font-weight:700; color:var(--ink-soft); white-space:nowrap; animation:wikiCount 24s linear infinite;`)}>статей в базе: 418</span>
            <span style={s(`position:absolute; right:0; top:0; font-family:monospace; font-size:var(--mock-sm); font-weight:700; color:#1F8A5B; white-space:nowrap; animation:wikiCount2 24s linear infinite;`)}>статей в базе: 419</span>
          </span>
        </div>

        <div ref={v.memRef} className="memfx" style={s(`position:relative; height:var(--mem-h); margin-top:14px; display:flex; flex-direction:column;`)}>

          {/* строка вопроса — оба чипа побайтово одинаковы, иначе «тот же вопрос» не прочитается */}
          <div style={s(`position:relative; height:26px; flex-shrink:0;`)}>
            <span data-mem="ask1" style={s(`position:absolute; right:0; top:0; display:inline-flex; align-items:center; gap:6px; max-width:100%; background:#fff; border:1px solid var(--line); border-radius:999px; padding:4px 12px 4px 6px; opacity:0; animation:memAsk1 24s linear infinite; will-change:transform,opacity;`)}>
              <span style={s(`width:16px; height:16px; border-radius:50%; background:#F1F3F5; color:var(--ink-soft); font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}>?</span>
              <span style={s(`font-size:var(--mock-sm); color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>Ламинат можно на тёплый пол?</span>
            </span>
            <span data-mem="ask2" style={s(`position:absolute; right:0; top:0; display:inline-flex; align-items:center; gap:6px; max-width:100%; background:#fff; border:1px solid var(--line); border-radius:999px; padding:4px 12px 4px 6px; opacity:0; animation:memAsk2 24s linear infinite; will-change:transform,opacity;`)}>
              <span style={s(`width:16px; height:16px; border-radius:50%; background:#F1F3F5; color:var(--ink-soft); font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}>?</span>
              <span style={s(`font-size:var(--mock-sm); color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>Ламинат можно на тёплый пол?</span>
            </span>
          </div>

          {/* эксперт слева над слотом, агент справа */}
          <div style={s(`position:relative; height:26px; margin-top:6px; flex-shrink:0; display:flex; align-items:center; justify-content:space-between; gap:10px;`)}>
            <span data-mem="human" style={s(`display:inline-flex; align-items:center; gap:6px; opacity:0; animation:memHuman 24s linear infinite;`)}>
              <span style={s(`width:18px; height:18px; border-radius:50%; background:rgba(217,72,15,0.14); border:1px solid rgba(217,72,15,0.4); flex-shrink:0;`)}></span>
              <span style={s(`font-family:monospace; font-size:var(--mock-xs); color:#D9480F; white-space:nowrap;`)}>эксперт</span>
            </span>
            {/* «агент» до последнего кадра пустой и пунктирный: ценность не в нём,
                а в записи, которую он подхватывает */}
            <span style={s(`position:relative; width:var(--mem-eff-w); height:26px; border-radius:999px; border:1.5px dashed var(--line); flex-shrink:0; display:flex; align-items:center; justify-content:center;`)}>
              <span style={s(`font-family:monospace; font-size:var(--mock-xs); color:var(--ink-faint);`)}>агент</span>
              <span data-mem="miss" style={s(`position:absolute; inset:-1px; border-radius:999px; background:#EDEFF2; display:flex; align-items:center; justify-content:center; opacity:0; animation:memMiss 24s linear infinite;`)}>
                <span style={s(`font-family:monospace; font-size:var(--mock-xs); color:var(--ink-soft); white-space:nowrap;`)}>не знаю</span>
              </span>
              <span data-mem="hit" style={s(`position:absolute; inset:-1px; border-radius:999px; background:var(--blue); display:flex; align-items:center; justify-content:center; opacity:0; animation:memHit 24s linear infinite;`)}>
                <span style={s(`font-family:monospace; font-size:var(--mock-xs); color:#fff; white-space:nowrap;`)}>отвечает сам</span>
              </span>
            </span>
          </div>

          {/* пунктирная линия от эксперта вниз к слоту */}
          <span data-mem="drop" style={s(`position:absolute; left:8px; top:58px; width:1px; height:18px; background-image:repeating-linear-gradient(180deg, rgba(217,72,15,0.55) 0 3px, transparent 3px 6px); transform:scaleY(0); transform-origin:top; animation:memDrop 24s linear infinite;`)}></span>

          {/* точка-вспышка: летит от новой записи к агенту за 0,1 с */}
          <span data-mem="streak" style={s(`position:absolute; left:24px; top:92px; width:7px; height:7px; border-radius:50%; background:var(--violet); opacity:0; animation:memStreak 24s linear infinite; z-index:3;`)}></span>

          {/* лента: слева пустой слот (зафиксированный пробел), справа записи.
              Ромбы-разделители превращают полоску в структуру — строки таблицы,
              а не progress bar */}
          <div style={s(`position:relative; margin-top:10px; flex-shrink:0;`)}>
            <div style={s(`display:flex; align-items:center; height:56px; overflow:hidden;`)}>
              <span data-mem="slot" style={s(`position:relative; width:var(--mem-blk); height:52px; border-radius:9px; border:1.5px dashed rgba(21,94,239,0.4); flex-shrink:0; animation:memSlot 24s linear infinite;`)}>
                <span data-mem="new" style={s(`position:absolute; inset:-1px; border-radius:9px; background:rgba(31,138,91,0.14); border:1px solid rgba(31,138,91,0.5); opacity:0; animation:memNew 24s linear infinite; will-change:transform,opacity;`)}>
                  <span style={s(`position:absolute; left:7px; right:7px; top:15px; height:4px; border-radius:2px; background:rgba(31,138,91,0.35);`)}></span>
                  <span style={s(`position:absolute; left:7px; right:18px; top:25px; height:4px; border-radius:2px; background:rgba(31,138,91,0.24);`)}></span>
                  <span data-mem="check" style={s(`position:absolute; right:4px; top:4px; width:12px; height:12px; border-radius:50%; background:#1F8A5B; display:flex; align-items:center; justify-content:center; opacity:0; animation:memCheck 24s linear infinite;`)}>
                    <svg width="7" height="7" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </span>
                </span>
              </span>
            <span style={s(`width:7px; height:7px; flex-shrink:0; margin:0 4px; background:var(--line); transform:rotate(45deg);`)}></span>
            <span style={s(`position:relative; width:var(--mem-blk); height:52px; border-radius:9px; flex-shrink:0; background:rgba(18,165,224,0.10); border:1px solid rgba(18,165,224,0.22); display:block;`)}>
              <span style={s(`position:absolute; left:7px; right:7px; top:15px; height:4px; border-radius:2px; background:rgba(20,23,28,0.13);`)}></span>
              <span style={s(`position:absolute; left:7px; right:18px; top:25px; height:4px; border-radius:2px; background:rgba(20,23,28,0.09);`)}></span>
              <span style={s(`position:absolute; inset:0; border-radius:9px; background:rgba(18,165,224,0.5); opacity:0; animation:memScan1 24s linear infinite;`)}></span>

            </span>
            <span style={s(`width:7px; height:7px; flex-shrink:0; margin:0 4px; background:var(--line); transform:rotate(45deg);`)}></span>
            <span style={s(`position:relative; width:var(--mem-blk); height:52px; border-radius:9px; flex-shrink:0; background:rgba(21,94,239,0.08); border:1px solid rgba(21,94,239,0.18); display:block;`)}>
              <span style={s(`position:absolute; left:7px; right:7px; top:15px; height:4px; border-radius:2px; background:rgba(20,23,28,0.13);`)}></span>
              <span style={s(`position:absolute; left:7px; right:18px; top:25px; height:4px; border-radius:2px; background:rgba(20,23,28,0.09);`)}></span>
              <span style={s(`position:absolute; inset:0; border-radius:9px; background:rgba(18,165,224,0.5); opacity:0; animation:memScan2 24s linear infinite;`)}></span>

            </span>
            <span style={s(`width:7px; height:7px; flex-shrink:0; margin:0 4px; background:var(--line); transform:rotate(45deg);`)}></span>
            <span style={s(`position:relative; width:var(--mem-blk); height:52px; border-radius:9px; flex-shrink:0; background:rgba(18,165,224,0.10); border:1px solid rgba(18,165,224,0.22); display:block;`)}>
              <span style={s(`position:absolute; left:7px; right:7px; top:15px; height:4px; border-radius:2px; background:rgba(20,23,28,0.13);`)}></span>
              <span style={s(`position:absolute; left:7px; right:18px; top:25px; height:4px; border-radius:2px; background:rgba(20,23,28,0.09);`)}></span>
              <span style={s(`position:absolute; inset:0; border-radius:9px; background:rgba(18,165,224,0.5); opacity:0; animation:memScan3 24s linear infinite;`)}></span>

            </span>
            <span style={s(`width:7px; height:7px; flex-shrink:0; margin:0 4px; background:var(--line); transform:rotate(45deg);`)}></span>
            <span style={s(`position:relative; width:var(--mem-blk); height:52px; border-radius:9px; flex-shrink:0; background:rgba(21,94,239,0.08); border:1px solid rgba(21,94,239,0.18); display:var(--mem-blk-far);`)}>
              <span style={s(`position:absolute; left:7px; right:7px; top:15px; height:4px; border-radius:2px; background:rgba(20,23,28,0.13);`)}></span>
              <span style={s(`position:absolute; left:7px; right:18px; top:25px; height:4px; border-radius:2px; background:rgba(20,23,28,0.09);`)}></span>
              <span style={s(`position:absolute; inset:0; border-radius:9px; background:rgba(18,165,224,0.5); opacity:0; animation:memScan4 24s linear infinite;`)}></span>

            </span>
            <span style={s(`width:7px; height:7px; flex-shrink:0; margin:0 4px; background:var(--line); transform:rotate(45deg);`)}></span>
            <span style={s(`position:relative; width:var(--mem-blk); height:52px; border-radius:9px; flex-shrink:0; background:rgba(18,165,224,0.10); border:1px solid rgba(18,165,224,0.22); display:var(--mem-blk-far);`)}>
              <span style={s(`position:absolute; left:7px; right:7px; top:15px; height:4px; border-radius:2px; background:rgba(20,23,28,0.13);`)}></span>
              <span style={s(`position:absolute; left:7px; right:18px; top:25px; height:4px; border-radius:2px; background:rgba(20,23,28,0.09);`)}></span>
              <span style={s(`position:absolute; inset:0; border-radius:9px; background:rgba(18,165,224,0.5); opacity:0; animation:memScan5 24s linear infinite;`)}></span>

            </span>
            <span style={s(`width:7px; height:7px; flex-shrink:0; margin:0 4px; background:var(--line); transform:rotate(45deg);`)}></span>
            <span style={s(`position:relative; width:var(--mem-blk); height:52px; border-radius:9px; flex-shrink:0; background:rgba(21,94,239,0.08); border:1px solid rgba(21,94,239,0.18); display:var(--mem-blk-far);`)}>
              <span style={s(`position:absolute; left:7px; right:7px; top:15px; height:4px; border-radius:2px; background:rgba(20,23,28,0.13);`)}></span>
              <span style={s(`position:absolute; left:7px; right:18px; top:25px; height:4px; border-radius:2px; background:rgba(20,23,28,0.09);`)}></span>
              <span style={s(`position:absolute; inset:0; border-radius:9px; background:rgba(18,165,224,0.5); opacity:0; animation:memScan6 24s linear infinite;`)}></span>
              <span data-mem="stale" style={s(`position:absolute; inset:0; border-radius:9px; background:rgba(255,255,255,0.72); opacity:0; animation:memStale 24s linear infinite;`)}></span>
              <span data-mem="stale" style={s(`position:absolute; right:5px; top:5px; width:6px; height:6px; border-radius:50%; background:#D9480F; opacity:0; animation:memStale 24s linear infinite;`)}></span>
            </span>
            </div>
            {/* «ответа нет» показывается гашением ленты, а не крестиком */}
            <span data-mem="dim" style={s(`position:absolute; inset:0; background:#FAFAF8; opacity:0; pointer-events:none; animation:memDim 24s linear infinite;`)}></span>
          </div>

          <div style={s(`position:relative; height:14px; margin-top:3px; flex-shrink:0;`)}>
            <span data-mem="tagnew" style={s(`position:absolute; left:0; top:0; font-family:monospace; font-size:var(--mock-xs); color:#1F8A5B; white-space:nowrap; opacity:0; animation:memTagNew 24s linear infinite;`)}>новая статья</span>
            <span data-mem="src" style={s(`position:absolute; left:0; top:0; font-family:monospace; font-size:var(--mock-xs); color:var(--ink-faint); white-space:nowrap; opacity:0; animation:memTagSrc 24s linear infinite;`)}>источник: диалог #8412</span>
          </div>

          {/* две дорожки времени — ядро смысла. Сравниваются не числа, а длины */}
          <div style={s(`margin-top:auto; padding-top:10px; border-top:1px solid var(--line); flex-shrink:0;`)}>
            <div style={s(`font-family:monospace; font-size:var(--mock-xs); color:var(--ink-faint); margin-bottom:7px;`)}>время ответа на один и тот же вопрос</div>

            <div style={s(`display:grid; grid-template-columns:var(--mem-lane-lbl-w) minmax(0,1fr) var(--mem-lane-val); align-items:center; gap:8px;`)}>
              <span style={s(`grid-column:1; display:var(--mem-lane-lbl); font-family:monospace; font-size:var(--mock-xs); color:var(--ink-faint); white-space:nowrap;`)}>первый раз</span>
              <span style={s(`grid-column:2; position:relative; height:10px; border-radius:5px; background:rgba(217,72,15,0.12); overflow:hidden;`)}>
                <span data-mem="fill1" style={s(`position:absolute; inset:0; border-radius:5px; background:rgba(217,72,15,0.85); transform:scaleX(0); transform-origin:left; animation:memFill1 24s linear infinite; will-change:transform;`)}></span>
              </span>
              <span data-mem="val1" style={s(`grid-column:3; font-family:monospace; font-size:var(--mock-xs); font-weight:700; color:#D9480F; white-space:nowrap; text-align:right; opacity:0; animation:memVal1 24s linear infinite;`)}>ждали человека</span>
            </div>

            <div style={s(`display:grid; grid-template-columns:var(--mem-lane-lbl-w) minmax(0,1fr) var(--mem-lane-val); align-items:center; gap:8px; margin-top:7px;`)}>
              <span style={s(`grid-column:1; display:var(--mem-lane-lbl); font-family:monospace; font-size:var(--mock-xs); color:var(--ink-faint); white-space:nowrap;`)}>тот же вопрос</span>
              <span style={s(`grid-column:2; position:relative; height:10px; border-radius:5px; background:rgba(31,138,91,0.12);`)}>
                {/* отдельный элемент фиксированной ширины, а не scaleX(0.04) от
                    полного трека — иначе скругление расплющится в эллипс */}
                <span data-mem="fill2" style={s(`position:absolute; left:0; top:0; width:18px; height:10px; border-radius:5px; background:#1F8A5B; transform:scaleX(0); transform-origin:left; animation:memFill2 24s linear infinite;`)}></span>
              </span>
              <span data-mem="val2" style={s(`grid-column:3; font-family:monospace; font-size:var(--mock-xs); font-weight:700; color:#1F8A5B; white-space:nowrap; text-align:right; opacity:0; animation:memVal2 24s linear infinite;`)}>3 секунды</span>
            </div>

            <div style={s(`position:relative; height:28px; margin-top:8px;`)}>
              <span data-mem="cap1" style={s(`position:absolute; left:0; top:0; right:0; font-size:var(--mock-sm); line-height:1.35; color:#D9480F; animation:memCap1 24s linear infinite;`)}>сканируем ленту — совпадений нет</span>
              <span data-mem="cap2" style={s(`position:absolute; left:0; top:0; right:0; font-size:var(--mock-sm); line-height:1.35; color:var(--blue); opacity:0; animation:memCap2 24s linear infinite;`)}>один разбор человеком — один раз</span>
              <span data-mem="cap3" style={s(`position:absolute; left:0; top:0; right:0; font-size:var(--mock-sm); line-height:1.35; color:var(--violet); opacity:0; animation:memCap3 24s linear infinite;`)}>оформлено в статью, эксперт подтвердил</span>
              <span data-mem="cap4" style={s(`position:absolute; left:0; top:0; right:0; font-size:var(--mock-sm); line-height:1.35; color:#1F8A5B; opacity:0; animation:memCap4 24s linear infinite;`)}>тот же вопрос — агент отвечает сам</span>
              <span data-mem="cap5" style={s(`position:absolute; left:0; top:0; right:0; font-size:var(--mock-sm); line-height:1.35; color:var(--ink-soft); opacity:0; animation:memCap5 24s linear infinite;`)}>сотрудник ушёл — запись осталась в компании</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style={s(`display:flex; flex-direction:column; gap:0;`)}>
          {[
            ['Ловит собственные пробелы', 'Агент не притворяется всезнающим: чего не знает — передаёт человеку и фиксирует как задачу для базы. Список пробелов видно в отчёте.'],
            ['Учится на ответах сотрудников', 'Источник знаний — обычная рабочая переписка. Никто не садится «писать документацию»: она собирается из того, что и так происходит.'],
            ['Приводит к единому виду', 'Разные формулировки одного и того же ИИ сводит в одну статью, проставляет теги и связи с товарами, сделками и регламентами.'],
            ['Следит за устареванием', 'Если статья противоречит новому прайсу или свежему ответу эксперта, ИИ помечает её на пересмотр, а не отвечает по устаревшим данным.'],
            ['Человек остаётся редактором', 'Ни одна статья не уходит в работу без подтверждения ответственного. Видно, кто подтвердил и на основании какого диалога.'],
            ['Новичок получает всё сразу', 'Тот же ассистент отвечает на вопросы новых сотрудников — онбординг идёт по накопленной базе, а не по чужому времени.'],
          ].map(([t, d], i) => (
            <div key={t} style={s(`display:flex; gap:16px; padding:18px 0; ${i ? 'border-top:1px solid var(--line);' : ''}`)}>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet); flex-shrink:0; width:24px;`)}>{String(i + 1).padStart(2, '0')}</span>
              <div style={s(`min-width:0;`)}>
                <div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>{t}</div>
                <div style={s(`font-size:var(--t14); line-height:1.55; color:var(--ink-soft); margin-top:4px;`)}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:22px; background:rgba(18,165,224,0.07); border:1px solid rgba(18,165,224,0.22); border-radius:12px; padding:14px 16px;`)}>
          <span style={s(`width:7px; height:7px; border-radius:50%; background:var(--violet); flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
          <span style={s(`font-size:var(--t14); line-height:1.5; color:var(--ink-soft);`)}>База знаний остаётся вашей: выгружается целиком и работает даже без нас.</span>
        </div>
      </div>
    </div>
  </section>

  <section id="content" data-screen-label="Карточки товаров и SEO-тексты" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; align-items:center;`)}>
      <div>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>Контент на автопилоте</div>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Карточки товаров и SEO-тексты — без контент-менеджера на потоке</h2>
        <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:calc(560px * var(--t-scale));`)}>Каталог на тысячи позиций месяцами стоит без описаний — и не находится в поиске. ИИ заполняет карточки по прайсу и фото, человек только проверяет.</p>
        <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:14px 0 0; max-width:calc(560px * var(--t-scale));`)}>На нашем боевом проекте — интернет-магазине стройматериалов — за июль прошло <b style={s(`color:var(--ink); font-weight:600;`)}>19 763 карточки</b>: пиковая скорость 1 557 штук в час, устойчивая — около 1 100. <b style={s(`color:var(--ink); font-weight:600;`)}>98,6%</b> ушли в публикацию без ручных правок, остальные ИИ сам пометил «на проверку», когда не был уверен в фото. Каталог на 20 000 позиций закрывается за пару рабочих дней, а не за год.</p>

        <div style={s(`display:flex; flex-direction:column; gap:0; margin-top:36px; max-width:calc(560px * var(--t-scale));`)}>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet); flex-shrink:0; width:24px;`)}>1.</span>
            <div><span style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Загружаете исходники.</span> <span style={s(`font-size:var(--t155); color:var(--ink-soft);`)}>Прайс, фото, артикулы — хватит даже названия и характеристик от поставщика.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet); flex-shrink:0; width:24px;`)}>2.</span>
            <div><span style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>ИИ собирает карточку.</span> <span style={s(`font-size:var(--t155); color:var(--ink-soft);`)}>Название, заполненная таблица характеристик, продающее описание и SEO-текст под поисковые запросы — всё в едином стиле бренда. Чего нет в прайсе, ИИ достаёт из открытых источников и помечает, если не уверен.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet); flex-shrink:0; width:24px;`)}>3.</span>
            <div><span style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Человек проверяет.</span> <span style={s(`font-size:var(--t155); color:var(--ink-soft);`)}>Выборочная вычитка вместо написания с нуля — в разы быстрее.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t14); color:var(--violet); flex-shrink:0; width:24px;`)}>4.</span>
            <div><span style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Выгружаем куда нужно.</span> <span style={s(`font-size:var(--t155); color:var(--ink-soft);`)}>Сайт на Битрикс, интернет-магазин, маркетплейсы — сразу в нужном формате.</span></div>
          </div>
        </div>
      </div>

      <div ref={v.contentRef}>
        <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; box-shadow:0 30px 60px -30px rgba(20,23,28,0.25), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-faint); background:#F1F3F5; border-radius:6px; padding:4px 10px; flex-shrink:0;`)}>Вход</span>
            <span key={v.prodKey + '-sku'} style={s(`font-family:monospace; font-size:12px; color:var(--ink-soft); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; animation:sliderItemIn 0.4s ease both;`)}>{v.prod.sku}</span>
          </div>

          <div style={s(`display:flex; align-items:center; gap:10px; margin:16px 0;`)}>
            <div style={s(`flex:1; height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px);`)}></div>
            <span style={s(`display:inline-flex; align-items:center; gap:6px; font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#fff; background:var(--grad); border-radius:999px; padding:5px 12px; box-shadow:0 6px 14px -4px rgba(21,94,239,0.5); white-space:nowrap;`)}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={s(`flex-shrink:0;`)}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="#fff"></path></svg>ИИ генерирует</span>
            <div style={s(`flex:1; height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px);`)}></div>
          </div>

          <div style={s(`background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px; overflow:hidden;`)}>
            <div style={s(`display:flex; gap:14px;`)}>
              {/* Фото приезжает через blur-up: сначала base64-миниатюра,
                  посчитанная на сервере, потом кроссфейд в оригинал. */}
              <div style={s(`width:92px; height:92px; border-radius:10px; overflow:hidden; position:relative; flex-shrink:0; background:#EEF2F6;`)}>
                <div key={v.prodKey + '-img'} style={s(`position:absolute; inset:0; opacity:${v.prodSearching ? 0 : 1}; transition:opacity .5s ease;`)}>
                  <BlurImage
                    src={v.prodBlur.src || v.prod.img}
                    alt={v.prod.name}
                    blurDataURL={v.prodBlur.blurDataURL}
                    fill
                    sizes="120px"
                    background="#EEF2F6"
                  />
                </div>
                {v.prodSearching ? (
                  <div style={s(`position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:#EEF2F6; z-index:3;`)}>
                    <div style={s(`width:24px; height:24px; border-radius:50%; border:3px solid #CDD5DE; border-top-color:#1F8A5B; animation:spin .8s linear infinite;`)}></div>
                    <div style={s(`font-size:var(--mock-xs); font-weight:600; color:#5A626E; text-align:center;`)}>подбираю<br />фото…</div>
                  </div>
                ) : null}
              </div>
              <div style={s(`min-width:0; flex:1;`)}>
                <div key={v.prodKey + '-cat'} style={s(`font-size:var(--mock-sm); font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:${v.prod.hue}; animation:sliderItemIn 0.4s ease both;`)}>{v.prodSearching ? ' ' : v.prod.cat}</div>
                <div key={v.prodKey + '-name'} style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); color:var(--ink); line-height:1.3; margin-top:3px; animation:sliderItemIn 0.4s ease both;`)}>{v.prodSearching ? '' : v.prod.name}</div>
                <div style={s(`display:flex; flex-wrap:wrap; gap:6px; margin-top:9px;`)}>
                  {(v.prodSearching ? [] : v.prod.specs).map((sp, i) => (
                    <span key={v.prodKey + '-sp' + i} style={s(`font-size:var(--mock-sm); font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:3px 8px; animation:sliderItemIn 0.4s ease both; animation-delay:${0.15 + i * 0.18}s;`)}>{sp}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={s(`margin-top:14px; min-height:96px;`)}>
              <div style={s(`display:flex; align-items:center; gap:8px; flex-wrap:wrap;`)}>
                <span style={s(`font-family:monospace; font-size:var(--mock-xs); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--violet);`)}>SEO-описание</span>
                <span key={v.prodKey + '-price'} style={s(`margin-left:auto; display:flex; align-items:baseline; gap:5px; animation:sliderItemIn 0.4s ease both;`)}>
                  <span style={s(`font-family:monospace; font-size:var(--t15); font-weight:800; color:var(--ink);`)}>{v.prodSearching ? '' : '₽' + v.prod.price}</span>
                  {!v.prodSearching && v.prod.priceNote ? <span style={s(`font-size:var(--mock-sm); color:var(--ink-faint); white-space:nowrap;`)}>{v.prod.priceNote}</span> : null}
                </span>
              </div>
              <div style={s(`font-size:12.5px; line-height:1.6; color:var(--ink-soft); margin-top:8px;`)}>
                {v.prodTypedText}
                <span style={s(`display:${v.prodCaret}; width:6px; height:12px; background:var(--violet); vertical-align:-1px; margin-left:1px; animation:genCursor 1s step-end infinite;`)}></span>
              </div>
            </div>

            <div style={s(`display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-top:16px; padding-top:14px; border-top:1px solid var(--line);`)}>
              <span style={s(`display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; color:${v.prodStatusColor};`)}>
                {v.prodDone
                  ? <span style={s(`width:14px; height:14px; border-radius:50%; background:#1F8A5B; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="8" height="8" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                  : <span style={s(`width:8px; height:8px; border-radius:50%; background:var(--violet); flex-shrink:0; animation:pulseDot 1.4s ease-in-out infinite;`)}></span>}
                {v.prodStatus}
              </span>
              <span style={s(`display:${v.prodBadges}; gap:6px; flex-wrap:wrap;`)}>
                <span style={s(`font-size:var(--mock-sm); font-weight:600; color:#1F8A5B; background:#EBF7F0; border-radius:6px; padding:4px 8px;`)}>SEO-текст ✓</span>
                <span style={s(`font-size:var(--mock-sm); font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 8px;`)}>alt-теги ✓</span>
                <span style={s(`font-size:var(--mock-sm); font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 8px;`)}>мета ✓</span>
              </span>
            </div>
          </div>

          <div style={s(`display:flex; align-items:center; gap:8px; margin-top:12px;`)}>
            <span style={s(`font-family:monospace; font-size:var(--mock-sm); color:var(--ink-faint);`)}>товар {v.prodStep} из {v.prodTotal} · дальше весь каталог</span>
            <span style={s(`margin-left:auto; display:flex; gap:5px;`)}>
              {Array.from({ length: v.prodTotal }).map((_, i) => (
                <span key={i} style={s(`width:${i === v.prodStep - 1 ? '18px' : '6px'}; height:6px; border-radius:3px; background:${i === v.prodStep - 1 ? 'var(--grad)' : '#D6DAE0'}; transition:width .35s cubic-bezier(.16,1,.3,1);`)}></span>
              ))}
            </span>
          </div>

          <div style={s(`display:flex; gap:10px; flex-wrap:wrap; margin-top:18px;`)}>
            {/* Цифры — не маркетинг, а замер на нашем боевом проекте
                (интернет-магазин стройматериалов, 19 763 карточки за июль):
                пик 1557 карточек/час, устойчивый темп ~1 100/час,
                98,6% ушли в публикацию без ручных правок. */}
            <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>1000+ карточек в час</span>
            <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>98,6% без правок</span>
            <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>Заполнение характеристик</span>
            <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>Единый стиль описаний</span>
            <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>Тексты под SEO-запросы</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="analytics" data-screen-label="ИИ-аналитика и отчёты" style={s(`position:relative; background:var(--ink); padding:${v.darkPad}; overflow:hidden;`)}>
    <div style={s(`position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:760px; height:760px; border-radius:50%; background:var(--grad); opacity:0.2; filter:blur(130px); pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; max-width:var(--wrap); margin:0 auto; padding:${v.darkInnerPad};`)}>
      <div data-reveal style={s(`max-width:calc(700px * var(--t-scale));`)}>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; display:inline-block;`)}>ИИ-аналитика</div>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(32px,4vw,46px); line-height:1.14; letter-spacing:-0.02em; margin:16px 0 0; color:#fff;`)}>Отчёты, которые приходят сами</h2>
        <p style={s(`font-size:var(--t18); line-height:1.6; color:rgba(255,255,255,0.65); margin:20px 0 0;`)}>Руководитель не строит отчёты — он их читает. ИИ собирает данные из CRM и телефонии и присылает выводы туда, где вам удобно: в Telegram или на почту.</p>
      </div>

      <div data-reveal-children="110" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:20px; margin-top:64px;`)}>
        <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(255,255,255,0.16); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);`)}>
          <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>Каждое утро</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; margin:12px 0 0; color:#fff;`)}>Сводка по продажам</h3>
          <p style={s(`font-size:var(--t145); line-height:1.6; color:rgba(255,255,255,0.7); margin:12px 0 0;`)}>Новые сделки и суммы, зависшие задачи, просроченные звонки, план-факт по менеджерам — короткий дайджест к началу дня.</p>
          <div style={s(`margin-top:auto; padding-top:24px;`)}>
            <div style={s(`background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:13px 15px;`)}>
              <div style={s(`display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;`)}>
                <span style={s(`font-family:monospace; font-size:var(--mock-sm); color:rgba(255,255,255,0.45);`)}>ИИ → Telegram, 09:00</span>
                <span style={s(`margin-left:auto; font-size:var(--mock-sm); font-weight:700; color:rgba(255,255,255,0.75); white-space:nowrap;`)}>Сергей В. · неделя</span>
              </div>

              {/* Столбцы — выручка по дням, точки над ними — обработанные лиды.
                  Пунктир = дневной план. Так видно и деньги, и нагрузку, а не
                  просто «красивая волна». */}
              <div style={s(`position:relative; height:74px; margin-top:12px;`)}>
                <div style={s(`position:absolute; left:0; right:0; top:27%; height:1px; background-image:repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0 4px, transparent 4px 8px); z-index:2;`)}></div>
                <span style={s(`position:absolute; right:0; top:27%; transform:translateY(-100%); font-family:monospace; font-size:8.5px; color:rgba(255,255,255,0.42); z-index:3;`)}>план ₽380К</span>
                <div style={s(`position:absolute; inset:0; display:flex; align-items:flex-end; gap:6px;`)}>
                  {[
                    { d: 'Пн', h: 40, sum: '210К', leads: 18 },
                    { d: 'Вт', h: 65, sum: '340К', leads: 24 },
                    { d: 'Ср', h: 54, sum: '280К', leads: 21 },
                    { d: 'Чт', h: 81, sum: '420К', leads: 27 },
                    { d: 'Пт', h: 100, sum: '520К', leads: 22, best: true },
                    { d: 'Сб', h: 14, sum: '70К', leads: 16 },
                  ].map((b, i) => (
                    <div key={b.d} style={s(`flex:1; min-width:0; display:flex; flex-direction:column; justify-content:flex-end; height:100%; position:relative;`)}>
                      <span style={s(`position:absolute; left:50%; bottom:calc(${b.h}% + 3px); transform:translateX(-50%); font-family:monospace; font-size:8px; font-weight:700; color:${b.best ? '#7BC4FF' : 'rgba(255,255,255,0.5)'}; white-space:nowrap; opacity:0; animation:dotPop .5s cubic-bezier(.2,1.1,.4,1) forwards; animation-delay:${0.5 + i * 0.11}s;`)}>{b.leads}</span>
                      <span style={s(`display:block; height:${b.h}%; border-radius:3px 3px 0 0; background:${b.best ? 'linear-gradient(180deg,#5E9FFF,#12A5E0)' : 'rgba(94,159,255,0.34)'}; transform-origin:bottom; animation:barGrow .7s cubic-bezier(.2,.8,.3,1) both; animation-delay:${i * 0.1}s;`)}></span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={s(`display:flex; gap:6px; margin-top:5px;`)}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((d) => (
                  <span key={d} style={s(`flex:1; min-width:0; text-align:center; font-family:monospace; font-size:8.5px; color:rgba(255,255,255,0.4);`)}>{d}</span>
                ))}
              </div>

              <div style={s(`display:flex; gap:8px; margin-top:11px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.1);`)}>
                <div style={s(`flex:1; min-width:0;`)}>
                  <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); color:#fff;`)}>₽1,84М</div>
                  <div style={s(`font-size:var(--mock-xs); color:rgba(255,255,255,0.45); margin-top:1px;`)}>выручка · +21%</div>
                </div>
                <div style={s(`flex:1; min-width:0;`)}>
                  <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); color:#fff;`)}>128</div>
                  <div style={s(`font-size:var(--mock-xs); color:rgba(255,255,255,0.45); margin-top:1px;`)}>лидов обработано</div>
                </div>
                <div style={s(`flex:1; min-width:0;`)}>
                  <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); color:#7BE0AC;`)}>22%</div>
                  <div style={s(`font-size:var(--mock-xs); color:rgba(255,255,255,0.45); margin-top:1px;`)}>конверсия · отдел 15%</div>
                </div>
              </div>

              <div style={s(`font-size:12.5px; line-height:1.55; color:rgba(255,255,255,0.85); margin-top:10px;`)}>«Сергей принёс ₽1,84 млн — 34% выручки отдела при 128 лидах. Пятница дала 28% недели: там были входящие с сайта, стоит усилить канал»</div>
            </div>
          </div>
        </div>

        <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(21,94,239,0.22), rgba(18,165,224,0.08)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(94,159,255,0.45); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(21,94,239,0.35), inset 0 1px 1px rgba(255,255,255,0.25);`)}>
          <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>После каждого звонка</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; margin:12px 0 0; color:#fff;`)}>Разбор звонков менеджеров</h3>
          <p style={s(`font-size:var(--t145); line-height:1.6; color:rgba(255,255,255,0.7); margin:12px 0 0;`)}>Транскрибация разговоров, оценка по вашему чек-листу, причины отказов и возражения — РОП слушает не всё подряд, а только проблемные звонки.</p>
          <div style={s(`margin-top:auto; padding-top:24px;`)}>
            <div style={s(`background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:13px 15px;`)}>
              <div style={s(`font-family:monospace; font-size:var(--mock-sm); color:rgba(255,255,255,0.45);`)}>оценка звонка · 4 мин 12 сек</div>
              <div aria-hidden="true" style={s(`display:flex; align-items:center; gap:3px; height:28px; margin-top:10px;`)}>
                <span style={s(`width:3px; height:35%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite;`)}></span>
                <span style={s(`width:3px; height:60%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.09s;`)}></span>
                <span style={s(`width:3px; height:85%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.18s;`)}></span>
                <span style={s(`width:3px; height:45%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.27s;`)}></span>
                <span style={s(`width:3px; height:95%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.36s;`)}></span>
                <span style={s(`width:3px; height:55%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.45s;`)}></span>
                <span style={s(`width:3px; height:30%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.54s;`)}></span>
                <span style={s(`width:3px; height:75%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.63s;`)}></span>
                <span style={s(`width:3px; height:50%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.72s;`)}></span>
                <span style={s(`width:3px; height:90%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.81s;`)}></span>
                <span style={s(`width:3px; height:40%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.9s;`)}></span>
                <span style={s(`width:3px; height:65%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -0.99s;`)}></span>
                <span style={s(`width:3px; height:35%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -1.08s;`)}></span>
                <span style={s(`width:3px; height:55%; border-radius:2px; background:rgba(94,159,255,0.75); animation:eqBar 1.2s ease-in-out infinite -1.17s;`)}></span>
              </div>
              <div style={s(`font-size:12.5px; line-height:1.55; color:rgba(255,255,255,0.85); margin-top:6px;`)}>«7/10 по чек-листу: не спросил про сроки, не назначил следующий шаг. Возражение — "дорого", отработано частично»</div>
            </div>
          </div>
        </div>

        <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(255,255,255,0.16); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);`)}>
          <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>По запросу</div>
          <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; margin:12px 0 0; color:#fff;`)}>Ответы цифрами из CRM</h3>
          <p style={s(`font-size:var(--t145); line-height:1.6; color:rgba(255,255,255,0.7); margin:12px 0 0;`)}>Спрашиваете как человека: «сколько сделок закрыл отдел в марте», «какая конверсия из заявки в оплату» — агент отвечает данными, а не ощущениями.</p>
          <div style={s(`margin-top:auto; padding-top:24px;`)}>
            <div style={s(`background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:13px 15px;`)}>
              <div style={s(`font-family:monospace; font-size:var(--mock-sm); color:rgba(255,255,255,0.45);`)}>вы → ИИ</div>
              <div style={s(`font-size:12.5px; line-height:1.55; color:rgba(255,255,255,0.85); margin-top:6px;`)}>«Почему в апреле упала конверсия?»</div>
              <div style={s(`position:relative; margin-top:7px;`)}>
                <span aria-hidden="true" style={s(`position:absolute; left:2px; top:6px; display:inline-flex; gap:4px; animation:aiQaDots 9s linear infinite;`)}>
                  <span style={s(`width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,0.75); animation:aiQaDot 0.9s ease-in-out infinite;`)}></span>
                  <span style={s(`width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,0.75); animation:aiQaDot 0.9s ease-in-out infinite 0.18s;`)}></span>
                  <span style={s(`width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,0.75); animation:aiQaDot 0.9s ease-in-out infinite 0.36s;`)}></span>
                </span>
                <div style={s(`font-size:12.5px; line-height:1.55; color:rgba(255,255,255,0.85); animation:aiQaAns 9s linear infinite;`)}>— «С 18% до 12%. Основная просадка — заявки с рекламы: 40 без первого звонка более суток»</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-top:36px;`)}>
        <p style={s(`font-size:var(--t15); color:rgba(255,255,255,0.55); margin:0; max-width:calc(560px * var(--t-scale));`)}>Отчёты собираем под ваши процессы: что измерять, как часто и куда присылать — решаем на диагностике.</p>
        <button className="aifx10" onClick={v.scrollToContact} style={s(`font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:var(--ink); background:#fff; border:none; padding:13px 28px; border-radius:999px; cursor:pointer; transition:transform 0.2s ease;`)}>Обсудить свои отчёты</button>
      </div>
    </div>
  </section>

  <section id="data" data-screen-label="Подключение к данным и БД" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; align-items:center;`)}>
      <div>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Данные</div>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Подключаемся напрямую к вашей базе данных</h2>
        <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:calc(560px * var(--t-scale));`)}>ИИ полезен ровно настолько, насколько он видит ваши реальные данные. Поэтому мы не просим «выгрузить всё в Excel», а подключаемся к источникам напрямую: PostgreSQL, MySQL/MariaDB, MS SQL, Oracle, ClickHouse, MongoDB, 1С и Битрикс24 — и агент отвечает по актуальным остаткам, ценам, заказам и статусам.</p>
        <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:16px 0 0; max-width:calc(560px * var(--t-scale));`)}>Нет прямого доступа к БД — работаем через REST/SOAP API, вебхуки, реплику или выгрузки по расписанию. Подберём вариант, который проходит у вашей службы безопасности.</p>

        <div style={s(`display:flex; flex-wrap:wrap; gap:10px; margin-top:28px;`)}>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>PostgreSQL</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>MySQL · MariaDB</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>MS SQL</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>Oracle</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>ClickHouse</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>MongoDB</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>1С</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>Битрикс24</span>
          <span style={s(`font-size:var(--t13); font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>REST · API · вебхуки</span>
        </div>
      </div>

      <div>
        <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; box-shadow:0 30px 60px -30px rgba(20,23,28,0.25), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Как это работает</div>

          <div style={s(`display:flex; flex-direction:column; gap:0; margin-top:14px;`)}>
            <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>01</span>
              <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Доступ только на чтение — по умолчанию</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>отдельный пользователь БД, ограниченный набор таблиц и полей; запись — только там, где вы её явно разрешили</div></div>
            </div>
            <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>02</span>
              <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Безопасный канал</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>SSH-туннель или VPN, доступ по белому списку IP, шифрование в пути — наружу база не смотрит</div></div>
            </div>
            <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>03</span>
              <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Данные не «уходят в нейросеть»</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>агент получает только результат конкретного запроса; при жёстких требованиях разворачиваем модель в вашем контуре</div></div>
            </div>
            <div style={s(`display:flex; gap:14px; padding:16px 0; align-items:baseline;`)}>
              <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>04</span>
              <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Всё логируется</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>видно, какой запрос агент сделал и на основании чего ответил — есть что показать аудиту</div></div>
            </div>
          </div>

          {/* Живой SQL-редактор: вопрос голосом → агент печатает запрос →
              прогон → строки результата → человеческий ответ. Подсветка как в
              редакторе: ключевые слова, строки и числа разного цвета — так
              сразу читается, что это настоящий запрос, а не картинка. */}
          <div style={s(`background:#0B1220; border:1px solid #1E2A3C; border-radius:14px; margin-top:22px; overflow:hidden;`)}>
            <div style={s(`display:flex; align-items:center; gap:8px; padding:9px 14px; background:#111C2E; border-bottom:1px solid #1E2A3C;`)}>
              <span style={s(`width:8px; height:8px; border-radius:2px; background:#4FC1FF; flex-shrink:0;`)}></span>
              <span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#8FA3BF;`)}>менеджер → ИИ-агент → PostgreSQL</span>
              <span style={s(`margin-left:auto; display:inline-flex; align-items:center; gap:5px; font-family:monospace; font-size:var(--mock-xs); color:#5FD08A; animation:sqlRun 14s linear infinite;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:#5FD08A; flex-shrink:0;`)}></span>12 ms</span>
            </div>

            <div style={s(`padding:14px 16px 16px;`)}>
              <div style={s(`display:flex; gap:8px; animation:sqlAsk 14s linear infinite;`)}>
                <span style={s(`font-family:monospace; font-size:11px; color:#5B6C86; flex-shrink:0;`)}>?</span>
                <span style={s(`font-size:12.5px; line-height:1.5; color:#C9D6E8;`)}>«Сколько ВВГнг 3×2,5 на складе в Ростове?»</span>
              </div>

              <div style={s(`margin-top:12px; font-family:'SFMono-Regular',ui-monospace,Menlo,Consolas,monospace; font-size:var(--sql-size); line-height:1.75; overflow-x:auto;`)}>
                <div style={s(`overflow:hidden; white-space:pre; width:0; animation:sqlLine1 14s steps(34,end) infinite;`)}><span style={s(`color:#4FC1FF; font-weight:600;`)}>SELECT</span><span style={s(`color:#D6E3F5;`)}> sku, stock, warehouse</span></div>
                <div style={s(`overflow:hidden; white-space:pre; width:0; animation:sqlLine2 14s steps(34,end) infinite;`)}><span style={s(`color:#4FC1FF; font-weight:600;`)}>  FROM</span><span style={s(`color:#9CDCFE;`)}> balances</span></div>
                <div style={s(`overflow:hidden; white-space:pre; width:0; animation:sqlLine3 14s steps(40,end) infinite;`)}><span style={s(`color:#4FC1FF; font-weight:600;`)}> WHERE</span><span style={s(`color:#9CDCFE;`)}> sku</span><span style={s(`color:#D6E3F5;`)}> = </span><span style={s(`color:#F09A76;`)}>&apos;VVG-3x2.5&apos;</span><span style={s(`color:#D6E3F5;`)}> AND city = </span><span style={s(`color:#F09A76;`)}>&apos;Ростов&apos;</span><span style={s(`color:#D6E3F5;`)}>;</span><span style={s(`display:inline-block; width:7px; height:13px; margin-left:2px; background:#4FC1FF; vertical-align:-2px; animation:sqlCaret 14s steps(1,end) infinite;`)}></span></div>
              </div>

              <div style={s(`margin-top:12px; border:1px solid #1E2A3C; border-radius:8px; overflow:hidden;`)}>
                <div style={s(`display:flex; gap:10px; padding:6px 10px; background:#111C2E; font-family:monospace; font-size:var(--mock-xs); letter-spacing:0.04em; text-transform:uppercase; color:#6B7F9C;`)}>
                  <span style={s(`flex:1.3; min-width:0;`)}>sku</span><span style={s(`flex:1; min-width:0; text-align:right;`)}>stock</span><span style={s(`flex:1.2; min-width:0; text-align:right;`)}>warehouse</span>
                </div>
                <div style={s(`display:flex; gap:10px; padding:6px 10px; font-family:monospace; font-size:11.5px; color:#D6E3F5; animation:sqlRow 14s linear infinite;`)}>
                  <span style={s(`flex:1.3; min-width:0; color:#F09A76;`)}>VVG-3x2.5</span><span style={s(`flex:1; min-width:0; text-align:right; color:#B5CEA8;`)}>860</span><span style={s(`flex:1.2; min-width:0; text-align:right;`)}>Ростов-1</span>
                </div>
                <div style={s(`display:flex; gap:10px; padding:6px 10px; border-top:1px solid #16202F; font-family:monospace; font-size:11.5px; color:#D6E3F5; animation:sqlRow 14s linear infinite; animation-delay:0.35s;`)}>
                  <span style={s(`flex:1.3; min-width:0; color:#F09A76;`)}>VVG-3x2.5</span><span style={s(`flex:1; min-width:0; text-align:right; color:#B5CEA8;`)}>400</span><span style={s(`flex:1.2; min-width:0; text-align:right;`)}>в пути</span>
                </div>
              </div>

              <div style={s(`display:flex; align-items:flex-start; gap:8px; margin-top:12px; padding-top:12px; border-top:1px solid #1E2A3C; animation:sqlAnswer 14s linear infinite;`)}>
                <span style={s(`width:17px; height:17px; border-radius:50%; background:#1F8A5B; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;`)}><svg width="9" height="9" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>
                <span style={s(`font-size:12.5px; color:#E6EEF9; line-height:1.5;`)}>«860 м в Ростове, ещё 400 м придут в четверг — поставить резерв?»</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="process" data-screen-label="Как внедряем ИИ" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:calc(720px * var(--t-scale));`)}>
      <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Процесс</div>
      <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Как устроено внедрение ИИ</h2>
      <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Не «купите подписку на нейросеть», а внедрение в процессы: начинаем с одного сценария, доказываем эффект цифрами — и только потом масштабируем.</p>
    </div>

    <div style={s(`max-width:860px; margin-top:56px;`)}>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--grad); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); box-shadow:0 8px 18px -6px rgba(21,94,239,0.5);`)}>01</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Диагностика процессов и данных</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>3–5 дней · бесплатно</span>
          </div>
          <p style={s(`font-size:var(--t16); line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:calc(640px * var(--t-scale));`)}>Смотрим, где рутина съедает часы: поток обращений, контент, отчёты, документы. Проверяем, какие данные есть для обучения ИИ, и выбираем 1–2 сценария с самым быстрым эффектом.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:var(--t145); color:var(--ink);`)}>карта сценариев с оценкой эффекта и сметой</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15);`)}>02</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Доступы и разбор архитектуры</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>3–10 дней · параллельно</span>
          </div>
          <p style={s(`font-size:var(--t16); line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:calc(640px * var(--t-scale));`)}>Самый недооценённый этап: доступы к Битрикс24, 1С, телефонии и базе данных согласовываются дольше, чем пишется код. Начинаем запрашивать их сразу и параллельно разбираем ваш ландшафт — что где стоит, какие версии, где реплика, а где живой контур, кто владелец каждой системы. Заранее находим места, где интеграция упрётся в чужой регламент.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:var(--t145); color:var(--ink);`)}>схема систем, список доступов и ответственных — без сюрпризов на запуске</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15);`)}>03</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Пилот на одном сценарии</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>2–3 недели</span>
          </div>
          <p style={s(`font-size:var(--t16); line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:calc(640px * var(--t-scale));`)}>Собираем решение на ваших данных: база знаний, прайсы, регламенты, история диалогов. Тестируем на реальных обращениях и меряем качество ответов до боевого запуска.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:var(--t145); color:var(--ink);`)}>работающая автоматизация и цифры «до/после»</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15);`)}>04</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Интеграция в системы</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>1–2 недели</span>
          </div>
          <p style={s(`font-size:var(--t16); line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:calc(640px * var(--t-scale));`)}>Подключаем ИИ к <a href="/bitrix24" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>Битрикс24</a>, мессенджерам, сайту, телефонии и 1С, а также напрямую к вашей базе данных — PostgreSQL, MySQL, MS SQL и другим, — чтобы агент работал на актуальных остатках, ценах и заказах. Настраиваем права и границы: что ИИ делает сам, что — только с подтверждением человека.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:var(--t145); color:var(--ink);`)}>ИИ работает в боевом контуре, под контролем</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15);`)}>05</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Обучение команды</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>3–4 дня</span>
          </div>
          <p style={s(`font-size:var(--t16); line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:calc(640px * var(--t-scale));`)}>Показываем, как ставить ИИ задачи, проверять его работу и что делать с нестандартными случаями. Фиксируем регламенты: где ИИ решает сам, где — человек.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:var(--t145); color:var(--ink);`)}>команда работает с ИИ уверенно, без страха</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15);`)}>06</div>
        </div>
        <div style={s(`min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Сопровождение и развитие</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>постоянно</span>
          </div>
          <p style={s(`font-size:var(--t16); line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:calc(640px * var(--t-scale));`)}>Следим за качеством ответов, дообучаем систему на новых данных и добавляем сценарии: после продаж — поддержка, после карточек — аналитика.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:var(--mock-sm); font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:var(--t145); color:var(--ink);`)}>система становится точнее с каждым месяцем</span></div>
        </div>
      </div>

    </div>
  </section>

  <section id="cases" data-screen-label="Кейсы и результаты" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:calc(720px * var(--t-scale));`)}>
      <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>Результаты</div>
      <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Типовые сценарии — и что они дают</h2>
      <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Три частые ситуации из проектов внедрения. Ваши цифры зависят от данных и процессов — честную оценку даём после диагностики.</p>
    </div>

    <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:24px; margin-top:56px; align-items:stretch;`)}>
      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:22px; padding:32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <span style={s(`align-self:flex-start; font-size:11.5px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:var(--blue); background:rgba(21,94,239,0.08); border:1px solid rgba(21,94,239,0.18); border-radius:999px; padding:6px 13px;`)}>Оптовая торговля</span>
        <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; letter-spacing:-0.01em; line-height:1.3; margin:18px 0 0; color:var(--ink);`)}>Каталог из 4 800 позиций описан за месяц</h3>
        <p style={s(`font-size:var(--t145); line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Контент-менеджер тратил 30–40 минут на карточку — каталог не был бы готов и за год. ИИ собирает карточки по прайсу поставщика, человек выборочно проверяет.</p>
        <div style={s(`display:flex; gap:12px; margin-top:auto; padding-top:24px;`)}>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>×12</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>быстрее на карточку</div>
          </div>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>100%</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>каталога в поиске</div>
          </div>
        </div>
      </div>

      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:22px; padding:32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <span style={s(`align-self:flex-start; font-size:11.5px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:var(--violet); background:rgba(18,165,224,0.08); border:1px solid rgba(18,165,224,0.2); border-radius:999px; padding:6px 13px;`)}>B2B-услуги</span>
        <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; letter-spacing:-0.01em; line-height:1.3; margin:18px 0 0; color:var(--ink);`)}>Заявки перестали «остывать» за ночь</h3>
        <p style={s(`font-size:var(--t145); line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Вечерние и ночные заявки ждали утра — часть клиентов уходила к тем, кто ответил первым. ИИ отвечает за минуту, квалифицирует и бронирует время звонка.</p>
        <div style={s(`display:flex; gap:12px; margin-top:auto; padding-top:24px;`)}>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>2 ч → 1 мин</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>время первого ответа</div>
          </div>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>+31%</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>заявок доходит до встречи</div>
          </div>
        </div>
      </div>

      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:22px; padding:32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <span style={s(`align-self:flex-start; font-size:11.5px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#1F8A5B; background:rgba(31,138,91,0.08); border:1px solid rgba(31,138,91,0.2); border-radius:999px; padding:6px 13px;`)}>Интернет-магазин</span>
        <h3 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; letter-spacing:-0.01em; line-height:1.3; margin:18px 0 0; color:var(--ink);`)}>Поддержка перестала тонуть в «где заказ?»</h3>
        <p style={s(`font-size:var(--t145); line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Операторы разгребали однотипные вопросы по статусам и доставке. ИИ отвечает по данным заказа сам, людям остаются возвраты и спорные случаи.</p>
        <div style={s(`display:flex; gap:12px; margin-top:auto; padding-top:24px;`)}>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>7 из 10</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>обращений закрывает ИИ</div>
          </div>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>24/7</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>без смен и очередей</div>
          </div>
        </div>
      </div>
    </div>

    <p data-reveal style={s(`font-size:var(--t14); color:var(--ink-faint); margin:26px 0 0;`)}>Сценарии обобщены по типовым проектам, без названий клиентов. Оценку эффекта для вашей компании даём на бесплатной диагностике.</p>
  </section>

  <section id="cost" data-screen-label="Стоимость внедрения ИИ" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; align-items:start;`)}>
      <div>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Стоимость</div>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Сколько стоит внедрение ИИ</h2>
        <p style={s(`font-size:var(--t18); line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:calc(560px * var(--t-scale));`)}>У ИИ-проектов нет честного прайса «для всех»: цена зависит от сценариев и данных, а не от тарифа. Поэтому мы начинаем с бесплатной диагностики — и только после неё фиксируем состав работ, сроки и смету в договоре.</p>
        <p style={s(`font-size:var(--t16); line-height:1.6; color:var(--ink-soft); margin:16px 0 0; max-width:calc(560px * var(--t-scale));`)}>Начать можно с малого: пилот на одном сценарии показывает эффект цифрами до того, как вы вкладываетесь в масштабирование.</p>
        <button className="aifx11" onClick={v.scrollToContact} style={s(`margin-top:30px; font-family:var(--font-inter),sans-serif; font-size:var(--t15); font-weight:600; color:#fff; background:var(--grad); border:none; padding:15px 30px; border-radius:14px; cursor:pointer; box-shadow:0 10px 24px rgba(21,94,239,0.25); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Получить оценку проекта</button>
      </div>

      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; box-shadow:0 30px 60px -30px rgba(20,23,28,0.25), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Что влияет на стоимость</div>
        <div style={s(`display:flex; flex-direction:column; gap:0; margin-top:14px;`)}>
          <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>01</span>
            <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Количество сценариев автоматизации</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>автоответы на заявки — одна задача, продажи + поддержка + контент и аналитика — другая</div></div>
          </div>
          <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>02</span>
            <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Объём и качество данных</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>готовая база знаний ускоряет запуск; разрозненные файлы и «знания в головах» — удлиняют</div></div>
          </div>
          <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>03</span>
            <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Интеграции</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>Битрикс24, 1С, сайт, телефония, нестандартные системы по API</div></div>
          </div>
          <div style={s(`display:flex; gap:14px; padding:16px 0; align-items:baseline;`)}>
            <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t13); color:var(--blue); flex-shrink:0;`)}>04</span>
            <div><div style={s(`font-size:var(--t155); font-weight:600; color:var(--ink);`)}>Требования к безопасности</div><div style={s(`font-size:var(--t14); color:var(--ink-soft); margin-top:3px;`)}>облачные модели или контур на ваших серверах, ограничения доступа к данным</div></div>
          </div>
        </div>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:22px; background:rgba(31,138,91,0.07); border:1px solid rgba(31,138,91,0.2); border-radius:12px; padding:14px 16px;`)}>
          <span style={s(`width:7px; height:7px; border-radius:50%; background:#1F8A5B; flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
          <span style={s(`font-size:var(--t14); font-weight:600; color:#1F8A5B;`)}>Диагностика и оценка проекта — бесплатно</span>
        </div>
      </div>
    </div>
  </section>

  <section id="faq" data-screen-label="FAQ" style={s(`padding:${v.secPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div style={s(`display:grid; grid-template-columns:${v.faqCols}; gap:${v.migGap}; align-items:start;`)}>
      <div data-reveal>
        <div style={s(`font-family:monospace; font-size:var(--t13); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>FAQ</div>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Частые вопросы о внедрении ИИ</h2>
        <p style={s(`font-size:var(--t17); line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:calc(420px * var(--t-scale));`)}>Не нашли свой вопрос — напишите нам, отвечаем в течение рабочего дня.</p>
        <button className="aifx12" onClick={v.scrollToContact} style={s(`margin-top:26px; font-family:var(--font-inter),sans-serif; font-size:var(--t14); font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); padding:13px 26px; border-radius:999px; cursor:pointer; transition:border-color 0.2s ease;`)}>Задать вопрос</button>
      </div>

      <div data-reveal-children="80" style={s(`display:flex; flex-direction:column; gap:14px;`)}>
        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg0}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq0} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Чем ИИ-агент отличается от чат-бота?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon0}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows0}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Чат-бот ходит по жёсткому скрипту и ломается на нестандартном вопросе. ИИ-агент понимает свободную речь, работает на данных вашей компании и выполняет действия в системах: создаёт сделку в CRM, готовит документ, ставит задачу менеджеру.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg1}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq1} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Какие задачи можно поручить ИИ уже сейчас?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon1}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows1}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Ответы клиентам в мессенджерах и на сайте, квалификация заявок, заполнение карточек товаров, SEO-тексты и описания, сводки по продажам, разбор звонков менеджеров, подготовка документов по шаблонам. Начинаем с того, что даст эффект быстрее всего.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg2}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq2} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Насколько это безопасно? Куда уходят наши данные?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon2}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows2}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Контур настраиваем под ваши требования: российские модели или размещение на ваших серверах, разграничение прав доступа. К вашей базе данных (PostgreSQL, MySQL, MS SQL, 1С) подключаемся отдельным пользователем с доступом только на чтение и только к нужным таблицам, через SSH-туннель или VPN. Агент видит ровно то, что ему явно разрешено, — и не может выгрузить базу «на сторону». <a href="#data" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>Подробнее о работе с данными</a>.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg7}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq7} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Можно ли подключить ИИ к нашей базе данных?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon7}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows7}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Да. Подключаемся напрямую к PostgreSQL, MySQL/MariaDB, MS SQL, Oracle, ClickHouse, MongoDB, а также к 1С и Битрикс24. Если прямой доступ к базе закрыт — работаем через REST/SOAP API, вебхуки, реплику или выгрузки по расписанию. По умолчанию доступ только на чтение и только к согласованным таблицам, через SSH-туннель или VPN.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg3}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq3} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Нужен ли Битрикс24, чтобы внедрить ИИ?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon3}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows3}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Нет. Глубже всего мы интегрируем агентов с <a href="/bitrix24" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>Битрикс24</a>, но агенты работают и с другими CRM, сайтом, телефонией и мессенджерами. Подключаемся к тем системам, которые у вас уже есть.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg4}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq4} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Что будет, если агент ошибётся?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon4}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows4}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Для каждого агента задаём границы: на что он отвечает сам, а что передаёт человеку. На пилоте измеряем качество ответов на реальных диалогах, критичные действия — отправка КП на крупную сумму, изменение заказа — выполняются с подтверждением сотрудника.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg5}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq5} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Сколько стоит внедрение ИИ и как быстро запуск?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon5}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows5}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Пилот на одном сценарии запускаем за 2–3 недели. Стоимость зависит от количества сценариев, объёма данных и интеграций — после бесплатной диагностики фиксируем состав работ и смету в договоре, без скрытых доплат.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg6}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq6} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:var(--font-inter),sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Заменит ли ИИ моих сотрудников?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon6}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:var(--t16); color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows6}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:var(--t15); line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Задача агентов — снять рутину, а не заменить команду. ИИ закрывает типовые обращения и черновую работу, люди занимаются сложными случаями и продажами. На практике компания успевает больше без расширения штата.</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section data-screen-label="Ссылка на Битрикс24" style={s(`padding:0 ${v.padX}; max-width:var(--wrap); margin:0 auto;`)}>
    <a className="aifx13" data-reveal href="/bitrix24" style={s(`display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; background:var(--ink); border-radius:24px; padding:${v.bannerPad}; text-decoration:none; position:relative; overflow:hidden; transition:transform 0.25s ease;`)}>
      <span style={s(`position:absolute; top:-120px; right:-80px; width:340px; height:340px; border-radius:50%; background:var(--grad); opacity:0.25; filter:blur(90px); pointer-events:none;`)}></span>
      <span style={s(`position:relative; z-index:1; display:block;`)}>
        <span style={s(`display:block; font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent;`)}>Смотрите также</span>
        <span style={s(`display:block; font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(20px,2.4vw,26px); letter-spacing:-0.01em; color:#fff; margin-top:10px;`)}>Внедрение и поддержка Битрикс24</span>
        <span style={s(`display:block; font-size:var(--t15); color:rgba(255,255,255,0.6); margin-top:8px; max-width:calc(520px * var(--t-scale));`)}>Настройка CRM под процессы, интеграции с 1С и телефонией, миграция с amoCRM, поддержка по SLA — на отдельной странице.</span>
      </span>
      <span style={s(`position:relative; z-index:1; display:inline-flex; align-items:center; gap:8px; font-size:var(--t15); font-weight:600; color:#fff; border:1px solid rgba(255,255,255,0.3); border-radius:999px; padding:13px 26px; white-space:nowrap;`)}>Подробнее о Битрикс24 →</span>
    </a>
  </section>

  <section id="contact" data-screen-label="Контакты CTA" style={s(`padding:${v.contactSecPad}; max-width:var(--wrap); margin:0 auto;`)}>
    <div data-reveal style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48)); backdrop-filter:blur(28px) saturate(180%); -webkit-backdrop-filter:blur(28px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:28px; padding:${v.contactPadding}; display:grid; grid-template-columns:${v.contactColumns}; gap:56px; position:relative; overflow:hidden; box-shadow:0 50px 90px -50px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
      <div style={s(`position:absolute; top:-140px; right:-140px; width:420px; height:420px; border-radius:50%; background:var(--grad); opacity:0.08; filter:blur(100px); pointer-events:none;`)}></div>

      <div style={s(`position:relative; z-index:1;`)}>
        <h2 style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:clamp(26px,3.6vw,42px); letter-spacing:-0.02em; line-height:1.15; color:var(--ink); margin:0;`)}>Расскажите, что болит — покажем, как это закрыть</h2>
        <p style={s(`font-size:var(--t17); line-height:1.6; color:var(--ink-soft); margin:18px 0 0; max-width:calc(420px * var(--t-scale));`)}>Опишите задачу в двух словах — на бесплатной диагностике разберём её, покажем сценарий и назовём сроки пилота. Если сомневаетесь, с чего начать, — поможем определиться и расставить приоритеты.</p>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:36px;`)}>
          <span style={s(`width:26px; height:26px; border-radius:8px; background:var(--grad); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="#fff"></path></svg></span>
          <span style={s(`font-size:var(--t14); font-weight:600; color:var(--ink-soft);`)}>Пилот за 2–3 недели · данные под вашим контролем</span>
        </div>
      </div>

      <div style={s(`position:relative; z-index:1; display:flex; flex-direction:column; justify-content:center; gap:24px; min-height:260px;`)}>
        <div style={s(`display:flex; flex-direction:column; gap:12px;`)}>
          <a className="aifx14" href={v.tgHref} target="_blank" rel="noopener" onClick={() => ymGoal("telegram")} style={s(`display:flex; align-items:center; justify-content:center; font-family:var(--font-inter),sans-serif; font-size:var(--t16); font-weight:600; color:#fff; background:var(--grad); border-radius:12px; padding:16px 28px; text-decoration:none; box-shadow:0 10px 24px rgba(21,94,239,0.22); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Написать в Telegram</a>
          <a className="aifx15" href={v.waHref} target="_blank" rel="noopener" onClick={() => ymGoal("whatsapp")} style={s(`display:flex; align-items:center; justify-content:center; font-family:var(--font-inter),sans-serif; font-size:var(--t16); font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); border-radius:12px; padding:16px 28px; text-decoration:none; transition:border-color 0.2s ease;`)}>Написать в WhatsApp</a>
        </div>
        <div style={s(`font-size:var(--t13); color:var(--ink-faint);`)}>Отвечаем в течение рабочего дня</div>
      </div>
    </div>
  </section>

  <footer style={s(`padding:0 ${v.padX} 48px; max-width:var(--wrap); margin:0 auto; display:flex; flex-direction:${v.footerDirection}; align-items:${v.footerAlign}; justify-content:space-between; gap:24px; border-top:1px solid var(--line); padding-top:36px;`)}>
    <div style={s(`display:flex; align-items:center; gap:10px;`)}>
      <img src="/logo.png" alt="" width="28" height="28" style={s(`display:block; flex-shrink:0;`)} />
      <span style={s(`font-family:var(--font-manrope),sans-serif; font-weight:800; font-size:var(--t15); color:var(--ink);`)}>ETHOS</span>
      <span style={s(`font-size:var(--t13); color:var(--ink-faint); margin-left:4px;`)}>· Битрикс24 и ИИ</span>
    </div>
    <div style={s(`display:flex; gap:24px; flex-wrap:wrap;`)}>
      <a href="/" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Главная</a>
      <a href="/bitrix24" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Битрикс24</a>
      <a href="#agents" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Сценарии</a>
      <a href="#assistant" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>ИИ-ассистент</a>
      <a href="#data" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Ваши данные</a>
      <a href="#process" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>Внедрение</a>
      <a href="#faq" style={s(`font-size:var(--t14); color:var(--ink-soft); text-decoration:none;`)}>FAQ</a>
    </div>
    <div style={s(`display:flex; flex-direction:column; gap:8px; font-size:var(--t13); color:var(--ink-faint); line-height:1.6;`)}><div style={s(`display:flex; gap:14px; flex-wrap:wrap; align-items:center;`)}><a href="tel:+79256777027" onClick={() => ymGoal('phone')} style={s(`color:var(--ink); font-weight:600; text-decoration:none;`)}>+7 925 677-70-27</a><a href="mailto:magomedov_zak_05@mail.ru" style={s(`color:var(--ink-soft); text-decoration:none; overflow-wrap:anywhere;`)}>magomedov_zak_05@mail.ru</a></div><div>ИП Магомедов З. А. · ИНН 054210247290 · ОГРНИП 326050000095170</div><div style={s(`display:flex; gap:14px; flex-wrap:wrap; align-items:center;`)}><a href="/contacts" style={s(`color:var(--ink-faint); text-decoration:none; border-bottom:1px solid var(--line);`)}>Контакты и реквизиты</a><a href="/privacy" style={s(`color:var(--ink-faint); text-decoration:none; border-bottom:1px solid var(--line);`)}>Политика конфиденциальности</a><span>© 2026 ETHOS</span></div></div>
  </footer>

</div>

      </>
    );
  }
}
