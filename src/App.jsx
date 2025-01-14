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
import "ag-grid-enterprise";
import {LicenseManager} from "ag-grid-enterprise";

LicenseManager.setLicenseKey(
  "Using_this_{AG_Grid}_Enterprise_key_{AG-074911}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Ucode}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Ucode}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{Ucode}_need_to_be_licensed___{Ucode}_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{13_January_2026}____[v3]_[01]_MTc2ODI2MjQwMDAwMA==40e06c51d110edfea88371a59cf5c435"
);

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
