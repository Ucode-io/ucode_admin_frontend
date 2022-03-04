import axios from "axios";
import { store } from "redux/store";

var token = store.getState().auth.accessToken;
var headers = {
  Authorization: token,
};

export const getV2Properties = async (params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group`,
    params,
  });
};
export const getV2Property = async (id, params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group/${id}`,
    params,
  });
};
export const deleteV2Property = async (id) => {
  return await axios.request({
    method: "delete",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group/${id}`,
  });
};
export const postV2Property = async (data, params) => {
  return await axios.request({
    method: "post",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group`,
    data,
    params,
  });
};
export const updateV2Property = async (id, data, params) => {
  return await axios.request({
    method: "put",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group/${id}`,
    data,
    params,
  });
};
