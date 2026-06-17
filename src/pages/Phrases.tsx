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
    // Reset shortly after; the API has no reliable per-utterance end here.
    setTimeout(() => setSpeaking(false), 1200);
  }

  return (
    <article className="card p-4">
      <p className="font-bold text-ink-900">{phrase.es}</p>
      <p className="mt-1 text-xl text-brand-600" lang={lang}>
        {phrase.target}
      </p>
      {phrase.romaji && <p className="text-ink-500 italic">({phrase.romaji})</p>}
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
      <PageHeader title="Frases útiles" />
      <p className="px-5 text-ink-500">
        {ttsOn
          ? 'Toca «Reproducir» para que el móvil lo diga, o enseña la pantalla.'
          : 'Enseña la pantalla para comunicarte.'}
      </p>
      <div className="space-y-6 p-5">
        {trip.phrases.map((group) => (
          <section key={group.id}>
            <h2 className="mb-2 text-lg font-bold text-ink-900">{group.title}</h2>
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
