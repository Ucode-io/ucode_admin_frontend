// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "utils/axios";

const requests = {
  getBranch: (params, id) =>
    request({
      headers: { Shipper: id },
      method: "get",
      url: "/branches",
      params,
    }),
  // postBranch: (data, id) =>
  //   request({
  //     headers: { Shipper: id },
  //     method: "post",
  //     url: "/branches",
  //     data,
  //   }),
  postBranchCourier: (data) =>
    request({ method: "post", url: "/branches/add-courier", data }),
  removeBranchCourier: (data) =>
    request({ method: "post", url: "/branches/remove-courier", data }),
  getBranchById: (params, branch_id) =>
    request({ method: "get", url: `/branches/${branch_id}`, params }),
  updateBranch: (data, branch_id) =>
    request({ method: "put", url: `/branches/${branch_id}`, data }),
  deleteBranch: (branch_id) =>
    request({ method: "delete", url: `/branches/${branch_id}` }),
  getBranchCouriers: (branch_id, params) =>
    request({ method: "get", url: `/branches/${branch_id}/couriers`, params }),
  getNearestBranch: (params) =>
    request({ method: "get", url: `​/nearest-branch`, params }),
};
export default requests;

export const getBranches = (params, id) =>
  request({
    headers: { Shipper: id },
    method: "get",
    url: "/branches",
    params,
  });
export const postBranch = (data, params) =>
  request({ method: "post", url: "/branches", data, params });
export const postBranchCourier = (data) =>
  request({ method: "post", url: "/branches/add-courier", data });
export const removeBranchCourier = (data) =>
  request({ method: "post", url: "/branches/remove-courier", data });
export const getBranchById = (params, branch_id) =>
  request({ method: "get", url: `/branches/${branch_id}`, params });
export const updateBranch = (data, branch_id, params) =>
  request({ method: "put", url: `/branches/${branch_id}`, data, params });
export const deleteBranch = (branch_id, id) =>
  request({
    headers: { shipper_id: id },
    method: "delete",
    url: `/branches/${branch_id}`,
  });
export const getBranchCouriers = (branch_id, params) =>
  request({ method: "get", url: `/branches/${branch_id}/couriers`, params });
export const getNearestBranch = (params) =>
  request({ method: "get", url: "/nearest-branch", params });
export const getBranch = (params, id) =>
  request({
    headers: { Shipper: id },
    method: "get",
    url: "/branches",
    params,
  });
