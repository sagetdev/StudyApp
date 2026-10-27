import { palette, type AppColors } from '@/constants/design';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Palette de l'app selon le thème système (clair ou sombre). */
export function useColors(): AppColors {
  return useColorScheme() === 'dark' ? palette.dark : palette.light;
}
