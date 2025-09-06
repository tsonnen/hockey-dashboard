import type { FC } from 'react';

const Loading: FC = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="text-gray-600">Loading page...</p>
      </div>
    </div>
  );
};

export default Loading;
