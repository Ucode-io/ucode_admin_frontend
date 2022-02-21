import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";

import authReducer from "./authReducer";
import alertReducer from "./alertReducer";
import systemReducer from "./systemReducer";
import langReducer from "./langReducer";

const authPersistConfig = {
  key: "auth",
  storage,
};

const langPersistConfig = {
  key: "lang",
  storage,
};

var rootReducer = combineReducers({
  alert: alertReducer,
  system: systemReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  lang: persistReducer(langPersistConfig, langReducer),
});

export default rootReducer;
