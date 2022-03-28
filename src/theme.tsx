import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { ThemeOptions, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useEffect } from 'react';
import deepmerge from 'deepmerge'
import { PaletteMode } from '@mui/material';

export const defaultThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#ba68c8',
    },
    secondary: {
      main: '#f06292',
    },
    error: {
      main: red.A400,
    },
  },
};

export const defaultTheme = createTheme(defaultThemeOptions);

export const ColorModeContext = React.createContext({ toggleColorMode: () => {}, isLight: true });

const ModeThemeProvider: React.FC = (props) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState(!prefersDark);

  // Update mode if preference updates
  useEffect(() => {
    setMode(!prefersDark);
  }, [prefersDark])

  // Create a theme instance.
  const theme = React.useMemo(() => createTheme(deepmerge(defaultThemeOptions, {
    palette: {
      mode: (mode ? 'light' : 'dark') as PaletteMode,
    }
  })), [mode]);

  const colorMode = React.useMemo(() => ({
    toggleColorMode: () => {
      setMode(prev => !prev);
    },
    isLight: mode
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        { props.children }
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ModeThemeProvider;