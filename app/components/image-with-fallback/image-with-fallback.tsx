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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access @typescript-eslint/no-unsafe-assignment
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
