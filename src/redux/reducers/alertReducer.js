import {
  ADD_NEW_ALERT,
  DELETE_ALERT,
  SET_GLOBAL_ALERT,
  SET_GLOBAL_ALERT_HEIGHT,
} from "../constants";

export default function alertReducer(
  state = {
    alerts: [],
    globalAlert: null,
    globalAlertHeight: 0,
  },
  { type, payload },
) {
  switch (type) {
    case ADD_NEW_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, { ...payload }],
      };

    case DELETE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== payload),
      };

    case SET_GLOBAL_ALERT:
      return {
        ...state,
        globalAlert: payload,
      };

    case SET_GLOBAL_ALERT_HEIGHT:
      return {
        ...state,
        globalAlertHeight: payload,
      };

    default:
      return state;
  }
}
