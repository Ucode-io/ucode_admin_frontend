import request from "../utils/axios"

export const getCourierReports = (params) =>
  request({ method: "get", url: "/admin_reports/couriers_report", params })

export const getBranchReports = (params) =>
  request({ method: "get", url: "/admin_reports/branches_report", params })

export const getUserReports = (params) =>
  request({ method: "get", url: "/admin_reports/users_report", params })
