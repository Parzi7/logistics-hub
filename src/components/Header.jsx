import { Search, X } from 'lucide-react';

export default function Header({ globalSearch, setGlobalSearch }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-3.5 sm:px-6 md:px-8 py-3 sm:py-4 sticky top-0 z-20 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* Заголовок, підзаголовок та мобільний профіль */}
        <div className="flex items-center justify-between sm:block">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 leading-tight">
              Робоча панель
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 hidden xs:block">
              Управління логістикою та автопарком
            </p>
          </div>

          {/* Компактний статус та Аватар для смартфона (< sm) */}
          <div className="flex items-center gap-2 sm:hidden">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shadow-inner">
              AD
            </div>
          </div>
        </div>

        {/* Пошук та повний профіль для планшетів / ПК */}
        <div className="flex items-center gap-2.5 sm:gap-4 w-full sm:w-auto">
          {/* Гнучке поле пошуку */}
          <div className="relative flex-1 sm:w-64 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            
            <input
              type="text"
              placeholder="Пошук по всім колонкам..."
              value={globalSearch || ''}
              onChange={(e) => setGlobalSearch && setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[15px] sm:text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
            />

            {/* Кнопка швидкого очищення пошуку */}
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch && setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 active:scale-90 transition-transform"
                title="Очистити"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Повний статус та Аватар для екранів sm: і вище */}
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Система онлайн
            </span>
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shadow-inner shrink-0">
              AD
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}