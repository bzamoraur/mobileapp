import { Navigate } from 'react-router-dom';
import { trip } from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { CopyField } from '@/components/CopyField';
import { ContactButton } from '@/components/ContactButton';
import { PhoneIcon } from '@/components/icons';

export function Insurance() {
  const ins = trip.insurance;
  if (!ins) return <Navigate to="/" replace />;

  return (
    <div>
      <PageHeader title="Seguro" back />
      <div className="space-y-4 p-5 pt-2">
        <p className="font-semibold text-ink-700">{ins.provider}</p>

        {ins.bookingLocator && <CopyField label="Localizador reserva" value={ins.bookingLocator} />}
        {ins.providerLocator && (
          <CopyField label="Localizador proveedor" value={ins.providerLocator} />
        )}
        {ins.policyNumber && <CopyField label="Nº de póliza" value={ins.policyNumber} />}

        {ins.assistance.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <PhoneIcon width={20} height={20} className="text-brand-600" /> Asistencia 24 horas
            </h2>
            {ins.assistance.map((c, i) => (
              <ContactButton key={i} contact={c} />
            ))}
          </section>
        )}

        {ins.email && (
          <ContactButton
            contact={{ label: 'Email de siniestros', value: ins.email, channel: 'email' }}
          />
        )}

        {ins.notes && <p className="text-sm text-ink-500">{ins.notes}</p>}
      </div>
    </div>
  );
}
