import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton height={60} className="mb-4" />
          <Skeleton width="60%" height={30} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
              <Skeleton circle width={60} height={60} className="mb-4" />
              <Skeleton height={30} className="mb-3" />
              <Skeleton count={2} height={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}