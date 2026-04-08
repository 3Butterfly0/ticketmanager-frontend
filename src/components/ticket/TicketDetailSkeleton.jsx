import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TicketDetailSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0" borderRadius="0.5rem">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 w-full">
        <div className="flex justify-between items-start">
          <div className="space-y-4 w-1/2">
            <div className="w-32"><Skeleton height={16} /></div>
            <Skeleton height={40} />
          </div>
          <div className="flex gap-3">
            <div className="w-28"><Skeleton height={44} /></div>
            <div className="w-32"><Skeleton height={44} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface-card p-8 rounded-3xl space-y-6 shadow-sm">
              <div className="pb-6 border-b border-surface-highest/50">
                <div className="w-40 mb-4"><Skeleton height={16} /></div>
                <div className="space-y-3">
                  <Skeleton count={5} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-surface-card p-8 rounded-3xl shadow-sm space-y-6">
              <div className="w-24 mb-6"><Skeleton height={16} /></div>
              <div className="space-y-6">
                <div>
                  <div className="w-16 mb-2"><Skeleton height={14} /></div>
                  <div className="w-20"><Skeleton height={24} /></div>
                </div>
                <div>
                  <div className="w-20 mb-2"><Skeleton height={14} /></div>
                  <div className="w-24"><Skeleton height={24} /></div>
                </div>
                <div className="pt-6 border-t border-surface-highest/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-16"><Skeleton height={14} /></div>
                    <div className="w-20"><Skeleton height={14} /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-20"><Skeleton height={14} /></div>
                    <div className="w-20"><Skeleton height={14} /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default TicketDetailSkeleton;
