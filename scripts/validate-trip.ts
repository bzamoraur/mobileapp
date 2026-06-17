/**
 * Standalone trip validation, runnable in CI: `npm run validate:trip`.
 * Importing the data module triggers schema validation (it throws on failure),
 * so a malformed plan fails the build before it can ship.
 */
import { trip } from '../src/data/index';

console.log(
  `✓ Plan válido: "${trip.title}" — ${trip.days.length} días, ${trip.places.length} lugares, ${trip.accommodations.length} alojamientos.`,
);
