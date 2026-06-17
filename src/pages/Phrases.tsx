import { useEffect, useMemo, useState } from 'react';
import { trip } from '@/data';
import type { Phrase } from '@/data/schema';
import { usePersistentState } from '@/lib/usePersistentState';
import { PageHeader } from '@/components/PageHeader';
import { SpeakerIcon, SearchIcon, StarIcon, CloseIcon } from '@/components/icons';
import { isTtsSupported, speak, stopSpeaking } from '@/lib/tts';

type Favs = Record<string, boolean>;

/** Lowercase + strip accents, so "leon" matches "León". */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function PhraseCard({
  phrase,
  lang,
  ttsOn,
  fav,
  onToggleFav,
}: {
  phrase: Phrase;
  lang: string;
  ttsOn: boolean;
  fav: boolean;
  onToggleFav: () => void;
}) {
  const [speaking, setSpeaking] = useState(false);

  async function onPlay() {
    setSpeaking(true);
    await speak(phrase.target, lang);
    setTimeout(() => setSpeaking(false), 1200);
  }

  return (
    <article className="card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-ink-900">{phrase.es}</p>
        <button
          type="button"
          onClick={onToggleFav}
          aria-pressed={fav}
          aria-label={fav ? 'Quitar de favoritas' : 'Marcar como favorita'}
          className="tap -mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-pill"
        >
          <StarIcon
            width={20}
            height={20}
            fill={fav ? 'currentColor' : 'none'}
            className={fav ? 'text-amber-500' : 'text-ink-300'}
          />
        </button>
      </div>
      <p
        className="mt-1 font-display text-2xl font-semibold tracking-tightish text-brand-600"
        lang={lang}
      >
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
  const [favs, setFavs] = usePersistentState<Favs>(`phraseFavs:${trip.id}`, {});
  const [query, setQuery] = useState('');
  useEffect(() => () => stopSpeaking(), []);

  const all = useMemo(
    () => trip.phrases.flatMap((g) => g.phrases.map((phrase) => ({ phrase, key: phrase.es }))),
    [],
  );

  const q = normalize(query.trim());
  const matches = q
    ? all.filter(({ phrase }) =>
        normalize(`${phrase.es} ${phrase.target} ${phrase.pron ?? ''}`).includes(q),
      )
    : [];
  const favList = all.filter(({ key }) => favs[key]);

  const toggleFav = (key: string) => setFavs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <PageHeader title="Frases en swahili" />
      <div className="px-5">
        <div className="relative">
          <SearchIcon
            width={18}
            height={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar una frase…"
            aria-label="Buscar una frase"
            className="w-full rounded-pill border border-surface-sunken bg-surface py-2.5 pl-10 pr-10 text-ink-900 outline-none focus:border-brand-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Borrar búsqueda"
              className="tap absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-pill text-ink-400"
            >
              <CloseIcon width={18} height={18} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 p-5">
        {q ? (
          <section>
            <h2 className="mb-2 font-display text-2xl font-semibold tracking-tightish text-ink-900">
              {matches.length} resultado{matches.length === 1 ? '' : 's'}
            </h2>
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map(({ phrase, key }) => (
                  <PhraseCard
                    key={key}
                    phrase={phrase}
                    lang={trip.phraseLang}
                    ttsOn={ttsOn}
                    fav={Boolean(favs[key])}
                    onToggleFav={() => toggleFav(key)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-ink-400">Sin resultados. Prueba con otra palabra.</p>
            )}
          </section>
        ) : (
          <>
            {favList.length > 0 && (
              <section>
                <h2 className="mb-2 flex items-center gap-1.5 font-display text-2xl font-semibold tracking-tightish text-ink-900">
                  <StarIcon width={18} height={18} fill="currentColor" className="text-amber-500" />
                  Favoritas
                </h2>
                <div className="space-y-3">
                  {favList.map(({ phrase, key }) => (
                    <PhraseCard
                      key={key}
                      phrase={phrase}
                      lang={trip.phraseLang}
                      ttsOn={ttsOn}
                      fav
                      onToggleFav={() => toggleFav(key)}
                    />
                  ))}
                </div>
              </section>
            )}
            {trip.phrases.map((group) => (
              <section key={group.id}>
                <h2 className="mb-2 font-display text-2xl font-semibold tracking-tightish text-ink-900">
                  {group.title}
                </h2>
                <div className="space-y-3">
                  {group.phrases.map((phrase) => (
                    <PhraseCard
                      key={phrase.es}
                      phrase={phrase}
                      lang={trip.phraseLang}
                      ttsOn={ttsOn}
                      fav={Boolean(favs[phrase.es])}
                      onToggleFav={() => toggleFav(phrase.es)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
