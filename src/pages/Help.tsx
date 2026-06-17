import { trip } from '@/data';
import type { ReactNode } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ContactButton } from '@/components/ContactButton';
import { PackingChecklist } from '@/components/PackingChecklist';
import {
  GlobeIcon,
  InfoIcon,
  ShieldIcon,
  SunsetIcon,
  LandmarkIcon,
  PhoneIcon,
} from '@/components/icons';

function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tightish text-ink-900">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function LinkCard({
  label,
  url,
  description,
}: {
  label: string;
  url: string;
  description?: string | undefined;
}) {
  return (
    <div className="card bg-brand-50 p-4">
      <h3 className="font-bold text-brand-700">{label}</h3>
      {description && <p className="mt-1 text-ink-700">{description}</p>}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="tap mt-3 inline-flex items-center gap-2 rounded-pill bg-brand-600 px-5 py-2 font-semibold text-white active:scale-95"
      >
        <GlobeIcon width={18} height={18} /> Abrir
      </a>
    </div>
  );
}

export function Help() {
  const p = trip.practical;
  const agency = trip.agency;

  return (
    <div>
      <PageHeader title="Ayuda y consejos" />
      <div className="space-y-7 p-5 pt-2">
        {p?.intro && <p className="leading-relaxed text-ink-700">{p.intro}</p>}

        {p?.documents && p.documents.length > 0 && (
          <Section title="Documentación" icon={<ShieldIcon width={22} height={22} className="text-brand-600" />}>
            {p.documents.map((d, i) => (
              <p key={i} className="card p-4 text-ink-700">
                {d}
              </p>
            ))}
            {p.visa && <LinkCard label={p.visa.label} url={p.visa.url} description={p.visa.description} />}
          </Section>
        )}

        {p?.links && p.links.length > 0 && (
          <Section title="Antes de volar" icon={<GlobeIcon width={22} height={22} className="text-brand-600" />}>
            {p.links.map((l, i) => (
              <LinkCard key={i} label={l.label} url={l.url} description={l.description} />
            ))}
          </Section>
        )}

        {p?.vaccines && (
          <Section title="Salud y vacunas" icon={<InfoIcon width={22} height={22} className="text-brand-600" />}>
            <p className="card p-4 text-ink-700">{p.vaccines}</p>
          </Section>
        )}

        {(p?.weather?.length || p?.language || p?.timezone || p?.money) && (
          <Section title="En destino" icon={<SunsetIcon width={22} height={22} className="text-brand-600" />}>
            {p?.weather && p.weather.length > 0 && (
              <div className="card overflow-hidden p-4">
                <p className="eyebrow mb-2">Clima (°C)</p>
                <div className="space-y-1">
                  {p.weather.map((w) => (
                    <div key={w.month} className="flex items-center justify-between text-ink-700">
                      <span>{w.month}</span>
                      <span className="font-medium">
                        {w.minC}° – {w.maxC}°
                        {w.rainPct !== undefined && (
                          <span className="ml-2 text-sm text-ink-400">💧 {w.rainPct}%</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {p?.language && (
                <div className="card p-4">
                  <p className="eyebrow">Idioma</p>
                  <p className="mt-1 text-ink-800">{p.language}</p>
                </div>
              )}
              {p?.timezone && (
                <div className="card p-4">
                  <p className="eyebrow">Hora</p>
                  <p className="mt-1 text-ink-800">{p.timezone}</p>
                </div>
              )}
            </div>
            {p?.money && <p className="card p-4 text-ink-700">{p.money}</p>}
          </Section>
        )}

        {p?.packing && p.packing.length > 0 && (
          <Section title="Qué llevar de safari">
            {trip.features.packingChecklist ? (
              <PackingChecklist items={p.packing} tripId={trip.id} />
            ) : (
              <ul className="card space-y-2 p-4">
                {p.packing.map((item, i) => (
                  <li key={i} className="flex gap-2 text-ink-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        )}

        {p?.taxes && p.taxes.length > 0 && (
          <Section title="Tasas y pagos">
            <ul className="card space-y-2 p-4">
              {p.taxes.map((t, i) => (
                <li key={i} className="flex gap-2 text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {p?.reminders?.map((r, i) => (
          <div key={i} className="card flex gap-3 bg-amber-50 p-4">
            <InfoIcon width={20} height={20} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-ink-700">{r}</p>
          </div>
        ))}

        {p?.emergencyContacts && p.emergencyContacts.length > 0 && (
          <Section title="Contactos útiles" icon={<PhoneIcon width={22} height={22} className="text-brand-600" />}>
            {p.emergencyContacts.map((c, i) => (
              <ContactButton key={i} contact={c} />
            ))}
          </Section>
        )}

        {agency && (
          <Section title="Tu agencia" icon={<LandmarkIcon width={22} height={22} className="text-brand-600" />}>
            <div className="card p-4">
              <p className="font-bold text-ink-900">{agency.name}</p>
              {agency.advisorName && (
                <p className="text-ink-700">Asesor: {agency.advisorName}</p>
              )}
              <div className="mt-1 space-y-0.5 text-sm text-ink-500">
                {agency.bookingRef && <p>Referencia: {agency.bookingRef}</p>}
                {agency.locator && <p>Localizador: {agency.locator}</p>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {agency.advisorPhone && (
                  <a
                    href={`tel:${agency.advisorPhone.replace(/\s/g, '')}`}
                    className="tap inline-flex items-center gap-1.5 rounded-pill bg-emerald-500 px-4 py-2 text-sm font-semibold text-white active:scale-95"
                  >
                    <PhoneIcon width={16} height={16} /> Llamar al asesor
                  </a>
                )}
                {agency.advisorEmail && (
                  <a
                    href={`mailto:${agency.advisorEmail}`}
                    className="tap inline-flex items-center gap-1.5 rounded-pill bg-sand-200 px-4 py-2 text-sm font-semibold text-ink-700 active:scale-95"
                  >
                    Email
                  </a>
                )}
              </div>
            </div>
          </Section>
        )}

        {(trip.inclusions.length > 0 || trip.exclusions.length > 0) && (
          <Section title="Qué incluye">
            {trip.inclusions.length > 0 && (
              <div className="card p-4">
                <p className="eyebrow mb-2 text-moss-700">Incluido</p>
                <ul className="space-y-2">
                  {trip.inclusions.map((t, i) => (
                    <li key={i} className="flex gap-2 text-ink-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-500" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {trip.exclusions.length > 0 && (
              <div className="card p-4">
                <p className="eyebrow mb-2 text-ink-500">No incluido</p>
                <ul className="space-y-2">
                  {trip.exclusions.map((t, i) => (
                    <li key={i} className="flex gap-2 text-ink-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}
