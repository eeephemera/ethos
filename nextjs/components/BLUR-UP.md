# Blur-up для `next/image` (App Router, React 19)

Картинка не должна появляться рывком и не должна двигать вёрстку. Схема здесь
одна и та же для обоих случаев: сначала показываем крошечную размытую
миниатюру, поверх неё плавно проявляется оригинал, а место в layout
зарезервировано **до** начала загрузки.

| Файл | Что делает | Где выполняется |
| --- | --- | --- |
| [`lib/lqip.ts`](../lib/lqip.ts) | Считает base64-миниатюру и реальные размеры через `sharp`; кодирует/декодирует ThumbHash | сервер |
| [`components/BlurImage.tsx`](./BlurImage.tsx) | Кроссфейд «плейсхолдер → оригинал» поверх `next/image` | клиент |
| [`components/BlurImage.module.css`](./BlurImage.module.css) | Сам переход: только `opacity` и `transform` | — |
| [`lib/productImages.ts`](../lib/productImages.ts) | Пример: плейсхолдеры для демо-карточек главной | сервер |

---

## Сценарий 1. Статические картинки

Если файл лежит в репозитории, ничего считать не нужно: при статическом импорте
Next сам прогоняет его через `sharp` на этапе сборки и подставляет
`blurDataURL` и размеры.

```tsx
// app/about/page.tsx — Server Component
import BlurImage from '@/components/BlurImage';
import office from './office.jpg'; // StaticImageData: src + width + height + blurDataURL

export default function Page() {
  return (
    <BlurImage
      src={office}          // пропорции и blurDataURL берутся из импорта
      alt="Офис ETHOS"
      sizes="(max-width: 768px) 100vw, 640px"
      priority              // если картинка в первом экране — иначе LCP просядет
    />
  );
}
```

С «голым» `next/image` то же самое выглядит так:

```tsx
<Image src={office} alt="Офис ETHOS" placeholder="blur" sizes="..." />
```

`BlurImage` отличается только качеством перехода — см. раздел «Почему не
штатный `placeholder="blur"`».

---

## Сценарий 2. Удалённые картинки (CMS, S3, прайс поставщика)

URL известен лишь в рантайме, поэтому автоматического плейсхолдера нет —
считаем его сами на сервере и передаём клиенту пропсами.

```tsx
// app/catalog/page.tsx — Server Component
import { getBlurImageData } from '@/lib/lqip';
import ProductCard from './ProductCard';

export default async function Page() {
  const products = await cms.getProducts();

  // Кэш внутри getBlurImageData схлопывает повторы: реальная работа
  // (скачать + sharp) выполняется один раз на URL за жизнь процесса.
  const images = await Promise.all(
    products.map((p) => getBlurImageData(p.imageUrl, p.width, p.height)),
  );

  return products.map((p, i) => <ProductCard key={p.id} product={p} image={images[i]} />);
}
```

```tsx
// app/catalog/ProductCard.tsx — Client Component
'use client';
import BlurImage from '@/components/BlurImage';
import type { BlurImageData } from '@/lib/lqip';

export default function ProductCard({ product, image }: { product: Product; image: BlurImageData }) {
  return (
    <article>
      <BlurImage
        src={image.src}
        alt={product.name}
        blurDataURL={image.blurDataURL}
        ratio={`${image.width} / ${image.height}`}  // пропорции = гарантия CLS 0
        sizes="(max-width: 768px) 50vw, 320px"
      />
      <h3>{product.name}</h3>
    </article>
  );
}
```

Хост картинок нужно разрешить в `next.config.mjs`, иначе оптимизатор ответит
400-й:

```js
images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }] }
```

### Вариант 2b. ThumbHash вместо генерации на лету

Если превью уже хранится строкой в CMS/БД, скачивать оригинал не нужно вовсе —
ThumbHash это ~25 байт, которые разворачиваются в data URL прямо на месте.

```ts
// один раз при загрузке картинки в CMS
import { imageToThumbHash } from '@/lib/lqip';
const hash = await imageToThumbHash(uploadedBuffer); // сохранить рядом с записью

// при рендере — ни сети, ни sharp
import { thumbHashToDataURL } from '@/lib/lqip';
const blurDataURL = thumbHashToDataURL(product.thumbHash);
```

ThumbHash предпочтительнее BlurHash: компактнее, умеет альфа-канал, сохраняет
пропорции. BlurHash-строку можно декодировать так же — заменив `thumbhash` на
пакет `blurhash` и собрав RGBA тем же `encodePng` из `lib/lqip.ts`.

---

## Как достигается CLS = 0

Сдвиг возникает, когда браузер узнаёт размер картинки только после загрузки.
Здесь размер известен всегда:

- `BlurImage` рисует рамку с `aspect-ratio` — место занято с первого кадра;
- внутри рамки `<Image fill>`, поэтому width/height картинки на layout не влияют;
- в режиме `fill` рамка растягивается на родителя, и пропорции задаёт он.

`width`/`height` у `BlurImage` намеренно нет: иначе появился бы набор пропсов,
при котором место не зарезервировано.

## Почему не штатный `placeholder="blur"`

Штатный вариант анимирует CSS-фильтр фонового изображения. Фильтр считается на
CPU и каждый кадр требует новой растеризации — на слабом телефоне переход
заметно дёргается.

Здесь плейсхолдер и оригинал — два отдельных слоя, и анимируются только
`opacity` и `transform`: их композитор крутит на GPU без перерисовки. Оригинал
дополнительно стартует с `scale(1.02)` — получается «наводка на резкость», а не
резкая подмена.

Дополнительно:

- **Картинка из кэша.** `onLoad` может не сработать, если изображение уже
  декодировано. Ловим через `ref.complete` в `useEffect` — иначе кадр залипал бы
  размытым.
- **`prefers-reduced-motion`.** Переход сокращается до 1 мс, `transform` не
  применяется.
- **`will-change`** снимается после перехода, чтобы не держать слой композитора
  на каждую картинку.

## Разделение Server / Client

`lib/lqip.ts` помечен `server-only`: `sharp` — нативный модуль, и случайный
импорт из клиентского компонента должен падать на сборке, а не в проде.
Клиентским остаётся только `BlurImage` — ему нужен `useState`, чтобы поймать
момент загрузки. Всё, что можно посчитать заранее, приходит пропсами.
