import type { ColorMode } from '@docusaurus/theme-common';

export type Actor<ActorIds extends string> = {
  label: React.ReactNode;
  id: ActorIds;
  color: `#${string}` | Record<ColorMode, `#${string}`>;
};
