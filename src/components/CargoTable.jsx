import { useState } from 'react';
import { Package, Calendar, Trash2, Plus, Edit2, RotateCcw, Archive, Search, Globe, Clock } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { filterItems } from '../utils/filterUtils';

export default function CargoTable({ 
  cargos = [], 
  openDetails, 
  handleArchive, 
  handleDelete, 
  onEdit, 
  onAdd, 
  isArchiveView 
}) {
  const [searchGeneral, setSearchGeneral] = useState('');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  const filteredCargos = filterItems(cargos, {
    query: searchGeneral,
    fromCountry: searchFrom,
    toCountry: searchTo,
  });

  const formatLocation = (locStr) => {
    if (!locStr) return '-';
    const codeMatch = locStr.match(/\(([A-Za-z]{2})\)/);
    const countryCode = codeMatch ? codeMatch[1].toUpperCase() : '';

    let cityName = locStr
      .replace(/\(.*?\)/g, '')
      .replace(/^[A-Z]{2}\s*-\s*/i, '')
      .trim();

    return (
      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
        {countryCode && <span className="text-slate-400 font-normal">({countryCode})</span>}
        <span>{cityName}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-3.5 sm:p-6">
      {/* Заголовок + Кнопка Додати */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2.5 sm:gap-3">
          <span className="bg-amber-100 p-1.5 sm:p-2 rounded-xl text-amber-600">
            <Package size={20} className="sm:w-[22px] sm:h-[22px]" />
          </span>
          {isArchiveView ? 'Архів вантажів' : 'Активні вантажі'}
        </h3>

        {!isArchiveView && onAdd && (
          <button 
            onClick={onAdd} 
            className="bg-[#0f172a] hover:bg-black active:scale-95 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Додати</span>
          </button>
        )}
      </div>

      {/* Потрійний фільтр (вертикальний стек на мобільці) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        {/* Список для автодоповнення */}
        <datalist id="countries-list-cargo">
          {COUNTRIES.map(c => <option key={c} value={c} />)}
        </datalist>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Пошук (місто, вантаж...)"
            value={searchGeneral}
            onChange={(e) => setSearchGeneral(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[15px] sm:text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            list="countries-list-cargo"
            type="text" 
            placeholder="Звідки (Країна)"
            value={searchFrom}
            onChange={(e) => setSearchFrom(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[15px] sm:text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            list="countries-list-cargo"
            type="text" 
            placeholder="Куди (Країна)"
            value={searchTo}
            onChange={(e) => setSearchTo(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[15px] sm:text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ================= 1. ТАБЛИЦЯ ДЛЯ ПК (md і вище) ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-4 px-3">Маршрут</th>
              <th className="pb-4 px-3">Вантаж / Вага</th>
              <th className="pb-4 px-3">Дата</th>
              <th className="pb-4 px-3">Пропозиція</th>
              <th className="pb-4 px-3 text-center w-28">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {filteredCargos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400 text-sm">
                  Записів не знайдено
                </td>
              </tr>
            ) : (
              filteredCargos.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => openDetails && openDetails(item, 'cargo')} 
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-3 text-sm">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {formatLocation(item.route?.from || item.location?.from)}
                      <span className="text-slate-300 mx-0.5">→</span>
                      {formatLocation(item.route?.to || item.location?.to)}
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{item.cargo || item.vehicle}</span>
                      {item.weight && (
                        <span className="text-[11px] bg-slate-100 font-bold text-slate-500 px-2 py-0.5 rounded-md">
                          {item.weight}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl text-xs font-bold">
                      <Calendar size={13} />
                      {item.dates || item.date}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                      <Clock size={11} />
                      {item.created_at || '2026-07-20 09:03:52'}
                    </div>
                  </td>

                  <td className="py-4 px-3">
                    <span className="font-extrabold text-emerald-600 text-sm">
                      {item.price || '-'}
                    </span>
                  </td>

                  <td className="py-4 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      {!isArchiveView && onEdit && (
                        <button 
                          onClick={(e) => onEdit(item, 'cargo', e)} 
                          title="Редагувати" 
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {handleArchive && (
                        <button 
                          onClick={(e) => handleArchive(item.id, 'cargo', e)} 
                          title={isArchiveView ? "Відновити" : "В архів"} 
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          {isArchiveView ? <RotateCcw size={16} /> : <Archive size={16} />}
                        </button>
                      )}
                      {handleDelete && (
                        <button 
                          onClick={(e) => handleDelete(item.id, 'cargo', e)} 
                          title="Видалити" 
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= 2. КАРТКИ ДЛЯ ТЕЛЕФОНІВ (менше md) ================= */}
      <div className="block md:hidden space-y-3">
        {filteredCargos.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            Записів не знайдено
          </div>
        ) : (
          filteredCargos.map((item) => (
            <div 
              key={item.id} 
              onClick={() => openDetails && openDetails(item, 'cargo')}
              className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm active:bg-slate-50 transition-all cursor-pointer space-y-3 relative overflow-hidden"
            >
              {/* Маршрут та Пропозиція */}
              <div className="flex justify-between items-start gap-2 border-b border-slate-100/80 pb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap text-sm leading-snug">
                  {formatLocation(item.route?.from || item.location?.from)}
                  <span className="text-slate-300 font-bold mx-0.5">→</span>
                  {formatLocation(item.route?.to || item.location?.to)}
                </div>
                {item.price && (
                  <span className="shrink-0 font-extrabold text-emerald-600 text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/60">
                    {item.price}
                  </span>
                )}
              </div>

              {/* Назва вантажу, вага та дата */}
              <div className="flex justify-between items-center text-xs gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800 text-sm">
                    {item.cargo || item.vehicle}
                  </span>
                  {item.weight && (
                    <span className="text-[10px] bg-slate-100 font-bold text-slate-500 px-2 py-0.5 rounded-md">
                      {item.weight}
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 shrink-0 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                  <Calendar size={12} />
                  {item.dates || item.date}
                </div>
              </div>

              {/* Час створення та Збільшені кнопки дій під палець */}
              <div className="flex justify-between items-center border-t border-slate-100/80 pt-2.5 mt-1">
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock size={11} />
                  {item.created_at || '2026-07-20 09:03:52'}
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  {!isArchiveView && onEdit && (
                    <button 
                      onClick={(e) => onEdit(item, 'cargo', e)} 
                      title="Редагувати" 
                      className="p-2 text-slate-400 active:text-blue-600 active:bg-blue-50 rounded-xl transition-all active:scale-95"
                    >
                      <Edit2 size={17} />
                    </button>
                  )}
                  {handleArchive && (
                    <button 
                      onClick={(e) => handleArchive(item.id, 'cargo', e)} 
                      title={isArchiveView ? "Відновити" : "В архів"} 
                      className="p-2 text-slate-400 active:text-amber-600 active:bg-amber-50 rounded-xl transition-all active:scale-95"
                    >
                      {isArchiveView ? <RotateCcw size={17} /> : <Archive size={17} />}
                    </button>
                  )}
                  {handleDelete && (
                    <button 
                      onClick={(e) => handleDelete(item.id, 'cargo', e)} 
                      title="Видалити" 
                      className="p-2 text-slate-400 active:text-rose-600 active:bg-rose-50 rounded-xl transition-all active:scale-95"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}