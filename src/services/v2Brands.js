import axios from "axios";
import { store } from "redux/store";

var token = store.getState().auth.accessToken;
var headers = {
  Authorization: token,
};

export const getV2Brands = async (params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/brand`,
    params,
  });
};
export const getV2Brand = async (id, params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/brand/${id}`,
    params,
  });
};
export const deleteV2Brand = async (id) => {
  return await axios.request({
    method: "delete",
    headers,
    url: `${process.env.REACT_APP_URL2}/brand/${id}`,
  });
};
export const postV2Brand = async (data, params) => {
  return await axios.request({
    method: "post",
    headers,
    url: `${process.env.REACT_APP_URL2}/brand`,
    data,
    params,
  });
};
export const updateV2Brand = async (id, data, params) => {
  return await axios.request({
    method: "put",
    headers,
    url: `${process.env.REACT_APP_URL2}/brand/${id}`,
    data,
    params,
  });
};
