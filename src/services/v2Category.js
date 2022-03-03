import axios from "axios";
import { store } from "redux/store";

var token = store.getState().auth.accessToken;
var headers = {
  Authorization: token,
};

export const getV2Categories = async (params) => {
  await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/category`,
    params,
  });
};
export const getV2Category = async (id, params) => {
  await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/category/${id}`,
    params,
  });
};
export const deleteV2Category = async (id) => {
  await axios.request({
    method: "delete",
    headers,
    url: `${process.env.REACT_APP_URL2}/category/${id}`,
  });
};
export const postV2Category = async (data, params) => {
  await axios.request({
    method: "post",
    headers,
    url: `${process.env.REACT_APP_URL2}/category`,
    data,
    params,
  });
};
export const updateV2Category = async (id, data, params) => {
  await axios.request({
    method: "put",
    headers,
    url: `${process.env.REACT_APP_URL2}/category/${id}`,
    data,
    params,
  });
};
