import { useMutation } from "react-query";
import request from "@/utils/request";

const mcpService = {
  mcpCell: (data) => request.post("/mcp-call", data),
  generateFrontend: (data) =>
    request.post("/mcp_project/generate_frontend", data, { timeout: 540000 }),
  // request.post(
  //   "http://192.0.0.49:8001/v1/mcp_project/generate_frontend",
  //   data,
  //   { timeout: 540000 },
  // ),
  getFrontend: (params) =>
    Promise.resolve({ data: { frontend: "frontend", params } }),
  getProjects: (params) => request.get("/mcp_project/list", { params }),
  getProject: (id) => request.get(`/mcp_project/${id}`),
  updateFrontend: (data, projectId) =>
    request.patch(`/mcp_project/update_frontend/${projectId}`, data, {
      timeout: 540000,
    }),
  // request.patch(
  //   `http://192.0.0.49:8001/v1/mcp_project/update_frontend/${projectId}`,
  //   data,
  //   {
  //     timeout: 540000,
  //   },
  // ),
  updateProject: (data, id) => request.put(`/mcp_project/${id}`, data),
  publishFrontend: (id) => request.post(`/mcp_project/publish-frontend/${id}`),
};

export const useMcpCellMutation = ((mutationSettings) => {
  return useMutation((data) => mcpService.mcpCell(data), mutationSettings);
})

export default mcpService;
