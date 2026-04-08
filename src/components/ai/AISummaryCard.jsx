import React from 'react';

const AISummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-brand-tertiary/5 backdrop-blur-xl border border-brand-tertiary/20 border-l-4 border-l-brand-tertiary rounded-3xl p-8 my-6 relative group transform transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <label className="text-xs font-display font-bold text-brand-tertiary uppercase tracking-widest">
          AI Generated Summary
        </label>
      </div>

      <p className="text-sm font-body leading-relaxed text-text-main/80">
        {summary}
      </p>
    </div>
  );
};

export default AISummaryCard;
