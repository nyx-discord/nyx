import {
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  ContainerBuilder,
  MappedComponentTypes,
  normalizeArray,
  RestOrArray,
  SectionBuilder,
} from 'discord.js';

/** Utility function to disable all components in the provided array. */
export function disableAllComponents(
  ...components: RestOrArray<MappedComponentTypes[keyof MappedComponentTypes]>
): void {
  const array = normalizeArray(components);
  for (const component of array) {
    if ('setDisabled' in component) {
      component.setDisabled(true);
      continue;
    }
    if (component instanceof SectionBuilder) {
      if (!(component.accessory instanceof ButtonBuilder)) continue;
      component.accessory.setDisabled(true);
      continue;
    }

    switch (component.data.type) {
      case ComponentType.Container:
        disableAllComponents((component as ContainerBuilder).components ?? []);
        break;
      case ComponentType.ActionRow:
        disableAllComponents((component as ActionRowBuilder).components ?? []);
        break;
    }
  }
}
