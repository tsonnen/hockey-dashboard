import Image from 'next/image';
import { type JSX, useState } from 'react';

import fallback from '@/app/assets/image-not-found.png';

export function ImageWithFallback({
  src,
  alt,
  height,
  width,
  quality,
  className,
  fill = undefined,
  priority = false,
  fallBackSrc = fallback.src,
  dataTestId = 'image-with-fallback',
}: {
  src: string;
  alt: string;
  fallBackSrc?: string;
  fill?: boolean;
  priority?: boolean;
  height?: number;
  width?: number;
  quality?: number;
  className?: string;
  dataTestId?: string;
}): JSX.Element {
  const [imageError, setImageError] = useState<boolean>(!src);

  return (
    <div className={fill ? 'relative size-full' : undefined}>
      <Image
        alt={alt}
        className={className}
        fill={fill}
        height={height}
        quality={quality}
        src={imageError ? fallBackSrc : src}
        width={width}
        priority={priority}
        onError={() => {
          setImageError(true);
        }}
        data-testid={dataTestId}
        unoptimized
      />
    </div>
  );
}
