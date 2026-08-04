import { Search, MapPin, X, RotateCcw } from 'lucide-react';
// Підключаємо ваш список країн
import { COUNTRIES } from '../data/countries'; 

export default function TableFilters({ 
  searchGeneral, setSearchGeneral,
  searchFrom, setSearchFrom,
  searchTo, setSearchTo
}) {

  // Перевірка, чи активовано хоча б один фільтр
  const isAnyFilterActive = searchGeneral || searchFrom || searchTo;

  // Функція для повного скидання всіх фільтрів
  const handleResetAll = () => {
    if (setSearchGeneral) setSearchGeneral('');
    if (setSearchFrom) setSearchFrom('');
    if (setSearchTo) setSearchTo('');
  };

  // Оновлені базонві класи (текст 15px для iOS, правильний фокус, вирівняні відступи)
  const inputBaseClasses = "w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/80 rounded-xl text-[15px] sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm";

  return (
    <div className="bg-slate-50/80 p-2.5 sm:p-3.5 rounded-2xl border border-slate-100 mb-5 sm:mb-6 transition-all">
      {/* Прихований список країн для автодоповнення */}
      <datalist id="filter-countries-list">
        {COUNTRIES.map(c => <option key={c} value={c} />)}
      </datalist>

      <div className="flex flex-col md:flex-row items-center gap-2.5 sm:gap-3">
        
        {/* 1. Загальний пошук */}
        <div className="relative w-full md:flex-[1.4]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
          <input 
            type="text" 
            placeholder="Пошук по вантажу, авто, місту..." 
            className={inputBaseClasses}
            value={searchGeneral || ''}
            onChange={(e) => setSearchGeneral && setSearchGeneral(e.target.value)}
          />
          {searchGeneral && (
            <button
              onClick={() => setSearchGeneral && setSearchGeneral('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg active:scale-90 transition-transform"
              title="Очистити"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* 2. Звідки (Країна) з випадаючим списком */}
        <div className="relative w-full md:flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
          <input 
            list="filter-countries-list"
            type="text" 
            placeholder="Звідки (Країна)" 
            className={inputBaseClasses}
            value={searchFrom || ''}
            onChange={(e) => setSearchFrom && setSearchFrom(e.target.value)}
          />
          {searchFrom && (
            <button
              onClick={() => setSearchFrom && setSearchFrom('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg active:scale-90 transition-transform"
              title="Очистити"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* 3. Куди (Країна) з випадаючим списком */}
        <div className="relative w-full md:flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
          <input 
            list="filter-countries-list"
            type="text" 
            placeholder="Куди (Країна)" 
            className={inputBaseClasses}
            value={searchTo || ''}
            onChange={(e) => setSearchTo && setSearchTo(e.target.value)}
          />
          {searchTo && (
            <button
              onClick={() => setSearchTo && setSearchTo('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg active:scale-90 transition-transform"
              title="Очистити"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Кнопка швидкого скидання всіх фільтрів (з'являється автоматично) */}
        {isAnyFilterActive && (
          <button
            onClick={handleResetAll}
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 transition-all"
            title="Скинути всі фільтри"
          >
            <RotateCcw size={15} />
            <span>Скинути</span>
          </button>
        )}

      </div>
    </div>
  );
}