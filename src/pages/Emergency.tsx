import { trip } from '@/data';
import type { Contact } from '@/data/schema';
import { getCurrentDay, getAccommodation } from '@/data/selectors';
import { PageHeader } from '@/components/PageHeader';
import { ContactButton } from '@/components/ContactButton';
import { AlertIcon } from '@/components/icons';

/**
 * Emergency quick-card: one-tap access to local emergency numbers, the travel
 * insurance assistance line, and tonight's lodge — all from existing trip data.
 */
export function Emergency() {
  const emergency = trip.practical?.emergencyContacts ?? [];
  const assistance = trip.insurance?.assistance ?? [];

  const today = getCurrentDay(trip);
  const lodge = getAccommodation(trip, today?.accommodationId);
  const lodgeContact: Contact | undefined = lodge?.phone
    ? { label: lodge.name, value: lodge.phone, channel: 'call' }
    : undefined;

  return (
    <div>
      <PageHeader title="Emergencia" />
      <div className="space-y-6 p-5 pt-2">
        <div className="card flex gap-3 bg-red-50 p-4">
          <AlertIcon width={20} height={20} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-ink-700">
            Ante un problema grave, llama primero a los servicios locales y a la asistencia 24 h de
            tu seguro.
          </p>
        </div>

        {emergency.length > 0 && (
          <section className="space-y-3">
            <h2 className="eyebrow">Emergencias y asistencia</h2>
            {emergency.map((c, i) => (
              <ContactButton key={i} contact={c} />
            ))}
          </section>
        )}

        {assistance.length > 0 && (
          <section className="space-y-3">
            <h2 className="eyebrow">Tu seguro de viaje</h2>
            {assistance.map((c, i) => (
              <ContactButton key={i} contact={c} />
            ))}
          </section>
        )}

        {lodgeContact && (
          <section className="space-y-3">
            <h2 className="eyebrow">Tu alojamiento de hoy</h2>
            <ContactButton contact={lodgeContact} />
          </section>
        )}
      </div>
    </div>
  );
}
