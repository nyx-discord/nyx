export type Step<ActorId extends string = string> = {
  label: React.ReactNode;
  to: ActorId;
  tooltip?: React.ReactNode;
  animated?: boolean;
  offset?: number;
};
