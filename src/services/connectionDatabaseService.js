import requestWithoutProjectId from "../utils/requestWithoutProjectId";

const conectionDatabaseService = {
  getConnections: () => requestWithoutProjectId.get("v1/connections"),
  createConnection: (data) =>
    requestWithoutProjectId.post("v1/connections", data),
  getTables: (id, params) =>
    requestWithoutProjectId.get(`v1/connections/${id}/tables`, { params }),
  trackTable: (id, data) =>
    requestWithoutProjectId.post(`v1/connections/${id}/tables/track`, data),
};

export default conectionDatabaseService;