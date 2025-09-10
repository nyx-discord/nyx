import { ColorMode } from '../color/ColorMode';

export type Actor<ActorIds extends string> = {
  label: React.ReactNode;
  id: ActorIds;
  color: `#${string}` | Record<ColorMode, `#${string}`>;
};
