import { useEffect, useRef, useState } from 'react';
import { trip } from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { addDoc, deleteDoc, getDoc, listDocs } from '@/lib/idb';
import type { DocMeta } from '@/lib/idb';
import { PlusIcon, CloseIcon, InfoIcon, FileIcon } from '@/components/icons';

/**
 * On-device documents vault. Stores images/PDFs (passport, visa, insurance QR…)
 * in IndexedDB so they're available offline. Device-only, no backend, no sharing.
 */
export function Documents() {
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listDocs(trip.id)
      .then(setDocs)
      .catch(() => setError(true));
  }, []);

  function refresh() {
    listDocs(trip.id)
      .then(setDocs)
      .catch(() => setError(true));
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await addDoc({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          tripId: trip.id,
          name: file.name,
          type: file.type || 'application/octet-stream',
          blob: file,
          addedAt: Date.now(),
        });
      }
      refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function view(id: string) {
    try {
      const rec = await getDoc(id);
      if (!rec) return;
      const url = URL.createObjectURL(rec.blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError(true);
    }
  }

  async function remove(id: string) {
    try {
      await deleteDoc(id);
      refresh();
    } catch {
      setError(true);
    }
  }

  return (
    <div>
      <PageHeader title="Documentos" />
      <div className="space-y-5 p-5 pt-2">
        <div className="card flex gap-3 bg-amber-50 p-4">
          <InfoIcon width={20} height={20} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm text-ink-700">
            Copia cómoda y <strong>offline</strong> de tus documentos (pasaporte, visado, seguro…),
            guardada solo en este móvil. Lleva siempre los originales: el navegador puede borrar
            estos archivos.
          </p>
        </div>

        <input
          ref={inputRef}
          id="doc-input"
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={(e) => void onFiles(e.target.files)}
          className="hidden"
        />
        <label
          htmlFor="doc-input"
          className="tap flex w-full cursor-pointer items-center justify-center gap-2 rounded-pill bg-brand-600 py-3 font-semibold text-white active:scale-[0.99]"
        >
          <PlusIcon width={20} height={20} /> {busy ? 'Guardando…' : 'Añadir documento'}
        </label>

        {error && (
          <p className="text-center text-sm text-red-600">
            No se pudo acceder al almacenamiento de este dispositivo.
          </p>
        )}

        {docs.length > 0
          ? (
            <ul className="space-y-2">
              {docs.map((d) => (
                <li key={d.id} className="card flex items-center gap-3 p-4">
                  <FileIcon width={22} height={22} className="shrink-0 text-brand-600" />
                  <button
                    type="button"
                    onClick={() => void view(d.id)}
                    className="tap min-w-0 flex-1 truncate text-left font-semibold text-ink-900"
                  >
                    {d.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(d.id)}
                    aria-label={`Eliminar ${d.name}`}
                    className="tap flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-400 active:bg-sand-100 active:text-ink-700"
                  >
                    <CloseIcon width={18} height={18} />
                  </button>
                </li>
              ))}
            </ul>
          )
          : !error && <p className="text-center text-ink-400">Aún no has añadido documentos.</p>}
      </div>
    </div>
  );
}
