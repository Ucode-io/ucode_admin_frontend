import { CHANGE_LANGUAGE } from '../constants'

const INITIAL_STATE = {
  language: 'ru',
}

export default function systemReducer(state = INITIAL_STATE, { payload, type }) {
  switch (type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        language: payload,
      }
    default:
      return state
  }
}
