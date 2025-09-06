import Link from 'next/link';
import type { FC } from 'react';

const NotFound: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">404 - Page Not Found</h2>
        <p className="mb-4 text-gray-600">The page you are looking for does not exist.</p>
        <Link className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" href="/">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
