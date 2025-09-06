import { useRouter } from 'next/navigation';
import { type ReactElement } from 'react';

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = '' }: BackButtonProps): ReactElement {
  const router = useRouter();

  return (
    <button
      className={`flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 ${className}`}
      onClick={() => {
        router.back();
      }}
    >
      <svg
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}
