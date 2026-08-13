import { MapPinned, ArrowLeft } from 'lucide-react';
import { extractCountryCity } from './addItemHelpers';

export default function CountryTransportsPage({ country, transports = [], onBack, openDetails }) {
  const matching = transports.filter((t) => {
    const fromParsed = extractCountryCity({ from_location: t.from_location || t.route?.from || t.location?.from }, true);
    // Prefer explicit `country_from` when available (formatted in App), fallback to parsed from_location
    const origin = t.country_from || fromParsed.country;
    return origin === country;
  });

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100">
          <ArrowLeft size={16} />
        </button>
        <MapPinned size={20} className="text-blue-500" />
        <h2 className="text-2xl font-bold text-slate-800">Транспорт з країни: {country}</h2>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {matching.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            У цій країні не знайдено транспорту.
          </div>
        ) : (
          <div className="space-y-4">
            {matching.map((t) => (
              <div
                key={t.id}
                onClick={() => openDetails && openDetails(t, 'transport')}
                role="button"
                tabIndex={0}
                className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl border border-slate-100 hover:shadow-md cursor-pointer"
              >
                <div className="col-span-5">
                  <div className="font-semibold text-slate-800">{t.vehicle || 'Транспорт'}</div>
                  <div className="text-sm text-slate-500 mt-1">{t.from_location || t.route?.from || t.location?.from || '—'} → {t.to_location || t.route?.to || t.location?.to || '—'}</div>
                </div>

                <div className="col-span-3 text-sm text-slate-600">
                  {t.company ? <div className="font-medium text-slate-800">{t.company}</div> : null}
                  {t.contact ? <div className="text-sm text-slate-500">{t.contact}</div> : null}
                </div>

                <div className="col-span-2 text-right font-black text-emerald-600">{t.price || '-'}</div>

                <div className="col-span-2 text-right text-xs text-indigo-600">
                  {t.phone ? (
                    <a href={`tel:${t.phone.replace(/\s+/g,'')}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                      {t.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
