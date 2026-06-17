import type { Tag as TagModel, TagKind } from '@/data/schema';
import { cn } from '@/lib/cn';

const STYLES: Record<TagKind, string> = {
  transfer: 'bg-brand-50 text-brand-700',
  freeDay: 'bg-emerald-50 text-emerald-700',
  family: 'bg-violet-50 text-violet-700',
  flight: 'bg-sky-50 text-sky-700',
  important: 'bg-amber-50 text-amber-700',
  mealIncluded: 'bg-amber-50 text-amber-700',
  organized: 'bg-indigo-50 text-indigo-700',
  optional: 'bg-slate-100 text-ink-700',
  info: 'bg-slate-100 text-ink-700',
};

export function Tag({ tag }: { tag: TagModel }) {
  return <span className={cn('pill', STYLES[tag.kind])}>{tag.label}</span>;
}

export function TagRow({ tags }: { tags: TagModel[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t, i) => (
        <Tag key={`${t.kind}-${t.label}-${i}`} tag={t} />
      ))}
    </div>
  );
}
