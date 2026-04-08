import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const TicketCard = ({ ticket }) => {
  const { id, title, description, status, priority, category, createdAt } = ticket;

  const summary = description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;

  const dateStr = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link 
      to={`/ticket/${id}`}
      className="block group bg-surface-card p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-display font-medium text-text-main group-hover:text-brand-primary transition-colors">
          {title}
        </h2>
        <StatusBadge status={status} />
      </div>
      
      <p className="text-text-muted font-body text-sm mb-6 line-clamp-2 min-h-[40px]">
        {summary}
      </p>
      
      <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-surface-highest/30">
        <PriorityBadge priority={priority} />
        <span className="px-2 py-1 text-[11px] font-bold rounded-lg bg-surface-low text-text-muted uppercase tracking-wider">
          {category.replace('_', ' ')}
        </span>
        <span className="ml-auto text-xs text-text-muted font-medium font-body">
          {dateStr}
        </span>
      </div>
    </Link>
  );
};

export default TicketCard;
