import type {
  ActionRowComponentData,
  APIActionRowComponentTypes,
  JSONEncodable,
} from 'discord.js';

/** Extracts the {@link ComponentType} from a {@link ActionRowComponentData}. */
export type ExtractTypeFromComponentData<
  ComponentData extends ActionRowComponentData,
> = ComponentData extends JSONEncodable<APIActionRowComponentTypes>
  ? ReturnType<ComponentData['toJSON']>['type']
  : ComponentData extends Exclude<
      ActionRowComponentData,
      JSONEncodable<unknown>
    >
  ? ComponentData['type']
  : never;
