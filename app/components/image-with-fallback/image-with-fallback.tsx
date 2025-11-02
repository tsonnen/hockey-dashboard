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
  fallBackSrc = fallback.src,
  dataTestId = 'image-with-fallback',
  unoptimized = undefined,
}: {
  src: string;
  alt: string;
  fallBackSrc?: string;
  fill?: boolean;
  height?: number;
  width?: number;
  quality?: number;
  className?: string;
  dataTestId?: string;
  unoptimized?: boolean;
}): JSX.Element {
  const [imageError, setImageError] = useState<boolean>(!src);

  return (
    <div>
      <Image
        alt={alt}
        className={className}
        fill={fill}
        height={height}
        quality={quality}
        src={imageError ? fallBackSrc : src}
        width={width}
        onError={() => {
          setImageError(true);
        }}
        data-testid={dataTestId}
        unoptimized={unoptimized}
      />
    </div>
  );
}
