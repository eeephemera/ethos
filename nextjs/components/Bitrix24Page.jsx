'use client';
import React from 'react';
import { s } from './_ui';

const FXCSS = ".b24fx0:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.b24fx1:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.b24fx2:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.b24fx3:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.b24fx4:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.b24fx5:hover{background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.b24fx6:hover{transform:translateY(-1px) !important; box-shadow:0 12px 26px -6px rgba(21,94,239,0.55), inset 0 1px 1px rgba(255,255,255,0.55) !important}\n.b24fx7:hover{color:var(--ink) !important}\n.b24fx8:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.32) !important}\n.b24fx9:hover{border-color:var(--ink) !important}\n.b24fx10:hover{transform:translateY(-2px) !important}\n.b24fx11:hover{border-color:var(--ink) !important}\n.b24fx12:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.32) !important}\n.b24fx13:hover{border-color:var(--ink) !important}\n.b24fx14:hover{border-color:var(--ink) !important}\n.b24fx15:hover{transform:translateY(-3px) !important}\n.b24fx16:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.3) !important}\n.b24fx17:hover{border-color:var(--ink) !important}";

export default class Bitrix24Page extends React.Component {
  state = {
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 1180 : false,
    mobileMenuOpen: false,
    mounted: false,
    openFaq: 0
  };

  progressRef = React.createRef();
  dragRef = React.createRef();
  workCountRef = React.createRef();
  workSumRef = React.createRef();
  succCountRef = React.createRef();
  succSumRef = React.createRef();

  componentDidMount() {
    this.handleResize = () => {
      const w = Math.min(window.innerWidth || 1e4, (document.documentElement && document.documentElement.clientWidth) || 1e4);
      const isMobile = w < 1180;
      if (isMobile !== this.state.isMobile) {
        this.setState({ isMobile, mobileMenuOpen: isMobile ? this.state.mobileMenuOpen : false });
      }
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    this.handleResize();
    this._sizeTimer = setTimeout(this.handleResize, 400);

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

    this.setupKanbanDrag();
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

  // Синхронизация счётчиков канбана с CSS-анимацией переноса сделки
  setupKanbanDrag() {
    const card = this.dragRef.current;
    if (!card) return;
    const D = 7000;
    const set = (ref, v) => { if (ref.current) ref.current.textContent = v; };
    const phase = (p) => {
      if (p === 0) {
        set(this.workCountRef, '2'); set(this.workSumRef, '₽1,22M');
        set(this.succCountRef, '1'); set(this.succSumRef, '₽2,10M');
      } else if (p === 1) {
        set(this.workCountRef, '1'); set(this.workSumRef, '₽740K');
        set(this.succCountRef, '1'); set(this.succSumRef, '₽2,10M');
      } else {
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

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    clearTimeout(this._sizeTimer);
    window.removeEventListener('scroll', this._onScroll);
    clearTimeout(this.mountTimer);
    clearTimeout(this._revealTimer);
    clearTimeout(this._revealFailsafe);
    (this._dragTimers || []).forEach(clearTimeout);
  }

  entrance(delay) {
    return this.state.mounted
      ? 'opacity:1; transform:translateY(0); transition:transform 0.7s cubic-bezier(.16,1,.3,1) ' + delay + 's;'
      : 'opacity:1; transform:translateY(14px);';
  }

  toggleMobileMenu = () => this.setState(s => ({ mobileMenuOpen: !s.mobileMenuOpen }));
  closeMobileMenu = () => this.setState({ mobileMenuOpen: false });

  renderVals() {
    const { isMobile, mobileMenuOpen, openFaq } = this.state;

    const vals = {
      padX: isMobile ? '20px' : '48px',
      heroPad: isMobile ? '44px 20px 72px' : '72px 48px 100px',
      heroCols: isMobile ? '1fr' : '0.95fr 1.05fr',
      heroGap: isMobile ? '0px' : '72px',
      heroVisualMt: isMobile ? '52px' : '0px',
      h1Size: isMobile ? 'clamp(30px, 8.6vw, 38px)' : 'clamp(38px, 4.4vw, 56px)',
      h2Size: isMobile ? '28px' : 'clamp(30px, 3vw, 40px)',
      kanbanHeight: isMobile ? '330px' : '400px',
      secPad: isMobile ? '78px 20px' : '110px 48px',
      darkPad: isMobile ? '84px 0' : '120px 0',
      darkInnerPad: isMobile ? '0 20px' : '0 48px',
      cols3: isMobile ? '1fr' : 'repeat(3, 1fr)',
      migCols: isMobile ? '1fr' : '1.05fr 0.95fr',
      migGap: isMobile ? '40px' : '72px',
      migCardPad: isMobile ? '30px 24px' : '42px 44px',
      faqCols: isMobile ? '1fr' : '0.8fr 1.2fr',
      stepGap: isMobile ? '18px' : '30px',
      bannerPad: isMobile ? '30px 24px' : '40px 52px',
      contactSecPad: isMobile ? '78px 20px 80px' : '110px 48px 120px',
      contactColumns: isMobile ? '1fr' : '1fr 1fr',
      contactPadding: isMobile ? '36px 24px' : '64px',
      footerDirection: isMobile ? 'column' : 'row',
      footerAlign: isMobile ? 'flex-start' : 'center',

      navDisplay: isMobile ? 'none' : 'flex',
      hamburgerDisplay: isMobile ? 'flex' : 'none',
      mobileMenuMaxHeight: mobileMenuOpen ? '480px' : '0px',
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
      dragRef: this.dragRef,
      workCountRef: this.workCountRef,
      workSumRef: this.workSumRef,
      succCountRef: this.succCountRef,
      succSumRef: this.succSumRef,

      scrollToContact: () => {
        const el = document.getElementById('contact');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      },
      scrollToContactMobile: () => {
        this.closeMobileMenu();
        const el = document.getElementById('contact');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }
    };

    for (let i = 0; i < 7; i++) {
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


<div style={s(`--bg:#FAFAF8; --paper:#FFFFFF; --ink:#14171C; --ink-soft:#535C69; --ink-faint:#8A8F99; --line:#E7E6E2; --blue:#155EEF; --violet:#12A5E0; --grad:linear-gradient(135deg, var(--blue), var(--violet)); font-family:'Inter',sans-serif; background:var(--bg); color:var(--ink); min-height:100vh; position:relative; isolation:isolate; overflow-x:hidden;`)}>

  <div ref={v.progressRef} style={s(`position:fixed; top:0; left:0; height:3px; width:0; z-index:70; background:linear-gradient(90deg, var(--blue), var(--violet)); box-shadow:0 0 14px rgba(21,94,239,0.55); pointer-events:none;`)}></div>

  <div aria-hidden="true" style={s(`position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;`)}>
    <div style={s(`position:absolute; top:-12%; left:-8%; width:55vw; height:55vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(21,94,239,0.5), transparent 68%); filter:blur(80px); animation:driftBlobA 22s ease-in-out infinite alternate;`)}></div>
    <div style={s(`position:absolute; top:10%; right:-14%; width:50vw; height:50vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(18,165,224,0.46), transparent 68%); filter:blur(85px); animation:driftBlobB 27s ease-in-out infinite alternate;`)}></div>
    <div style={s(`position:absolute; bottom:-20%; left:20%; width:54vw; height:54vw; border-radius:50%; background:radial-gradient(circle at 50% 50%, rgba(139,92,246,0.4), transparent 70%); filter:blur(95px); animation:driftBlobA 31s ease-in-out infinite alternate;`)}></div>
  </div>

  <header style={s(`position:sticky; top:14px; z-index:50; margin:14px ${v.padX} 0; display:flex; align-items:center; justify-content:space-between; padding:12px 14px 12px 20px; background:linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.34)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.7); border-radius:22px; box-shadow:0 16px 40px -16px rgba(20,23,28,0.32), inset 0 1px 1px rgba(255,255,255,0.9);`)}>

    <a href="/" style={s(`display:flex; align-items:center; gap:12px; text-decoration:none;`)}>
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
      <span style={s(`display:flex; align-items:baseline; gap:8px;`)}>
        <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; color:var(--ink);`)}>Терра</span>
        <span style={s(`font-size:12px; font-weight:600; color:var(--ink-faint); white-space:nowrap;`)}>· Битрикс24</span>
      </span>
    </a>

    <div style={s(`display:${v.navDisplay}; align-items:center; gap:24px;`)}>
      <a className="b24fx0" href="#steps" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Этапы</a>
      <a className="b24fx1" href="#integrations" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Интеграции</a>
      <a className="b24fx2" href="#migration" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Миграция</a>
      <a className="b24fx3" href="#sla" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Поддержка</a>
      <a className="b24fx4" href="#faq" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>FAQ</a>
      <a className="b24fx5" href="/ai" style={s(`font-size:15px; font-weight:500; color:var(--blue); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--blue),var(--blue)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), transform 0.25s cubic-bezier(.16,1,.3,1);`)}>ИИ-решения</a>
      <button className="b24fx6" onClick={v.scrollToContact} style={s(`font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:#fff; background:linear-gradient(135deg, rgba(21,94,239,0.92), rgba(18,165,224,0.82)); border:1px solid rgba(255,255,255,0.45); padding:12px 26px; border-radius:999px; cursor:pointer; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); box-shadow:0 8px 20px -6px rgba(21,94,239,0.45), inset 0 1px 1px rgba(255,255,255,0.55); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Получить консультацию</button>
    </div>

    <button onClick={v.toggleMobileMenu} style={s(`display:${v.hamburgerDisplay}; width:42px; height:42px; border-radius:10px; border:1px solid var(--line); background:var(--paper); flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer;`)}>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
    </button>

    <div style={s(`position:absolute; top:calc(100% + 8px); left:0; right:0; overflow:hidden; max-height:${v.mobileMenuMaxHeight}; transition:max-height 0.35s cubic-bezier(.16,1,.3,1); z-index:49;`)}>
      <div style={s(`display:flex; flex-direction:column; padding:22px 24px 30px; gap:20px; background:#FFFFFF; border:1px solid var(--line); border-radius:20px; box-shadow:0 24px 48px -16px rgba(20,23,28,0.3);`)}>
        <a href="/" style={s(`display:inline-flex; align-items:center; gap:8px; font-size:16px; font-weight:600; color:var(--ink-soft); text-decoration:none; padding-bottom:14px; border-bottom:1px solid var(--line);`)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={s(`flex-shrink:0; display:block;`)}><path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Главная</span></a>
        <a href="#steps" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Этапы</a>
        <a href="#integrations" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Интеграции</a>
        <a href="#migration" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Миграция</a>
        <a href="#sla" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Поддержка</a>
        <a href="#faq" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>FAQ</a>
        <a href="/ai" style={s(`font-size:16px; font-weight:600; color:var(--blue); text-decoration:none;`)}>ИИ-решения →</a>
        <button onClick={v.scrollToContactMobile} style={s(`font-family:'Inter',sans-serif; font-size:15px; font-weight:600; color:#fff; background:var(--blue); border:none; padding:14px 22px; border-radius:999px; cursor:pointer; margin-top:6px;`)}>Получить консультацию</button>
      </div>
    </div>
  </header>

  <section id="hero" data-screen-label="Hero — внедрение Битрикс24" style={s(`position:relative; padding:${v.heroPad}; max-width:1360px; margin:0 auto; overflow:visible;`)}>
    <div style={s(`position:absolute; top:-140px; right:-100px; width:540px; height:540px; border-radius:50%; background:var(--blue); opacity:0.13; filter:blur(95px); animation:driftBlobA 17s ease-in-out infinite alternate; z-index:0; pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; display:grid; grid-template-columns:${v.heroCols}; gap:${v.heroGap}; align-items:center;`)}>
      <div>
        <nav aria-label="Хлебные крошки" style={s(`display:flex; align-items:center; gap:8px; font-size:13px; color:var(--ink-faint); ${v.entranceBadge}`)}>
          <a className="b24fx7" href="/" style={s(`color:var(--ink-faint); text-decoration:none;`)}>Главная</a>
          <span aria-hidden="true">→</span>
          <span style={s(`color:var(--ink-soft); font-weight:500;`)}>Битрикс24</span>
        </nav>

        <div style={s(`display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.32)); backdrop-filter:blur(18px) saturate(180%); -webkit-backdrop-filter:blur(18px) saturate(180%); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:6px 16px 6px 6px; box-shadow:0 1px 2px rgba(20,23,28,0.05); margin-top:22px; ${v.entranceBadge}`)}>
          <span style={s(`width:26px; height:26px; border-radius:8px; background:repeating-linear-gradient(45deg, #ECEBE7, #ECEBE7 4px, #F6F6F4 4px, #F6F6F4 8px); border:1px dashed #C9CDD3; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:8px; color:#8A8F99;`)}>Б24</span>
          <span style={s(`font-size:14px; font-weight:600; color:var(--ink); white-space:nowrap;`)}>Официальный партнёр · Enterprise</span>
        </div>

        <h1 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h1Size}; line-height:1.07; letter-spacing:-0.03em; margin:26px 0 0; color:var(--ink); ${v.entranceH1}`)}>
          Внедрение и поддержка<br />
          <span style={s(`background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent;`)}>Битрикс24 под ключ</span>
        </h1>

        <p style={s(`font-size:18px; line-height:1.65; color:var(--ink-soft); max-width:540px; margin:22px 0 0; ${v.entranceP}`)}>
          Настраиваем CRM и воронки под ваши процессы, подключаем 1С, телефонию и сайт, аккуратно переносим данные из amoCRM и Excel — и сопровождаем систему по SLA после запуска.
        </p>

        <div style={s(`display:flex; align-items:center; gap:22px; margin-top:34px; flex-wrap:wrap; ${v.entranceCta}`)}>
          <button className="b24fx8" onClick={v.scrollToContact} style={s(`font-family:'Inter',sans-serif; font-size:16px; font-weight:600; color:#fff; background:linear-gradient(135deg, rgba(21,94,239,0.95), rgba(18,165,224,0.85)); border:1px solid rgba(255,255,255,0.45); padding:16px 32px; border-radius:16px; white-space:nowrap; cursor:pointer; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); box-shadow:0 12px 28px -6px rgba(21,94,239,0.45), inset 0 1px 1px rgba(255,255,255,0.6); transition:transform 0.25s ease, box-shadow 0.25s ease;`)}>Получить консультацию</button>
          <a className="b24fx9" href="#steps" style={s(`font-size:16px; font-weight:600; color:var(--ink); display:inline-flex; align-items:center; gap:8px; padding:16px 2px; text-decoration:none; border-bottom:1px solid transparent; transition:border-color 0.25s ease;`)}>Этапы внедрения ↓</a>
        </div>

        <div style={s(`display:flex; gap:24px; flex-wrap:wrap; margin-top:38px; ${v.entranceCta}`)}>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:14px; color:var(--ink-soft);`)}>Запуск от 2 недель</span></div>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--violet); flex-shrink:0;`)}></span><span style={s(`font-size:14px; color:var(--ink-soft);`)}>Договор и SLA</span></div>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#1F8A5B; flex-shrink:0;`)}></span><span style={s(`font-size:14px; color:var(--ink-soft);`)}>Обучение включено</span></div>
        </div>
      </div>

      <div style={s(`margin-top:${v.heroVisualMt}; ${v.entranceCard}`)}>
        <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(26px) saturate(180%); -webkit-backdrop-filter:blur(26px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:10px; box-shadow:0 40px 70px -24px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <div style={s(`height:${v.kanbanHeight}; background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden; display:flex; flex-direction:column;`)}>
            <div style={s(`display:flex; align-items:center; gap:8px; padding:11px 16px; border-bottom:1px solid var(--line); background:#fff;`)}>
              <span style={s(`width:22px; height:22px; border-radius:6px; background:#155EEF; display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="12" height="12" viewBox="0 0 24 24"><path d="M4 5h16l-5.5 7v5.5L9.5 20v-8L4 5z" fill="#fff"></path></svg></span>
              <span style={s(`font-family:'Manrope',sans-serif; font-weight:700; font-size:13px; color:var(--ink);`)}>Сделки · Канбан</span>
              <span style={s(`display:inline-flex; align-items:center; font-size:10px; font-weight:600; color:var(--ink-faint); background:#F1F3F5; border-radius:6px; padding:3px 8px;`)}>Мои сделки</span>
              <span style={s(`margin-left:auto; font-size:11px; color:var(--ink-faint);`)}>Итого</span>
              <span style={s(`font-family:monospace; font-size:13px; font-weight:800; color:var(--ink); animation:mkCountPulse 3.4s ease-in-out infinite;`)}>₽4,78M</span>
            </div>
            <div style={s(`position:relative; flex:1; display:flex; gap:10px; padding:14px; background:#EEF2F6; min-height:0;`)}>

              <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; min-width:0;`)}>
                <div style={s(`border-radius:8px; background:#E3E8EE; padding:7px 10px;`)}>
                  <div style={s(`display:flex; align-items:center; justify-content:space-between;`)}><span style={s(`font-size:11px; font-weight:700; color:#5A626E;`)}>Новые</span><span style={s(`font-size:10px; font-weight:700; color:#8A8F99;`)}>2</span></div>
                  <div style={s(`font-family:monospace; font-size:10px; font-weight:700; color:#5A626E; margin-top:2px;`)}>₽1,46M</div>
                </div>
                <div style={s(`background:#fff; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #9AA2AE;`)}>
                  <div style={s(`font-size:11.5px; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>ТД «Восток»</div>
                  <div style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽260 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#B8860B;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>ТВ</span><span style={s(`width:5px;height:5px;border-radius:50%;background:#D6DAE0;`)}></span><span style={s(`width:5px;height:5px;border-radius:50%;background:#D6DAE0;`)}></span></div>
                </div>
                <div style={s(`background:#fff; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #9AA2AE;`)}>
                  <div style={s(`font-size:11.5px; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>Аптека, сеть</div>
                  <div style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽1 200 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#7A6FF0;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>АС</span><span style={s(`width:5px;height:5px;border-radius:50%;background:#D6DAE0;`)}></span></div>
                </div>
              </div>

              <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; min-width:0;`)}>
                <div style={s(`border-radius:8px; background:#DCE8FF; padding:7px 10px;`)}>
                  <div style={s(`display:flex; align-items:center; justify-content:space-between;`)}><span style={s(`font-size:11px; font-weight:700; color:#155EEF;`)}>В работе</span><span ref={v.workCountRef} style={s(`font-size:10px; font-weight:700; color:#155EEF;`)}>2</span></div>
                  <div ref={v.workSumRef} style={s(`font-family:monospace; font-size:10px; font-weight:700; color:#155EEF; margin-top:2px;`)}>₽1,22M</div>
                </div>
                <div style={s(`background:#fff; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.09); border-left:3px solid #155EEF;`)}>
                  <div style={s(`font-size:11.5px; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>СтройДом</div>
                  <div style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽740 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#155EEF;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>СД</span><span style={s(`width:5px;height:5px;border-radius:50%;background:#3DDC84;`)}></span></div>
                </div>
              </div>

              <div style={s(`flex:1; display:flex; flex-direction:column; gap:8px; min-width:0;`)}>
                <div style={s(`border-radius:8px; background:#DCF3E6; padding:7px 10px;`)}>
                  <div style={s(`display:flex; align-items:center; justify-content:space-between;`)}><span style={s(`font-size:11px; font-weight:700; color:#1F8A5B;`)}>Успех</span><span ref={v.succCountRef} style={s(`font-size:10px; font-weight:700; color:#1F8A5B;`)}>1</span></div>
                  <div ref={v.succSumRef} style={s(`font-family:monospace; font-size:10px; font-weight:700; color:#1F8A5B; margin-top:2px;`)}>₽2,10M</div>
                </div>
                <div style={s(`background:#EBF7F0; border-radius:8px; padding:9px 10px; box-shadow:0 1px 3px rgba(20,23,28,.06); border-left:3px solid #1F8A5B;`)}>
                  <div style={s(`font-size:11.5px; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>IT-Парк</div>
                  <div style={s(`font-family:monospace; font-size:11px; font-weight:800; color:#1F8A5B; margin-top:4px;`)}>₽2 100 000</div>
                  <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}><span style={s(`width:16px;height:16px;border-radius:50%;background:#1F8A5B;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>IP</span><span style={s(`width:14px;height:14px;border-radius:50%;background:#1F8A5B;display:flex;align-items:center;justify-content:center;`)}><svg width="8" height="8" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span></div>
                </div>
              </div>

              <div ref={v.dragRef} style={s(`position:absolute; left:calc(34px + 2*(100% - 48px)/3); width:calc((100% - 48px)/3); top:141px; background:#fff; border-radius:8px; padding:9px 10px; border-left:3px solid #12A5E0; box-shadow:0 2px 6px rgba(20,23,28,.12); transform:translate(calc(-100% - 10px),0); pointer-events:none; z-index:7; animation:b24Carry 7s cubic-bezier(.6,.02,.35,1) infinite; animation-play-state:${v.heroPlayState}; will-change:transform,opacity;`)}>
                <div style={s(`display:flex; align-items:center; gap:5px;`)}>
                  <span style={s(`font-size:11.5px; font-weight:700; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;`)}>ООО «Ромашка»</span>
                  <span style={s(`width:6px;height:6px;border-radius:50%;background:#3DDC84;flex-shrink:0;`)}></span>
                </div>
                <div style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); margin-top:4px;`)}>₽480 000</div>
                <div style={s(`display:flex; align-items:center; gap:5px; margin-top:7px;`)}>
                  <span style={s(`width:16px;height:16px;border-radius:50%;background:#12A5E0;color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;`)}>РМ</span>
                  <span style={s(`font-size:9px; color:var(--ink-faint); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>перетаскивание</span>
                </div>
                <div style={s(`position:absolute; right:14px; bottom:-2px; z-index:8; pointer-events:none; filter:drop-shadow(0 3px 4px rgba(0,0,0,.32)); animation:b24Press 7s cubic-bezier(.6,.02,.35,1) infinite; animation-play-state:${v.heroPlayState};`)}>
                  <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l6 16 2.4-6.4L19 9 4 2z" fill="#1B1F24" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"></path></svg>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div style={s(`display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px;`)}>
          <span style={s(`display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--ink-soft); background:linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.4)); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:7px 14px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>1С · счета и остатки</span>
          <span style={s(`display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--ink-soft); background:linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.4)); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:7px 14px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite; animation-delay:.4s;`)}></span>Телефония · записи звонков</span>
          <span style={s(`display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--ink-soft); background:linear-gradient(135deg, rgba(255,255,255,0.65), rgba(255,255,255,0.4)); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:7px 14px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite; animation-delay:.8s;`)}></span>Сайт · лиды с форм</span>
        </div>
        <div style={s(`font-family:monospace; font-size:11px; color:var(--ink-faint); margin-top:12px; text-align:center;`)}>// так выглядит CRM после внедрения</div>
      </div>
    </div>
  </section>

  <section id="scope" data-screen-label="Что настраиваем" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:720px;`)}>
      <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Настройка под процессы</div>
      <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Что настраиваем во внедрении</h2>
      <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Не «включаем всё подряд», а собираем систему из блоков, которые нужны вашим процессам — без перегруза для команды.</p>
    </div>

    <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:24px; margin-top:56px;`)}>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>01</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>CRM и воронки продаж</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>Стадии под ваш цикл сделки, обязательные поля, карточки сделок и клиентов — без лишних кнопок.</p>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>02</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Роботы и автоматизация</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>Автозадачи, триггеры и напоминания: сделки не зависают, менеджеры не забывают про клиентов.</p>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>03</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Задачи и проекты</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>Канбан, шаблоны задач, чек-листы и сроки — регламенты компании живут в системе, а не в чатах.</p>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>04</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Телефония и контакт-центр</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>Звонки из карточки, записи разговоров, распределение обращений и открытые линии из мессенджеров.</p>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>05</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Отчёты и дашборды</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>Воронка, план-факт, нагрузка менеджеров: руководитель видит картину в системе, а не в Excel по пятницам.</p>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>06</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Права и структура</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>Отделы, роли и права доступа: каждый видит своё, база клиентов защищена от выгрузки «на память».</p>
      </div>
    </div>
  </section>

  <section id="steps" data-screen-label="Этапы внедрения" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:720px;`)}>
      <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Процесс</div>
      <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Этапы внедрения Битрикс24</h2>
      <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Объём и сроки фиксируем после аудита — дальше ведём проект по шагам, с понятным результатом на каждом.</p>
    </div>

    <div style={s(`max-width:860px; margin-top:56px;`)}>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--grad); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px; box-shadow:0 8px 18px -6px rgba(21,94,239,0.5);`)}>01</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Аудит процессов</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>3–5 дней</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Интервью с руководителем и командой, разбор текущих инструментов: как приходят заявки, где теряются, кто за что отвечает и что тормозит продажи.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>карта процессов и план внедрения с оценкой</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>02</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Проектирование системы</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>~1 неделя</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Проектируем структуру CRM: воронки и стадии, поля и карточки, роли и права, сценарии автоматизации. Всё согласовываем до начала настройки.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>ТЗ, по которому строится система</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>03</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Настройка Битрикс24</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>1–2 недели</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Разворачиваем портал: CRM, задачи, роботы, отчёты, структура компании. Показываем промежуточные версии — а не «сюрприз» в конце проекта.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>настроенный портал на ваших сценариях</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>04</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Интеграции и перенос данных</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>1–2 недели</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Подключаем 1С, телефонию, сайт и мессенджеры. Переносим базу из старой CRM или таблиц: сначала тестовый прогон на копии, проверка — и только потом боевой перенос.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>единый контур без ручного переноса</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>05</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Обучение команды</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>3–4 дня</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Отдельные сценарии для менеджеров, РОПа и руководителя. Записи занятий, инструкции и регламенты остаются у вас — новички обучаются сами.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>команда работает в системе с первого дня</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>06</div>
        </div>
        <div style={s(`min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Запуск и сопровождение</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>постоянно</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Первые недели — самые важные: следим, как команда пользуется системой, донастраиваем, отвечаем на вопросы. Дальше — <a href="#sla" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>поддержка по SLA</a>.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>система живёт и развивается вместе с бизнесом</span></div>
        </div>
      </div>

    </div>
  </section>

  <section id="integrations" data-screen-label="Интеграции" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:760px;`)}>
      <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>Единый контур</div>
      <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Интеграции: 1С, телефония, сайт и мессенджеры</h2>
      <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>CRM работает, когда в ней сходятся все каналы. Подключаем то, чем вы уже пользуетесь.</p>
    </div>

    <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:24px; margin-top:56px;`)}>
      <div style={s(`background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:30px;`)}>
        <div style={s(`display:flex; align-items:center; gap:12px;`)}>
          <span style={s(`width:38px; height:38px; border-radius:11px; background:rgba(21,94,239,0.08); border:1px solid rgba(21,94,239,0.18); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:13px; color:var(--blue); flex-shrink:0;`)}>1С</span>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; margin:0; color:var(--ink);`)}>1С: Бухгалтерия и УТ</h3>
        </div>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Обмен счетами, оплатами, товарами и остатками. Менеджер видит статус оплаты прямо в сделке — без звонков в бухгалтерию.</p>
      </div>
      <div style={s(`background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:30px;`)}>
        <div style={s(`display:flex; align-items:center; gap:12px;`)}>
          <span style={s(`width:38px; height:38px; border-radius:11px; background:rgba(18,165,224,0.08); border:1px solid rgba(18,165,224,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><span style={s(`width:10px; height:10px; border-radius:50%; background:var(--violet); animation:pulseDot 1.8s ease-in-out infinite;`)}></span></span>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; margin:0; color:var(--ink);`)}>Телефония и АТС</h3>
        </div>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Звонки из карточки клиента, записи разговоров в сделке, автосоздание лидов по пропущенным вызовам.</p>
      </div>
      <div style={s(`background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:30px;`)}>
        <div style={s(`display:flex; align-items:center; gap:12px;`)}>
          <span style={s(`width:38px; height:38px; border-radius:11px; background:rgba(31,138,91,0.08); border:1px solid rgba(31,138,91,0.2); display:flex; align-items:center; justify-content:center; font-family:monospace; font-weight:700; font-size:12px; color:#1F8A5B; flex-shrink:0;`)}>www</span>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; margin:0; color:var(--ink);`)}>Сайт и формы</h3>
        </div>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Заявки с сайта попадают в CRM с источником и UTM-метками — ни одна не теряется в почте менеджера.</p>
      </div>
      <div style={s(`background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:30px;`)}>
        <div style={s(`display:flex; align-items:center; gap:12px;`)}>
          <span style={s(`width:38px; height:38px; border-radius:11px; background:rgba(21,94,239,0.08); border:1px solid rgba(21,94,239,0.18); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><span style={s(`display:flex; gap:3px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue);`)}></span><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--violet);`)}></span></span></span>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; margin:0; color:var(--ink);`)}>Мессенджеры</h3>
        </div>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Telegram, WhatsApp и VK в открытых линиях: вся переписка сохраняется в карточке клиента, отвечать можно из Битрикс24.</p>
      </div>
      <div style={s(`background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:30px;`)}>
        <div style={s(`display:flex; align-items:center; gap:12px;`)}>
          <span style={s(`width:38px; height:38px; border-radius:11px; background:rgba(184,134,11,0.08); border:1px solid rgba(184,134,11,0.2); display:flex; align-items:center; justify-content:center; font-family:monospace; font-weight:700; font-size:12px; color:#B8860B; flex-shrink:0;`)}>@</span>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; margin:0; color:var(--ink);`)}>Почта</h3>
        </div>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Двусторонняя синхронизация: письма автоматически прикрепляются к сделкам и контактам, история переписки — в одном месте.</p>
      </div>
      <div style={s(`background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:30px;`)}>
        <div style={s(`display:flex; align-items:center; gap:12px;`)}>
          <span style={s(`width:38px; height:38px; border-radius:11px; background:rgba(20,23,28,0.05); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-family:monospace; font-weight:700; font-size:11px; color:var(--ink-soft); flex-shrink:0;`)}>API</span>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; margin:0; color:var(--ink);`)}>Нестандартные системы</h3>
        </div>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:14px 0 0;`)}>Интегрируем через REST API и вебхуки: учётные системы, личные кабинеты, службы доставки, платёжные сервисы.</p>
      </div>
    </div>
  </section>

  <section id="migration" data-screen-label="Миграция с других CRM" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; align-items:start;`)}>
      <div>
        <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Переезд в Битрикс24</div>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Миграция в Битрикс24 с amoCRM, Excel и других CRM</h2>
        <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:560px;`)}>Смена CRM пугает потерей истории. Поэтому переезд у нас поэтапный: сначала перенос на тестовую копию и проверка вместе с вами — и только после этого переключение команды.</p>

        <div style={s(`display:flex; flex-direction:column; gap:0; margin-top:36px; max-width:560px;`)}>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue); flex-shrink:0; width:24px;`)}>1.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Аудит и выгрузка данных.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Смотрим структуру текущей базы, чистим дубли и мусор.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue); flex-shrink:0; width:24px;`)}>2.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Маппинг полей и стадий.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Сопоставляем воронки, поля и статусы со структурой новой CRM.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue); flex-shrink:0; width:24px;`)}>3.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Тестовый перенос.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Проверяем на копии: карточки, связи и история на месте.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue); flex-shrink:0; width:24px;`)}>4.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Боевой перенос.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Переключаем команду в согласованный день — без остановки продаж.</span></div>
          </div>
        </div>
      </div>

      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; box-shadow:0 30px 60px -30px rgba(20,23,28,0.25), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Что переносим</div>
        <div style={s(`display:flex; flex-direction:column; gap:13px; margin-top:20px;`)}>
          <div style={s(`display:flex; align-items:center; gap:11px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:15.5px; color:var(--ink);`)}>Контакты и компании</span></div>
          <div style={s(`display:flex; align-items:center; gap:11px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:15.5px; color:var(--ink);`)}>Сделки со стадиями и суммами</span></div>
          <div style={s(`display:flex; align-items:center; gap:11px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:15.5px; color:var(--ink);`)}>История переписки и комментарии</span></div>
          <div style={s(`display:flex; align-items:center; gap:11px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:15.5px; color:var(--ink);`)}>Задачи и активности</span></div>
          <div style={s(`display:flex; align-items:center; gap:11px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:15.5px; color:var(--ink);`)}>Файлы и документы</span></div>
        </div>

        <div style={s(`height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px); margin:26px 0;`)}></div>

        <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Откуда переезжают чаще всего</div>
        <div style={s(`display:flex; flex-wrap:wrap; gap:10px; margin-top:18px;`)}>
          <span style={s(`font-size:13.5px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 16px;`)}>amoCRM</span>
          <span style={s(`font-size:13.5px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 16px;`)}>Excel / Google Таблицы</span>
          <span style={s(`font-size:13.5px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 16px;`)}>Мегаплан</span>
          <span style={s(`font-size:13.5px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 16px;`)}>RetailCRM</span>
          <span style={s(`font-size:13.5px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 16px;`)}>Самописные CRM</span>
        </div>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:26px; background:rgba(31,138,91,0.07); border:1px solid rgba(31,138,91,0.2); border-radius:12px; padding:14px 16px;`)}>
          <span style={s(`width:7px; height:7px; border-radius:50%; background:#1F8A5B; flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
          <span style={s(`font-size:14px; font-weight:600; color:#1F8A5B;`)}>Боевой перенос — только после проверки тестового</span>
        </div>
      </div>
    </div>
  </section>

  <section id="sla" data-screen-label="Поддержка и SLA" style={s(`position:relative; background:var(--ink); padding:${v.darkPad}; overflow:hidden;`)}>
    <div style={s(`position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:760px; height:760px; border-radius:50%; background:var(--grad); opacity:0.2; filter:blur(130px); pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; max-width:1360px; margin:0 auto; padding:${v.darkInnerPad};`)}>
      <div data-reveal style={s(`max-width:680px;`)}>
        <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; display:inline-block;`)}>После запуска</div>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:clamp(32px,4vw,46px); line-height:1.14; letter-spacing:-0.02em; margin:16px 0 0; color:#fff;`)}>Поддержка и сопровождение по SLA</h2>
        <p style={s(`font-size:18px; line-height:1.6; color:rgba(255,255,255,0.65); margin:20px 0 0;`)}>Внедрение — это старт, а не финиш. Берём систему на сопровождение: отвечаем на вопросы, донастраиваем и развиваем её вместе с бизнесом.</p>
      </div>

      <div data-reveal-children="110" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:20px; margin-top:64px;`)}>
        <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(255,255,255,0.16); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);`)}>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; margin:0; color:#fff;`)}>Базовый</h3>
          <p style={s(`font-size:14px; line-height:1.55; color:rgba(255,255,255,0.55); margin:8px 0 0;`)}>Для стабильных систем без частых изменений</p>
          <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:24px;`)}>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Консультации и ответы на вопросы команды</span></div>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Мелкие правки настроек и прав</span></div>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Контроль обновлений Битрикс24</span></div>
          </div>
          <div style={s(`margin-top:auto; padding-top:26px;`)}>
            <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>Реакция</div>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; color:#fff; margin-top:6px;`)}>до 1 рабочего дня</div>
          </div>
        </div>

        <div style={s(`position:relative; display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(21,94,239,0.22), rgba(18,165,224,0.08)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(94,159,255,0.45); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(21,94,239,0.35), inset 0 1px 1px rgba(255,255,255,0.25);`)}>
          <span style={s(`position:absolute; top:-13px; left:32px; font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#fff; background:var(--grad); border-radius:999px; padding:6px 14px; box-shadow:0 6px 16px -4px rgba(21,94,239,0.55);`)}>Чаще всего</span>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; margin:0; color:#fff;`)}>Расширенный</h3>
          <p style={s(`font-size:14px; line-height:1.55; color:rgba(255,255,255,0.55); margin:8px 0 0;`)}>Для растущих команд, которым нужны доработки</p>
          <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:24px;`)}>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:#5E9FFF; flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Всё из пакета «Базовый»</span></div>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:#5E9FFF; flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Доработки: новые воронки, роботы, отчёты</span></div>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:#5E9FFF; flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Приоритетная очередь задач</span></div>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:#5E9FFF; flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Ежемесячный мини-аудит использования</span></div>
          </div>
          <div style={s(`margin-top:auto; padding-top:26px;`)}>
            <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>Реакция</div>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; color:#fff; margin-top:6px;`)}>до 4 часов</div>
          </div>
        </div>

        <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(255,255,255,0.16); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);`)}>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; margin:0; color:#fff;`)}>Энтерпрайз</h3>
          <p style={s(`font-size:14px; line-height:1.55; color:rgba(255,255,255,0.55); margin:8px 0 0;`)}>Для компаний, где CRM — критичный процесс</p>
          <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:24px;`)}>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Выделенная команда и персональный менеджер</span></div>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Развитие системы: интеграции, смарт-процессы</span></div>
            <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--violet); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:rgba(255,255,255,0.85);`)}>Регулярные аудиты и план развития</span></div>
          </div>
          <div style={s(`margin-top:auto; padding-top:26px;`)}>
            <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>Реакция</div>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; color:#fff; margin-top:6px;`)}>до 1 часа</div>
          </div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-top:36px;`)}>
        <p style={s(`font-size:15px; color:rgba(255,255,255,0.55); margin:0; max-width:560px;`)}>Объём часов и условия зависят от вашей системы — подберём формат на консультации.</p>
        <button className="b24fx10" onClick={v.scrollToContact} style={s(`font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:var(--ink); background:#fff; border:none; padding:13px 28px; border-radius:999px; cursor:pointer; transition:transform 0.2s ease;`)}>Подобрать пакет поддержки</button>
      </div>
    </div>
  </section>

  <section id="packages" data-screen-label="Пакеты внедрения" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:720px;`)}>
      <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Форматы работы</div>
      <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Пакеты внедрения</h2>
      <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Три типовых формата — от быстрого запуска до сложных доработок. Точный объём собираем под ваши процессы после аудита.</p>
    </div>

    <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:24px; margin-top:56px; align-items:stretch;`)}>
      <div style={s(`display:flex; flex-direction:column; background:var(--paper); border:1px solid var(--line); border-radius:24px; padding:38px 34px;`)}>
        <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Старт</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:23px; letter-spacing:-0.01em; margin:12px 0 0; color:var(--ink);`)}>Быстрый запуск CRM</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Для небольшой команды, которой нужно начать вести клиентов в системе.</p>
        <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:24px;`)}>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Одна воронка продаж, базовая настройка</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Подключение почты и телефонии</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Обучение команды — стартовая сессия</span></div>
        </div>
        <div style={s(`margin-top:auto; padding-top:28px;`)}>
          <div style={s(`font-family:monospace; font-size:12px; color:var(--ink-faint);`)}>Срок: от 2 недель</div>
          <button className="b24fx11" onClick={v.scrollToContact} style={s(`width:100%; margin-top:14px; font-family:'Inter',sans-serif; font-size:15px; font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); padding:14px 24px; border-radius:12px; cursor:pointer; transition:border-color 0.2s ease;`)}>Обсудить проект</button>
        </div>
      </div>

      <div style={s(`position:relative; display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(21,94,239,0.4); border-radius:24px; padding:38px 34px; box-shadow:0 30px 60px -24px rgba(21,94,239,0.3), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <span style={s(`position:absolute; top:-13px; left:34px; font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#fff; background:var(--grad); border-radius:999px; padding:6px 14px; box-shadow:0 6px 16px -4px rgba(21,94,239,0.55);`)}>Оптимальный</span>
        <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--blue);`)}>Бизнес</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:23px; letter-spacing:-0.01em; margin:12px 0 0; color:var(--ink);`)}>Внедрение под процессы</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Полный цикл: от аудита до обучения — CRM собрана под то, как вы реально продаёте.</p>
        <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:24px;`)}>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Несколько воронок, роботы и автоматизация</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Интеграции: 1С, сайт, телефония, мессенджеры</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Перенос данных из старой CRM</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Обучение по ролям + регламенты</span></div>
        </div>
        <div style={s(`margin-top:auto; padding-top:28px;`)}>
          <div style={s(`font-family:monospace; font-size:12px; color:var(--ink-faint);`)}>Срок: 4–8 недель</div>
          <button className="b24fx12" onClick={v.scrollToContact} style={s(`width:100%; margin-top:14px; font-family:'Inter',sans-serif; font-size:15px; font-weight:600; color:#fff; background:var(--grad); border:none; padding:14px 24px; border-radius:12px; cursor:pointer; box-shadow:0 10px 24px rgba(21,94,239,0.25); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Обсудить проект</button>
        </div>
      </div>

      <div style={s(`display:flex; flex-direction:column; background:var(--paper); border:1px solid var(--line); border-radius:24px; padding:38px 34px;`)}>
        <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Энтерпрайз</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:23px; letter-spacing:-0.01em; margin:12px 0 0; color:var(--ink);`)}>Сложные процессы</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Для компаний с нестандартной логикой, доработками и высокими требованиями.</p>
        <div style={s(`display:flex; flex-direction:column; gap:12px; margin-top:24px;`)}>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Смарт-процессы и нестандартная логика</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Интеграции по API с внутренними системами</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Коробочная версия и доработки интерфейса</span></div>
          <div style={s(`display:flex; align-items:baseline; gap:10px;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:var(--blue); flex-shrink:0; transform:translateY(-2px);`)}></span><span style={s(`font-size:14.5px; color:var(--ink);`)}>Выделенная команда проекта</span></div>
        </div>
        <div style={s(`margin-top:auto; padding-top:28px;`)}>
          <div style={s(`font-family:monospace; font-size:12px; color:var(--ink-faint);`)}>Срок: от 8 недель</div>
          <button className="b24fx13" onClick={v.scrollToContact} style={s(`width:100%; margin-top:14px; font-family:'Inter',sans-serif; font-size:15px; font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); padding:14px 24px; border-radius:12px; cursor:pointer; transition:border-color 0.2s ease;`)}>Обсудить проект</button>
        </div>
      </div>
    </div>

    <p data-reveal style={s(`font-size:14px; color:var(--ink-faint); margin:26px 0 0;`)}>Стоимость каждого пакета считаем по итогам бесплатного аудита — без «вилок» и скрытых доплат в процессе.</p>
  </section>

  <section id="faq" data-screen-label="FAQ" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div style={s(`display:grid; grid-template-columns:${v.faqCols}; gap:${v.migGap}; align-items:start;`)}>
      <div data-reveal>
        <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>FAQ</div>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Частые вопросы о внедрении Битрикс24</h2>
        <p style={s(`font-size:17px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:420px;`)}>Не нашли свой вопрос — напишите нам, отвечаем в течение рабочего дня.</p>
        <button className="b24fx14" onClick={v.scrollToContact} style={s(`margin-top:26px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); padding:13px 26px; border-radius:999px; cursor:pointer; transition:border-color 0.2s ease;`)}>Задать вопрос</button>
      </div>

      <div data-reveal-children="80" style={s(`display:flex; flex-direction:column; gap:14px;`)}>
        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg0}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq0} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Сколько стоит внедрение Битрикс24?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon0}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows0}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Зависит от количества воронок, интеграций и объёма переносимых данных. После бесплатной консультации и аудита фиксируем смету и сроки в договоре — без скрытых доплат в процессе.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg1}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq1} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Сколько времени занимает внедрение?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon1}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows1}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Базовая настройка CRM — от 2 недель. Внедрение с интеграциями 1С, телефонии и переносом данных — обычно 4–8 недель. Точный срок называем после аудита процессов.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg2}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq2} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Облачный или коробочный Битрикс24 — что выбрать?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon2}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows2}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Облако быстрее и дешевле на старте, обновляется само. Коробка нужна, когда требуются глубокие доработки интерфейса и хранение данных на своих серверах. На консультации поможем выбрать редакцию и тариф под ваши задачи.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg3}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq3} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Можно ли перенести данные из amoCRM или Excel?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon3}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows3}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Да. Переносим контакты, компании, сделки с историей, задачи и файлы из amoCRM, Excel и Google Таблиц, Мегаплана и самописных CRM. Сначала тестовый перенос на копии — вы проверяете данные, и только потом переключаем команду.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg4}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq4} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Что будет после запуска?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon4}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows4}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Сопровождаем систему по SLA: отвечаем на вопросы команды, донастраиваем процессы, делаем доработки и обучаем новых сотрудников. Первые недели после запуска следим за использованием особенно внимательно.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg5}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq5} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Битрикс24 уже настроен, но команда им не пользуется. Поможете?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon5}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows5}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Да, это частая ситуация. Проводим аудит текущей настройки, убираем лишнее, перестраиваем воронки под реальные процессы и заново обучаем команду — по ролям, на ваших сценариях.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg6}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq6} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Нужна ли лицензия Битрикс24 и где её купить?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon6}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows6}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Да, для работы нужен тариф Битрикс24. Как официальный партнёр поможем подобрать редакцию под количество сотрудников и задачи и оформим лицензию — это входит в сопровождение проекта.</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section data-screen-label="Ссылка на ИИ-решения" style={s(`padding:0 ${v.padX}; max-width:1360px; margin:0 auto;`)}>
    <a className="b24fx15" data-reveal href="/ai" style={s(`display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; background:var(--ink); border-radius:24px; padding:${v.bannerPad}; text-decoration:none; position:relative; overflow:hidden; transition:transform 0.25s ease;`)}>
      <span style={s(`position:absolute; top:-120px; right:-80px; width:340px; height:340px; border-radius:50%; background:var(--grad); opacity:0.25; filter:blur(90px); pointer-events:none;`)}></span>
      <span style={s(`position:relative; z-index:1; display:block;`)}>
        <span style={s(`display:block; font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent;`)}>Смотрите также</span>
        <span style={s(`display:block; font-family:'Manrope',sans-serif; font-weight:800; font-size:clamp(20px,2.4vw,26px); letter-spacing:-0.01em; color:#fff; margin-top:10px;`)}>ИИ-автоматизация для вашего бизнеса</span>
        <span style={s(`display:block; font-size:15px; color:rgba(255,255,255,0.6); margin-top:8px; max-width:520px;`)}>Обработка заявок 24/7, карточки товаров с SEO-текстами, аналитика — на отдельной странице.</span>
      </span>
      <span style={s(`position:relative; z-index:1; display:inline-flex; align-items:center; gap:8px; font-size:15px; font-weight:600; color:#fff; border:1px solid rgba(255,255,255,0.3); border-radius:999px; padding:13px 26px; white-space:nowrap;`)}>Подробнее об ИИ →</span>
    </a>
  </section>

  <section id="contact" data-screen-label="Контакты CTA" style={s(`padding:${v.contactSecPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48)); backdrop-filter:blur(28px) saturate(180%); -webkit-backdrop-filter:blur(28px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:28px; padding:${v.contactPadding}; display:grid; grid-template-columns:${v.contactColumns}; gap:56px; position:relative; overflow:hidden; box-shadow:0 50px 90px -50px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
      <div style={s(`position:absolute; top:-140px; right:-140px; width:420px; height:420px; border-radius:50%; background:var(--grad); opacity:0.08; filter:blur(100px); pointer-events:none;`)}></div>

      <div style={s(`position:relative; z-index:1;`)}>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:clamp(30px,3.6vw,42px); letter-spacing:-0.02em; line-height:1.15; color:var(--ink); margin:0;`)}>Обсудим внедрение Битрикс24?</h2>
        <p style={s(`font-size:17px; line-height:1.6; color:var(--ink-soft); margin:18px 0 0; max-width:420px;`)}>Расскажите, как устроены продажи сейчас, — предложим план внедрения, сроки и оценку. Консультация бесплатная.</p>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:36px;`)}>
          <div style={s(`width:26px; height:26px; border-radius:8px; background:repeating-linear-gradient(45deg, #ECEBE7, #ECEBE7 4px, #F6F6F4 4px, #F6F6F4 8px); border:1px dashed #C9CDD3; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:8px; color:#8A8F99; flex-shrink:0;`)}>Б24</div>
          <span style={s(`font-size:14px; font-weight:600; color:var(--ink-soft);`)}>Официальный партнёр Битрикс24</span>
        </div>
      </div>

      <div style={s(`position:relative; z-index:1; display:flex; flex-direction:column; justify-content:center; gap:24px; min-height:260px;`)}>
        <div style={s(`display:flex; flex-direction:column; gap:12px;`)}>
          <a className="b24fx16" href={v.tgHref} target="_blank" rel="noopener" style={s(`display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; font-size:16px; font-weight:600; color:#fff; background:var(--grad); border-radius:12px; padding:16px 28px; text-decoration:none; box-shadow:0 10px 24px rgba(21,94,239,0.22); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Написать в Telegram</a>
          <a className="b24fx17" href={v.waHref} target="_blank" rel="noopener" style={s(`display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; font-size:16px; font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); border-radius:12px; padding:16px 28px; text-decoration:none; transition:border-color 0.2s ease;`)}>Написать в WhatsApp</a>
        </div>
        <div style={s(`font-size:13px; color:var(--ink-faint);`)}>Отвечаем в течение рабочего дня</div>
      </div>
    </div>
  </section>

  <footer style={s(`padding:0 ${v.padX} 48px; max-width:1360px; margin:0 auto; display:flex; flex-direction:${v.footerDirection}; align-items:${v.footerAlign}; justify-content:space-between; gap:24px; border-top:1px solid var(--line); padding-top:36px;`)}>
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
      <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:15px; color:var(--ink);`)}>Терра</span>
      <span style={s(`font-size:13px; color:var(--ink-faint); margin-left:4px;`)}>· Битрикс24 и ИИ</span>
    </div>
    <div style={s(`display:flex; gap:24px; flex-wrap:wrap;`)}>
      <a href="/" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>Главная</a>
      <a href="/ai" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>ИИ-решения</a>
      <a href="#steps" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>Этапы</a>
      <a href="#sla" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>Поддержка</a>
      <a href="#faq" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>FAQ</a>
    </div>
    <div style={s(`font-size:13px; color:var(--ink-faint);`)}>© 2026 Терра. Все права защищены.</div>
  </footer>

</div>

      </>
    );
  }
}
