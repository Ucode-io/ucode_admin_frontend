// import storage from 'redux-persist/lib/storage'
import { persistStore } from "redux-persist"
import { applyMiddleware, createStore } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import rootReducer from "./reducers/index"
import thunk from "redux-thunk"

// const persistConfig = {
//   key: 'dashboard',
//   storage,
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export const persistor = persistStore(store)
