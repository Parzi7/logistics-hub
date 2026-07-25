import React, { useEffect } from 'react';
import { 
  X, MapPin, Calendar, Package, Truck, 
  DollarSign, User, Phone, Building2, 
  FileText, Clock, ArrowRight, ArrowDown, Weight 
} from 'lucide-react';

export default function DetailsModal({ isOpen, onClose, data, type }) {
  // Блокуємо скрол сторінки, коли вікно відкрите
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const isCargo = type === 'cargo';
  const MainIcon = isCargo ? Package : Truck;
  
  // Допоміжна функція для форматування локацій
  const formatLocationFull = (locStr) => {
    if (!locStr) return <span className="text-sm text-slate-400">Не вказано</span>;
    const codeMatch = locStr.match(/\(([A-Za-z]{2})\)/);
    const countryCode = codeMatch ? codeMatch[1].toUpperCase() : '';
    let cityName = locStr.replace(/\(.*?\)/g, '').replace(/^[A-Z]{2}\s*-\s*/i, '').trim();
    
    return (
      <div className="flex flex-col">
        <span className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
          {cityName || 'Невідоме місто'}
        </span>
        {countryCode && (
          <span className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">
            Код країни: <span className="text-indigo-600 font-bold">{countryCode}</span>
          </span>
        )}
      </div>
    );
  };

  const fromLocation = data.route?.from || data.location?.from;
  const toLocation = data.route?.to || data.location?.to;
  const descriptionText = data.notes || data.description;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      
      {/* Затемнення фону */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Модальне вікно (Bottom Sheet на мобілці / Центроване на ПК) */}
      <div 
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden border border-slate-200/80 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 1. ШАПКА ВІКНА (Фіксована) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isCargo ? 'bg-amber-100/80 text-amber-600' : 'bg-blue-100/80 text-blue-600'}`}>
              <MainIcon size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                {isCargo ? 'Деталі вантажу' : 'Деталі транспорту'}
              </h2>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock size={12} /> Додано: {data.timeAdded || data.created_at || 'Щойно'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. ТІЛО ВІКНА (Зі скролом) */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          
          {/* Адаптивний блок маршруту */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/60 relative">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <MapPin size={15} className="text-indigo-500" /> Маршрут транспортування
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              
              {/* Звідки */}
              <div className="flex-1 w-full bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-100 shadow-sm sm:shadow-none">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Звідки</div>
                {formatLocationFull(fromLocation)}
              </div>
              
              {/* Стрілка для ПК */}
              <div className="hidden sm:flex shrink-0 items-center justify-center bg-white shadow-sm border border-slate-200/60 p-2 rounded-full text-indigo-500">
                <ArrowRight size={20} />
              </div>

              {/* Стрілка для Мобілки */}
              <div className="flex sm:hidden w-full justify-center -my-1 text-indigo-500">
                <ArrowDown size={18} className="animate-bounce" />
              </div>

              {/* Куди */}
              <div className="flex-1 w-full bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-100 shadow-sm sm:shadow-none sm:text-right">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Куди</div>
                {formatLocationFull(toLocation)}
              </div>
            </div>
          </div>

          {/* Основні характеристики (Адаптивний Грід) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Назва / Транспорт */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                <MainIcon size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-0.5">
                  {isCargo ? 'Найменування вантажу' : 'Тип кузова / авто'}
                </p>
                <p className="text-sm font-bold text-slate-800">{data.cargo || data.vehicle || '—'}</p>
              </div>
            </div>

            {/* Дати */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-0.5">Дата завантаження</p>
                <p className="text-sm font-bold text-slate-800">{data.dates || data.date || '—'}</p>
              </div>
            </div>

            {/* Вага / Об'єм */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                <Weight size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-0.5">Вага / Тоннаж</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  {data.weight || '—'} 
                  {data.volume && <span className="text-slate-400 font-normal">/ {data.volume}</span>}
                </p>
              </div>
            </div>

            {/* Ставка */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 shadow-sm">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0 mt-0.5">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-0.5">Ставка / Пропозиція</p>
                <p className="text-base sm:text-lg font-black text-emerald-600">
                  {data.price || 'За домовленістю'}
                </p>
              </div>
            </div>
          </div>

          {/* Блок контактів */}
          {(data.company || data.contact || data.phone) && (
            <div className="bg-indigo-50/50 rounded-2xl p-4 sm:p-5 border border-indigo-100/80">
              <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User size={15} /> Контактна інформація
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.company && (
                  <div className="flex items-center gap-2.5 bg-white sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-none border-indigo-100">
                    <Building2 className="text-indigo-400 shrink-0" size={17} />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{data.company}</span>
                  </div>
                )}

                {data.contact && (
                  <div className="flex items-center gap-2.5 bg-white sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-none border-indigo-100">
                    <User className="text-indigo-400 shrink-0" size={17} />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">{data.contact}</span>
                  </div>
                )}

                {data.phone && (
                  <div className="sm:col-span-2 mt-1">
                    <a 
                      href={`tel:${data.phone}`} 
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all"
                    >
                      <Phone size={16} />
                      <span>Зателефонувати: {data.phone}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Примітки / Коментарі */}
          {descriptionText && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText size={15} className="text-slate-400" /> Додаткові примітки
              </h3>
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm text-slate-600 border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                {descriptionText}
              </div>
            </div>
          )}

        </div>

        {/* 3. ФУТЕР ВІКНА (Фіксований знизу) */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-end">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl active:scale-95 transition-all shadow-sm"
          >
            Закрити
          </button>
        </div>

      </div>
    </div>
  );
}