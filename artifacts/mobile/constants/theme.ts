export const THEME = {
  // Brand
  gold: '#D8B25C',
  goldLight: '#F3D58A',
  goldDark: '#A87D2C',

  red: '#D52B35',
  redLight: '#F04B55',

  orange: '#E86A24',
  orangeLight: '#FF8A3D',

  // Backgrounds
  background: '#050505',
  backgroundSoft: '#090909',
  surface: '#111111',
  surfaceSoft: '#171717',

  card: '#151515',
  cardElevated: '#1C1C1C',
  cardBorder: 'rgba(255,255,255,0.08)',

  // Glass
  glass: 'rgba(20,20,20,0.58)',
  glassStrong: 'rgba(15,15,15,0.76)',
  glassLight: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassBorderStrong: 'rgba(255,255,255,0.22)',
  glassHighlight: 'rgba(255,255,255,0.18)',

  // Overlays
  overlay: 'rgba(0,0,0,0.82)',
  overlayMid: 'rgba(0,0,0,0.58)',
  overlayLight: 'rgba(0,0,0,0.30)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#C7C7C7',
  textMuted: '#858585',

  // Radius
  radiusSm: 10,
  radiusMd: 16,
  radiusLg: 24,
  radiusXL: 32,

  genreColors: {
    Drama: '#3566D6',
    Comedy: '#34A853',
    Thriller: '#8E44AD',
    Documentary: '#E86A24',
    Action: '#D52B35',
    Romance: '#D84D86',
    Cultural: '#D8B25C',
    Classic: '#607D8B',
  } as Record<string, string>,
} as const;