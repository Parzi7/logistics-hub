import React from 'react';
import { Package, Truck } from 'lucide-react';

export default function SubTabNavigation({ 
  activeTab, 
  setActiveTab, 
  cargoCount, 
  transportCount 
}) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      {/* Контейнер-трек для кнопок */}
      <div className="w-full sm:w-auto flex items-center p-1 bg-slate-200/60 rounded-2xl gap-1">
        
        {/* Кнопка "Вантажі" */}
        <button
          type="button"
          onClick={() => setActiveTab && setActiveTab('cargo')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] ${
            activeTab === 'cargo'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 active:bg-slate-300/40'
          }`}
        >
          <Package 
            size={16} 
            className={activeTab === 'cargo' ? 'text-amber-500' : 'text-slate-400'} 
          />
          <span>Вантажі</span>

          {/* Опціональний лічильник кількості */}
          {typeof cargoCount === 'number' && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold transition-colors ${
              activeTab === 'cargo' ? 'bg-amber-100 text-amber-700' : 'bg-slate-300/60 text-slate-600'
            }`}>
              {cargoCount}
            </span>
          )}
        </button>

        {/* Кнопка "Транспорт" */}
        <button
          type="button"
          onClick={() => setActiveTab && setActiveTab('transport')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] ${
            activeTab === 'transport'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 active:bg-slate-300/40'
          }`}
        >
          <Truck 
            size={16} 
            className={activeTab === 'transport' ? 'text-blue-500' : 'text-slate-400'} 
          />
          <span>Транспорт</span>

          {/* Опціональний лічильник кількості */}
          {typeof transportCount === 'number' && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold transition-colors ${
              activeTab === 'transport' ? 'bg-blue-100 text-blue-700' : 'bg-slate-300/60 text-slate-600'
            }`}>
              {transportCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
}