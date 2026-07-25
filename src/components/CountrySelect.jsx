import React, { useState, useRef, useEffect } from 'react';
import { Globe, X, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '../data/countries';

export default function CountrySelect({ value, onChange, placeholder = "Оберіть країну" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Фільтрація по коду та назві
  const filteredCountries = COUNTRIES.filter(cStr => 
    cStr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
      >
        <Globe className="absolute left-3 text-slate-400" size={16} />
        
        {value ? (
          <span className="text-slate-800 font-medium truncate">{value}</span>
        ) : (
          <span className="text-slate-400 truncate">{placeholder}</span>
        )}

        {value ? (
          <button 
            onClick={(e) => { e.stopPropagation(); onChange(''); setSearchTerm(''); }}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        ) : (
          <ChevronDown className="absolute right-3 text-slate-400" size={16} />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Пошук країни (UA, Польща...)"
            className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg mb-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          {filteredCountries.length === 0 ? (
            <div className="p-2 text-xs text-slate-400 text-center">Країну не знайдено</div>
          ) : (
            filteredCountries.map(cStr => {
              const [code, name] = cStr.split(' - ');
              return (
                <div
                  key={cStr}
                  onClick={() => {
                    onChange(cStr);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-slate-50 ${value === cStr ? 'bg-indigo-50 font-semibold text-indigo-600' : 'text-slate-700'}`}
                >
                  <span>{name}</span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{code}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}