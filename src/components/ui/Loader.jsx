import React from 'react';

const Loader = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-6 shadow-sm"></div>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;
