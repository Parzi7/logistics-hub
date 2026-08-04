import { useEffect } from 'react';
import { 
  X, MapPin, Flag, Package, Truck, 
  Calendar, Banknote, Weight, Phone, FileText, ArrowRight, ArrowDown 
} from 'lucide-react';

export default function ItemDetailsModal({ item, type, onClose }) {
  // Блокуємо скрол сторінки під модалкою
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [item]);

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
  const notes = item.notes || item.description || 'Додаткова інформація відсутня або не вказана користувачем у цій заявці.';
  const timeAdded = item.timeAdded || item.created_at || 'Щойно';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Затемнення фону */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Модальне вікно (Шторка знизу на мобільних, центроване вікно на десктопах) */}
      <div 
        className="relative bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col z-10 overflow-hidden border border-slate-200/80 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка (Динамічна: Жовта для вантажу, Синя для транспорту) */}
        <div className={`flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 shrink-0 border-b ${isCargo ? 'bg-amber-50/70 border-amber-100' : 'bg-blue-50/70 border-blue-100'}`}>
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${isCargo ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {isCargo ? <Package size={22} /> : <Truck size={22} />}
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-slate-800 leading-tight">
                {isCargo ? 'Заявка на вантаж' : 'Пропозиція транспорту'}
              </h2>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                Додано: {timeAdded}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 shadow-sm border border-slate-200/60 p-2 sm:p-2.5 rounded-2xl active:scale-95 transition-all"
            aria-label="Закрити"
          >
            <X size={18} />
          </button>
        </div>

        {/* Скролл-контент */}
        <div className="overflow-y-auto px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
          
          {/* Маршрут (Адаптивний Side-by-Side блок) */}
          <div className="bg-slate-50/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/60 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
              
              {/* Звідки */}
              <div className="flex-1 w-full flex items-start gap-3">
                <div className="mt-1 text-slate-400 shrink-0"><MapPin size={20} /></div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {isCargo ? 'Завантаження' : 'Поточна локація'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-800 leading-snug">{fromLocation}</div>
                </div>
              </div>
              
              {/* Стрілка для ПК */}
              <div className="hidden sm:flex shrink-0 text-slate-300">
                <ArrowRight size={22} strokeWidth={1.5} />
              </div>

              {/* Стрілка для Мобілок */}
              <div className="flex sm:hidden w-full justify-center -my-1 text-slate-300">
                <ArrowDown size={18} strokeWidth={1.5} />
              </div>

              {/* Куди */}
              <div className="flex-1 w-full flex items-start sm:justify-end gap-3 sm:text-right">
                <div className="mt-1 text-slate-400 shrink-0 sm:order-2"><Flag size={20} /></div>
                <div className="sm:order-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {isCargo ? 'Розвантаження' : 'Готовий їхати в'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-slate-800 leading-snug">{toLocation}</div>
                </div>
              </div>

            </div>
          </div>

          {/* Основні характеристики (Сітка) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
            {/* Блок 1: Тип */}
            <div className="bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
              <div className={`p-2.5 rounded-xl shrink-0 ${isCargo ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}`}>
                {isCargo ? <Package size={20} /> : <Truck size={20} />}
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  {isCargo ? 'Найменування' : 'Тип транспорту'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{title}</div>
              </div>
            </div>

            {/* Блок 2: Вага / Об'єм */}
            <div className="bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-500 shrink-0">
                <Weight size={20} />
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  {isCargo ? 'Вага та об\'єм' : 'Вантажопідйомність'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                  {weight}{volume}
                </div>
              </div>
            </div>

            {/* Блок 3: Дата */}
            <div className="bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500 shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  {isCargo ? 'Дата завантаження' : 'Дата готовності'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{dates}</div>
              </div>
            </div>

            {/* Блок 4: Фінанси */}
            <div className="bg-white border border-slate-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <Banknote size={20} />
              </div>
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  {isCargo ? 'Пропозиція' : 'Бажана ставка'}
                </div>
                <div className="text-sm sm:text-base font-black text-emerald-600 leading-snug">{price}</div>
              </div>
            </div>

          </div>

          {/* Нижня частина: Контакти та Інфо */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            
            {/* Телефон з Click-to-Call */}
            <a 
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="sm:w-1/3 bg-slate-900 hover:bg-black active:scale-98 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-center transition-all shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Phone size={15} className="group-hover:text-amber-400 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Зв'язок (Натисніть)</span>
              </div>
              <div className="text-base sm:text-lg font-bold tracking-wide group-hover:text-amber-300 transition-colors">
                {phone}
              </div>
            </a>

            {/* Примітки */}
            <div className="sm:w-2/3 bg-slate-50/80 border border-slate-200/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                <FileText size={15} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Додатково</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {notes}
              </div>
            </div>

          </div>

        </div>

        {/* Нижній кнопковий блок для зручності закриття на смартфоні */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-end sm:hidden">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Закрити
          </button>
        </div>

      </div>
    </div>
  );
}