import axios from "axios";
import { store } from "redux/store";

var token = store.getState().auth.accessToken;
var headers = {
  Authorization: token,
};

export const getV2Tags = async (params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/tag`,
    params,
  });
};
export const getV2Tag = async (id, params) => {
  return await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/tag/${id}`,
    params,
  });
};
export const deleteV2Tag = async (id) => {
  return await axios.request({
    method: "delete",
    headers,
    url: `${process.env.REACT_APP_URL2}/tag/${id}`,
  });
};
export const postV2Tag = async (data, params) => {
  return await axios.request({
    method: "post",
    headers,
    url: `${process.env.REACT_APP_URL2}/tag`,
    data,
    params,
  });
};
export const updateV2Tag = async (id, data, params) => {
  return await axios.request({
    method: "put",
    headers,
    url: `${process.env.REACT_APP_URL2}/tag/${id}`,
    data,
    params,
  });
};
