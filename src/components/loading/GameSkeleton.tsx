import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function GameSkeleton() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-2xl">
      <Skeleton height={40} width="70%" className="mb-6" />
      <Skeleton height={200} className="mb-4" />
      <div className="flex gap-4">
        <Skeleton height={50} width={120} />
        <Skeleton height={50} width={120} />
      </div>
    </div>
  );
}