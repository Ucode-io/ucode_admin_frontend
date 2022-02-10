import { MENU_KEY } from '../constants'

const INITIAL_STATE = {
    menu_key: ['1'],
}

export default function basicReducer(state = INITIAL_STATE, { payload, type }) {
    switch (type) {
        case MENU_KEY:
            return {
                ...state,
                menu_key: payload,
            }
        default:
            return state
    }
}
