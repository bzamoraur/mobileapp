import { Navigate } from 'react-router-dom';
import { trip } from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { CopyField } from '@/components/CopyField';
import { ContactButton } from '@/components/ContactButton';
import { ShieldIcon, PhoneIcon, InfoIcon } from '@/components/icons';

export function Insurance() {
  const ins = trip.insurance;
  if (!ins) return <Navigate to="/" replace />;

  return (
    <div>
      <PageHeader title="Seguro de viaje" back />
      <div className="space-y-4 p-5 pt-2">
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-moss-500/15 text-moss-700">
            <ShieldIcon width={24} height={24} />
          </span>
          <div>
            <p className="font-bold text-ink-900">{ins.provider}</p>
            {ins.plan && <p className="text-sm text-ink-500">{ins.plan}</p>}
          </div>
        </div>

        {ins.bookingLocator && <CopyField label="Localizador reserva" value={ins.bookingLocator} />}
        {ins.providerLocator && (
          <CopyField label="Localizador proveedor" value={ins.providerLocator} />
        )}
        {ins.policyNumber && <CopyField label="Nº de póliza" value={ins.policyNumber} />}

        {ins.coverages.length > 0 && (
          <section className="card p-4">
            <h2 className="font-bold text-ink-900">Coberturas principales</h2>
            <ul className="mt-2 space-y-2">
              {ins.coverages.map((c, i) => (
                <li key={i} className="flex gap-2 text-ink-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-500" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}

        {ins.assistance.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <PhoneIcon width={20} height={20} className="text-brand-600" /> Asistencia
            </h2>
            {ins.assistance.map((c, i) => (
              <ContactButton key={i} contact={c} />
            ))}
          </section>
        )}

        {ins.email && (
          <ContactButton
            contact={{ label: 'Email del seguro', value: ins.email, channel: 'email' }}
          />
        )}

        {ins.notes && (
          <section className="card flex gap-3 bg-amber-50 p-4">
            <InfoIcon width={20} height={20} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-ink-700">{ins.notes}</p>
          </section>
        )}
      </div>
    </div>
  );
}
