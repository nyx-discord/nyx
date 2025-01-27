import type {
  ActionRowBuilder,
  ActionRowComponentData,
  ActionRowData,
  AnyComponentBuilder,
  ComponentType,
} from 'discord.js';

import type { ActionRowWrapper } from './ActionRowWrapper';
import type { ExtractTypeFromComponentData } from './ExtractTypeFromComponentData';

/** Finds the respective builder for a {@link ComponentType}. */
type BuilderOfType<Component extends ComponentType> = Extract<
  AnyComponentBuilder,
  { toJSON(): { type: Component } }
>;

/**
 * Union of types that can be assigned to an action row containing a given component data.
 * Either:
 * - {@link ActionRowBuilder} with component builders of the corresponding type.
 * - {@link ActionRowData} with the passed component data.
 * - {@link ActionRowWrapper} with the passed component data.
 */
export type RowAssignable<ComponentData extends ActionRowComponentData> =
  | ActionRowBuilder<BuilderOfType<ExtractTypeFromComponentData<ComponentData>>>
  | ActionRowData<ComponentData>
  | ActionRowWrapper<ComponentData>;
