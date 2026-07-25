export function filterItems(items = [], { query = '', fromCountry = '', toCountry = '' }, globalSearch = '') {
  return items.filter(item => {
    // 1. Пошук по текст-запиту (назва, міста)
    const textTerm = (query || globalSearch).toLowerCase().trim();
    const itemName = (item.cargo || item.vehicle || '').toLowerCase();
    const routeFrom = (item.route?.from || item.location?.from || '').toLowerCase();
    const routeTo = (item.route?.to || item.location?.to || '').toLowerCase();

    const matchesText = !textTerm || 
      itemName.includes(textTerm) || 
      routeFrom.includes(textTerm) || 
      routeTo.includes(textTerm);

    // 2. Фільтр за країною виїзду
    const matchesFromCountry = !fromCountry || 
      routeFrom.includes(`(${fromCountry.toLowerCase()})`) || 
      routeFrom.includes(fromCountry.toLowerCase());

    // 3. Фільтр за країною призначення
    const matchesToCountry = !toCountry || 
      routeTo.includes(`(${toCountry.toLowerCase()})`) || 
      routeTo.includes(toCountry.toLowerCase());

    return matchesText && matchesFromCountry && matchesToCountry;
  });
}