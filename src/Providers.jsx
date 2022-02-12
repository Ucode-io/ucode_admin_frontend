import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@material-ui/core/styles";
import theme from "theme";
import palette from "theme/palette";

const GlobalStyle = createGlobalStyle`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
`;
function Providers({ pageProps, children }) {
  const muiTheme = createTheme({
    palette,
    typography: {
      fontFamily: `'Inter', sans-serif`,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 1200,
        xl: 1440,
      },
    },
  });
  return (
    <Provider store={store}>
      <StylesProvider injectFirst>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <MuiThemeProvider theme={muiTheme}>
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </MuiThemeProvider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  );
}

export default Providers;
