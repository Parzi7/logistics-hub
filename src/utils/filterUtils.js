const normalize = (value) => String(value || '').trim().toLowerCase();

export const extractCountryCode = (str) => {
  if (!str) return '';
  const match = String(str).match(/([A-Za-z]{2})/);
  return match ? match[1].toUpperCase() : String(str).trim().toUpperCase();
};

export const filterItems = (
  items = [],
  { query = '', fromCountry = '', toCountry = '' } = {},
  globalSearch = ''
) => {
  if (!Array.isArray(items)) return [];

  const searchTerm = normalize(query || globalSearch);
  const codeFrom = extractCountryCode(fromCountry).toLowerCase();
  const codeTo = extractCountryCode(toCountry).toLowerCase();

  return items.filter((item) => {
    const itemName = normalize(item?.cargo || item?.vehicle || '');
    const routeFrom = normalize(item?.route?.from || item?.location?.from || '');
    const routeTo = normalize(item?.route?.to || item?.location?.to || '');
    const price = normalize(item?.price || '');
    const extra = normalize(item?.additional || item?.notes || item?.description || item?.details || '');

    const matchesText =
      !searchTerm ||
      itemName.includes(searchTerm) ||
      routeFrom.includes(searchTerm) ||
      routeTo.includes(searchTerm) ||
      price.includes(searchTerm) ||
      extra.includes(searchTerm);

    const matchesFromCountry =
      !codeFrom ||
      routeFrom.includes(`(${codeFrom})`) ||
      routeFrom.includes(codeFrom);

    const matchesToCountry =
      !codeTo ||
      routeTo.includes(`(${codeTo})`) ||
      routeTo.includes(codeTo);

    return matchesText && matchesFromCountry && matchesToCountry;
  });
};
