
const INITIAL_STATE = {
   current: 'ru'
}

export default function langReducer(state = INITIAL_STATE, { payload, type }) {
  switch (type) {
    case 'SET_LANG':
      return {
        ...state,
        current: payload,
      }
    default:
      return state
  }
}
