import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'

import authReducer from './authReducer'
import basicReducer from './basicReducer'
import alertReducer from './alertReducer'
import systemReducer from './systemReducer'
import langReducer from './langReducer'

const authPersistConfig = {
  key: 'auth',
  storage,
}

const langPersistConfig = {
  key: 'lang',
  storage,
}

const rootReducer = combineReducers({
  alert: alertReducer,
  basics: basicReducer,
  system: systemReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  lang: persistReducer(langPersistConfig, langReducer),
})

export default rootReducer
