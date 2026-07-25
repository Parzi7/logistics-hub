import React, { useState, useEffect } from 'react';
import { X, Package, PlusCircle } from 'lucide-react';
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
      
      const priceParts = (initialData.price || '').split(' ');
      const currency = priceParts.length > 1 ? priceParts.pop() : 'EUR';
      const priceVal = priceParts.join(' ');

      setFormData({
        country_from: fromParsed.country || '',
        city_from: fromParsed.city || '',
        country_to: toParsed.country || '',
        city_to: toParsed.city || '',
        title: initialData.cargo || initialData.vehicle || (isCargo ? '' : 'Тент'),
        weight: initialData.weight ? initialData.weight.replace(' т', '') : '',
        price: priceVal || '',
        currency: ['EUR', 'UAH', 'USD', 'PLN'].includes(currency) ? currency : 'EUR',
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
    
    // Використовуємо вашу утиліту extractCountryCode
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

  const inputClasses = "w-full px-3.5 py-2.5 bg-[#f8fafc]/50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative border border-slate-200 my-8 flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Приховані списки для автодоповнення (залишили тільки країни) */}
        <datalist id="countries-list">
          {COUNTRIES.map(c => <option key={c} value={c} />)}
        </datalist>

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {isCargo ? <Package size={22} className="text-orange-500" /> : <PlusCircle size={22} className="text-blue-500" fill="currentColor" stroke="white" />}
            <h3 className="text-[18px] font-bold text-[#1a2b4b]">
              {initialData ? 'Редагувати запис' : (isCargo ? 'Додати новий вантаж' : 'Нове авто')}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {isCargo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Країна завантаження</label>
                  <input list="countries-list" required type="text" placeholder="Напр: UA - Україна" className={inputClasses} value={formData.country_from} onChange={(e) => setFormData({ ...formData, country_from: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Місто завантаження</label>
                  <input required type="text" placeholder="Напр: Київ" className={inputClasses} value={formData.city_from} onChange={(e) => setFormData({ ...formData, city_from: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Країна розвантаження</label>
                  <input list="countries-list" required type="text" placeholder="Напр: PL - Польща" className={inputClasses} value={formData.country_to} onChange={(e) => setFormData({ ...formData, country_to: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Місто розвантаження</label>
                  <input required type="text" placeholder="Напр: Варшава" className={inputClasses} value={formData.city_to} onChange={(e) => setFormData({ ...formData, city_to: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Назва вантажу</label>
                  <input required type="text" placeholder="Напр: Меблі" className={inputClasses} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Вага (тонн)</label>
                  <input type="text" placeholder="Напр: 22" className={inputClasses} value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Ставка</label>
                  <input type="text" placeholder="Напр: 1500" className={inputClasses} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Валюта</label>
                  <select className={`${inputClasses} appearance-none cursor-pointer`} value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                    <option value="USD">USD</option>
                    <option value="PLN">PLN</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Дата завантаження</label>
                  <input type="text" placeholder="Напр: 24.05 або АСАП" className={inputClasses} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Телефон контакту</label>
                  <input type="text" placeholder="+380..." className={inputClasses} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-500 mb-1.5">Додаткова інформація</label>
                <textarea rows="3" placeholder="Ремені, CMR, тип кузова тощо..." className={`${inputClasses} resize-none`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="grid grid-cols-[1fr_2.5fr] gap-3">
                <input list="countries-list" required type="text" placeholder="Країна" className={inputClasses} value={formData.country_from} onChange={(e) => setFormData({ ...formData, country_from: e.target.value })} />
                <input required type="text" placeholder="Звідки (місто, село, селище)" className={inputClasses} value={formData.city_from} onChange={(e) => setFormData({ ...formData, city_from: e.target.value })} />
              </div>

              <div className="grid grid-cols-[1fr_2.5fr] gap-3">
                <input list="countries-list" required type="text" placeholder="Країна" className={inputClasses} value={formData.country_to} onChange={(e) => setFormData({ ...formData, country_to: e.target.value })} />
                <input required type="text" placeholder="Куди (місто, село, селище)" className={inputClasses} value={formData.city_to} onChange={(e) => setFormData({ ...formData, city_to: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select className={`${inputClasses} appearance-none cursor-pointer`} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}>
                  <option value="Тент">Тент</option>
                  <option value="Рефрижератор">Рефрижератор</option>
                  <option value="Цільномет">Цільномет</option>
                  <option value="Ізотерм">Ізотерм</option>
                  <option value="Бус">Бус</option>
                  <option value="Відкрита">Відкрита</option>
                </select>
                <input type="text" placeholder="Тоннаж (т)" className={inputClasses} value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <input type="text" placeholder="Бажана ціна" className={`${inputClasses} w-full`} value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  <select className={`${inputClasses} w-24 appearance-none cursor-pointer px-2 text-center`} value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                    <option value="EUR">EUR</option>
                    <option value="UAH">UAH</option>
                    <option value="USD">USD</option>
                    <option value="PLN">PLN</option>
                  </select>
                </div>
                <input type="text" placeholder="Дата (напр. завтра, 12.05)" className={inputClasses} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>

              <input type="text" placeholder="Контакти (Ім'я, Телефон)" className={inputClasses} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <textarea rows="3" placeholder="Додатковий опис..." className={`${inputClasses} resize-none`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Скасувати</button>
            <button type="submit" className="bg-[#0f172a] hover:bg-black text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold shadow-sm transition-all">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
}