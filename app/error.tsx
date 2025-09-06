'use client';

import type { FC } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error: FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong!</h2>
        <p className="mb-4 text-gray-600">{error.message}</p>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={reset}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default Error;
