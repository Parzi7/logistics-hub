import { extractCountryCode } from '../utils/filterUtils';

/**
 * Безпечне отримання ISO-коду країни
 */
export const getSafeCountryCode = (countryName) => {
  if (!countryName) return '';
  try {
    const code = extractCountryCode(countryName);
    return code || countryName;
  } catch {
    return countryName;
  }
};

/**
 * Розумний розбір міста та країни з різних форматів запису
 */
export const extractCountryCity = (data, isFrom = true) => {
  const directCountry = isFrom
    ? (data?.country_from || data?.fromCountry || data?.from_country)
    : (data?.country_to || data?.toCountry || data?.to_country);

  const directCity = isFrom
    ? (data?.city_from || data?.fromCity || data?.from_city || data?.city)
    : (data?.city_to || data?.toCity || data?.to_city);

  if (directCountry || directCity) {
    return { country: directCountry || '', city: directCity || '' };
  }

  const str = (
    isFrom
      ? (data?.route?.from || data?.location?.from || data?.from_location || data?.from || '')
      : (data?.route?.to || data?.location?.to || data?.to_location || data?.to || '')
  ).trim();

  if (!str) return { country: '', city: '' };

  // Формат "(UA) Київ"
  const bracketMatch = str.match(/^\(([^)]+)\)\s*(.*)$/);
  if (bracketMatch) {
    return { country: bracketMatch[1].trim(), city: bracketMatch[2].trim() };
  }

  // Формат "Київ (UA)"
  const reverseBracketMatch = str.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (reverseBracketMatch) {
    return { country: reverseBracketMatch[2].trim(), city: reverseBracketMatch[1].trim() };
  }

  // Формат "UA, Київ" або "UA - Київ"
  const prefixMatch = str.match(/^([A-Za-z]{2})[\s,–/-]+(.+)$/);
  if (prefixMatch) {
    return { country: prefixMatch[1].trim(), city: prefixMatch[2].trim() };
  }

  // Формат "Київ, UA"
  const suffixMatch = str.match(/^(.+?)[\s,–/-]+([A-Za-z]{2})$/);
  if (suffixMatch) {
    return { country: suffixMatch[2].trim(), city: suffixMatch[1].trim() };
  }

  // Якщо це просто 2-значний код країни
  if (/^[A-Za-z]{2}$/.test(str)) {
    return { country: str, city: '' };
  }

  return { country: '', city: str };
};

/**
 * Підготовка початкового стану форми з даних initialData
 */
export const parseInitialFormData = (initialData, isCargo) => {
  const defaultData = {
    country_from: '', city_from: '',
    country_to: '', city_to: '',
    title: isCargo ? '' : 'Тент',
    weight: '', price: '', currency: 'EUR',
    date: '', phone: '', description: ''
  };

  if (!initialData) return defaultData;

  const fromParsed = extractCountryCity(initialData, true);
  const toParsed = extractCountryCity(initialData, false);

  const priceParts = (initialData.price || '').split(' ');
  const currency = priceParts.length > 1 ? priceParts.pop() : 'EUR';
  const priceVal = priceParts.join(' ');

  return {
    country_from: fromParsed.country || '',
    city_from: fromParsed.city || '',
    country_to: toParsed.country || '',
    city_to: toParsed.city || '',
    title: initialData.cargo || initialData.vehicle || (isCargo ? '' : 'Тент'),
    weight: initialData.weight ? String(initialData.weight).replace(/\s*т$/i, '') : '',
    price: priceVal || '',
    currency: ['EUR', 'UAH', 'USD', 'PLN'].includes(currency) ? currency : 'EUR',
    date: initialData.dates || initialData.date || '',
    phone: initialData.phone || '',
    description: initialData.description || initialData.additional || initialData.notes || ''
  };
};

/**
 * Збирання готового об'єкта запису для збереження
 */
export const buildSavePayload = (formData, initialData, isCargo) => {
  const codeFrom = getSafeCountryCode(formData.country_from);
  const codeTo = getSafeCountryCode(formData.country_to);

  const fromStr = codeFrom 
    ? `(${codeFrom}) ${formData.city_from}`.trim() 
    : formData.city_from;
    
  const toStr = codeTo 
    ? `(${codeTo}) ${formData.city_to}`.trim() 
    : formData.city_to;

  const fullPrice = formData.price ? `${formData.price} ${formData.currency}` : '';
  const formattedWeight = formData.weight ? `${formData.weight} т` : '';

  return {
    ...initialData,
    id: initialData?.id || Date.now(),
    ...(isCargo 
      ? { route: { from: fromStr, to: toStr }, cargo: formData.title } 
      : { location: { from: fromStr, to: toStr }, vehicle: formData.title }),
    
    country_from: formData.country_from,
    city_from: formData.city_from,
    country_to: formData.country_to,
    city_to: formData.city_to,
    from_location: fromStr,
    to_location: toStr,
    
    weight: formattedWeight,
    ...(isCargo ? { dates: formData.date } : { date: formData.date }),
    price: fullPrice,
    phone: formData.phone,
    description: formData.description,
    additional: formData.description,
    timeAdded: initialData?.timeAdded || 'Щойно'
  };
};