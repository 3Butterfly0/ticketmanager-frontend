import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ message = "No tickets found.", onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{message}</h3>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">
        Get started by creating a new ticket. Our AI assistant will help you categorize and prioritize it.
      </p>
      <Link
        to="/create"
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-sm"
      >
        Create Your First Ticket
      </Link>
    </div>
  );
};

export default EmptyState;
