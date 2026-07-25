import React from 'react';
import { Truck, Archive, BarChart2, Layers } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isArchiveView, setIsArchiveView }) {
  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between p-5 min-h-screen">
      <div>
        {/* Логотип */}
        <div className="flex items-center gap-3 px-2 py-3 mb-8">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
            <Truck size={22} />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-wide leading-tight">Logistics Hub</h1>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Pro Edition</span>
          </div>
        </div>

        {/* Меню */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
            Меню
          </span>

          <button
            onClick={() => {
              if (setIsArchiveView) setIsArchiveView(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              !isArchiveView 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers size={18} />
            <span>Всі активні</span>
          </button>

          <button
            onClick={() => {
              if (setIsArchiveView) setIsArchiveView(true);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              isArchiveView 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Archive size={18} />
            <span>Архів даних</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-all cursor-not-allowed opacity-60"
          >
            <BarChart2 size={18} />
            <span>Аналітика</span>
          </button>
        </div>
      </div>

      {/* ШІ Віджет */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
        <h4 className="text-xs font-bold text-indigo-400 mb-1">ШІ-Помічник</h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Система автоматичного розпізнавання заявок підключена.
        </p>
      </div>
    </aside>
  );
}