/**
 * MBOA FLIX brand-specific design constants.
 * Use these for elements that should always carry the brand identity
 * regardless of the device color scheme.
 */

export const THEME = {
  // Brand colors
  gold: '#D4AF37',
  goldLight: '#F0C040',
  goldDark: '#B8962E',
  red: '#C62828',
  redLight: '#E53935',
  orange: '#E65100',
  orangeLight: '#FF6D00',

  // Surfaces
  background: '#0A0A0A',
  surface: '#141414',
  card: '#1C1C1C',
  cardElevated: '#242424',
  cardBorder: '#2A2A2A',

  // Overlays
  overlay: 'rgba(0,0,0,0.78)',
  overlayMid: 'rgba(0,0,0,0.55)',
  overlayLight: 'rgba(0,0,0,0.35)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  textMuted: '#777777',

  // Genre badge colors
  genreColors: {
    Drama: '#1565C0',
    Comedy: '#2E7D32',
    Thriller: '#6A1B9A',
    Documentary: '#E65100',
    Action: '#C62828',
    Romance: '#AD1457',
    Cultural: '#D4AF37',
    Classic: '#546E7A',
  } as Record<string, string>,
} as const;
