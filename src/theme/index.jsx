import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import shape from './shape';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';
import { selectThemeMode } from '../store/theme/theme.slice';

ThemeConfig.propTypes = {
  children: PropTypes.node
};

export default function ThemeConfig({ children }) {
  const themeMode = useSelector(selectThemeMode);
  const isLight = themeMode === 'light';

  // Apply theme attribute to document for CSS dark mode styles
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.body.style.backgroundColor = isLight ? '#ffffff' : '#161C24';
    document.body.style.color = isLight ? '#212B36' : '#ffffff';
  }, [themeMode, isLight]);

  const themeOptions = useMemo(
    () => (
      {
        palette: isLight
          ? { ...palette.light, mode: 'light' }
          : { ...palette.dark, mode: 'dark' },
        shape,
        typography,
        breakpoints,
        direction: 'left',
        shadows: isLight ? shadows.light : shadows.dark,
        customShadows: isLight ? customShadows.light : customShadows.dark
      }
    ),
    [isLight]
  );

  const theme = createTheme(themeOptions, ruRU);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
