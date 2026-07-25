import React, { useState } from 'react';
import { Truck, Archive, BarChart2, Layers, Menu, X, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isArchiveView, setIsArchiveView }) {
  // Локальний стан для відкриття/закриття меню на мобільних пристроях
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleNavClick = (isArchive) => {
    if (setIsArchiveView) {
      setIsArchiveView(isArchive);
    }
    // Автоматично закриваємо мобільне меню після вибору пункту
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* ================= 1. МОБІЛЬНА ШАПКА (показується тільки на md:hidden) ================= */}
      <div className="md:hidden flex items-center justify-between bg-[#0f172a] border-b border-slate-800 px-4 py-3 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
            <Truck size={18} />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-wide leading-none">Logistics Hub</h1>
            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Pro Edition</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800 rounded-xl transition-all"
          aria-label="Toggle Menu"
        >
          {isOpenMobile ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ================= 2. ОВЕРЛЕЙ / ЗАТЕМНЕННЯ ФОНУ (для мобільного) ================= */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* ================= 3. ОСНОВНИЙ САЙДБАР (Адаптивний) ================= */}
      <aside 
        className={`
          fixed md:static top-0 left-0 z-50 h-full md:min-h-screen w-72 md:w-64 
          bg-[#0f172a] text-slate-300 flex flex-col justify-between p-5 
          transition-transform duration-300 ease-in-out border-r border-slate-800/60
          ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Логотип та шапка сайдбару */}
          <div className="flex items-center justify-between px-2 py-2 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                <Truck size={22} />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg tracking-wide leading-tight">Logistics Hub</h1>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Pro Edition</span>
              </div>
            </div>

            {/* Кнопка закриття всередині сайдбару (тільки мобілка) */}
            <button 
              onClick={() => setIsOpenMobile(false)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Меню навігації */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
              Навігація
            </span>

            <button
              onClick={() => handleNavClick(false)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-98 ${
                !isArchiveView 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers size={18} />
              <span>Всі активні</span>
            </button>

            <button
              onClick={() => handleNavClick(true)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-98 ${
                isArchiveView 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm' 
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Archive size={18} />
              <span>Архів даних</span>
            </button>

            <button
              disabled
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-500/80 hover:bg-slate-800/30 transition-all cursor-not-allowed opacity-60"
            >
              <BarChart2 size={18} />
              <span>Аналітика</span>
            </button>
          </div>
        </div>

        {/* ШІ Віджет */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 mt-6">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-indigo-400" />
            <h4 className="text-xs font-bold text-indigo-400">ШІ-Помічник</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Система автоматичного розпізнавання заявок підключена.
          </p>
        </div>
      </aside>
    </>
  );
}