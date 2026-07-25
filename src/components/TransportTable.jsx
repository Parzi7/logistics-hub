import React, { useState } from 'react';
import { Truck, Calendar, Trash2, Plus, Edit2, RotateCcw, Archive, Search, Globe } from 'lucide-react';
// Додали імпорт extractCountryCode
import { COUNTRIES, extractCountryCode } from '../data/countries';

export default function TransportTable({ 
  transports = [], 
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

  // РОЗУМНА ФІЛЬТРАЦІЯ
  const filteredTransports = transports.filter(item => {
    const fromStr = item.location?.from || item.route?.from || '';
    const toStr = item.location?.to || item.route?.to || '';
    const title = item.vehicle || item.cargo || '';

    // 1. Загальний пошук
    const matchGeneral = !searchGeneral || 
      title.toLowerCase().includes(searchGeneral.toLowerCase()) || 
      fromStr.toLowerCase().includes(searchGeneral.toLowerCase()) ||
      toStr.toLowerCase().includes(searchGeneral.toLowerCase());

    // 2. Витягуємо лише код (наприклад "UA") з того, що вибрав користувач
    const codeFrom = extractCountryCode(searchFrom).toLowerCase();
    const codeTo = extractCountryCode(searchTo).toLowerCase();

    // 3. Шукаємо цей код у рядку маршруту (в дужках "(ua)" або просто "ua")
    const matchFrom = !codeFrom || fromStr.toLowerCase().includes(`(${codeFrom})`) || fromStr.toLowerCase().includes(codeFrom);
    const matchTo = !codeTo || toStr.toLowerCase().includes(`(${codeTo})`) || toStr.toLowerCase().includes(codeTo);

    return matchGeneral && matchFrom && matchTo;
  });

  const formatLocation = (locStr) => {
    if (!locStr) return '-';

    const codeMatch = locStr.match(/([A-Za-z]{2})/);
    const countryCode = codeMatch ? codeMatch[1].toUpperCase() : '';

    let cityName = locStr
      .replace(/\(.*?\)/g, '')
      .replace(/^[A-Z]{2}\s*-\s*/i, '')
      .trim();

    if (cityName) {
      cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    }

    return (
      <span className="inline-flex items-center gap-1">
        {countryCode && <span className="text-slate-400 text-xs font-semibold">({countryCode})</span>}
        <span className="text-slate-700 font-medium">{cityName}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          <Truck className="text-blue-500 bg-blue-100 p-1.5 rounded-lg w-8 h-8" /> 
          {isArchiveView ? 'Архів транспорту' : 'Активний транспорт'}
        </h3>
        {!isArchiveView && onAdd && (
          <button 
            onClick={onAdd} 
            className="bg-[#1a202c] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-md transition-colors"
          >
            <Plus size={18} /> Додати
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <datalist id="countries-list-transport">
          {COUNTRIES.map(c => <option key={c} value={c} />)}
        </datalist>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Пошук (місто, транспорт...)"
            value={searchGeneral}
            onChange={(e) => setSearchGeneral(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            list="countries-list-transport"
            type="text" 
            placeholder="Звідки (Країна)"
            value={searchFrom}
            onChange={(e) => setSearchFrom(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            list="countries-list-transport"
            type="text" 
            placeholder="Куди (Країна)"
            value={searchTo}
            onChange={(e) => setSearchTo(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-4 px-4">Маршрут</th>
              <th className="pb-4 px-4">Транспорт / Вага</th>
              <th className="pb-4 px-4">Дата</th>
              <th className="pb-4 px-4">Ставка</th>
              <th className="pb-4 px-4 text-center w-28">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTransports.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-400 text-sm">
                  Записів не знайдено
                </td>
              </tr>
            ) : (
              filteredTransports.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => openDetails && openDetails(item, 'transport')} 
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4 text-sm">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {formatLocation(item.location?.from || item.route?.from)}
                      <span className="text-slate-300 mx-1">→</span>
                      {formatLocation(item.location?.to || item.route?.to)}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-slate-700">{item.vehicle || item.cargo}</div>
                    <span className="text-xs bg-slate-100 font-medium text-slate-500 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {item.weight}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-sm">
                    <div className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-max flex items-center gap-1.5 font-medium mb-1">
                      <Calendar size={14}/>{item.date || item.dates}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-emerald-600">{item.price}</span>
                  </td>

                  <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      {!isArchiveView && onEdit && (
                        <button 
                          onClick={(e) => onEdit(item, 'transport', e)} 
                          title="Редагувати" 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {handleArchive && (
                        <button 
                          onClick={(e) => handleArchive(item.id, 'transport', e)} 
                          title={isArchiveView ? "Відновити" : "В архів"} 
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        >
                          {isArchiveView ? <RotateCcw size={16} /> : <Archive size={16} />}
                        </button>
                      )}
                      {handleDelete && (
                        <button 
                          onClick={(e) => handleDelete(item.id, 'transport', e)} 
                          title="Видалити" 
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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
    </div>
  );
}