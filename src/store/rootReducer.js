import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import { alertReducer } from "./alert/alert.slice";
import { authReducer } from "./auth/auth.slice";
import storage from "redux-persist/lib/storage"
import { contructorTableReducer } from "./contructorTable/contructorTable.slice";


const authPersistConfig = {
  key: "auth",
  storage,
}

const contructorTablePersistConfig = {
  key: "contructorTable",
  storage,
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  contructorTable: persistReducer(contructorTablePersistConfig, contructorTableReducer),
  alert: alertReducer,
})

export default rootReducer