import axios from "axios";
import { store } from "redux/store";

var token = store.getState().auth.accessToken;
var headers = {
  Authorization: token,
};

export const getV2Products = async (params) => {
  await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/product`,
    params,
  });
};
export const getV2Product = async (id, params) => {
  await axios.request({
    method: "get",
    headers,
    url: `${process.env.REACT_APP_URL2}/product/${id}`,
    params,
  });
};
export const deleteV2Product = async (id) => {
  await axios.request({
    method: "delete",
    headers,
    url: `${process.env.REACT_APP_URL2}/product/${id}`,
  });
};
export const postV2Product = async (data, params) => {
  await axios.request({
    method: "post",
    headers,
    url: `${process.env.REACT_APP_URL2}/product`,
    data,
    params,
  });
};
export const updateV2Product = async (id, data, params) => {
  await axios.request({
    method: "put",
    headers,
    url: `${process.env.REACT_APP_URL2}/product/${id}`,
    data,
    params,
  });
};
