import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import { alertReducer } from "./alert/alert.slice";
import { authReducer } from "./auth/auth.slice";
import storage from "redux-persist/lib/storage"
import { constructorTableReducer } from "./constructorTable/constructorTable.slice";
import { tableColumnReducer } from "./tableColumn/tableColumn.slice";


const authPersistConfig = {
  key: "auth",
  storage,
}

const constructorTablePersistConfig = {
  key: "constructorTable",
  storage,
}

const tableColumnTablePersistConfig = {
  key: "tableColumn",
  storage,
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  constructorTable: persistReducer(constructorTablePersistConfig, constructorTableReducer),
  tableColumn: persistReducer(tableColumnTablePersistConfig, tableColumnReducer),
  alert: alertReducer,
})

export default rootReducer