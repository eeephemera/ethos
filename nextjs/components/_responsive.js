// Единые адаптивные токены для всех страниц лендинга.
//
// Почему не JS-брейкпоинты.
// Раньше раскладка вычислялась из `window.innerWidth` в state класса. На сервере
// `window` нет → SSR всегда отдавал ДЕСКТОПНУЮ сетку. При гидратации React
// строит клиентское дерево уже с мобильными значениями, но несовпавшие
// inline-стили в существующем DOM он не переписывает — телефон навсегда
// оставался с десктопной раскладкой в 3 колонки, и текст уезжал за экран.
//
// Теперь каждое переключение раскладки живёт в CSS (globals.css, блок
// «adaptive design tokens»): один и тот же HTML на сервере и на клиенте,
// правильная раскладка с первого кадра и нулевой layout shift.
//
// JS-состояние `isMobile` осталось только для ПОВЕДЕНИЯ (свайпы, автоплей),
// где расхождение при гидратации безопасно.

export const R = {
  // ---- отступы ----
  padX: 'var(--pad-x)',
  secPad: 'var(--sec-pad)',
  heroPad: 'var(--hero-pad)',
  contactSecPad: 'var(--contact-sec-pad)',
  darkPad: 'var(--dark-pad)',
  darkInnerPad: 'var(--dark-inner-pad)',
  migGap: 'var(--mig-gap)',
  migCardPad: 'var(--mig-card-pad)',
  bannerPad: 'var(--banner-pad)',
  contactPadding: 'var(--contact-pad)',
  stepGap: 'var(--step-gap)',
  heroGap: 'var(--hero-gap)',
  heroVisualMt: 'var(--hero-visual-mt)',
  chatHeight: 'var(--chat-h)',

  // ---- сетки ----
  heroCols: 'var(--cols-hero)',
  cols2: 'var(--cols-2)',
  cols3: 'var(--cols-3)',
  migCols: 'var(--cols-mig)',
  faqCols: 'var(--cols-faq)',
  cols4: 'var(--cols-4)',

  // ---- типографика ----
  h1Size: 'var(--h1-size)',
  h1SizeXl: 'var(--h1-size-xl)',
  h2Size: 'var(--h2-size)',

  // ---- хром страницы ----
  navDisplay: 'var(--nav-display)',
  hamburgerDisplay: 'var(--burger-display)',
  footerDirection: 'var(--footer-dir)',
  footerAlign: 'var(--footer-align)',
  onlyDesktop: 'var(--only-desktop)',
  onlyMobile: 'var(--only-mobile)',
  onlyDesktopFlex: 'var(--only-desktop-flex)',
};

export default R;
