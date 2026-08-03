import { createTheme } from '@mui/material/styles';

export const fontSans =
  '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const fontMono =
  '"IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
// Editorial display serif for titles only (body/UI stays fontSans).
export const fontDisplay = '"Fraunces", "Iowan Old Style", Georgia, "Times New Roman", serif';

// Monospace numeric style — reuse anywhere figures are shown so columns align.
export const mono = {
  fontFamily: fontMono,
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" 1, "cv01" 1',
  letterSpacing: '-0.01em',
};

// Shared accent palette used by charts and tone-keyed components.
export const C = {
  blue: '#46698f', // exports
  blueDeep: '#334f70',
  orange: '#a86435', // imports
  teal: '#4f756d', // balance / positive
  red: '#a45159', // deficit / negative
  purple: '#756783', // year-to-date highlight
  slate: '#6b7280',
  grid: '#e2dfd7',
  ink: '#111827', // dark app bar
  inkSoft: '#1d2636',
};

// Shared layout rhythm. Use these values for page shells and groups so
// individual sections do not drift onto their own spacing scales.
export const layout = {
  pageY: { xs: 3, sm: 4, md: 5 },
  heroY: { xs: 4, sm: 5, md: 6 },
  sectionGap: { xs: 4, sm: 5, md: 6 },
  contentGap: { xs: 1.5, md: 2 },
  cardPadding: { xs: 2, sm: 2.5, md: 3 },
  sectionIntroGap: { xs: 2, md: 2.5 },
};

export const toneColor = (tone) =>
  ({ primary: C.blue, warning: C.orange, success: C.teal, accent: C.purple, danger: C.red })[
    tone
  ] || C.blue;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: C.blue },
    secondary: { main: C.purple },
    success: { main: C.teal },
    warning: { main: C.orange },
    error: { main: C.red },
    background: { default: '#f3f0e8', paper: '#fffdf9' },
    text: { primary: '#172033', secondary: '#687283' },
    divider: '#dfddd5',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: fontSans,
    // Titles use Fraunces (display serif); browser optical sizing makes larger sizes higher-contrast.
    // Tracking is relaxed vs the old Inter headings — serifs read better without tight negative spacing.
    h1: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: '-0.015em' },
    h4: {
      fontFamily: fontDisplay,
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
      lineHeight: 1.12,
      letterSpacing: '-0.01em',
    },
    h5: { fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.01em' },
    h6: {
      fontFamily: fontDisplay,
      fontWeight: 700,
      fontSize: '1.125rem',
      letterSpacing: '-0.005em',
    },
    subtitle1: { fontFamily: fontDisplay, fontWeight: 700 },
    subtitle2: { fontFamily: fontDisplay, fontWeight: 700 },
    button: { fontWeight: 700, letterSpacing: 0 },
    overline: { fontWeight: 800, letterSpacing: '0.12em' },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 6, fontWeight: 700 },
        sizeSmall: { paddingTop: 5, paddingBottom: 5 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 5, fontWeight: 700, letterSpacing: '-0.005em' },
        sizeSmall: { height: 22 },
        label: { paddingLeft: 8, paddingRight: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#ebe8e0',
          paddingTop: 9,
          paddingBottom: 9,
        },
        head: {
          fontWeight: 800,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#687283',
          background: '#f7f4ed',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width: 600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
          '@media (min-width: 1200px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
        maxWidthXl: {
          '@media (min-width: 1200px)': { maxWidth: 1320 },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: 12, fontWeight: 600, borderRadius: 8 },
      },
    },
  },
});

export default theme;
