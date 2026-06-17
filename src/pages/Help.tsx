import { trip } from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { ContactButton } from '@/components/ContactButton';
import { GlobeIcon, InfoIcon, ShieldIcon } from '@/components/icons';

export function Help() {
  const help = trip.help;

  return (
    <div>
      <PageHeader title="Ayuda" />
      <div className="space-y-5 p-5 pt-2">
        {help?.documents && help.documents.length > 0 && (
          <section className="space-y-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <ShieldIcon width={20} height={20} className="text-brand-600" /> Documentación
            </h2>
            {help.documents.map((d, i) => (
              <p key={i} className="card p-4 text-ink-700">
                {d}
              </p>
            ))}
          </section>
        )}

        {help?.links?.map((link, i) => (
          <section key={i} className="card bg-brand-50 p-4">
            <h3 className="flex items-center gap-2 font-bold text-brand-700">
              <GlobeIcon width={20} height={20} /> {link.label.replace(/^Abrir\s+/i, '')}
            </h3>
            {link.description && <p className="mt-1 text-ink-700">{link.description}</p>}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tap mt-3 inline-flex items-center gap-2 rounded-pill bg-brand-600 px-5 py-2 font-semibold text-white active:scale-95"
            >
              <GlobeIcon width={18} height={18} /> {link.label}
            </a>
          </section>
        ))}

        {help?.emergencyContacts && help.emergencyContacts.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-ink-900">Emergencias</h2>
            {help.emergencyContacts.map((c, i) => (
              <ContactButton key={i} contact={c} />
            ))}
          </section>
        )}

        {help?.reminders?.map((r, i) => (
          <section key={i} className="card flex gap-3 bg-amber-50 p-4">
            <InfoIcon width={20} height={20} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Recordad</p>
              <p className="text-ink-700">{r}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
