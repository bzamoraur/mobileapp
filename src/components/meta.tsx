import type { ComponentType, SVGProps } from 'react';
import type { Activity, PlaceCategory } from '@/data/schema';
import {
  BalloonIcon,
  BinocularsIcon,
  LandmarkIcon,
  MarketIcon,
  MountainIcon,
  PawIcon,
  PinIcon,
  PlaneIcon,
  SparkleIcon,
  TreeIcon,
  WavesIcon,
} from './icons';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const placeCategoryMeta: Record<PlaceCategory, { label: string; Icon: Icon }> = {
  park: { label: 'Parques y reservas', Icon: TreeIcon },
  crater: { label: 'Cráteres', Icon: MountainIcon },
  wildlife: { label: 'Fauna', Icon: PawIcon },
  nature: { label: 'Naturaleza', Icon: TreeIcon },
  viewpoint: { label: 'Miradores', Icon: MountainIcon },
  beach: { label: 'Playas y mar', Icon: WavesIcon },
  town: { label: 'Ciudades y pueblos', Icon: PinIcon },
  historic: { label: 'Historia y patrimonio', Icon: LandmarkIcon },
  market: { label: 'Mercados', Icon: MarketIcon },
  culture: { label: 'Cultura', Icon: SparkleIcon },
  other: { label: 'Otros', Icon: PinIcon },
};

export const activityTypeMeta: Record<Activity['type'], { label: string; Icon: Icon }> = {
  safari: { label: 'Safari', Icon: BinocularsIcon },
  sightseeing: { label: 'Visita', Icon: PinIcon },
  transport: { label: 'Traslado', Icon: PinIcon },
  flight: { label: 'Vuelo', Icon: PlaneIcon },
  experience: { label: 'Experiencia', Icon: BalloonIcon },
  beach: { label: 'Playa', Icon: WavesIcon },
  culture: { label: 'Cultura', Icon: LandmarkIcon },
  free: { label: 'Libre', Icon: SparkleIcon },
};
