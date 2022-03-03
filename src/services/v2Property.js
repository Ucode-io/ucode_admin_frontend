import axios from "axios";
import { store } from "redux/store";

var token = store.getState().auth.accessToken;
var headers = {
  Authorization: token,
};

export const getV2Properties = async (params) => {
  await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group`,
    params,
  });
};
export const getV2Property = async (id, params) => {
  await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group/${id}`,
    params,
  });
};
export const deleteV2Property = async (id) => {
  await axios.request({
    method: "delete",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group/${id}`,
  });
};
export const postV2Property = async (data, params) => {
  await axios.request({
    method: "post",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group`,
    data,
    params,
  });
};
export const updateV2Property = async (id, data, params) => {
  await axios.request({
    method: "put",
    headers,
    url: `${process.env.REACT_APP_URL2}/property-group/${id}`,
    data,
    params,
  });
};
