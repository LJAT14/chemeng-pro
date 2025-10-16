import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function AuthSkeleton() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-2xl">
      <Skeleton circle width={80} height={80} className="mx-auto mb-6" />
      <Skeleton height={40} className="mb-4" />
      <Skeleton height={50} className="mb-3" />
      <Skeleton height={50} className="mb-3" />
      <Skeleton height={60} />
    </div>
  );
}