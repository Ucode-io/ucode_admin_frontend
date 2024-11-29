import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {PersistGate} from "redux-persist/integration/react";
import AlertProvider from "./providers/AlertProvider";
import GlobalFunctionsProvider from "./providers/GlobalFunctionsProvider";
import MaterialUIProvider from "./providers/MaterialUIProvider";
import Router from "./router";
import {persistor, store} from "./store";
import "./i18next";
import {Suspense} from "react";
import {QueryClientProvider} from "react-query";
import queryClient from "./queries";
import {ReactQueryDevtools} from "react-query/devtools";
import {AliveScope} from "react-activation";
import {GoogleOAuthProvider} from "@react-oauth/google";

function App() {
  return (
    <Suspense fallback="Loading...">
      <div className="App">
        <GoogleOAuthProvider clientId="471439990521-hfd3oreqct00ittfsmv4f2n07bab93bf.apps.googleusercontent.com">
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <MaterialUIProvider>
                  <AlertProvider>
                    <GlobalFunctionsProvider />
                    <BrowserRouter>
                      <AliveScope>
                        <Router />
                      </AliveScope>
                    </BrowserRouter>
                  </AlertProvider>
                </MaterialUIProvider>
              </PersistGate>
            </Provider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </div>
    </Suspense>
  );
}

export default App;
