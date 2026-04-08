import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    OPEN: 'bg-emerald-500/10 text-emerald-700',
    IN_PROGRESS: 'bg-brand-primary/10 text-brand-primary',
    CLOSED: 'bg-text-muted/10 text-text-muted',
  };

  const formattedStatus = status.replace('_', ' ');

  return (
    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${statusStyles[status] || statusStyles.OPEN}`}>
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
