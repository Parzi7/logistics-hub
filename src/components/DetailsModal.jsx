import React, { useEffect } from 'react';
import { 
  X, MapPin, Calendar, Package, Truck, 
  DollarSign, User, Phone, Building2, 
  FileText, Clock, ArrowRight, Weight, Expand
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
    if (!locStr) return 'Не вказано';
    const codeMatch = locStr.match(/\(([A-Za-z]{2})\)/);
    const countryCode = codeMatch ? codeMatch[1].toUpperCase() : '';
    let cityName = locStr.replace(/\(.*?\)/g, '').replace(/^[A-Z]{2}\s*-\s*/i, '').trim();
    
    return (
      <div className="flex flex-col">
        <span className="text-lg font-bold text-slate-800">{cityName || 'Невідоме місто'}</span>
        {countryCode && <span className="text-sm font-medium text-slate-500">Код країни: {countryCode}</span>}
      </div>
    );
  };

  const fromLocation = data.route?.from || data.location?.from;
  const toLocation = data.route?.to || data.location?.to;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Затемнення фону */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Сааме модальне вікно */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка вікна */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isCargo ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              <MainIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isCargo ? 'Деталі вантажу' : 'Деталі транспорту'}
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock size={12} /> Створено: {data.created_at || 'Невідомо'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Тіло вікна (скролиться, якщо багато контенту) */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Блок маршруту */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={16} /> Маршрут
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <div className="text-xs font-semibold text-slate-500 mb-1">ЗВІДКИ</div>
                {formatLocationFull(fromLocation)}
              </div>
              
              <div className="hidden sm:flex shrink-0 items-center justify-center bg-white shadow-sm border border-slate-100 p-2 rounded-full z-10">
                <ArrowRight className="text-slate-300" size={24} />
              </div>

              <div className="flex-1 w-full sm:text-right">
                <div className="text-xs font-semibold text-slate-500 mb-1">КУДИ</div>
                {formatLocationFull(toLocation)}
              </div>
            </div>
          </div>

          {/* Основні характеристики (Грід) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Назва / Транспорт */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <div className="mt-1 text-indigo-500"><MainIcon size={20} /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-0.5">{isCargo ? 'Найменування вантажу' : 'Тип транспорту'}</p>
                <p className="text-sm font-bold text-slate-800">{data.cargo || data.vehicle || '—'}</p>
              </div>
            </div>

            {/* Дати */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <div className="mt-1 text-emerald-500"><Calendar size={20} /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-0.5">Дати завантаження</p>
                <p className="text-sm font-bold text-slate-800">{data.dates || data.date || '—'}</p>
              </div>
            </div>

            {/* Вага / Об'єм (якщо є) */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <div className="mt-1 text-purple-500"><Weight size={20} /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-0.5">Вага / Об'єм</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  {data.weight || '—'} 
                  {data.volume && <span className="text-slate-400 font-normal">/ {data.volume}</span>}
                </p>
              </div>
            </div>

            {/* Ставка */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <div className="mt-1 text-amber-500"><DollarSign size={20} /></div>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-0.5">Ставка / Пропозиція</p>
                <p className="text-lg font-black text-emerald-600">{data.price || 'За домовленістю'}</p>
              </div>
            </div>
          </div>

          {/* Блок контактів (якщо ці дані будуть у вашій базі) */}
          {(data.company || data.contact || data.phone) && (
            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} /> Контактна інформація
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="text-indigo-300" size={18} />
                    <span className="text-sm font-medium text-slate-700">{data.company}</span>
                  </div>
                )}
                {data.contact && (
                  <div className="flex items-center gap-3">
                    <User className="text-indigo-300" size={18} />
                    <span className="text-sm font-medium text-slate-700">{data.contact}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-indigo-300" size={18} />
                    <a href={`tel:${data.phone}`} className="text-sm font-bold text-indigo-600 hover:underline">
                      {data.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Примітки / Коментарі */}
          {data.notes && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText size={16} /> Примітки
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 border border-slate-100 whitespace-pre-wrap">
                {data.notes}
              </div>
            </div>
          )}

        </div>

        {/* Підвал вікна */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-colors"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}