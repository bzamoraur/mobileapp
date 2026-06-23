/**
 * Content QA gate: runs the heuristics in src/lib/contentQa on the active trip.
 * Complements `validate:trip` (schema). Errors fail the build (exit 1); warnings
 * are advisory. Run: `npm run qa:content`.
 */
import { trip } from '../src/data/index';
import { contentQa } from '../src/lib/contentQa';

const { errors, warnings } = contentQa(trip);

if (trip.id === 'nuevo-viaje') {
  console.log('ℹ Blank template (id "nuevo-viaje") — run the generator/import to fill it.');
}
for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);

if (errors.length > 0) {
  console.error(`\nContent QA failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(
  `\n✓ Content QA passed${warnings.length ? ` (${warnings.length} warning(s))` : ''}: "${trip.title}".`,
);
