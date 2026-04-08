import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TicketCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0" borderRadius="0.5rem">
      <div className="block bg-surface-card p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="w-2/3">
            <Skeleton height={24} />
          </div>
          <div className="w-20">
            <Skeleton height={24} borderRadius="0.5rem" />
          </div>
        </div>
        
        <div className="mb-6 space-y-2 text-sm min-h-[40px]">
          <Skeleton count={2} />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-surface-highest/30">
          <div className="w-16"><Skeleton height={20} /></div>
          <div className="w-20"><Skeleton height={20} /></div>
          <div className="ml-auto w-24"><Skeleton height={16} /></div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default TicketCardSkeleton;
