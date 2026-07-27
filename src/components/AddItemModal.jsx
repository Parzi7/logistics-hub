import React, { useState, useEffect } from 'react';
import { X, Package, Truck } from 'lucide-react';
import { COUNTRIES, extractCountryCode } from '../data/countries';

export default function AddItemModal({ isOpen, onClose, onSave, initialData, type }) {
  if (!isOpen) return null;

  const isCargo = type === 'cargo';

  const defaultFormData = {
    country_from: '', city_from: '',
    country_to: '', city_to: '',
    title: isCargo ? '' : 'Тент',
    weight: '', price: '', currency: 'EUR',
    date: '', phone: '', description: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  // 1. Блокування скролу та обробка клавіші Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // 2. Синхронізація даних при відкритті або зміні initialData
  useEffect(() => {
    if (initialData) {
      const fromFull = initialData.route?.from || initialData.location?.from || '';
      const toFull = initialData.route?.to || initialData.location?.to || '';

      const extractCountryCity = (str) => {
        const match = str.match(/\((.*?)\)\s*(.*)/);
        if (match) return { country: match[1], city: match[2] };
        return { country: '', city: str };
      };

      const fromParsed = extractCountryCity(fromFull);
      const toParsed = extractCountryCity(toFull);

      const priceParts = (initialData.price || '').trim().split(' ');
      const currencyCandidate = priceParts.length > 1 ? priceParts.pop() : 'EUR';
      const currency = ['EUR', 'UAH', 'USD', 'PLN'].includes(currencyCandidate) ? currencyCandidate : 'EUR';
      const priceVal = priceParts.join(' ');

      setFormData({
        country_from: fromParsed.country || '',
        city_from: fromParsed.city || '',
        country_to: toParsed.country || '',
        city_to: toParsed.city || '',
        title: initialData.cargo || initialData.vehicle || (isCargo ? '' : 'Тент'),
        weight: initialData.weight ? initialData.weight.replace(/\s*т$/, '') : '',
        price: priceVal || '',
        currency,
        date: initialData.dates || initialData.date || '',
        phone: initialData.phone || '',
        description: initialData.description || ''
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen, isCargo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const fromStr = formData.country_from
      ? `(${extractCountryCode(formData.country_from)}) ${formData.city_from}`
      : formData.city_from;

    const toStr = formData.country_to
      ? `(${extractCountryCode(formData.country_to)}) ${formData.city_to}`
      : formData.city_to;

    const fullPrice = formData.price ? `${formData.price} ${formData.currency}` : '';
    const formattedWeight = formData.weight ? `${formData.weight} т` : '';

    const newItem = {
      id: initialData?.id || Date.now(),
      ...(isCargo
        ? { route: { from: fromStr, to: toStr }, cargo: formData.title }
        : { location: { from: fromStr, to: toStr }, vehicle: formData.title }),
      weight: formattedWeight,
      ...(isCargo ? { dates: formData.date } : { date: formData.date }),
      price: fullPrice,
      phone: formData.phone,
      description: formData.description,
      timeAdded: 'Щойно'
    };

    onSave(newItem);
  };

  const inputClasses = "w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200/90 rounded-xl text-[15px] sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <datalist id="countries-list">
          {COUNTRIES.map(c => <option key={c} value={c} />)}
        </datalist>

        {/* 1. ШАПКА МОДАЛКИ */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isCargo ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
              {isCargo ? <Package size={20} /> : <Truck size={20} />}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {initialData ? 'Редагувати запис' : (isCargo ? 'Додати новий вантаж' : 'Додати нове авто')}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 rounded-xl transition-all"
            aria-label="Закрити"
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. ОБ'ЄДНАНЕ ТІЛО ФОРМИ */}
        <form id="add-item-form" onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Звідки */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr] gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Країна (Звідки)</label>
              <input
                list="countries-list"
                required
                type="text"
                placeholder="UA - Україна"
                className={inputClasses}
                value={formData.country_from}
                onChange={(e) => setFormData({ ...formData, country_from: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Місто завантаження</label>
              <input
                required
                type="text"
                placeholder="Напр: Київ"
                className={inputClasses}
                value={formData.city_from}
                onChange={(e) => setFormData({ ...formData, city_from: e.target.value })}
              />
            </div>
          </div>

          {/* Куди */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr] gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Країна (Куди)</label>
              <input
                list="countries-list"
                required
                type="text"
                placeholder="PL - Польща"
                className={inputClasses}
                value={formData.country_to}
                onChange={(e) => setFormData({ ...formData, country_to: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Місто розвантаження</label>
              <input
                required
                type="text"
                placeholder="Напр: Варшава"
                className={inputClasses}
                value={formData.city_to}
                onChange={(e) => setFormData({ ...formData, city_to: e.target.value })}
              />
            </div>
          </div>

          {/* Назва/Тип та Вага */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {isCargo ? 'Назва вантажу' : 'Тип кузова'}
              </label>
              {isCargo ? (
                <input
                  required
                  type="text"
                  placeholder="Напр: Меблі"
                  className={inputClasses}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              ) : (
                <select
                  className={`${inputClasses} appearance-none cursor-pointer`}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                >
                  <option value="Тент">Тент</option>
                  <option value="Рефрижератор">Рефрижератор</option>
                  <option value="Цільномет">Цільномет</option>
                  <option value="Ізотерм">Ізотерм</option>
                  <option value="Бус">Бус</option>
                  <option value="Відкрита">Відкрита</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {isCargo ? 'Вага (тонн)' : 'Вантажопідйомність (т)'}
              </label>
              <input
                type="text"
                placeholder="Напр: 22"
                className={inputClasses}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          {/* Ціна, Валюта та Дата */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {isCargo ? 'Ставка' : 'Бажана ціна'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Напр: 1500"
                  className={`${inputClasses} w-full`}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <select
                  className={`${inputClasses} w-24 shrink-0 appearance-none cursor-pointer px-2 text-center`}
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="EUR">EUR</option>
                  <option value="UAH">UAH</option>
                  <option value="USD">USD</option>
                  <option value="PLN">PLN</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                {isCargo ? 'Дата завантаження' : 'Готовність до завантаження'}
              </label>
              <input
                type="text"
                placeholder="Напр: 24.05 або АСАП"
                className={inputClasses}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {/* Телефон / Контакти */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              {isCargo ? 'Телефон контакту' : 'Контакти (Ім\'я, Телефон)'}
            </label>
            <input
              type="text"
              placeholder="+380..."
              className={inputClasses}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Опис */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Додаткова інформація</label>
            <textarea
              rows="2"
              placeholder="Ремені, CMR, тип кузова тощо..."
              className={`${inputClasses} resize-none`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </form>

        {/* 3. ФУТЕР МОДАЛКИ */}
        <div className="flex items-center justify-end gap-2.5 px-4 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200/60 active:scale-95 transition-all"
          >
            Скасувати
          </button>
          
          <button
            type="submit"
            form="add-item-form"
            className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 active:scale-95 transition-all"
          >
            Зберегти
          </button>
        </div>

      </div>
    </div>
  );
}