import { createTheme } from '@mui/material/styles';

// Define the color palette
const palette = {
  primary: {
    main: '#6200EA', // Deep purple
    light: '#9D46FF',
    dark: '#3700B3',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#B388FF', // Light purple
    light: '#E7B9FF',
    dark: '#805ACB',
    contrastText: '#000000',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F9F9FF',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
  },
  error: {
    main: '#CF6679',
  },
  success: {
    main: '#03DAC5',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
};

// Create the theme
const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 24px',
          boxShadow: '0 4px 20px 0 rgba(98, 0, 234, 0.14)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 25px 0 rgba(98, 0, 234, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            backgroundColor: palette.primary.dark,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 16px 70px rgba(98, 0, 234, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme; 