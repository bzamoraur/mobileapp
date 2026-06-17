import { tripSchema, type Trip } from './schema';
import { sampleTrip } from './trip.sample';

/**
 * Loads and validates the active trip.
 *
 * Until the real plan is generated into `trip.ts`, we use the sample trip. When
 * `trip.ts` exists it should `export const trip: Trip` and this file will import
 * it instead. Validation runs once at module load so any schema violation throws
 * immediately and visibly rather than corrupting the UI.
 */
function loadTrip(): Trip {
  const raw: unknown = sampleTrip;
  const result = tripSchema.safeParse(raw);
  if (!result.success) {
    // Surface a readable error in dev/build; the app must not boot with bad data.
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`El plan de viaje no es válido:\n${issues}`);
  }
  return result.data;
}

export const trip: Trip = loadTrip();

export * from './schema';
