'use client';
import React from 'react';
import { s } from './_ui';

const FXCSS = ".aifx0:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx1:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx2:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx3:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx4:hover{color:var(--ink) !important; background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx5:hover{background-size:100% 1.5px !important; transform:translateY(-2px) !important}\n.aifx6:hover{transform:translateY(-1px) !important; box-shadow:0 12px 26px -6px rgba(21,94,239,0.55), inset 0 1px 1px rgba(255,255,255,0.55) !important}\n.aifx7:hover{color:var(--ink) !important}\n.aifx8:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.32) !important}\n.aifx9:hover{border-color:var(--ink) !important}\n.aifx10:hover{transform:translateY(-2px) !important}\n.aifx11:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.32) !important}\n.aifx12:hover{border-color:var(--ink) !important}\n.aifx13:hover{transform:translateY(-3px) !important}\n.aifx14:hover{transform:translateY(-2px) !important; box-shadow:0 14px 30px rgba(21,94,239,0.3) !important}\n.aifx15:hover{border-color:var(--ink) !important}";

export default class AiPage extends React.Component {
  state = {
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 1180 : false,
    mobileMenuOpen: false,
    mounted: false,
    openFaq: 0
  };

  progressRef = React.createRef();

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
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    clearTimeout(this._sizeTimer);
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
    const { isMobile, mobileMenuOpen, openFaq } = this.state;

    const vals = {
      padX: isMobile ? '20px' : '48px',
      heroPad: isMobile ? '44px 20px 72px' : '72px 48px 100px',
      heroCols: isMobile ? '1fr' : '0.95fr 1.05fr',
      heroGap: isMobile ? '0px' : '72px',
      heroVisualMt: isMobile ? '52px' : '0px',
      h1Size: isMobile ? 'clamp(30px, 8.6vw, 38px)' : 'clamp(38px, 4.4vw, 56px)',
      h2Size: isMobile ? '28px' : 'clamp(30px, 3vw, 40px)',
      chatHeight: isMobile ? 'auto' : '470px',
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
        <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; color:var(--ink);`)}>ETHOS</span>
        <span style={s(`font-size:12px; font-weight:600; color:var(--ink-faint); white-space:nowrap;`)}>· ИИ-решения</span>
      </span>
    </a>

    <div style={s(`display:${v.navDisplay}; align-items:center; gap:24px;`)}>
      <a className="aifx0" href="#agents" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Сценарии</a>
      <a className="aifx1" href="#content" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Карточки товаров</a>
      <a className="aifx2" href="#analytics" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Аналитика</a>
      <a className="aifx3" href="#process" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Внедрение</a>
      <a className="aifx4" href="#faq" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>FAQ</a>
      <a className="aifx5" href="/bitrix24" style={s(`font-size:15px; font-weight:500; color:var(--ink-soft); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--ink),var(--ink)); background-repeat:no-repeat; background-position:0 100%; background-size:0% 1.5px; padding-bottom:3px; transition:background-size 0.3s cubic-bezier(.16,1,.3,1), color 0.2s ease, transform 0.25s cubic-bezier(.16,1,.3,1);`)}>Битрикс24</a>
      <a href="/ai" aria-current="page" style={s(`font-size:15px; font-weight:600; color:var(--blue); text-decoration:none; white-space:nowrap; background-image:linear-gradient(var(--blue),var(--blue)); background-repeat:no-repeat; background-position:0 100%; background-size:100% 1.5px; padding-bottom:3px;`)}>ИИ-решения</a>
      <button className="aifx6" onClick={v.scrollToContact} style={s(`font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:#fff; background:linear-gradient(135deg, #155EEF, #12A5E0); border:1px solid rgba(255,255,255,0.22); padding:12px 26px; border-radius:999px; cursor:pointer; box-shadow:0 8px 20px -6px rgba(21,94,239,0.45), inset 0 1px 1px rgba(255,255,255,0.55); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Получить консультацию</button>
    </div>

    <button onClick={v.toggleMobileMenu} style={s(`display:${v.hamburgerDisplay}; width:42px; height:42px; border-radius:10px; border:1px solid var(--line); background:var(--paper); flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer;`)}>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
      <span style={s(`width:18px; height:2px; background:var(--ink); border-radius:2px;`)}></span>
    </button>

    <div style={s(`position:absolute; top:calc(100% + 8px); left:0; right:0; overflow:hidden; max-height:${v.mobileMenuMaxHeight}; transition:max-height 0.35s cubic-bezier(.16,1,.3,1); z-index:49;`)}>
      <div style={s(`display:flex; flex-direction:column; padding:22px 24px 30px; gap:20px; background:#FFFFFF; border:1px solid var(--line); border-radius:20px; box-shadow:0 24px 48px -16px rgba(20,23,28,0.3);`)}>
        <a href="/" style={s(`display:inline-flex; align-items:center; gap:8px; font-size:16px; font-weight:600; color:var(--ink-soft); text-decoration:none; padding-bottom:14px; border-bottom:1px solid var(--line);`)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={s(`flex-shrink:0; display:block;`)}><path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg><span>Главная</span></a>
        <a href="#agents" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Сценарии</a>
        <a href="#content" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Карточки товаров</a>
        <a href="#analytics" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Аналитика</a>
        <a href="#process" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>Внедрение</a>
        <a href="#faq" onClick={v.closeMobileMenu} style={s(`font-size:16px; font-weight:600; color:var(--ink); text-decoration:none;`)}>FAQ</a>
        <a href="/bitrix24" style={s(`font-size:16px; font-weight:600; color:var(--ink-soft); text-decoration:none;`)}>Битрикс24 →</a>
        <a href="/ai" aria-current="page" style={s(`font-size:16px; font-weight:700; color:var(--blue); text-decoration:none;`)}>ИИ-решения · вы здесь</a>
        <button onClick={v.scrollToContactMobile} style={s(`font-family:'Inter',sans-serif; font-size:15px; font-weight:600; color:#fff; background:var(--blue); border:none; padding:14px 22px; border-radius:999px; cursor:pointer; margin-top:6px;`)}>Получить консультацию</button>
      </div>
    </div>
  </header>

  <section id="hero" data-screen-label="Hero — ИИ-агенты" style={s(`position:relative; padding:${v.heroPad}; max-width:1360px; margin:0 auto; overflow:visible;`)}>
    <div style={s(`position:absolute; top:-140px; right:-100px; width:540px; height:540px; border-radius:50%; background:var(--violet); opacity:0.14; filter:blur(95px); animation:driftBlobA 17s ease-in-out infinite alternate; z-index:0; pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; display:grid; grid-template-columns:${v.heroCols}; gap:${v.heroGap}; align-items:center;`)}>
      <div>
        <nav aria-label="Хлебные крошки" style={s(`display:flex; align-items:center; gap:8px; font-size:13px; color:var(--ink-faint); ${v.entranceBadge}`)}>
          <a className="aifx7" href="/" style={s(`color:var(--ink-faint); text-decoration:none;`)}>Главная</a>
          <span aria-hidden="true">→</span>
          <span style={s(`color:var(--ink-soft); font-weight:500;`)}>ИИ-решения</span>
        </nav>

        <div style={s(`display:inline-flex; align-items:center; gap:10px; background:linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.32)); backdrop-filter:blur(18px) saturate(180%); -webkit-backdrop-filter:blur(18px) saturate(180%); border:1px solid rgba(255,255,255,0.72); border-radius:999px; padding:6px 16px; box-shadow:0 1px 2px rgba(20,23,28,0.05); margin-top:22px; ${v.entranceBadge}`)}>
          <span style={s(`width:7px; height:7px; border-radius:50%; background:#3DDC84; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
          <span style={s(`font-size:14px; font-weight:600; color:var(--ink); white-space:nowrap;`)}>Работает на ваших данных · 24/7</span>
        </div>

        <h1 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h1Size}; line-height:1.07; letter-spacing:-0.03em; margin:26px 0 0; color:var(--ink); ${v.entranceH1}`)}>
          ИИ-автоматизация, которая<br />
          <span style={s(`background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent;`)}>снимает рутину с команды</span>
        </h1>

        <p style={s(`font-size:18px; line-height:1.65; color:var(--ink-soft); max-width:540px; margin:22px 0 0; ${v.entranceP}`)}>
          От автоответов клиентам и генерации карточек товаров до ИИ-агентов, которые сами ведут сделки, готовят отчёты и разбирают звонки. Внедряем ИИ в реальные процессы — с пилотом и измеримым результатом.
        </p>

        <div style={s(`display:flex; align-items:center; gap:22px; margin-top:34px; flex-wrap:wrap; ${v.entranceCta}`)}>
          <button className="aifx8" onClick={v.scrollToContact} style={s(`font-family:'Inter',sans-serif; font-size:16px; font-weight:600; color:#fff; background:linear-gradient(135deg, #155EEF, #12A5E0); border:1px solid rgba(255,255,255,0.22); padding:16px 32px; border-radius:16px; white-space:nowrap; cursor:pointer; box-shadow:0 12px 28px -6px rgba(21,94,239,0.45), inset 0 1px 1px rgba(255,255,255,0.6); transition:transform 0.25s ease, box-shadow 0.25s ease;`)}>Получить консультацию</button>
          <a className="aifx9" href="#agents" style={s(`font-size:16px; font-weight:600; color:var(--ink); display:inline-flex; align-items:center; gap:8px; padding:16px 2px; text-decoration:none; border-bottom:1px solid transparent; transition:border-color 0.25s ease;`)}>Что автоматизируем ↓</a>
        </div>

        <div style={s(`display:flex; gap:24px; flex-wrap:wrap; margin-top:38px; ${v.entranceCta}`)}>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--blue); flex-shrink:0;`)}></span><span style={s(`font-size:14px; color:var(--ink-soft);`)}>Пилот за 2–3 недели</span></div>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:var(--violet); flex-shrink:0;`)}></span><span style={s(`font-size:14px; color:var(--ink-soft);`)}>Интеграция с Битрикс24 и 1С</span></div>
          <div style={s(`display:flex; align-items:center; gap:9px;`)}><span style={s(`width:6px; height:6px; border-radius:50%; background:#1F8A5B; flex-shrink:0;`)}></span><span style={s(`font-size:14px; color:var(--ink-soft);`)}>Данные под вашим контролем</span></div>
        </div>
      </div>

      <div style={s(`margin-top:${v.heroVisualMt}; ${v.entranceCard}`)}>
        <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(26px) saturate(180%); -webkit-backdrop-filter:blur(26px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:10px; box-shadow:0 40px 70px -24px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <div style={s(`height:${v.chatHeight}; background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden; display:flex; flex-direction:column;`)}>
            <div style={s(`display:flex; flex-wrap:wrap; align-items:center; gap:6px 10px; padding:11px 16px; border-bottom:1px solid var(--line); background:#fff;`)}>
              <span style={s(`width:30px; height:30px; border-radius:50%; background:var(--grad); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 10px -2px rgba(21,94,239,0.5);`)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="#fff"></path><circle cx="18.5" cy="17.5" r="2.1" fill="#fff" opacity="0.85"></circle></svg></span>
              <span style={s(`display:flex; flex-direction:column; min-width:0;`)}>
                <span style={s(`font-family:'Manrope',sans-serif; font-weight:700; font-size:13px; color:var(--ink); white-space:nowrap;`)}>ИИ-агент · Продажи</span>
                <span style={s(`position:relative; height:14px; display:block;`)}>
                  <span style={s(`position:absolute; left:0; top:0; display:inline-flex; align-items:center; gap:5px; font-size:10.5px; color:#1F8A5B; animation:aiHdrOnline 20s linear infinite; animation-play-state:${v.heroPlayState}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;`)}><span style={s(`width:5px; height:5px; border-radius:50%; background:#3DDC84; flex-shrink:0;`)}></span>онлайн · после 18:00</span>
                  <span style={s(`position:absolute; left:0; top:0; font-size:10.5px; color:var(--ink-faint); animation:aiHdrTyping 20s linear infinite; animation-play-state:${v.heroPlayState}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;`)}>проверяет остатки…</span>
                </span>
              </span>
              <span style={s(`margin-left:auto; display:inline-flex; align-items:center; gap:6px; font-size:10px; font-weight:600; color:var(--ink-faint); background:#F1F3F5; border-radius:6px; padding:3px 8px; white-space:nowrap;`)}>Telegram · 19:42</span>
            </div>

            <div style={s(`position:relative; flex:1; display:flex; flex-direction:column; justify-content:flex-end; gap:9px; padding:16px; background:#EEF2F6; min-height:0; overflow:hidden;`)}>

              <div style={s(`align-self:flex-start; max-width:82%; animation:aiMsg1 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:#fff; border:1px solid var(--line); border-radius:14px 14px 14px 4px; padding:10px 13px; box-shadow:0 1px 3px rgba(20,23,28,.07);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:var(--ink);`)}>Добрый день. Нужен кабель ВВГнг-LS 3×2,5, объём 1 200 м. Есть на складе?</div>
                </div>
                <div style={s(`font-size:9.5px; color:var(--ink-faint); margin:4px 0 0 6px;`)}>Клиент · 19:42</div>
              </div>

              <div style={s(`align-self:flex-end; max-width:82%; animation:aiMsg2 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:linear-gradient(135deg, #155EEF, #12A5E0); border-radius:14px 14px 4px 14px; padding:10px 13px; box-shadow:0 6px 16px -6px rgba(21,94,239,0.55);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:#fff;`)}>Добрый день! Проверил по 1С: на складе 860 м, ещё ~400 м придут в четверг. Могу поставить резерв на весь объём — подойдёт?</div>
                </div>
                <div style={s(`font-size:9.5px; color:var(--ink-faint); margin:4px 6px 0 0; text-align:right;`)}>Агент · 19:43</div>
              </div>

              <div style={s(`align-self:flex-start; max-width:82%; animation:aiMsg3 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:#fff; border:1px solid var(--line); border-radius:14px 14px 14px 4px; padding:10px 13px; box-shadow:0 1px 3px rgba(20,23,28,.07);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:var(--ink);`)}>Ставьте резерв. И нужны счёт и сертификаты соответствия — закупка под госконтракт</div>
                </div>
                <div style={s(`font-size:9.5px; color:var(--ink-faint); margin:4px 0 0 6px;`)}>Клиент · 19:47</div>
              </div>

              <div style={s(`align-self:flex-end; max-width:82%; animation:aiMsg4 20s linear infinite; animation-play-state:${v.heroPlayState};`)}>
                <div style={s(`background:linear-gradient(135deg, #155EEF, #12A5E0); border-radius:14px 14px 4px 14px; padding:10px 13px; box-shadow:0 6px 16px -6px rgba(21,94,239,0.55);`)}>
                  <div style={s(`font-size:12.5px; line-height:1.5; color:#fff;`)}>Резерв поставил до пятницы. Счёт и сертификаты подготовит менеджер завтра с утра и пришлёт сюда. Подскажите, пожалуйста, ИНН организации</div>
                </div>
                <div style={s(`font-size:9.5px; color:var(--ink-faint); margin:4px 6px 0 0; text-align:right;`)}>Агент · 19:47</div>
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

  <section id="agents" data-screen-label="Сценарии ИИ-агентов по ролям" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:740px;`)}>
      <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Сценарии по ролям</div>
      <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Что автоматизируем с помощью ИИ</h2>
      <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Где-то достаточно простой ИИ-автоматизации: распознать документ, сгенерировать текст, разобрать звонок. Где-то нужен ИИ-агент, который сам ведёт диалог и выполняет действия в системах. Подбираем инструмент под задачу — по ролям в вашей команде.</p>
    </div>

    <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:24px; margin-top:56px;`)}>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>01 · Продажи</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Продажи и обработка заявок</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>ИИ-агент отвечает на заявки за секунды в любое время, задаёт уточняющие вопросы, называет цены и сроки, готовит КП — и создаёт сделку в CRM с полной историей.</p>
        <div style={s(`display:flex; align-items:baseline; gap:8px; margin-top:16px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Итог</span><span style={s(`font-size:13.5px; color:var(--ink);`)}>ни одна заявка не ждёт до утра</span></div>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>02 · Поддержка</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Поддержка клиентов</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>ИИ отвечает по базе знаний и статусам заказов: «где моя доставка», «как вернуть», «не работает». Типовые обращения закрывает сам, сложные — передаёт человеку с контекстом.</p>
        <div style={s(`display:flex; align-items:baseline; gap:8px; margin-top:16px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Итог</span><span style={s(`font-size:13.5px; color:var(--ink);`)}>поддержка не растёт вместе с потоком</span></div>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>03 · Контент</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Контент и карточки товаров</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>ИИ заполняет карточки товаров, пишет описания и SEO-тексты в едином стиле — по прайсу, фото или артикулу. <a href="#content" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>Подробнее ниже</a>.</p>
        <div style={s(`display:flex; align-items:baseline; gap:8px; margin-top:16px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Итог</span><span style={s(`font-size:13.5px; color:var(--ink);`)}>весь каталог описан и находится в поиске</span></div>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>04 · Руководитель</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Отчёты и контроль</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>ИИ присылает сводки по продажам, разбирает звонки менеджеров по чек-листу, отвечает на вопросы цифрами из CRM. <a href="#analytics" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>Подробнее ниже</a>.</p>
        <div style={s(`display:flex; align-items:baseline; gap:8px; margin-top:16px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Итог</span><span style={s(`font-size:13.5px; color:var(--ink);`)}>картина бизнеса — без ручных отчётов</span></div>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>05 · Бэк-офис</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Документы и бэк-офис</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>ИИ готовит договоры и счета по шаблонам, сверяет реквизиты, разносит первичку, отвечает сотрудникам на вопросы по регламентам компании.</p>
        <div style={s(`display:flex; align-items:baseline; gap:8px; margin-top:16px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Итог</span><span style={s(`font-size:13.5px; color:var(--ink);`)}>документы за минуты, без ошибок в реквизитах</span></div>
      </div>
      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:20px; padding:30px 30px 32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--blue);`)}>06 · HR и обучение</div>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:19px; letter-spacing:-0.01em; margin:14px 0 0; color:var(--ink);`)}>Онбординг и обучение</h3>
        <p style={s(`font-size:15px; line-height:1.6; color:var(--ink-soft); margin:10px 0 0;`)}>Внутренний ИИ-помощник отвечает новичкам на вопросы по продуктам и процессам, ведёт по плану онбординга, подсказывает регламенты — старшие сотрудники не отвлекаются.</p>
        <div style={s(`display:flex; align-items:baseline; gap:8px; margin-top:16px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Итог</span><span style={s(`font-size:13.5px; color:var(--ink);`)}>новичок выходит на результат быстрее</span></div>
      </div>
    </div>
  </section>

  <section id="content" data-screen-label="Карточки товаров и SEO-тексты" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; align-items:center;`)}>
      <div>
        <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>Контент на автопилоте</div>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Карточки товаров и SEO-тексты — без контент-менеджера на потоке</h2>
        <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:560px;`)}>Каталог на тысячи позиций месяцами стоит без описаний — и не находится в поиске. ИИ заполняет карточки по прайсу и фото, человек только проверяет.</p>

        <div style={s(`display:flex; flex-direction:column; gap:0; margin-top:36px; max-width:560px;`)}>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--violet); flex-shrink:0; width:24px;`)}>1.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Загружаете исходники.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Прайс, фото, артикулы — хватит даже названия и характеристик от поставщика.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--violet); flex-shrink:0; width:24px;`)}>2.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>ИИ собирает карточку.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Название, характеристики, продающее описание и SEO-текст под поисковые запросы — в едином стиле бренда.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--violet); flex-shrink:0; width:24px;`)}>3.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Человек проверяет.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Выборочная вычитка вместо написания с нуля — в разы быстрее.</span></div>
          </div>
          <div style={s(`display:flex; gap:16px; padding:18px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:14px; color:var(--violet); flex-shrink:0; width:24px;`)}>4.</span>
            <div><span style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Выгружаем куда нужно.</span> <span style={s(`font-size:15.5px; color:var(--ink-soft);`)}>Сайт на Битрикс, интернет-магазин, маркетплейсы — сразу в нужном формате.</span></div>
          </div>
        </div>
      </div>

      <div>
        <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; box-shadow:0 30px 60px -30px rgba(20,23,28,0.25), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
          <div style={s(`display:flex; align-items:center; gap:10px;`)}>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-faint); background:#F1F3F5; border-radius:6px; padding:4px 10px;`)}>Вход</span>
            <span style={s(`font-family:monospace; font-size:12px; color:var(--ink-soft); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>арт. KR-4407 · «кресло Оптима сет.» · 12 400 ₽</span>
          </div>

          <div style={s(`display:flex; align-items:center; gap:10px; margin:16px 0;`)}>
            <div style={s(`flex:1; height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px);`)}></div>
            <span style={s(`display:inline-flex; align-items:center; gap:6px; font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#fff; background:var(--grad); border-radius:999px; padding:5px 12px; box-shadow:0 6px 14px -4px rgba(21,94,239,0.5);`)}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="#fff"></path></svg>ИИ генерирует</span>
            <div style={s(`flex:1; height:1px; background-image:repeating-linear-gradient(90deg, var(--line) 0 6px, transparent 6px 11px);`)}></div>
          </div>

          <div style={s(`background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px; overflow:hidden;`)}>
            <div style={s(`display:flex; gap:14px;`)}>
              <div style={s(`width:86px; height:86px; border-radius:10px; background:repeating-linear-gradient(45deg, #ECEBE7, #ECEBE7 5px, #F6F6F4 5px, #F6F6F4 10px); border:1px dashed #C9CDD3; display:flex; align-items:center; justify-content:center; font-family:monospace; font-size:9px; color:#8A8F99; flex-shrink:0; text-align:center;`)}>фото<br />товара</div>
              <div style={s(`min-width:0; flex:1;`)}>
                <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:15px; color:var(--ink); line-height:1.3;`)}>Кресло офисное «Оптима» с сетчатой спинкой, чёрное</div>
                <div style={s(`display:flex; flex-wrap:wrap; gap:6px; margin-top:9px;`)}>
                  <span style={s(`font-size:10.5px; font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:3px 8px; animation:chipIn 6s cubic-bezier(.4,0,.2,1) infinite;`)}>нагрузка до 120 кг</span>
                  <span style={s(`font-size:10.5px; font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:3px 8px; animation:chipIn 6s cubic-bezier(.4,0,.2,1) 0.35s infinite;`)}>газлифт класс 3</span>
                  <span style={s(`font-size:10.5px; font-weight:600; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:3px 8px; animation:chipIn 6s cubic-bezier(.4,0,.2,1) 0.7s infinite;`)}>гарантия 2 года</span>
                </div>
              </div>
            </div>
            <div style={s(`margin-top:14px;`)}>
              <div style={s(`font-family:monospace; font-size:9.5px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--violet); display:flex; align-items:center; gap:6px;`)}>SEO-описание<span style={s(`width:6px; height:11px; background:var(--violet); display:inline-block; animation:genCursor 1s step-end infinite;`)}></span></div>
              <div style={s(`display:flex; flex-direction:column; gap:7px; margin-top:9px;`)}>
                <div style={s(`height:8px; border-radius:4px; background:linear-gradient(90deg, #DCE4F0, #E8EDF6); transform-origin:left; animation:genLine 6s cubic-bezier(.4,0,.2,1) infinite;`)}></div>
                <div style={s(`height:8px; border-radius:4px; background:linear-gradient(90deg, #DCE4F0, #E8EDF6); transform-origin:left; animation:genLine 6s cubic-bezier(.4,0,.2,1) infinite 0.5s; width:92%;`)}></div>
                <div style={s(`height:8px; border-radius:4px; background:linear-gradient(90deg, #DCE4F0, #E8EDF6); transform-origin:left; animation:genLine 6s cubic-bezier(.4,0,.2,1) infinite 1s; width:78%;`)}></div>
                <div style={s(`height:8px; border-radius:4px; background:linear-gradient(90deg, #DCE4F0, #E8EDF6); transform-origin:left; animation:genLine 6s cubic-bezier(.4,0,.2,1) infinite 1.5s; width:52%;`)}></div>
              </div>
            </div>
            <div style={s(`display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:16px; padding-top:14px; border-top:1px solid var(--line);`)}>
              <span style={s(`display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; color:#1F8A5B;`)}><span style={s(`width:14px; height:14px; border-radius:50%; background:#1F8A5B; display:flex; align-items:center; justify-content:center;`)}><svg width="8" height="8" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg></span>готово к выгрузке</span>
              <span style={s(`font-family:monospace; font-size:10.5px; color:var(--ink-faint);`)}>заголовок · характеристики · описание · мета-теги</span>
            </div>
          </div>

          <div style={s(`display:flex; gap:10px; flex-wrap:wrap; margin-top:18px;`)}>
            <span style={s(`font-size:13px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>1000+ карточек в неделю</span>
            <span style={s(`font-size:13px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>Единый стиль описаний</span>
            <span style={s(`font-size:13px; font-weight:600; color:var(--ink); background:var(--paper); border:1px solid var(--line); border-radius:999px; padding:8px 15px;`)}>Тексты под SEO-запросы</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="analytics" data-screen-label="ИИ-аналитика и отчёты" style={s(`position:relative; background:var(--ink); padding:${v.darkPad}; overflow:hidden;`)}>
    <div style={s(`position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:760px; height:760px; border-radius:50%; background:var(--grad); opacity:0.2; filter:blur(130px); pointer-events:none;`)}></div>

    <div style={s(`position:relative; z-index:1; max-width:1360px; margin:0 auto; padding:${v.darkInnerPad};`)}>
      <div data-reveal style={s(`max-width:700px;`)}>
        <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent; display:inline-block;`)}>ИИ-аналитика</div>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:clamp(32px,4vw,46px); line-height:1.14; letter-spacing:-0.02em; margin:16px 0 0; color:#fff;`)}>Отчёты, которые приходят сами</h2>
        <p style={s(`font-size:18px; line-height:1.6; color:rgba(255,255,255,0.65); margin:20px 0 0;`)}>Руководитель не строит отчёты — он их читает. ИИ собирает данные из CRM и телефонии и присылает выводы туда, где вам удобно: в Telegram или на почту.</p>
      </div>

      <div data-reveal-children="110" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:20px; margin-top:64px;`)}>
        <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(255,255,255,0.16); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2);`)}>
          <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>Каждое утро</div>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; margin:12px 0 0; color:#fff;`)}>Сводка по продажам</h3>
          <p style={s(`font-size:14.5px; line-height:1.6; color:rgba(255,255,255,0.7); margin:12px 0 0;`)}>Новые сделки и суммы, зависшие задачи, просроченные звонки, план-факт по менеджерам — короткий дайджест к началу дня.</p>
          <div style={s(`margin-top:auto; padding-top:24px;`)}>
            <div style={s(`background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:13px 15px;`)}>
              <div style={s(`font-family:monospace; font-size:10px; color:rgba(255,255,255,0.45);`)}>ИИ → Telegram, 09:00</div>
              <div aria-hidden="true" style={s(`display:flex; align-items:flex-end; gap:5px; height:36px; margin-top:10px;`)}>
                <span style={s(`flex:1; height:42%; border-radius:3px 3px 0 0; background:rgba(94,159,255,0.4); transform-origin:bottom; animation:barLive 3.4s ease-in-out infinite;`)}></span>
                <span style={s(`flex:1; height:58%; border-radius:3px 3px 0 0; background:rgba(94,159,255,0.4); transform-origin:bottom; animation:barLive 3.4s ease-in-out infinite -0.4s;`)}></span>
                <span style={s(`flex:1; height:36%; border-radius:3px 3px 0 0; background:rgba(94,159,255,0.4); transform-origin:bottom; animation:barLive 3.4s ease-in-out infinite -0.8s;`)}></span>
                <span style={s(`flex:1; height:68%; border-radius:3px 3px 0 0; background:rgba(94,159,255,0.45); transform-origin:bottom; animation:barLive 3.4s ease-in-out infinite -1.2s;`)}></span>
                <span style={s(`flex:1; height:50%; border-radius:3px 3px 0 0; background:rgba(94,159,255,0.45); transform-origin:bottom; animation:barLive 3.4s ease-in-out infinite -1.6s;`)}></span>
                <span style={s(`flex:1; height:80%; border-radius:3px 3px 0 0; background:rgba(94,159,255,0.55); transform-origin:bottom; animation:barLive 3.4s ease-in-out infinite -2s;`)}></span>
                <span style={s(`flex:1; height:95%; border-radius:3px 3px 0 0; background:linear-gradient(180deg, #5E9FFF, #12A5E0); transform-origin:bottom; animation:barLive 3.4s ease-in-out infinite -2.4s;`)}></span>
              </div>
              <div style={s(`font-size:12.5px; line-height:1.55; color:rgba(255,255,255,0.85); margin-top:6px;`)}>«За вчера 14 новых сделок на ₽2,4 млн. У Сергея 3 просроченные задачи, сделка "Альфа" стоит 6 дней — рекомендую позвонить сегодня»</div>
            </div>
          </div>
        </div>

        <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(21,94,239,0.22), rgba(18,165,224,0.08)); backdrop-filter:blur(20px) saturate(160%); -webkit-backdrop-filter:blur(20px) saturate(160%); border:1px solid rgba(94,159,255,0.45); border-radius:22px; padding:34px 32px; box-shadow:0 24px 60px -20px rgba(21,94,239,0.35), inset 0 1px 1px rgba(255,255,255,0.25);`)}>
          <div style={s(`font-family:monospace; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:rgba(255,255,255,0.4);`)}>После каждого звонка</div>
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; margin:12px 0 0; color:#fff;`)}>Разбор звонков менеджеров</h3>
          <p style={s(`font-size:14.5px; line-height:1.6; color:rgba(255,255,255,0.7); margin:12px 0 0;`)}>Транскрибация разговоров, оценка по вашему чек-листу, причины отказов и возражения — РОП слушает не всё подряд, а только проблемные звонки.</p>
          <div style={s(`margin-top:auto; padding-top:24px;`)}>
            <div style={s(`background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:13px 15px;`)}>
              <div style={s(`font-family:monospace; font-size:10px; color:rgba(255,255,255,0.45);`)}>оценка звонка · 4 мин 12 сек</div>
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
          <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; margin:12px 0 0; color:#fff;`)}>Ответы цифрами из CRM</h3>
          <p style={s(`font-size:14.5px; line-height:1.6; color:rgba(255,255,255,0.7); margin:12px 0 0;`)}>Спрашиваете как человека: «сколько сделок закрыл отдел в марте», «какая конверсия из заявки в оплату» — агент отвечает данными, а не ощущениями.</p>
          <div style={s(`margin-top:auto; padding-top:24px;`)}>
            <div style={s(`background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:13px 15px;`)}>
              <div style={s(`font-family:monospace; font-size:10px; color:rgba(255,255,255,0.45);`)}>вы → ИИ</div>
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
        <p style={s(`font-size:15px; color:rgba(255,255,255,0.55); margin:0; max-width:560px;`)}>Отчёты собираем под ваши процессы: что измерять, как часто и куда присылать — решаем на диагностике.</p>
        <button className="aifx10" onClick={v.scrollToContact} style={s(`font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:var(--ink); background:#fff; border:none; padding:13px 28px; border-radius:999px; cursor:pointer; transition:transform 0.2s ease;`)}>Обсудить свои отчёты</button>
      </div>
    </div>
  </section>

  <section id="process" data-screen-label="Как внедряем ИИ" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:720px;`)}>
      <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Процесс</div>
      <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Как устроено внедрение ИИ</h2>
      <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Не «купите подписку на нейросеть», а внедрение в процессы: начинаем с одного сценария, доказываем эффект цифрами — и только потом масштабируем.</p>
    </div>

    <div style={s(`max-width:860px; margin-top:56px;`)}>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--grad); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px; box-shadow:0 8px 18px -6px rgba(21,94,239,0.5);`)}>01</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Диагностика процессов и данных</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>3–5 дней · бесплатно</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Смотрим, где рутина съедает часы: поток обращений, контент, отчёты, документы. Проверяем, какие данные есть для обучения ИИ, и выбираем 1–2 сценария с самым быстрым эффектом.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>карта сценариев с оценкой эффекта и сметой</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>02</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Пилот на одном сценарии</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>2–3 недели</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Собираем решение на ваших данных: база знаний, прайсы, регламенты, история диалогов. Тестируем на реальных обращениях и меряем качество ответов до боевого запуска.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>работающая автоматизация и цифры «до/после»</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>03</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Интеграция в системы</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>1–2 недели</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Подключаем ИИ к Битрикс24, мессенджерам, сайту, телефонии и 1С. Настраиваем права и границы: что ИИ делает сам, что — только с подтверждением человека.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>ИИ работает в боевом контуре, под контролем</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--paper); border:1px solid var(--line); color:var(--ink); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>04</div>
          <div style={s(`flex:1; width:1px; background-image:repeating-linear-gradient(180deg, var(--line) 0 6px, transparent 6px 11px); margin:8px 0;`)}></div>
        </div>
        <div style={s(`padding-bottom:40px; min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Обучение команды</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>3–4 дня</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Показываем, как ставить ИИ задачи, проверять его работу и что делать с нестандартными случаями. Фиксируем регламенты: где ИИ решает сам, где — человек.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>команда работает с ИИ уверенно, без страха</span></div>
        </div>
      </div>

      <div data-reveal style={s(`display:flex; gap:${v.stepGap};`)}>
        <div style={s(`display:flex; flex-direction:column; align-items:center; flex-shrink:0;`)}>
          <div style={s(`width:46px; height:46px; border-radius:50%; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:15px;`)}>05</div>
        </div>
        <div style={s(`min-width:0;`)}>
          <div style={s(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
            <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:21px; letter-spacing:-0.01em; margin:0; color:var(--ink);`)}>Сопровождение и развитие</h3>
            <span style={s(`font-family:monospace; font-size:11px; font-weight:700; color:var(--ink-soft); background:#F1F3F5; border-radius:6px; padding:4px 9px;`)}>постоянно</span>
          </div>
          <p style={s(`font-size:16px; line-height:1.65; color:var(--ink-soft); margin:10px 0 0; max-width:640px;`)}>Следим за качеством ответов, дообучаем систему на новых данных и добавляем сценарии: после продаж — поддержка, после карточек — аналитика.</p>
          <div style={s(`display:flex; align-items:baseline; gap:10px; margin-top:14px;`)}><span style={s(`font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#1F8A5B; flex-shrink:0;`)}>Результат</span><span style={s(`font-size:14.5px; color:var(--ink);`)}>система становится точнее с каждым месяцем</span></div>
        </div>
      </div>

    </div>
  </section>

  <section id="cases" data-screen-label="Кейсы и результаты" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`max-width:720px;`)}>
      <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>Результаты</div>
      <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Типовые сценарии — и что они дают</h2>
      <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0;`)}>Три частые ситуации из проектов внедрения. Ваши цифры зависят от данных и процессов — честную оценку даём после диагностики.</p>
    </div>

    <div data-reveal-children="120" style={s(`display:grid; grid-template-columns:${v.cols3}; gap:24px; margin-top:56px; align-items:stretch;`)}>
      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:22px; padding:32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <span style={s(`align-self:flex-start; font-size:11.5px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:var(--blue); background:rgba(21,94,239,0.08); border:1px solid rgba(21,94,239,0.18); border-radius:999px; padding:6px 13px;`)}>Оптовая торговля</span>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; letter-spacing:-0.01em; line-height:1.3; margin:18px 0 0; color:var(--ink);`)}>Каталог из 4 800 позиций описан за месяц</h3>
        <p style={s(`font-size:14.5px; line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Контент-менеджер тратил 30–40 минут на карточку — каталог не был бы готов и за год. ИИ собирает карточки по прайсу поставщика, человек выборочно проверяет.</p>
        <div style={s(`display:flex; gap:12px; margin-top:auto; padding-top:24px;`)}>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>×12</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>быстрее на карточку</div>
          </div>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>100%</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>каталога в поиске</div>
          </div>
        </div>
      </div>

      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:22px; padding:32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <span style={s(`align-self:flex-start; font-size:11.5px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:var(--violet); background:rgba(18,165,224,0.08); border:1px solid rgba(18,165,224,0.2); border-radius:999px; padding:6px 13px;`)}>B2B-услуги</span>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; letter-spacing:-0.01em; line-height:1.3; margin:18px 0 0; color:var(--ink);`)}>Заявки перестали «остывать» за ночь</h3>
        <p style={s(`font-size:14.5px; line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Вечерние и ночные заявки ждали утра — часть клиентов уходила к тем, кто ответил первым. ИИ отвечает за минуту, квалифицирует и бронирует время звонка.</p>
        <div style={s(`display:flex; gap:12px; margin-top:auto; padding-top:24px;`)}>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>2 ч → 1 мин</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>время первого ответа</div>
          </div>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>+31%</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>заявок доходит до встречи</div>
          </div>
        </div>
      </div>

      <div style={s(`display:flex; flex-direction:column; background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:22px; padding:32px; box-shadow:0 18px 40px -22px rgba(20,23,28,0.2), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <span style={s(`align-self:flex-start; font-size:11.5px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:#1F8A5B; background:rgba(31,138,91,0.08); border:1px solid rgba(31,138,91,0.2); border-radius:999px; padding:6px 13px;`)}>Интернет-магазин</span>
        <h3 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; letter-spacing:-0.01em; line-height:1.3; margin:18px 0 0; color:var(--ink);`)}>Поддержка перестала тонуть в «где заказ?»</h3>
        <p style={s(`font-size:14.5px; line-height:1.6; color:var(--ink-soft); margin:12px 0 0;`)}>Операторы разгребали однотипные вопросы по статусам и доставке. ИИ отвечает по данным заказа сам, людям остаются возвраты и спорные случаи.</p>
        <div style={s(`display:flex; gap:12px; margin-top:auto; padding-top:24px;`)}>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>7 из 10</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>обращений закрывает ИИ</div>
          </div>
          <div style={s(`flex:1; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:13px 15px;`)}>
            <div style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; color:var(--ink);`)}>24/7</div>
            <div style={s(`font-size:11.5px; color:var(--ink-faint); margin-top:2px;`)}>без смен и очередей</div>
          </div>
        </div>
      </div>
    </div>

    <p data-reveal style={s(`font-size:14px; color:var(--ink-faint); margin:26px 0 0;`)}>Сценарии обобщены по типовым проектам, без названий клиентов. Оценку эффекта для вашей компании даём на бесплатной диагностике.</p>
  </section>

  <section id="cost" data-screen-label="Стоимость внедрения ИИ" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal-children="150" style={s(`display:grid; grid-template-columns:${v.migCols}; gap:${v.migGap}; align-items:start;`)}>
      <div>
        <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue);`)}>Стоимость</div>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Сколько стоит внедрение ИИ</h2>
        <p style={s(`font-size:18px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:560px;`)}>У ИИ-проектов нет честного прайса «для всех»: цена зависит от сценариев и данных, а не от тарифа. Поэтому мы начинаем с бесплатной диагностики — и только после неё фиксируем состав работ, сроки и смету в договоре.</p>
        <p style={s(`font-size:16px; line-height:1.6; color:var(--ink-soft); margin:16px 0 0; max-width:560px;`)}>Начать можно с малого: пилот на одном сценарии показывает эффект цифрами до того, как вы вкладываетесь в масштабирование.</p>
        <button className="aifx11" onClick={v.scrollToContact} style={s(`margin-top:30px; font-family:'Inter',sans-serif; font-size:15px; font-weight:600; color:#fff; background:var(--grad); border:none; padding:15px 30px; border-radius:14px; cursor:pointer; box-shadow:0 10px 24px rgba(21,94,239,0.25); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Получить оценку проекта</button>
      </div>

      <div style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.5)); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:24px; padding:${v.migCardPad}; box-shadow:0 30px 60px -30px rgba(20,23,28,0.25), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
        <div style={s(`font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink-faint);`)}>Что влияет на стоимость</div>
        <div style={s(`display:flex; flex-direction:column; gap:0; margin-top:14px;`)}>
          <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:13px; color:var(--blue); flex-shrink:0;`)}>01</span>
            <div><div style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Количество сценариев автоматизации</div><div style={s(`font-size:14px; color:var(--ink-soft); margin-top:3px;`)}>автоответы на заявки — одна задача, продажи + поддержка + контент и аналитика — другая</div></div>
          </div>
          <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:13px; color:var(--blue); flex-shrink:0;`)}>02</span>
            <div><div style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Объём и качество данных</div><div style={s(`font-size:14px; color:var(--ink-soft); margin-top:3px;`)}>готовая база знаний ускоряет запуск; разрозненные файлы и «знания в головах» — удлиняют</div></div>
          </div>
          <div style={s(`display:flex; gap:14px; padding:16px 0; border-bottom:1px solid var(--line); align-items:baseline;`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:13px; color:var(--blue); flex-shrink:0;`)}>03</span>
            <div><div style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Интеграции</div><div style={s(`font-size:14px; color:var(--ink-soft); margin-top:3px;`)}>Битрикс24, 1С, сайт, телефония, нестандартные системы по API</div></div>
          </div>
          <div style={s(`display:flex; gap:14px; padding:16px 0; align-items:baseline;`)}>
            <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:13px; color:var(--blue); flex-shrink:0;`)}>04</span>
            <div><div style={s(`font-size:15.5px; font-weight:600; color:var(--ink);`)}>Требования к безопасности</div><div style={s(`font-size:14px; color:var(--ink-soft); margin-top:3px;`)}>облачные модели или контур на ваших серверах, ограничения доступа к данным</div></div>
          </div>
        </div>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:22px; background:rgba(31,138,91,0.07); border:1px solid rgba(31,138,91,0.2); border-radius:12px; padding:14px 16px;`)}>
          <span style={s(`width:7px; height:7px; border-radius:50%; background:#1F8A5B; flex-shrink:0; animation:pulseDot 1.8s ease-in-out infinite;`)}></span>
          <span style={s(`font-size:14px; font-weight:600; color:#1F8A5B;`)}>Диагностика и оценка проекта — бесплатно</span>
        </div>
      </div>
    </div>
  </section>

  <section id="faq" data-screen-label="FAQ" style={s(`padding:${v.secPad}; max-width:1360px; margin:0 auto;`)}>
    <div style={s(`display:grid; grid-template-columns:${v.faqCols}; gap:${v.migGap}; align-items:start;`)}>
      <div data-reveal>
        <div style={s(`font-family:monospace; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--violet);`)}>FAQ</div>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:${v.h2Size}; line-height:1.12; letter-spacing:-0.02em; margin:16px 0 0; color:var(--ink);`)}>Частые вопросы о внедрении ИИ</h2>
        <p style={s(`font-size:17px; line-height:1.6; color:var(--ink-soft); margin:20px 0 0; max-width:420px;`)}>Не нашли свой вопрос — напишите нам, отвечаем в течение рабочего дня.</p>
        <button className="aifx12" onClick={v.scrollToContact} style={s(`margin-top:26px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); padding:13px 26px; border-radius:999px; cursor:pointer; transition:border-color 0.2s ease;`)}>Задать вопрос</button>
      </div>

      <div data-reveal-children="80" style={s(`display:flex; flex-direction:column; gap:14px;`)}>
        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg0}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq0} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Чем ИИ-агент отличается от чат-бота?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon0}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows0}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Чат-бот ходит по жёсткому скрипту и ломается на нестандартном вопросе. ИИ-агент понимает свободную речь, работает на данных вашей компании и выполняет действия в системах: создаёт сделку в CRM, готовит документ, ставит задачу менеджеру.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg1}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq1} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Какие задачи можно поручить ИИ уже сейчас?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon1}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows1}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Ответы клиентам в мессенджерах и на сайте, квалификация заявок, заполнение карточек товаров, SEO-тексты и описания, сводки по продажам, разбор звонков менеджеров, подготовка документов по шаблонам. Начинаем с того, что даст эффект быстрее всего.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg2}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq2} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Насколько это безопасно? Куда уходят наши данные?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon2}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows2}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Контур настраиваем под ваши требования: российские модели или размещение на ваших серверах, разграничение прав доступа. Агент видит только те данные, которые ему явно разрешены, — и не может выгрузить базу «на сторону».</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg3}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq3} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Нужен ли Битрикс24, чтобы внедрить ИИ?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon3}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows3}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Нет. Глубже всего мы интегрируем агентов с Битрикс24 — как <a href="/bitrix24" style={s(`color:var(--blue); text-decoration:none; border-bottom:1px solid rgba(21,94,239,0.35);`)}>официальный партнёр</a>, — но агенты работают и с другими CRM, сайтом, телефонией и мессенджерами. Подключаемся к тем системам, которые у вас уже есть.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg4}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq4} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Что будет, если агент ошибётся?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon4}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows4}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Для каждого агента задаём границы: на что он отвечает сам, а что передаёт человеку. На пилоте измеряем качество ответов на реальных диалогах, критичные действия — отправка КП на крупную сумму, изменение заказа — выполняются с подтверждением сотрудника.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg5}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq5} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Сколько стоит внедрение ИИ и как быстро запуск?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon5}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows5}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Пилот на одном сценарии запускаем за 2–3 недели. Стоимость зависит от количества сценариев, объёма данных и интеграций — после бесплатной диагностики фиксируем состав работ и смету в договоре, без скрытых доплат.</p></div>
          </div>
        </div>

        <div style={s(`border:1px solid var(--line); border-radius:16px; background:${v.faqBg6}; overflow:hidden; transition:background 0.3s ease;`)}>
          <div onClick={v.toggleFaq6} style={s(`display:flex; align-items:center; gap:16px; padding:20px 24px; cursor:pointer;`)}>
            <h3 style={s(`font-family:'Inter',sans-serif; font-size:16.5px; font-weight:600; color:var(--ink); margin:0; flex:1; line-height:1.4;`)}>Заменит ли ИИ моих сотрудников?</h3>
            <span style={s(`width:26px; height:26px; border-radius:50%; border:1px solid var(--line); background:var(--paper); display:flex; align-items:center; justify-content:center; flex-shrink:0; transform:${v.faqIcon6}; transition:transform 0.35s cubic-bezier(.16,1,.3,1); font-size:16px; color:var(--ink-soft); line-height:1;`)}>+</span>
          </div>
          <div style={s(`display:grid; grid-template-rows:${v.faqRows6}; transition:grid-template-rows 0.4s cubic-bezier(.16,1,.3,1);`)}>
            <div style={s(`overflow:hidden; min-height:0;`)}><p style={s(`font-size:15px; line-height:1.65; color:var(--ink-soft); margin:0; padding:0 60px 22px 24px;`)}>Задача агентов — снять рутину, а не заменить команду. ИИ закрывает типовые обращения и черновую работу, люди занимаются сложными случаями и продажами. На практике компания успевает больше без расширения штата.</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section data-screen-label="Ссылка на Битрикс24" style={s(`padding:0 ${v.padX}; max-width:1360px; margin:0 auto;`)}>
    <a className="aifx13" data-reveal href="/bitrix24" style={s(`display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; background:var(--ink); border-radius:24px; padding:${v.bannerPad}; text-decoration:none; position:relative; overflow:hidden; transition:transform 0.25s ease;`)}>
      <span style={s(`position:absolute; top:-120px; right:-80px; width:340px; height:340px; border-radius:50%; background:var(--grad); opacity:0.25; filter:blur(90px); pointer-events:none;`)}></span>
      <span style={s(`position:relative; z-index:1; display:block;`)}>
        <span style={s(`display:block; font-family:monospace; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; background:var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent;`)}>Смотрите также</span>
        <span style={s(`display:block; font-family:'Manrope',sans-serif; font-weight:800; font-size:clamp(20px,2.4vw,26px); letter-spacing:-0.01em; color:#fff; margin-top:10px;`)}>Внедрение и поддержка Битрикс24</span>
        <span style={s(`display:block; font-size:15px; color:rgba(255,255,255,0.6); margin-top:8px; max-width:520px;`)}>Настройка CRM под процессы, интеграции с 1С и телефонией, миграция с amoCRM, поддержка по SLA — на отдельной странице.</span>
      </span>
      <span style={s(`position:relative; z-index:1; display:inline-flex; align-items:center; gap:8px; font-size:15px; font-weight:600; color:#fff; border:1px solid rgba(255,255,255,0.3); border-radius:999px; padding:13px 26px; white-space:nowrap;`)}>Подробнее о Битрикс24 →</span>
    </a>
  </section>

  <section id="contact" data-screen-label="Контакты CTA" style={s(`padding:${v.contactSecPad}; max-width:1360px; margin:0 auto;`)}>
    <div data-reveal style={s(`background:linear-gradient(160deg, rgba(255,255,255,0.72), rgba(255,255,255,0.48)); backdrop-filter:blur(28px) saturate(180%); -webkit-backdrop-filter:blur(28px) saturate(180%); border:1px solid rgba(255,255,255,0.75); border-radius:28px; padding:${v.contactPadding}; display:grid; grid-template-columns:${v.contactColumns}; gap:56px; position:relative; overflow:hidden; box-shadow:0 50px 90px -50px rgba(20,23,28,0.28), inset 0 1px 1px rgba(255,255,255,0.9);`)}>
      <div style={s(`position:absolute; top:-140px; right:-140px; width:420px; height:420px; border-radius:50%; background:var(--grad); opacity:0.08; filter:blur(100px); pointer-events:none;`)}></div>

      <div style={s(`position:relative; z-index:1;`)}>
        <h2 style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:clamp(30px,3.6vw,42px); letter-spacing:-0.02em; line-height:1.15; color:var(--ink); margin:0;`)}>Обсудим, что ИИ снимет с вашей команды?</h2>
        <p style={s(`font-size:17px; line-height:1.6; color:var(--ink-soft); margin:18px 0 0; max-width:420px;`)}>Расскажите, где у вас больше всего рутины, — на бесплатной диагностике покажем сценарии, оценим эффект и назовём сроки пилота.</p>

        <div style={s(`display:flex; align-items:center; gap:10px; margin-top:36px;`)}>
          <span style={s(`width:26px; height:26px; border-radius:8px; background:var(--grad); display:flex; align-items:center; justify-content:center; flex-shrink:0;`)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" fill="#fff"></path></svg></span>
          <span style={s(`font-size:14px; font-weight:600; color:var(--ink-soft);`)}>Пилот за 2–3 недели · данные под вашим контролем</span>
        </div>
      </div>

      <div style={s(`position:relative; z-index:1; display:flex; flex-direction:column; justify-content:center; gap:24px; min-height:260px;`)}>
        <div style={s(`display:flex; flex-direction:column; gap:12px;`)}>
          <a className="aifx14" href={v.tgHref} target="_blank" rel="noopener" style={s(`display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; font-size:16px; font-weight:600; color:#fff; background:var(--grad); border-radius:12px; padding:16px 28px; text-decoration:none; box-shadow:0 10px 24px rgba(21,94,239,0.22); transition:transform 0.2s ease, box-shadow 0.2s ease;`)}>Написать в Telegram</a>
          <a className="aifx15" href={v.waHref} target="_blank" rel="noopener" style={s(`display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; font-size:16px; font-weight:600; color:var(--ink); background:transparent; border:1px solid var(--line); border-radius:12px; padding:16px 28px; text-decoration:none; transition:border-color 0.2s ease;`)}>Написать в WhatsApp</a>
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
      <span style={s(`font-family:'Manrope',sans-serif; font-weight:800; font-size:15px; color:var(--ink);`)}>ETHOS</span>
      <span style={s(`font-size:13px; color:var(--ink-faint); margin-left:4px;`)}>· Битрикс24 и ИИ</span>
    </div>
    <div style={s(`display:flex; gap:24px; flex-wrap:wrap;`)}>
      <a href="/" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>Главная</a>
      <a href="/bitrix24" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>Битрикс24</a>
      <a href="#agents" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>Сценарии</a>
      <a href="#process" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>Внедрение</a>
      <a href="#faq" style={s(`font-size:14px; color:var(--ink-soft); text-decoration:none;`)}>FAQ</a>
    </div>
    <div style={s(`font-size:13px; color:var(--ink-faint);`)}>© 2026 ETHOS. Все права защищены.</div>
  </footer>

</div>

      </>
    );
  }
}
