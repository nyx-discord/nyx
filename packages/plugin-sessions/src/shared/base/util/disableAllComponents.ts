import { ComponentType } from 'discord-api-types/v10';
import type { APIMessageTopLevelComponent } from 'discord-api-types/v10';

/** Utility function to disable all interactive components in the provided array. */
export function disableAllComponents(
  components: APIMessageTopLevelComponent[],
): APIMessageTopLevelComponent[] {
  return components.map(disableComponent);
}

function disableComponent<T extends APIMessageTopLevelComponent>(
  component: T,
): T {
  switch (component.type) {
    case ComponentType.ActionRow:
      return {
        ...component,
        components: component.components.map((child) => ({
          ...child,
          disabled: true,
        })),
      } as T;
    case ComponentType.Container:
      return {
        ...component,
        components: component.components.map((child) =>
          disableComponent(child),
        ),
      } as T;
    case ComponentType.Section: {
      const accessory =
        component.accessory.type === ComponentType.Thumbnail
          ? component.accessory
          : { ...component.accessory, disabled: true };
      return { ...component, accessory } as T;
    }
    default:
      return component;
  }
}
