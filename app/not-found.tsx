import Link from 'next/link';
import type { FC } from 'react';

const NotFound: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
        <Link className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" href="/">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
