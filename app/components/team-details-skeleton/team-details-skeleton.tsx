import React from 'react';
/**
 * Skeleton loader for the Team Details page.
 * Mimics the layout of TeamPage, TeamHeader, TeamSchedule, and TeamRoster.
 */
export const TeamDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto animate-pulse p-4">
      {/* Back Button Skeleton */}
      <div className="mb-6 h-10 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col items-center space-y-4 text-center md:flex-row md:space-x-8 md:space-y-0 md:text-left">
        <div className="size-32 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-10 w-64 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="space-y-12">
        {/* Schedule Section Skeleton */}
        <section>
          <div className="mb-4 h-8 w-40 rounded border-b bg-gray-200 pb-2 dark:bg-gray-700" />
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="mb-3 h-7 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-16 w-full rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
        {/* Roster Section Skeleton */}
        <section>
          <div className="mb-4 h-8 w-40 rounded border-b bg-gray-200 pb-2 dark:bg-gray-700" />
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="mb-4 h-7 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="overflow-x-auto">
                  <div className="h-64 w-full rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};