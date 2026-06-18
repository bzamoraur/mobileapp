/**
 * Tiny IndexedDB store for the on-device documents vault (images / PDFs).
 *
 * Files are kept as Blobs in IndexedDB so they work fully offline and never
 * leave the device — there is no backend. This is a convenience copy, not a
 * backup: browsers can evict this storage, so originals must always be carried.
 */
const DB_NAME = 'viaje';
const STORE = 'docs';

export type DocRecord = {
  id: string;
  tripId: string;
  name: string;
  type: string;
  blob: Blob;
  addedAt: number;
};

/** Metadata only (no Blob) — what the list view needs. */
export type DocMeta = Omit<DocRecord, 'blob'>;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
      }),
  );
}

export async function addDoc(record: DocRecord): Promise<void> {
  await run('readwrite', (s) => s.put(record));
}

export async function deleteDoc(id: string): Promise<void> {
  await run('readwrite', (s) => s.delete(id));
}

export async function getDoc(id: string): Promise<DocRecord | undefined> {
  return run<DocRecord | undefined>('readonly', (s) => s.get(id));
}

export async function listDocs(tripId: string): Promise<DocMeta[]> {
  const all = await run<DocRecord[]>('readonly', (s) => s.getAll());
  return all
    .filter((d) => d.tripId === tripId)
    .sort((a, b) => b.addedAt - a.addedAt)
    .map((d) => ({ id: d.id, tripId: d.tripId, name: d.name, type: d.type, addedAt: d.addedAt }));
}
