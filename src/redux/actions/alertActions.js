import axios from "utils/axios";

import {
  ADD_NEW_ALERT,
  DELETE_ALERT,
  SET_GLOBAL_ALERT,
  SET_GLOBAL_ALERT_HEIGHT,
} from "../constants";

let id = 1;

export const addAlert = (title, type, id) => ({
  type: ADD_NEW_ALERT,
  payload: { title, type, id },
});

export const deleteAlert = (id) => ({ type: DELETE_ALERT, payload: id });

export const setGlobalAlert = (alert) => ({
  type: SET_GLOBAL_ALERT,
  payload: alert,
});

export const setGlobalAlertHeight = (height) => ({
  type: SET_GLOBAL_ALERT_HEIGHT,
  payload: height,
});

export const showAlert = (title, type = "error") => {
  return (dispatch) => {
    const _id = id;
    dispatch(addAlert(title, type, _id));
    setTimeout(() => {
      dispatch(deleteAlert(_id));
    }, 4000);
    id++;
  };
};

export const fetchAnnouncement = () => {
  return (dispatch) => {
    axios.get("/announcement").then((res) => {
      if (!res?.announcements?.[0]?.status) return null;
      dispatch(setGlobalAlert(res?.announcements[0]));
    });
  };
};
