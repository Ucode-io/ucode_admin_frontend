import { CHANGE_LANGUAGE } from '../constants'

export const changeLanguage = (lang) => ({
  type: CHANGE_LANGUAGE,
  payload: lang,
})
