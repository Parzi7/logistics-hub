import { Package, Truck, Archive, CalendarDays, MapPinned, DollarSign } from 'lucide-react';
import { extractCountryCity } from './addItemHelpers';

const parsePriceValue = (value) => {
  if (!value || value === '-' || value === 'За домовленістю') return null;

  const normalized = String(value)
    .replace(/[^0-9,.-]/g, '')
    .replace(/,/g, '.');

  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const getPriceRange = (value) => {
  if (value === null) return 'Без ціни';
  if (value < 50000) return '< 50k';
  if (value < 100000) return '50k-100k';
  if (value < 200000) return '100k-200k';
  return '200k+';
};

const formatDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function AnalyticsPanel({
  cargos = [],
  transports = [],
  archivedCargos = [],
  archivedTransports = []
}) {
  const allCargos = [...cargos, ...archivedCargos];
  const allTransports = [...transports, ...archivedTransports];

  const today = new Date();
  const todayString = today.toDateString();

  const addedToday = allCargos.filter((item) => {
    const createdAt = item.created_at || item.createdAt || item.timeAdded;
    if (!createdAt) return false;

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return false;

    return date.toDateString() === todayString;
  });

  const transportCountryStats = allTransports.reduce((acc, item) => {
    const fromParsed = extractCountryCity(
      { from_location: item.from_location || item.route?.from || item.location?.from },
      true
    );
    const toParsed = extractCountryCity(
      { to_location: item.to_location || item.route?.to || item.location?.to },
      false
    );

    [fromParsed.country, toParsed.country]
      .filter(Boolean)
      .forEach((country) => {
        acc[country] = (acc[country] || 0) + 1;
      });

    return acc;
  }, {});

  const transportPriceStats = allTransports.reduce((acc, item) => {
    const priceValue = parsePriceValue(item.price);
    const range = getPriceRange(priceValue);

    if (range) {
      acc[range] = (acc[range] || 0) + 1;
    }

    return acc;
  }, {});

  const statCards = [
    {
      title: 'Активні вантажі',
      value: cargos.length,
      icon: Package,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      title: 'Всього вантажів',
      value: allCargos.length,
      icon: Archive,
      color: 'text-slate-700 bg-slate-100'
    },
    {
      title: 'Активний транспорт',
      value: transports.length,
      icon: Truck,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Всього транспорту',
      value: allTransports.length,
      icon: MapPinned,
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Аналітика логістики</h2>
            <p className="text-sm text-slate-500">
              Короткий огляд активних і архівних вантажів та транспорту
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="font-semibold">Архівів:</span> {archivedCargos.length} вантажів / {archivedTransports.length} транспорту
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ title, value, icon: Icon, color }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className={`inline-flex rounded-xl p-2 ${color}`}>
                <Icon size={18} />
              </div>
              <div className="mt-3 text-2xl font-black text-slate-800">{value}</div>
              <div className="text-sm text-slate-500">{title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} className="text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Вантажі, додані сьогодні</h3>
          </div>

          {addedToday.length > 0 ? (
            <div className="space-y-2">
              {addedToday.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-800">{item.cargo || 'Без назви'}</div>
                      <div className="text-sm text-slate-500">
                        {item.from_location || item.route?.from || item.location?.from || '—'}
                        {' → '}
                        {item.to_location || item.route?.to || item.location?.to || '—'}
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-xs font-semibold text-slate-500">
                      {formatDate(item.created_at || item.createdAt) || 'Сьогодні'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Сьогодні ще не було додано жодного вантажу.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPinned size={18} className="text-blue-500" />
              <h3 className="text-lg font-bold text-slate-800">Транспорт по країнам</h3>
            </div>

            {Object.keys(transportCountryStats).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(transportCountryStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                      <span className="font-medium text-slate-700">{country}</span>
                      <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Немає даних по країнах.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <DollarSign size={18} className="text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-800">Цінові діапазони</h3>
            </div>

            {Object.keys(transportPriceStats).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(transportPriceStats)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([range, count]) => (
                    <div key={range} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                      <span className="font-medium text-slate-700">{range}</span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Немає даних для аналізу цін.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
