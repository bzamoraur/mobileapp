import type { Contact } from '@/data/schema';
import { PhoneIcon, GlobeIcon } from './icons';
import { cn } from '@/lib/cn';

function href(c: Contact): string {
  switch (c.channel) {
    case 'whatsapp':
      return `https://wa.me/${c.value.replace(/[^\d]/g, '')}`;
    case 'email':
      return `mailto:${c.value}`;
    case 'web':
      return c.value;
    case 'text':
      return '#';
    case 'call':
    default:
      return `tel:${c.value.replace(/\s/g, '')}`;
  }
}

const STYLE: Record<Contact['channel'], string> = {
  call: 'bg-emerald-500',
  whatsapp: 'bg-emerald-500',
  email: 'bg-brand-600',
  web: 'bg-brand-600',
  text: 'bg-ink-500',
};

const VERB: Record<Contact['channel'], string> = {
  call: 'Llamar',
  whatsapp: 'WhatsApp',
  email: 'Email',
  web: 'Abrir',
  text: '',
};

export function ContactButton({ contact }: { contact: Contact }) {
  const isText = contact.channel === 'text';
  const Icon = contact.channel === 'web' ? GlobeIcon : PhoneIcon;
  return (
    <div className="card p-4">
      <p className="font-bold text-ink-900">{contact.label}</p>
      <p className="mt-0.5 text-lg text-ink-700">{contact.value}</p>
      {contact.note && <p className="text-sm text-ink-500">{contact.note}</p>}
      {!isText && (
        <a
          href={href(contact)}
          target={contact.channel === 'web' || contact.channel === 'whatsapp' ? '_blank' : undefined}
          rel="noopener noreferrer"
          className={cn(
            'tap mt-3 inline-flex items-center gap-2 rounded-pill px-5 py-2 font-semibold text-white transition active:scale-95',
            STYLE[contact.channel],
          )}
        >
          <Icon width={18} height={18} />
          {VERB[contact.channel]}
        </a>
      )}
    </div>
  );
}
