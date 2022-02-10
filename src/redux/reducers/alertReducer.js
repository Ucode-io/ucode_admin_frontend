import {
  ADD_NEW_ALERT,
  DELETE_ALERT,
  SET_GLOBAL_ALERT,
  SET_GLOBAL_ALERT_HEIGHT,
} from "../constants"
import axios from "../../utils/axios"

let id = 1

const INITIAL_STATE = {
  alerts: [],
  globalAlert: null,
  globalAlertHeight: 0,
}

export default function alertReducer(state = INITIAL_STATE, { type, payload }) {
  switch (type) {
    case ADD_NEW_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, { ...payload }],
      }

    case DELETE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== payload),
      }

    case SET_GLOBAL_ALERT:
      return {
        ...state,
        globalAlert: payload,
      }

    case SET_GLOBAL_ALERT_HEIGHT:
      return {
        ...state,
        globalAlertHeight: payload,
      }

    default:
      return state
  }
}

export const addAlert = (title, type, id) => ({
  type: ADD_NEW_ALERT,
  payload: { title, type, id },
})

export const deleteAlert = (id) => ({ type: DELETE_ALERT, payload: id })

export const setGlobalAlert = (alert) => ({
  type: SET_GLOBAL_ALERT,
  payload: alert,
})

export const setGlobalAlertHeight = (height) => ({
  type: SET_GLOBAL_ALERT_HEIGHT,
  payload: height,
})

export const showAlert = (title, type = "error") => {
  return (dispatch) => {
    const _id = id
    dispatch(addAlert(title, type, _id))
    setTimeout(() => {
      dispatch(deleteAlert(_id))
    }, 4000)
    id++
  }
}

export const fetchAnnouncement = () => {
  return (dispatch) => {
    axios.get("/announcement").then((res) => {
      if (!res?.announcements?.[0]?.status) return null
      dispatch(setGlobalAlert(res?.announcements[0]))
    })
  }
}
