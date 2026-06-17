import { useEffect, useState } from 'react';
import { trip } from '@/data';
import type { Phrase } from '@/data/schema';
import { PageHeader } from '@/components/PageHeader';
import { SpeakerIcon } from '@/components/icons';
import { isTtsSupported, speak, stopSpeaking } from '@/lib/tts';

function PhraseCard({ phrase, lang, ttsOn }: { phrase: Phrase; lang: string; ttsOn: boolean }) {
  const [speaking, setSpeaking] = useState(false);

  async function onPlay() {
    setSpeaking(true);
    await speak(phrase.target, lang);
    setTimeout(() => setSpeaking(false), 1200);
  }

  return (
    <article className="card p-4">
      <p className="font-semibold text-ink-900">{phrase.es}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tightish text-brand-600" lang={lang}>
        {phrase.target}
      </p>
      {phrase.pron && <p className="text-ink-500 italic">{phrase.pron}</p>}
      {phrase.note && <p className="mt-1 text-sm text-ink-500">{phrase.note}</p>}
      {ttsOn && (
        <button
          type="button"
          onClick={() => void onPlay()}
          className="tap mt-3 inline-flex items-center gap-2 rounded-pill bg-brand-600 px-4 py-2 font-semibold text-white transition active:scale-95"
          aria-label={`Reproducir: ${phrase.es}`}
        >
          <SpeakerIcon width={20} height={20} />
          {speaking ? 'Reproduciendo…' : 'Reproducir'}
        </button>
      )}
    </article>
  );
}

export function Phrases() {
  const ttsOn = isTtsSupported();
  useEffect(() => () => stopSpeaking(), []);

  return (
    <div>
      <PageHeader title="Frases en swahili" />
      <p className="px-5 text-ink-500">
        {ttsOn
          ? 'Toca «Reproducir» para oírlo, o enseña la pantalla. Un “Asante sana” abre muchas puertas.'
          : 'Enseña la pantalla para comunicarte. Un “Asante sana” abre muchas puertas.'}
      </p>
      <div className="space-y-6 p-5">
        {trip.phrases.map((group) => (
          <section key={group.id}>
            <h2 className="mb-2 font-display text-2xl font-semibold tracking-tightish text-ink-900">
              {group.title}
            </h2>
            <div className="space-y-3">
              {group.phrases.map((p, i) => (
                <PhraseCard key={`${group.id}-${i}`} phrase={p} lang={trip.phraseLang} ttsOn={ttsOn} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
