export const metadata = {
  title: 'Политика конфиденциальности — ETHOS',
  description: 'Как ETHOS (aiethos.ru) обрабатывает персональные данные и использует cookie и Яндекс.Метрику.',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: true },
};

const UPDATED = '21 июля 2026 г.';

const wrap = {
  maxWidth: '820px',
  margin: '0 auto',
  padding: '48px 24px 96px',
  color: '#14171C',
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  lineHeight: 1.7,
};
const h1 = { fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 5vw, 40px)', letterSpacing: '-0.02em', margin: '20px 0 8px' };
const h2 = { fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: '20px', letterSpacing: '-0.01em', margin: '38px 0 10px' };
const p = { fontSize: '16px', color: '#2C333D', margin: '0 0 12px' };
const muted = { fontSize: '14px', color: '#8A8F99' };
const li = { fontSize: '16px', color: '#2C333D', margin: '0 0 8px' };
const link = { color: '#155EEF', textDecoration: 'none' };

export default function PrivacyPage() {
  return (
    <main style={wrap}>
      <a href="/" style={{ ...link, fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        ← На главную
      </a>

      <h1 style={h1}>Политика конфиденциальности</h1>
      <p style={muted}>Актуальная редакция от {UPDATED}</p>

      <h2 style={h2}>1. Общие положения</h2>
      <p style={p}>
        Настоящая Политика описывает, как проект <strong>ETHOS</strong> (далее — «Оператор»),
        владелец сайта <a href="https://aiethos.ru" style={link}>aiethos.ru</a> (далее — «Сайт»),
        обрабатывает персональные данные посетителей и использует файлы cookie. Используя Сайт,
        вы соглашаетесь с условиями этой Политики. Если вы не согласны — не используйте Сайт.
      </p>

      <h2 style={h2}>2. Какие данные мы обрабатываем</h2>
      <ul>
        <li style={li}>
          <strong>Обезличенные данные посещения</strong>, собираемые автоматически через сервис
          аналитики Яндекс.Метрика: IP-адрес, файлы cookie, данные об устройстве и браузере,
          источник перехода, просмотренные страницы и действия на них, в том числе записи
          действий (Вебвизор).
        </li>
        <li style={li}>
          <strong>Контактные данные</strong>, которые вы сами передаёте, когда обращаетесь к нам
          через мессенджеры (Telegram, WhatsApp) — имя, номер телефона, аккаунт и текст обращения.
        </li>
      </ul>

      <h2 style={h2}>3. Цели обработки</h2>
      <ul>
        <li style={li}>анализ посещаемости и улучшение работы Сайта;</li>
        <li style={li}>обработка ваших обращений и обратная связь;</li>
        <li style={li}>подготовка коммерческих предложений по вашему запросу.</li>
      </ul>

      <h2 style={h2}>4. Правовые основания</h2>
      <p style={p}>
        Обработка ведётся на основании вашего согласия (в том числе выраженного продолжением
        использования Сайта), а также в связи с исполнением обращения, которое вы инициировали.
      </p>

      <h2 style={h2}>5. Cookie и веб-аналитика</h2>
      <p style={p}>
        Сайт использует файлы cookie и систему <strong>Яндекс.Метрика</strong> для сбора обезличенной
        статистики. Порядок обработки данных Яндексом описан в{' '}
        <a href="https://yandex.ru/legal/confidential/" style={link} target="_blank" rel="noopener">
          Политике конфиденциальности Яндекса
        </a>{' '}и в{' '}
        <a href="https://yandex.ru/legal/metrica_agreement/" style={link} target="_blank" rel="noopener">
          условиях использования Яндекс.Метрики
        </a>. Вы можете отключить cookie в настройках браузера или отказаться от учёта в Метрике
        с помощью{' '}
        <a href="https://yandex.ru/support/metrica/general/opt-out.html" style={link} target="_blank" rel="noopener">
          блокировщика Яндекса
        </a>.
      </p>

      <h2 style={h2}>6. Передача данных третьим лицам</h2>
      <p style={p}>
        Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением
        сервисов, обеспечивающих работу Сайта и аналитики (Яндекс.Метрика), а также случаев,
        предусмотренных законодательством РФ.
      </p>

      <h2 style={h2}>7. Срок хранения</h2>
      <p style={p}>
        Данные хранятся не дольше, чем это необходимо для целей обработки, либо до отзыва вашего
        согласия. Статистика Яндекс.Метрики хранится в соответствии с правилами сервиса.
      </p>

      <h2 style={h2}>8. Ваши права</h2>
      <p style={p}>
        Вы вправе запросить сведения об обработке ваших данных, их уточнение, блокирование или
        удаление, а также отозвать согласие на обработку. Для этого свяжитесь с нами по контактам ниже.
      </p>

      <h2 style={h2}>9. Реквизиты оператора и контакты</h2>
      <p style={p}>
        Оператор персональных данных:{' '}
        <strong>Индивидуальный предприниматель Магомедов Закир Асланович</strong> (проект ETHOS).<br />
        ИНН: 054210247290<br />
        ОГРНИП: 326050000095170<br />
        Адрес: Республика Дагестан, г. Дербент<br />
        Сайт: <a href="https://aiethos.ru" style={link}>aiethos.ru</a>
      </p>
      <p style={p}>
        Для обращений по вопросам обработки персональных данных — в том числе для отзыва согласия,
        уточнения, блокирования или удаления данных:<br />
        E-mail: <a href="mailto:magomedov_zak_05@mail.ru" style={link}>magomedov_zak_05@mail.ru</a><br />
        Телефон: <a href="tel:+79256777027" style={link}>+7 925 677-70-27</a><br />
        Мессенджеры:{' '}
        <a href="https://t.me/Terraiib24" style={link} target="_blank" rel="noopener">Telegram</a>{' '}·{' '}
        <a href="https://wa.me/79285288598" style={link} target="_blank" rel="noopener">WhatsApp</a>
      </p>
      <p style={muted}>
        Ответ на обращение направляется в течение рабочего дня, но не позднее срока,
        установленного Федеральным законом № 152-ФЗ «О персональных данных».
      </p>
    </main>
  );
}
