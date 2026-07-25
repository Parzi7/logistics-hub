import React from 'react';

export default function SubTabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-1 bg-slate-200/60 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab && setActiveTab('cargo')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'cargo'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Вантажі
        </button>

        <button
          type="button"
          onClick={() => setActiveTab && setActiveTab('transport')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'transport'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Транспорт
        </button>
      </div>
    </div>
  );
}