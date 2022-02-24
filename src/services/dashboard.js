import request from "utils/axios";

export const getStatistics = (params) =>
  request({ method: "get", url: "/reports/dashboard", params });
export const getBranchesCount = (params) =>
  request({ method: "get", url: "/branches", params });
export const getCouriersCount = (params) =>
  request({ method: "get", url: "/couriers", params });
export const getCustomersCount = (params) =>
  request({ method: "get", url: "/customers", params });
export const getOrderLocations = (params) =>
  request({ method: "get", url: "/order-locations", params });
