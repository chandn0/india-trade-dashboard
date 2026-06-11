import { createTheme } from '@mui/material/styles';

export const fontSans =
  '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const fontMono =
  '"IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
// Editorial display serif for titles only (body/UI stays fontSans).
export const fontDisplay =
  '"Fraunces", "Iowan Old Style", Georgia, "Times New Roman", serif';

// Monospace numeric style — reuse anywhere figures are shown so columns align.
export const mono = {
  fontFamily: fontMono,
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" 1, "cv01" 1',
  letterSpacing: '-0.01em',
};

// Shared accent palette used by charts and tone-keyed components.
export const C = {
  blue: '#2563eb', // exports
  blueDeep: '#1e40af',
  orange: '#ea670e', // imports
  teal: '#0d9488', // balance / positive
  red: '#e11d48', // deficit / negative
  purple: '#7c3aed', // year-to-date highlight
  slate: '#64748b',
  grid: '#e8edf4',
  ink: '#0b1220', // dark app bar
  inkSoft: '#111a2e',
};

export const toneColor = (tone) =>
  ({ primary: C.blue, warning: C.orange, success: C.teal, accent: C.purple, danger: C.red }[tone] || C.blue);

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: C.blue },
    secondary: { main: C.purple },
    success: { main: C.teal },
    warning: { main: C.orange },
    error: { main: C.red },
    background: { default: '#f0eee6', paper: '#faf9f5' },
    text: { primary: '#0c1730', secondary: '#5a6a85' },
    divider: '#e6ebf3',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: fontSans,
    // Titles use Fraunces (display serif); browser optical sizing makes larger sizes higher-contrast.
    // Tracking is relaxed vs the old Inter headings — serifs read better without tight negative spacing.
    h1: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontFamily: fontDisplay, fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontFamily: fontDisplay, fontWeight: 700, letterSpacing: '-0.005em' },
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
        root: { textTransform: 'none', borderRadius: 9, fontWeight: 700 },
        sizeSmall: { paddingTop: 5, paddingBottom: 5 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 7, fontWeight: 700, letterSpacing: '-0.005em' },
        sizeSmall: { height: 22 },
        label: { paddingLeft: 8, paddingRight: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#edf1f7',
          paddingTop: 9,
          paddingBottom: 9,
        },
        head: {
          fontWeight: 800,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#64748b',
          background: '#f7f9fc',
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
