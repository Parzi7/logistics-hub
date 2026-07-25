export const COUNTRIES = [
  "AT - Австрія", "AZ - Азербайджан", "AL - Албанія", "DZ - Алжир", "AD - Андорра", 
  "BD - Бангладеш", "BE - Бельгія", "BG - Болгарія", "BA - Боснія і Герцеговина", 
  "GB - Велика Британія", "VN - В'єтнам", "VA - Ватикан", "AM - Вірменія", 
  "HK - Гонконг", "GR - Греція", "GE - Грузія", "DK - Данія", "EE - Естонія", 
  "EG - Єгипет", "IL - Ізраїль", "IN - Індія", "ID - Індонезія", "IQ - Ірак", 
  "IE - Ірландія", "ES - Іспанія", "IT - Італія", "JO - Йорданія", "KZ - Казахстан", 
  "KH - Камбоджа", "CA - Канада", "QA - Катар", "KE - Кенія", "CY - Кіпр", 
  "KG - Киргизстан", "CN - Китай", "KW - Кувейт", "LA - Лаос", "LV - Латвія", 
  "LB - Ліван", "LI - Ліхтенштейн", "LT - Литва", "LU - Люксембург", "MY - Малайзія", 
  "MT - Мальта", "MA - Марокко", "MD - Молдова", "MC - Монако", "MN - Монголія", 
  "NL - Нідерланди", "DE - Німеччина", "NO - Норвегія", "AE - ОАЕ", "OM - Оман", 
  "PK - Пакистан", "PL - Польща", "PT - Португалія", "RO - Румунія", "SM - Сан-Марино", 
  "SA - Саудівська Аравія", "MK - Північна Македонія", "RS - Сербія", "SG - Сінгапур", 
  "SY - Сирія", "SK - Словаччина", "SI - Словенія", "US - США", "TJ - Таджикистан", 
  "TH - Таїланд", "TN - Туніс", "TR - Туреччина", "TM - Туркменістан", "UZ - Узбекистан", 
  "UA - Україна", "FI - Фінляндія", "FR - Франція", "HR - Хорватія", "ME - Чорногорія", 
  "CZ - Чехія", "CH - Швейцарія", "SE - Швеція", "ZA - ПАР", "JP - Японія"
];

// ДОДАНО EXPORT ОСЬ ТУТ 👇
export const extractCountryCode = (str) => {
  if (!str) return '';
  const match = str.match(/([A-Za-z]{2})/);
  return match ? match[1].toUpperCase() : str.trim().toUpperCase();
};

export function filterItems(items = [], { query = '', fromCountry = '', toCountry = '' }, globalSearch = '') {
  if (!Array.isArray(items)) return [];

  return items.filter(item => {
    const textTerm = (query || globalSearch).toLowerCase().trim();
    const itemName = (item?.cargo || item?.vehicle || '').toLowerCase();
    const routeFrom = (item?.route?.from || item?.location?.from || '').toLowerCase();
    const routeTo = (item?.route?.to || item?.location?.to || '').toLowerCase();

    // 1. Пошук по тексту (назва вантажу/міста)
    const matchesText = !textTerm || 
      itemName.includes(textTerm) || 
      routeFrom.includes(textTerm) || 
      routeTo.includes(textTerm);

    // 2. Коди країн з випадаючих списків
    const codeFrom = extractCountryCode(fromCountry).toLowerCase();
    const codeTo = extractCountryCode(toCountry).toLowerCase();

    // 3. Перевірка наявності коду у дужках типу "(cz)" або у тексті
    const matchesFromCountry = !codeFrom || routeFrom.includes(`(${codeFrom})`) || routeFrom.includes(codeFrom);
    const matchesToCountry = !codeTo || routeTo.includes(`(${codeTo})`) || routeTo.includes(codeTo);

    return matchesText && matchesFromCountry && matchesToCountry;
  });
}