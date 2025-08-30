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
  fallBackSrc = fallback.src,
}: {
  src: string;
  alt: string;
  fallBackSrc?: string;
  height?: number;
  width?: number;
  quality?: number;
  className?: string;
}): JSX.Element {
  const [imageError, setImageError] = useState(false);
  return (
    <div>
      <Image
        alt={alt}
        className={className}
        height={height}
        objectFit="cover"
        quality={quality}
        src={imageError ? fallBackSrc : src}
        width={width}
        onError={() => {
          setImageError(true);
        }}
      />
    </div>
  );
}
