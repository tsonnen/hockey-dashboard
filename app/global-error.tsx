'use client';

import type { FC } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError: FC<GlobalErrorProps> = ({ error, reset }) => {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Application Error</h2>
            <p className="mb-4 text-gray-600">
              Something went wrong with the application: {error.message}
            </p>
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={reset}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
