import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#d0652b',
    },
    secondary: {
      main: '#e65400',
    },
  },
});

theme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#2a1002',
    },
    secondary: {
      main: '#4500e6',
    },
    mode: 'dark',
  },
});

export default theme;