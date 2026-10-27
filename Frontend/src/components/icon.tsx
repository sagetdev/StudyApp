import { Text, type ColorValue, type TextStyle } from 'react-native';

/**
 * Point d'entrée unique des icônes. Les glyphes sont centralisés ici : pour passer à une
 * vraie bibliothèque d'icônes (ex. @expo/vector-icons), il suffit de modifier ce fichier.
 */
const glyphs = {
  home: '⌂', explore: '✧', profile: '◉', cards: '▤', quiz: '✓', glossary: 'Aa', recall: '↗',
  exam: '✎', notes: '✎', progress: '↗', ranking: '♛', settings: '⚙', book: '▤', spark: '✦',
  clock: '◷', back: '‹', next: '›', check: '✓', cross: '✕', trash: '⌫', help: '?', science: '⌁', math: '∑', history: '◷',
} as const;

export type IconName = keyof typeof glyphs;

export function Icon({ name, color, size = 20, style }: { name: IconName; color: ColorValue; size?: number; style?: TextStyle }) {
  return <Text accessible={false} importantForAccessibility="no" style={[{ color, fontSize: size, lineHeight: size * 1.2, fontWeight: '700', textAlign: 'center' }, style]}>{glyphs[name]}</Text>;
}
