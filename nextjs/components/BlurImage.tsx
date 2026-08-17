'use client';

/**
 * BlurImage — blur-up поверх next/image с плавным кроссфейдом.
 *
 * КЛИЕНТСКИЙ компонент, и только по одной причине: нужен `useState`, чтобы
 * поймать момент декодирования картинки (`onLoad`) и переключить классы
 * перехода. Всё, что можно посчитать заранее (URL, blurDataURL, размеры),
 * приходит пропсами из Server Component — см. lib/lqip.ts.
 *
 * Что решается:
 *  • CLS = 0. Место в layout резервируется через aspect-ratio (режим `fill`)
 *    либо через явные width/height. Ни один кадр не сдвигает соседей.
 *  • Плавность. Анимируются только opacity и transform — их композитор крутит
 *    на GPU. Штатный `placeholder="blur"` анимирует CSS-фильтр, а это работа
 *    для CPU и заметные рывки на слабых устройствах.
 *  • Кэш. Если картинка уже в кэше браузера, onLoad срабатывает до навешивания
 *    обработчика — ловим это через `ref.complete` и показываем без анимации,
 *    иначе кадр залипал бы размытым.
 */

import Image, { type ImageProps, type StaticImageData } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './BlurImage.module.css';

/**
 * width/height намеренно исключены: размер кадра всегда задаёт рамка
 * (aspect-ratio или родитель), а <Image> внутри всегда работает в режиме
 * `fill`. Это единственный вариант, при котором место в layout
 * зарезервировано до загрузки при любом наборе пропсов.
 */
type BaseProps = Omit<
  ImageProps,
  'src' | 'alt' | 'placeholder' | 'blurDataURL' | 'onLoad' | 'width' | 'height' | 'fill'
>;

export type BlurImageProps = BaseProps & {
  /**
   * Статический импорт (`import photo from './photo.jpg'`) — тогда Next сам
   * посчитает blurDataURL и размеры на сборке, ничего добавлять не нужно.
   * Либо строковый URL — тогда blurDataURL/width/height приходят с сервера.
   */
  src: string | StaticImageData;
  alt: string;
  /** base64 data URL. Для статического импорта не нужен. */
  blurDataURL?: string | null;
  /** Пропорции кадра, например `4 / 3`. Для статического импорта не нужны. */
  ratio?: number | string;
  /** Цвет-заглушка, пока не отрисовался даже плейсхолдер. */
  background?: string;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  className?: string;
  /** Стили внешней рамки (не самой картинки). */
  frameStyle?: React.CSSProperties;
  /** true — рамка растягивается на родителя вместо собственных пропорций. */
  fill?: boolean;
};

export default function BlurImage({
  src,
  alt,
  blurDataURL,
  ratio,
  background,
  objectFit = 'cover',
  objectPosition = 'center',
  className,
  frameStyle,
  sizes = '100vw',
  fill,
  ...imageProps
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Картинка из кэша успевает загрузиться до навешивания onLoad —
  // без этой проверки размытый кадр остался бы навсегда.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const handleLoad = useCallback(() => setLoaded(true), []);

  const isStatic = typeof src !== 'string';
  // Для статического импорта blurDataURL и пропорции Next знает сам.
  const effectiveBlur = isStatic ? (src as StaticImageData).blurDataURL : blurDataURL ?? undefined;
  const effectiveRatio =
    ratio ??
    (isStatic
      ? `${(src as StaticImageData).width} / ${(src as StaticImageData).height}`
      : undefined);

  // `fill` тянет картинку на размер родителя — тогда рамка не задаёт
  // пропорции сама, а растягивается по контейнеру.
  const useFillFrame = Boolean(fill);

  return (
    <span
      className={[
        styles.frame,
        useFillFrame ? styles.frameFill : '',
        loaded ? styles.loaded : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          ...(effectiveRatio ? { ['--blur-image-ratio' as string]: String(effectiveRatio) } : null),
          ...(background ? { ['--blur-image-bg' as string]: background } : null),
          ['--blur-image-fit' as string]: objectFit,
          ['--blur-image-position' as string]: objectPosition,
          ...frameStyle,
        } as React.CSSProperties
      }
    >
      {/*
        Плейсхолдер — отдельный div с background-image, а не встроенный
        placeholder="blur". Так им можно управлять независимо от <img>
        и гасить его собственным переходом.
      */}
      {effectiveBlur ? (
        <span
          aria-hidden="true"
          className={styles.placeholder}
          style={{ backgroundImage: `url("${effectiveBlur}")` }}
        />
      ) : null}

      <Image
        {...imageProps}
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={handleLoad}
        className={[styles.image, styles.photo].join(' ')}
      />
    </span>
  );
}
