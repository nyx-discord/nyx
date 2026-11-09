import { useTheme } from 'next-themes';

export type ColorMode = 'dark' | 'light';

export function useColorMode(): ColorMode {
  const { theme } = useTheme();
  return theme === 'dark' ? 'dark' : 'light';
}
