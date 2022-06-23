import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import { alertReducer } from "./alert/alert.slice";
import { authReducer } from "./auth/auth.slice";
import storage from "redux-persist/lib/storage"
import { constructorTableReducer } from "./constructorTable/constructorTable.slice";
import { tableColumnReducer } from "./tableColumn/tableColumn.slice";
import { tabRouterReducer } from "./tabRouter/tabRouter.slice";
import { applicationReducer } from "./application/application.slice";

const authPersistConfig = {
  key: "auth",
  storage,
}

const constructorTablePersistConfig = {
  key: "constructorTable",
  storage,
}

const applicationPersistConfig = {
  key: "application",
  storage
}

const tableColumnTablePersistConfig = {
  key: "tableColumn",
  storage,
}

const tabRouterPersistConfig = {
  key: "tabRoute",
  storage,
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  constructorTable: persistReducer(constructorTablePersistConfig, constructorTableReducer),
  application: persistReducer(applicationPersistConfig, applicationReducer),
  tableColumn: persistReducer(tableColumnTablePersistConfig, tableColumnReducer),
  tabRouter: persistReducer(tabRouterPersistConfig, tabRouterReducer),
  // tabRouter: tabRouterReducer,
  alert: alertReducer,
})

export default rootReducer