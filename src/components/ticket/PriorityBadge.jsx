import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    HIGH: 'bg-brand-danger/10 text-brand-danger',
    MEDIUM: 'bg-amber-500/10 text-amber-700',
    LOW: 'bg-emerald-500/10 text-emerald-700',
  };

  return (
    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${priorityStyles[priority] || priorityStyles.MEDIUM}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
