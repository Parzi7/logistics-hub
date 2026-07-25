import React, { useEffect } from 'react';
import { 
  X, MapPin, Flag, Package, Truck, 
  Calendar, Banknote, Weight, Phone, FileText, ArrowRight 
} from 'lucide-react';

export default function ItemDetailsModal({ item, type, onClose }) {
  // Блокуємо скрол сторінки під модалкою
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!item) return null;

  const isCargo = type === 'cargo';
  
  // Базові дані з фолбеками (заглушками)
  const fromLocation = item.route?.from || item.location?.from || 'Не вказано';
  const toLocation = item.route?.to || item.location?.to || 'Не вказано';
  
  const title = item.cargo || item.vehicle || '—';
  const weight = item.weight || '—';
  const volume = item.volume ? ` / ${item.volume}` : '';
  const dates = item.dates || item.date || '—';
  const price = item.price || 'За домовленістю';
  const phone = item.phone || '+380505493663';
  const notes = item.notes || 'Додаткова інформація відсутня або не вказана користувачем у цій заявці.';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Затемнення фону */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Модальне вікно */}
      <div 
        className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка (Динамічна: Жовта для вантажу, Синя для транспорту) */}
        <div className={`flex items-center justify-between px-8 py-6 rounded-t-[2rem] shrink-0 border-b ${isCargo ? 'bg-amber-50/50 border-amber-100/50' : 'bg-blue-50/50 border-blue-100/50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isCargo ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {isCargo ? <Package size={24} /> : <Truck size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isCargo ? 'Заявка на вантаж' : 'Пропозиція транспорту'}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Додано: {item.timeAdded || item.created_at || 'Щойно'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 shadow-sm border border-slate-100 p-2.5 rounded-2xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Скролл-контент */}
        <div className="overflow-y-auto px-8 py-6 space-y-6">
          
          {/* Маршрут (Сучасний Side-by-Side блок) */}
          <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Звідки */}
              <div className="flex-1 w-full flex items-start gap-3">
                <div className="mt-1 text-slate-400"><MapPin size={20} /></div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {isCargo ? 'Завантаження' : 'Поточна локація'}
                  </div>
                  <div className="text-base font-bold text-slate-800">{fromLocation}</div>
                </div>
              </div>
              
              {/* Стрілка (ховається на мобілках) */}
              <div className="hidden sm:flex shrink-0 text-slate-300">
                <ArrowRight size={24} strokeWidth={1.5} />
              </div>

              {/* Куди */}
              <div className="flex-1 w-full flex items-start sm:justify-end gap-3 sm:text-right">
                <div className="mt-1 text-slate-400 sm:order-2"><Flag size={20} /></div>
                <div className="sm:order-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {isCargo ? 'Розвантаження' : 'Готовий їхати в'}
                  </div>
                  <div className="text-base font-bold text-slate-800">{toLocation}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Основні характеристики (Сітка) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Блок 1: Тип */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className={`p-2.5 rounded-xl ${isCargo ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                {isCargo ? <Package size={20} /> : <Truck size={20} />}
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {isCargo ? 'Найменування' : 'Тип транспорту'}
                </div>
                <div className="text-sm font-bold text-slate-800 leading-tight">{title}</div>
              </div>
            </div>

            {/* Блок 2: Вага / Об'єм */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-500">
                <Weight size={20} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {isCargo ? 'Вага та об\'єм' : 'Вантажопідйомність'}
                </div>
                <div className="text-sm font-bold text-slate-800 leading-tight">
                  {weight}{volume}
                </div>
              </div>
            </div>

            {/* Блок 3: Дата */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {isCargo ? 'Дата завантаження' : 'Дата готовності'}
                </div>
                <div className="text-sm font-bold text-slate-800 leading-tight">{dates}</div>
              </div>
            </div>

            {/* Блок 4: Фінанси */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
                <Banknote size={20} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {isCargo ? 'Пропозиція' : 'Бажана ставка'}
                </div>
                <div className="text-sm font-black text-green-600 leading-tight">{price}</div>
              </div>
            </div>

          </div>

          {/* Нижня частина: Контакти та Інфо */}
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Телефон */}
            <div className="sm:w-1/3 bg-slate-800 text-white rounded-3xl p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Phone size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Зв'язок</span>
              </div>
              <div className="text-lg font-bold">{phone}</div>
            </div>

            {/* Примітки */}
            <div className="sm:w-2/3 bg-slate-50 border border-slate-100 rounded-3xl p-6">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <FileText size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Додатково</span>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed font-medium">
                {notes}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}