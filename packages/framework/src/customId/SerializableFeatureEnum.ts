export const SerializableFeatureEnum = {
  Command: 1,
  Session: 2,
} as const;

export type SerializableFeature =
  (typeof SerializableFeatureEnum)[keyof typeof SerializableFeatureEnum];
