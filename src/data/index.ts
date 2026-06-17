import { tripSchema, type Trip } from './schema';
import { trip as activeTrip } from './trip';

/**
 * Loads and validates the active trip. Validation runs once at module load so any
 * schema violation throws immediately and visibly rather than corrupting the UI.
 */
function loadTrip(): Trip {
  const result = tripSchema.safeParse(activeTrip);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`El plan de viaje no es válido:\n${issues}`);
  }
  return result.data;
}

export const trip: Trip = loadTrip();

export * from './schema';
