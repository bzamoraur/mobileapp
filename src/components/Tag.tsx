import type { Tag as TagModel, TagKind } from '@/data/schema';
import { cn } from '@/lib/cn';

const STYLES: Record<TagKind, string> = {
  flight: 'bg-sky-100 text-sky-800',
  transfer: 'bg-sand-200 text-ink-700',
  safari: 'bg-moss-500/15 text-moss-700',
  freeDay: 'bg-emerald-100 text-emerald-800',
  family: 'bg-violet-100 text-violet-800',
  important: 'bg-amber-100 text-amber-800',
  mealIncluded: 'bg-amber-100/70 text-amber-800',
  beach: 'bg-cyan-100 text-cyan-800',
  culture: 'bg-rose-100 text-rose-800',
  experience: 'bg-brand-100 text-brand-700',
  optional: 'bg-sand-200 text-ink-600',
  info: 'bg-sand-200 text-ink-700',
};

export function Tag({ tag }: { tag: TagModel }) {
  return <span className={cn('pill', STYLES[tag.kind])}>{tag.label}</span>;
}

export function TagRow({ tags }: { tags: TagModel[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t, i) => (
        <Tag key={`${t.kind}-${t.label}-${i}`} tag={t} />
      ))}
    </div>
  );
}
