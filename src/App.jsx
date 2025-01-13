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
  "[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-074442}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{28 February 2025}____[v3]_[0102]_MTc0MDcwMDgwMDAwMA==bb2688d270ed69f72a8ba59760c71424"
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
