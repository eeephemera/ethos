// Shared UI helpers for the ported ETHOS pages.
// s(): parse a CSS text string into a React style object, so the design's
// inline styles port over verbatim (incl. CSS custom properties).
// Yandex.Metrika counter id (kept here so goal calls stay in one place).
export const YM_ID = 110919394;

// Fire a Metrika goal (conversion). No-op during SSR or if the counter
// hasn't loaded yet, so it's always safe to call from a click handler.
export function ymGoal(name) {
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', name);
  }
}

/**
 * Скрытие шапки при листании — паттерн headroom.
 *
 * Почему именно он. Липкая шапка на телефоне съедает верх экрана и в длинных
 * текстах реально мешает. Варианты, которые рассматривались:
 *
 *   • прятать по любому скроллу и показывать только вверху страницы — чтобы
 *     вернуться к меню, приходится долистывать до самого верха;
 *   • автопрятание по таймеру — шапка исчезает, когда человек просто читает;
 *   • совсем не липкая — с длинной страницы до навигации не добраться.
 *
 * Headroom (вниз — прячем, вверх — сразу возвращаем) выигрывает потому, что
 * листание вверх и есть сигнал «хочу управление»: пользователь получает меню
 * ровно тогда, когда потянулся за ним, и не теряет ни пикселя при чтении.
 *
 * Детали, без которых паттерн раздражает:
 *   – порог REVEAL_AT: у первого экрана шапка не прячется никогда, иначе она
 *     дёргается на микро-скроллах в самом верху;
 *   – DELTA: игнорируем дрожание пальца меньше 6 px, иначе шапка мигает;
 *   – открытое мобильное меню не прячем — иначе оно уедет вместе с шапкой;
 *   – :focus-within в CSS возвращает шапку при переходе по Tab;
 *   – prefers-reduced-motion отключает и анимацию, и само скрытие.
 *
 * Состояние пишется data-атрибутом прямо в DOM, без setState: страницы весят
 * ~130 КБ разметки, и ре-рендер на каждый скролл-эвент был бы заметен.
 */
export function setupHeaderAutoHide(getHeader, isMenuOpen) {
  if (typeof window === 'undefined') return () => {};

  const REVEAL_AT = 220; // до этой отметки шапка всегда видна
  const DELTA = 6; // мёртвая зона против дрожания

  let lastY = window.scrollY || 0;
  let ticking = false;

  const apply = () => {
    ticking = false;
    const el = typeof getHeader === 'function' ? getHeader() : getHeader;
    if (!el) return;

    const y = Math.max(0, window.scrollY || 0);
    const diff = y - lastY;
    if (Math.abs(diff) < DELTA) return;

    const menuOpen = typeof isMenuOpen === 'function' ? isMenuOpen() : false;
    const atTop = y < REVEAL_AT;
    // у самого низа страницы прятать нечего — там уже футер
    const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 4;

    const hide = diff > 0 && !atTop && !atBottom && !menuOpen;
    el.setAttribute('data-hidden', hide ? 'true' : 'false');
    lastY = y;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(apply);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}

export function s(css) {
  const style = {};
  if (!css) return style;
  String(css).split(';').forEach((decl) => {
    const i = decl.indexOf(':');
    if (i < 0) return;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop || !val) return;
    const key = prop.slice(0, 2) === '--' ? prop : prop.replace(/-([a-zA-Z])/g, (_, c) => c.toUpperCase());
    style[key] = val;
  });
  return style;
}

/**
 * Пауза для тяжёлых секций, пока их нет на экране.
 *
 * Зачем. На главной одновременно крутились четыре автоплей-цикла (кран 4,6 с,
 * канбан 7 с, слайдер 9 с, карточки товаров 7 с) плюс setInterval на 1,5 с,
 * перерисовывающий компонент целиком. Работали они всегда — и пока человек
 * читал футер, и пока вкладка была свёрнута. На среднем Android это ровно те
 * подтормаживания, которые видно при листании.
 *
 * Механика та же, что уже была у «Ленты знаний»: data-run='1' на элементе,
 * а CSS по нему снимает animation-play-state: paused. Здесь наблюдатель
 * работает в обе стороны — секция ушла из кадра, значит снова пауза.
 *
 * onChange получает true/false и гасит JS-таймеры секции. Возвращается
 * функция отписки для componentWillUnmount.
 */
export function observeInView(el, onChange, { rootMargin = '150px' } = {}) {
  if (typeof window === 'undefined' || !el) return () => {};

  const apply = (inView) => {
    el.setAttribute('data-run', inView ? '1' : '0');
    if (typeof onChange === 'function') onChange(inView);
  };

  // Без IntersectionObserver ничего не делаем: пауза выставляется атрибутом
  // data-run='0', поэтому по умолчанию демо работает как раньше. Замороженный
  // на нулевом кадре ролик выглядел бы сломанным — такой ценой экономить нельзя.
  if (!('IntersectionObserver' in window)) return () => {};

  const io = new IntersectionObserver(([entry]) => apply(entry.isIntersecting), { rootMargin });
  io.observe(el);
  return () => io.disconnect();
}
