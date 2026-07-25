import React from 'react';
import { Search, MapPin } from 'lucide-react';
// Підключаємо ваш список країн
import { COUNTRIES } from '../data/countries'; 

export default function TableFilters({ 
  searchGeneral, setSearchGeneral,
  searchFrom, setSearchFrom,
  searchTo, setSearchTo
}) {
  
  // Загальні стилі для інпутів, щоб не дублювати код
  const inputBaseClasses = "w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all";

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
      
      {/* Прихований список країн для автодоповнення */}
      <datalist id="filter-countries-list">
        {COUNTRIES.map(c => <option key={c} value={c} />)}
      </datalist>

      {/* 1. Загальний пошук */}
      <div className="relative flex-[1.5]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Пошук по вантажу, авто, місту..." 
          className={inputBaseClasses}
          value={searchGeneral}
          onChange={(e) => setSearchGeneral(e.target.value)}
        />
      </div>

      {/* 2. Звідки (Країна) з випадаючим списком */}
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          list="filter-countries-list"
          type="text" 
          placeholder="Звідки (Країна)" 
          className={inputBaseClasses}
          value={searchFrom}
          onChange={(e) => setSearchFrom(e.target.value)}
        />
      </div>

      {/* 3. Куди (Країна) з випадаючим списком */}
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          list="filter-countries-list"
          type="text" 
          placeholder="Куди (Країна)" 
          className={inputBaseClasses}
          value={searchTo}
          onChange={(e) => setSearchTo(e.target.value)}
        />
      </div>

    </div>
  );
}