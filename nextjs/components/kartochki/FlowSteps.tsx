import type { CSSProperties, ReactNode } from "react";
import { FlowStepsPlay } from "./FlowStepsPlay";
import s from "./flow-steps.module.css";

// «Как это работает» — анимация с сайта «Карточки·AI Лаб» (kartochki-ai-lab.ru, первый экран,
// site/src/components/flow/flow-steps.tsx, origin/main cf09315): путь карточки 1С → ИИ → 1С →
// сайт на одном экране, под ним четыре шага-кнопки. Перенесена 02.11 по просьбе владельца:
// раздел «Карточки товаров и SEO-тексты» на /ai — в стилистике продукта и с его анимацией.
// Разметка, движение (flow-steps.module.css) и петля (FlowStepsPlay.tsx) — как на сайте
// продукта; данные, которые там берутся из lib/kino-data и lib/onec-flow, — здесь константами.
//
// Товар — МФУ Canon сборки 21.10 из кинозала: наименование из 1С, кандидаты фото из выдачи и
// причины отказа, заголовок, первая фраза описания, характеристики и сколько источников их
// подтвердили, время сборки. Соседние строки 1С и плитки витрины — смеситель и кран из прогона
// «Домостроя», заполненные вручную: сервис их не трогает и пишет только в пустые поля.
//
// Экран — неподвижная картинка SVG, а всё, что движется, — HTML-«спрайты» поверх неё, и движутся
// они только transform и opacity: такую анимацию ведёт композитор, экран не перерисовывается.

const IMG = "/kartochki/";

/** Строки 1С, заполненные вручную: наименование как в 1С, начало описания, фото; на витрине —
 *  название в две строки */
const HAND = [
  { name: "Смеситель LEMARK LM0451C д/в", photo: IMG + "demo-smesitel.jpg", desc: "Смеситель для…", tile: ["Смеситель Lemark", "LM0451C для ванны"] },
  { name: "Кран шар. BG 3/4 американка", photo: IMG + "demo-kran.jpg", desc: "Шаровый кран…", tile: ["Кран шар. BG 3/4", "американка"] },
];

/** Наш товар — сборка 21.10 */
const OURS = {
  name: ["МФУ CANON imageRUNNER ADVANCE", "DX 4751i (4053C005)"],
  photo: IMG + "kino-photo-main.jpg",
  title: ["МФУ Canon imageRUNNER ADVANCE", "DX 4751i (4053C005), А3, ч/б"],
  text: ["Монохромное лазерное МФУ формата А3", "со скоростью 51 стр./мин по А4", "и двусторонней печатью."],
  tile: ["МФУ Canon imageRUNNER", "ADVANCE DX 4751i"],
};

/** Кандидаты фото из выдачи сборки: чужая модель серии (по адресу) и крупный план панели (зрение) */
const OTHER_MODEL = { file: IMG + "kino-search-01.jpg", reason: "DX C5840i" };
const PANEL = { file: IMG + "kino-search-02.jpg" };

/** Три характеристики карточки и сколько источников сверки их подтвердили */
const SPECS = [
  { name: "Формат", value: "А3", note: "6 источников" },
  { name: "Скорость ч/б А4", value: "51 стр/мин", note: "6 источников" },
  { name: "Двусторонняя печать", value: "Да", note: "5 источников" },
];

/** Итог сборки: время, характеристик в карточке, фото (главное + 2 доп.) */
const KINO_CARD = { elapsed: 56, published: 43, photos: 3 };

type Box = [x: number, y: number, w: number, h: number];

/**
 * Спрайт поверх картинки экрана. at — его место в координатах экрана 160×90 (как у SVG под
 * ним); форма — своя маленькая SVG в тех же координатах. Когда и как он движется — классы
 * (className): по ним CSS берёт ключевые кадры фазы. overlay — HTML-слои внутри спрайта (шторки).
 */
function Sprite({
  className,
  at,
  children,
  overlay,
}: {
  className: string;
  at: Box;
  children?: ReactNode;
  overlay?: ReactNode;
}) {
  const [x, y, w, h] = at;
  const style: CSSProperties = {
    left: `${+(x / 1.6).toFixed(2)}%`,
    top: `${+(y / 0.9).toFixed(2)}%`,
    width: `${+(w / 1.6).toFixed(2)}%`,
    height: `${+(h / 0.9).toFixed(2)}%`,
  };
  return (
    <i className={`${s.sprite} ${className}`} style={style}>
      {children && <svg viewBox={at.join(" ")}>{children}</svg>}
      {overlay}
    </i>
  );
}

/** Шторка над строкой текста внутри спрайта box: цвет карточки; уходит вправо — строка «печатается» */
function Cover({ box, line, cue }: { box: Box; line: Box; cue: string }) {
  const [bx, by, bw, bh] = box;
  const [x, y, w, h] = line;
  const style: CSSProperties = {
    left: `${+(((x - bx) / bw) * 100).toFixed(2)}%`,
    top: `${+(((y - by) / bh) * 100).toFixed(2)}%`,
    width: `${+((w / bw) * 100).toFixed(2)}%`,
    height: `${+((h / bh) * 100).toFixed(2)}%`,
  };
  return <b className={`${s.cover} ${cue}`} style={style} />;
}

/** Строка 1С, заполненная вручную: наименование, начало описания, фото */
function HandRow({ y, item }: { y: number; item: (typeof HAND)[number] }) {
  return (
    <>
      <text className={s.onecName} x="12" y={y + 10.2}>
        {item.name}
      </text>
      <text className={s.onecDesc} x="103" y={y + 10.2}>
        {item.desc}
      </text>
      <rect x="134.5" y={y + 2.5} width="13" height="13" rx="2" fill="#fff" stroke="#e3e0d6" strokeWidth="0.6" />
      <image href={item.photo} x="135" y={y + 3} width="12" height="12" />
    </>
  );
}

/** «пусто» в ячейке нашей строки: мигает, когда строка уходит в сервис; гаснет, когда ответ лёг */
function Empty({ className, x, center = false }: { className: string; x: number; center?: boolean }) {
  return (
    <Sprite className={className} at={[x, 54.6, 15, 5]}>
      <text className={s.onecEmpty} x={center ? x + 7.5 : x} y="58.4" textAnchor={center ? "middle" : undefined}>
        пусто
      </text>
    </Sprite>
  );
}

/** Окно 1С «Номенклатура», наша строка — вторая. Без write — пустые поля уходят в сервис;
 *  с write — ответ ложится только в них. */
function OnecScreen({ write = false }: { write?: boolean }) {
  return (
    <>
      <svg className={s.art} viewBox="0 0 160 90">
        <rect width="160" height="15" fill="#e6e2d6" />
        <path d="M0 15.5h160" stroke="#d3cfc2" />
        <rect x="6" y="4" width="7" height="7" rx="1.6" fill="#f5d55a" stroke="#c9a92b" strokeWidth="0.8" />
        <text className={s.onecTitle} x="17" y="11.6">
          1С
        </text>
        <text className={s.onecWindow} x="33" y="10.3">
          Номенклатура
        </text>
        <rect x="6" y="20" width="148" height="64" fill="#fff" stroke="#d6d2c6" strokeWidth="0.8" />
        <rect x="6.4" y="20.4" width="147.2" height="9.6" fill="#efebdd" />
        <text className={s.onecHead} x="12" y="26.4">
          Наименование
        </text>
        <text className={s.onecHead} x="103" y="26.4">
          Описание
        </text>
        <text className={s.onecHead} x="134.5" y="26.4">
          Фото
        </text>
        <path d="M6.4 48h147.2M6.4 66h147.2" stroke="#ebe8df" strokeWidth="0.8" />
        <HandRow y={30} item={HAND[0]} />
        <HandRow y={66} item={HAND[1]} />
        {/* наша строка: МФУ Canon, описания и фото нет */}
        <text className={s.onecOurs} x="12" y="55.4">
          {OURS.name[0]}
        </text>
        <text className={s.onecOurs} x="12" y="60.4">
          {OURS.name[1]}
        </text>
      </svg>

      {write ? (
        <>
          <Sprite className={s.rowFlash} at={[6.4, 48, 147.2, 18]} />
          <Empty className={s.dashGone} x={103} />
          <Empty className={s.dashGone} x={134} center />
          <Sprite className={`${s.done} ${s.doneCheck}`} at={[102.5, 53.4, 28, 7]}>
            <path d="M103.6 57.3l1.6 1.6 3-3.2" fill="none" stroke="#0c7a41" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            <text className={s.onecDone} x="109.4" y="58.6">
              {OURS.text[0].split(" ")[0]}…
            </text>
          </Sprite>
          <Sprite className={`${s.done} ${s.donePhoto}`} at={[134, 50, 14, 14]}>
            <rect x="134.5" y="50.5" width="13" height="13" rx="2" fill="#fff" stroke="#9fd9b5" strokeWidth="0.8" />
            <image href={OURS.photo} x="135" y="51" width="12" height="12" />
          </Sprite>
          {/* ответ сервиса входит слева — из шага 2 */}
          <Sprite className={s.packetIn} at={[98, 46.6, 21, 16.6]}>
            <rect x="99" y="51" width="15" height="11" rx="1.6" fill="#eafbf1" stroke="#7fd3a3" strokeWidth="0.7" />
            <circle cx="114" cy="51.5" r="4.4" fill="#16a35a" />
            <path d="M112.2 51.6l1.3 1.3 2.4-2.6" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </Sprite>
        </>
      ) : (
        <>
          {/* кнопка обработки «Заполнение карточек (ИИ)» */}
          <Sprite className={s.aiBtn} at={[122, 3.5, 32, 8]}>
            <text className={s.onecBtn} x="138" y="8.6" textAnchor="middle">
              Заполнение (ИИ)
            </text>
          </Sprite>
          <Sprite className={s.rowHi} at={[6.4, 48, 147.2, 18]} />
          <Sprite className={s.rowBar} at={[6.4, 50, 2.4, 14]} />
          <Empty className={s.dashBlink} x={103} />
          <Empty className={s.dashBlink} x={134} center />
          {/* пачка уходит направо — в сервис, шаг 2 */}
          <Sprite className={s.packetOut} at={[111, 46.6, 25, 17.4]}>
            <rect x="113" y="52.5" width="15" height="11" rx="1.6" fill="#f3f2ee" stroke="#cfcbbf" strokeWidth="0.7" transform="rotate(-7 120 58)" />
            <rect x="116" y="51" width="15" height="11" rx="1.6" fill="#fff" stroke="#cfcbbf" strokeWidth="0.7" />
            <circle cx="131" cy="51.5" r="4.4" fill="#155eef" />
            <path d="M129 51.5h4.2M131.7 49.8l1.7 1.7-1.7 1.7" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </Sprite>
        </>
      )}
    </>
  );
}

/** Кандидат фото на станции сервиса: с mark — отбракован, на метке причина (появляется, когда
 *  плитка тускнеет); без mark — фото нашего товара, его берут в карточку */
function Candidate({
  y,
  photo,
  cue,
  mark,
  label,
}: {
  y: number;
  photo: string;
  cue: string;
  mark?: string;
  label?: string;
}) {
  return (
    <>
      <Sprite className={mark ? `${s.tile} ${s.tileBad} ${cue}` : `${s.tile} ${cue}`} at={[5.6, y - 0.4, 24.8, 18.8]}>
        <rect x="6" y={y} width="24" height="18" rx="2.6" fill="#101722" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
        <rect x="11" y={y + 2} width="14" height="14" rx="1.5" fill="#fff" />
        <image href={photo} x="11" y={y + 2} width="14" height="14" />
      </Sprite>
      {mark && (
        <Sprite className={`${s.mark} ${mark}`} at={[8.5, y + 12.3, 19, 4.4]}>
          <rect x="8.5" y={y + 12.3} width="19" height="4.4" rx="1.4" fill="#ef6b5b" />
          <path d={`M10.3 ${y + 13.6}l1.8 1.8m0-1.8l-1.8 1.8`} stroke="#fff" strokeWidth="0.7" strokeLinecap="round" />
          <text className={s.rejText} x="13.4" y={y + 15.45}>
            {label}
          </text>
        </Sprite>
      )}
    </>
  );
}

/** Строка характеристики в карточке: поле, значение, сколько источников подтвердили, «сверено» */
function SpecRow({ y, cue, spec }: { y: number; cue: string; spec: (typeof SPECS)[number] }) {
  return (
    <Sprite className={`${s.spec} ${cue}`} at={[42, y - 1.8, 108, 6.8]}>
      <text className={s.specName} x="42" y={y + 2.7}>
        {spec.name}
      </text>
      <text className={s.specValue} x="84" y={y + 2.7}>
        {spec.value}
      </text>
      <text className={s.specNote} x="141" y={y + 2.6} textAnchor="end">
        {spec.note}
      </text>
      <circle cx="146" cy={y + 1.6} r="3.3" fill="rgba(53,201,120,0.22)" />
      <path d={`M144.5 ${y + 1.7}l1.1 1.1 2.1-2.3`} fill="none" stroke="#0c7a41" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" />
    </Sprite>
  );
}

/** Карточка на станции и её строки: заголовок — две, описание — три; шторка у каждой своя */
const CARD: Box = [36, 6, 118, 78];
const CARD_LINES = [
  { text: OURS.title[0], y: 16.4, title: true, cue: s.type1 },
  { text: OURS.title[1], y: 21.4, title: true, cue: s.type2 },
  { text: OURS.text[0], y: 27.8, title: false, cue: s.type3 },
  { text: OURS.text[1], y: 32.2, title: false, cue: s.type4 },
  { text: OURS.text[2], y: 36.6, title: false, cue: s.type5 },
];

/** Станция ИИ «Карточки AI»: кандидаты фото в брак или в карточку, текст и характеристики */
function ServiceScreen() {
  return (
    <>
      {/* знак сервиса — как в шапке сайта */}
      <svg className={s.art} viewBox="0 0 160 90">
        <rect x="6" y="5" width="10" height="10" rx="2.4" fill="#155eef" />
        <rect x="7.9" y="6.9" width="2.6" height="2.6" rx="0.6" fill="#fff" />
        <rect x="11.5" y="6.9" width="2.6" height="2.6" rx="0.6" fill="#fff" />
        <rect x="7.9" y="10.5" width="2.6" height="2.6" rx="0.6" fill="#fff" />
        <rect x="11.5" y="10.5" width="2.6" height="2.6" rx="0.6" fill="#35c978" />
        <text className={s.aiLabel} x="19" y="13.3">
          ИИ
        </text>
      </svg>

      <Candidate y={21} photo={OTHER_MODEL.file} cue={s.tileA} mark={s.rejA} label={OTHER_MODEL.reason.replace(/^DX\s+/, "")} />
      <Candidate y={42} photo={OURS.photo} cue={s.tileB} />
      {/* «крупный план панели» — на метке коротко */}
      <Candidate y={63} photo={PANEL.file} cue={s.tileC} mark={s.rejC} label="панель" />
      <Sprite className={`${s.mark} ${s.pick}`} at={[5.4, 41.4, 25.2, 19.2]}>
        <rect x="6" y="42" width="24" height="18" rx="2.6" fill="none" stroke="#4f83ff" strokeWidth="1.3" />
      </Sprite>
      <Sprite className={s.scan} at={[4, 19, 28, 4]} />

      <Sprite
        className={s.card}
        at={CARD}
        overlay={CARD_LINES.map((line) => (
          <Cover
            key={line.cue}
            box={CARD}
            line={line.title ? [77.5, line.y - 3.8, 72.5, 5] : [77.5, line.y - 2.9, 72.5, 3.9]}
            cue={line.cue}
          />
        ))}
      >
        <rect x="36" y="6" width="118" height="78" rx="4" fill="#fbfbf8" />
        <rect x="42" y="12" width="30" height="30" rx="2.5" fill="#e9ebe5" stroke="rgba(17,22,31,0.25)" strokeWidth="0.7" strokeDasharray="2 1.6" />
        {CARD_LINES.map((line) => (
          <text key={line.cue} className={line.title ? s.cardTitle : s.cardText} x="78" y={line.y}>
            {line.text}
          </text>
        ))}
        <path d="M42 53.6h110M42 62.1h110" stroke="#ebeee8" strokeWidth="0.6" />
      </Sprite>
      <Sprite className={s.photo} at={[41.4, 11.4, 31.2, 31.2]}>
        <rect x="42" y="12" width="30" height="30" rx="2.5" fill="#fff" />
        <image href={OURS.photo} x="42.5" y="12.5" width="29" height="29" />
        <rect x="42" y="12" width="30" height="30" rx="2.5" fill="none" stroke="#4f83ff" strokeWidth="1.2" />
      </Sprite>
      {/* характеристики: сверены по сайтам и брошюре */}
      <SpecRow y={48.4} cue={s.spec1} spec={SPECS[0]} />
      <SpecRow y={56.9} cue={s.spec2} spec={SPECS[1]} />
      <SpecRow y={65.4} cue={s.spec3} spec={SPECS[2]} />
      <Sprite className={`${s.mark} ${s.ok}`} at={[42, 73.6, 33, 6.6]}>
        <rect x="42" y="73.6" width="33" height="6.6" rx="3.3" fill="rgba(53,201,120,0.22)" />
        <path d="M45.2 76.9l1.2 1.2 2.2-2.4" fill="none" stroke="#0c7a41" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" />
        <text className={s.okText} x="50" y="78">
          Готово · {KINO_CARD.elapsed}&nbsp;с
        </text>
      </Sprite>
      <Sprite className={`${s.mark} ${s.okMore}`} at={[78, 73.6, 72, 6.6]}>
        <text className={s.okNote} x="78" y="78">
          {KINO_CARD.published} характеристики · {KINO_CARD.photos} фото
        </text>
      </Sprite>

      {/* выбранное фото перелетает в карточку */}
      <Sprite className={s.flyer} at={[11, 44, 14, 14]}>
        <rect x="11" y="44" width="14" height="14" rx="1.5" fill="#fff" />
        <image href={OURS.photo} x="11" y="44" width="14" height="14" />
      </Sprite>
    </>
  );
}

/** Плитка каталога на витрине: фото, название в две строки, кнопка */
function Tile({ x, photo, name }: { x: number; photo: string; name: string[] }) {
  return (
    <>
      <rect x={x} y="29" width="47" height="55" rx="3" fill="#fff" stroke="#e3e6eb" strokeWidth="0.8" />
      <image href={photo} x={x + 9.5} y="31.5" width="28" height="28" />
      <text className={s.tileName} x={x + 5} y="64.4">
        {name[0]}
      </text>
      <text className={s.tileName} x={x + 5} y="68.3">
        {name[1]}
      </text>
      <rect x={x + 5} y="72.4" width="37" height="6.6" rx="3.3" fill="#155eef" />
      <text className={s.tileBtn} x={x + 23.5} y="76.75" textAnchor="middle">
        В корзину
      </text>
    </>
  );
}

/** Витрина: обмен 1С с сайтом выводит карточку в каталог */
function SiteScreen() {
  return (
    <>
      <svg className={s.art} viewBox="0 0 160 90">
        <rect width="160" height="13" fill="#eceef1" />
        <path d="M0 13.5h160" stroke="#dde0e5" />
        <circle cx="7" cy="6.5" r="1.9" fill="#c9ced6" />
        <circle cx="12.8" cy="6.5" r="1.9" fill="#c9ced6" />
        <circle cx="18.6" cy="6.5" r="1.9" fill="#c9ced6" />
        <rect x="25" y="3" width="129" height="7" rx="3.5" fill="#fff" stroke="#dde0e5" strokeWidth="0.6" />
        <text className={s.siteUrl} x="30" y="7.5">
          ваш-сайт.ru/catalog
        </text>
        <text className={s.siteTitle} x="7" y="23.8">
          Новинки
        </text>
        <Tile x={6} photo={HAND[0].photo} name={HAND[0].tile} />
        <Tile x={56.5} photo={HAND[1].photo} name={HAND[1].tile} />
      </svg>
      <Sprite className={s.slot} at={[107.4, 29.4, 46.2, 54.2]} />
      <Sprite className={s.newTile} at={[106.6, 28.6, 47.8, 55.8]}>
        <Tile x={107} photo={OURS.photo} name={OURS.tile} />
      </Sprite>
      <Sprite className={s.newRing} at={[145.4, 31.4, 5.2, 5.2]} />
      <Sprite className={s.newDot} at={[145.4, 31.4, 5.2, 5.2]} />
    </>
  );
}

/** Шаг: подпись на кнопке и одна строка под экраном — простыми словами, для того, кто решает,
 *  а не для ИТ (Алексей 26.10: «из 1С в сервис, обратно в 1С» непонятно) */
const STEPS: { chip: ReactNode; caption: ReactNode; screen: ReactNode; kind: string; ai?: boolean }[] = [
  {
    chip: <>Берём товары из&nbsp;1С</>,
    caption: <>Находим в&nbsp;вашей 1С товары без описаний и&nbsp;фото.</>,
    screen: <OnecScreen />,
    kind: s.onec,
  },
  {
    chip: <>ИИ заполняет карточку</>,
    caption: <>ИИ пишет описание, находит фото и&nbsp;сверяет характеристики с&nbsp;сайтами производителей.</>,
    screen: <ServiceScreen />,
    kind: s.service,
    ai: true,
  },
  {
    chip: <>Возвращаем в&nbsp;1С</>,
    caption: <>Готовая карточка ложится в&nbsp;1С&nbsp;— только в&nbsp;пустые поля.</>,
    screen: <OnecScreen write />,
    kind: s.onec,
  },
  {
    chip: <>Товар на&nbsp;сайте</>,
    caption: <>Ваш обычный обмен 1С с&nbsp;сайтом выводит карточку в&nbsp;каталог.</>,
    screen: <SiteScreen />,
    kind: s.site,
  },
];

/**
 * «Как это работает»: большой экран и четыре шага под ним. Шаг — кнопка: экран переходит к нему
 * и проигрывает его; щелчок по экрану — следующий шаг. Подписи и экраны меняет CSS по data-phase,
 * которую ставит FlowStepsPlay. after — селектор блока, чьи анимации должны доиграть до первого
 * шага (первый экран: сначала читается левая колонка, Закир 01.11).
 */
export function FlowSteps({ className, after }: { className?: string; after?: string }) {
  return (
    <FlowStepsPlay className={className ? `${s.flow} ${className}` : s.flow} after={after}>
      <p className={s.head}>
        <span>Как это работает</span>
        <span className={s.tap}>нажмите на&nbsp;шаг</span>
      </p>
      <div className={s.stage} data-flow-stage="" aria-hidden="true">
        {STEPS.map((step, i) => (
          <div key={i} className={`${s.clip} ${step.kind} ${s.scr}`} data-scr={i + 1}>
            {step.screen}
          </div>
        ))}
      </div>
      <div className={s.captions} aria-hidden="true">
        {STEPS.map((step, i) => (
          <p key={i} data-cap={i + 1}>
            {step.caption}
          </p>
        ))}
      </div>
      <ol className={s.chips} aria-label="Как это работает: четыре шага">
        {STEPS.map((step, i) => (
          <li key={i}>
            <button type="button" className={s.chip} data-step={i + 1} data-ai={step.ai ? "" : undefined}>
              <b className={s.num}>{i + 1}</b>
              <span className={s.chipText}>{step.chip}</span>
              <span className={s.srOnly}>. {step.caption}</span>
              <i className={s.bar} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <p className={s.alt}>Нет 1С? Подойдёт выгрузка из&nbsp;Битрикса или Excel.</p>
    </FlowStepsPlay>
  );
}
