import axios from "axios";
import { store } from "redux/store";

var token = store.getState().auth.accessToken;
var headers = {
  Authorization: token,
};

export const getV2Measurements = async (params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/measurement`,
    params,
  });
};
export const getV2Measurement = async (id, params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/measurement/${id}`,
    params,
  });
};
export const deleteV2Measurement = async (id) => {
  return await axios.request({
    method: "delete",
    headers,
    url: `${process.env.REACT_APP_URL2}/measurement/${id}`,
  });
};
export const postV2Measurement = async (data, params) => {
  return await axios.request({
    method: "post",
    headers,
    url: `${process.env.REACT_APP_URL2}/measurement`,
    data,
    params,
  });
};
export const updateV2Measurement = async (id, data, params) => {
  return await axios.request({
    method: "put",
    headers,
    url: `${process.env.REACT_APP_URL2}/measurement/${id}`,
    data,
    params,
  });
};
