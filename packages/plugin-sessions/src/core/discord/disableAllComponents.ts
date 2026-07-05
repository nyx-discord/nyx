import type {
  ActionRowBuilder,
  ComponentBuilder,
  ContainerBuilder,
  RestOrArray,
  SectionBuilder,
} from 'discord.js';
import { ComponentType, normalizeArray } from 'discord.js';

/** Utility function to disable all components in the provided array. */
export function disableAllComponents(
  ...components: RestOrArray<ComponentBuilder>
): void {
  const array = normalizeArray(components);
  for (const component of array) {
    if (
      'setDisabled' in component
      && typeof component.setDisabled === 'function'
    ) {
      component.setDisabled(true);
      continue;
    }

    switch (component.data.type) {
      case ComponentType.Section: {
        const sectionBuilder = component as SectionBuilder;
        disableAllComponents(sectionBuilder.components);
        if (sectionBuilder.accessory) {
          disableAllComponents(sectionBuilder.accessory);
        }
        break;
      }
      case ComponentType.Container:
        disableAllComponents((component as ContainerBuilder).components ?? []);
        break;
      case ComponentType.ActionRow:
        disableAllComponents((component as ActionRowBuilder).components ?? []);
        break;
    }
  }
}
