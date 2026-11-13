import {
  SiCloudflareworkers,
  SiNetlify,
  SiSupabase,
  SiVercel,
} from '@icons-pack/react-simple-icons';
import { icons as lucideIcons } from 'lucide-react';
import { type ComponentType, createElement, type ReactElement } from 'react';

const brandIcons: Record<string, ComponentType<{ size?: string | number }>> = {
  SiCloudflareworkers,
  SiNetlify,
  SiSupabase,
  SiVercel,
};

/** Resolves a page's `icon` frontmatter: a lucide icon name, or one of the brand icons above. */
export function getIcon(
  name: string | undefined,
  props: { size?: string | number } = {},
): ReactElement | undefined {
  if (!name) return;

  if (name in lucideIcons) {
    return createElement(lucideIcons[name as keyof typeof lucideIcons], props);
  }

  const brandIcon = brandIcons[name];
  if (brandIcon) return createElement(brandIcon, props);
}
