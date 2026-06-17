import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11l8-7 8 7" />
    <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
  </svg>
);

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
  </svg>
);

export const MapIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13L15 6.5l-6-2Z" />
    <path d="M9 4.5v13M15 6.5v13" />
  </svg>
);

export const ChatIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V16.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
  </svg>
);

export const LifebuoyIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="m5.8 5.8 3.8 3.8M14.4 14.4l3.8 3.8M18.2 5.8l-3.8 3.8M9.6 14.4l-3.8 3.8" />
  </svg>
);

export const PinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5h.01" />
  </svg>
);

export const PlaneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10.5 13.5 4 15l-1-2 5.5-3.2-1-5.3 1.8-.8 2.7 4.8 5.2-3c.9-.5 2 .6 1.5 1.5l-3 5.2 4.8 2.7-.8 1.8-5.3-1L13.5 17l-2-1 1-2.5Z" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 19 6v5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6l7-2.5Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const SpeakerIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
    <path d="M15.5 9a4 4 0 0 1 0 6M17.8 6.5a7 7 0 0 1 0 11" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** Star outline; pass `fill="currentColor"` to render it filled. */
export const StarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5l2.6 5.3 5.9.86-4.25 4.14 1 5.87L12 17l-5.25 2.74 1-5.87L3.5 9.66l5.9-.86L12 3.5Z" />
  </svg>
);

export const PencilIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
    <path d="m13.5 6.5 4 4" />
  </svg>
);

export const WalletIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17a1 1 0 0 1 1 1v1.5" />
    <rect x="3.5" y="7.5" width="17" height="11" rx="2.5" />
    <circle cx="16.5" cy="13" r="1.2" />
  </svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const BedIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 8v9M3 12h18v5M21 12v-1a3 3 0 0 0-3-3H9v4" />
  </svg>
);

export const CopyIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const GlobeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

export const BinocularsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 5h3l1 3M18 5h-3l-1 3M10 8h4" />
    <path d="M9 8 6.5 18a2.5 2.5 0 1 1-4.4-2L5 8.5A1.5 1.5 0 0 1 6.4 7.5H9Z" />
    <path d="M15 8l2.5 10a2.5 2.5 0 1 0 4.4-2L19 8.5A1.5 1.5 0 0 0 17.6 7.5H15Z" />
  </svg>
);

export const PawIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <ellipse cx="7" cy="9.5" rx="1.4" ry="1.9" />
    <ellipse cx="12" cy="8" rx="1.4" ry="2" />
    <ellipse cx="17" cy="9.5" rx="1.4" ry="1.9" />
    <path d="M12 12c-2.6 0-4.5 2-4.5 4 0 1.6 1.4 2.3 2.6 1.8 1.2-.5 2.6-.5 3.8 0 1.2.5 2.6-.2 2.6-1.8 0-2-1.9-4-4.5-4Z" />
  </svg>
);

export const MountainIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m3 19 6-11 4 7 2-3 6 7H3Z" />
    <path d="m9 8 1.5 2.7" />
  </svg>
);

export const TreeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4c-3 0-5 2.2-5 4.5 0 1 .4 1.8 1 2.4-1 .6-1.7 1.6-1.7 2.8C6.3 16 8 17.5 12 17.5s5.7-1.5 5.7-3.8c0-1.2-.7-2.2-1.7-2.8.6-.6 1-1.4 1-2.4C17 6.2 15 4 12 4Z" />
    <path d="M12 17.5V21" />
  </svg>
);

export const WavesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2 7c2 0 2 1.6 4 1.6S8 7 10 7s2 1.6 4 1.6S16 7 18 7s2 1.6 4 1.6" />
    <path d="M2 12c2 0 2 1.6 4 1.6S8 12 10 12s2 1.6 4 1.6S16 12 18 12s2 1.6 4 1.6" />
    <path d="M2 17c2 0 2 1.6 4 1.6S8 17 10 17s2 1.6 4 1.6S16 17 18 17s2 1.6 4 1.6" />
  </svg>
);

export const LandmarkIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 10h16M5 10v8M19 10v8M9 10v8M15 10v8M3 18h18M12 3 4 7h16l-8-4Z" />
  </svg>
);

export const MarketIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9h16l-1 11H5L4 9Z" />
    <path d="M8 9V6a4 4 0 0 1 8 0v3" />
  </svg>
);

export const BalloonIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3a7 7 0 0 1 7 7c0 4-3.5 6.5-5.5 7.2h-3C8.5 16.5 5 14 5 10a7 7 0 0 1 7-7Z" />
    <path d="M10 17.2h4l-.6 2.3a1 1 0 0 1-1 .8h-.8a1 1 0 0 1-1-.8L10 17.2Z" />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
  </svg>
);

export const SunsetIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 18h18M5.5 18a6.5 6.5 0 0 1 13 0M12 3v3M5 7l1.5 1.5M19 7l-1.5 1.5M2 14h2M20 14h2" />
  </svg>
);
