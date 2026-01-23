import { useMutation } from "react-query";
import request from "@/utils/request";

const mcpService = {
  mcpCell: (data) => request.post("/mcp-call", data),
  generateFrontend: (data) =>
    request.post("/mcp-front", data, { timeout: 540000 }),
  getFrontend: (params) =>
    Promise.resolve({ data: { frontend: "frontend", params } }),
  getProjects: (params) => request.get("/mcp_project/list", { params }),
  getProject: (id) => request.get(`/mcp_project/${id}`),
  updateFrontend: (data, projectId) =>
    request.patch(`/mcp_project/update_frontend/${projectId}`, data, {
      timeout: 540000,
    }),
  updateFrontendCode: (data, id) => request.put(`/mcp_project/${id}`, data),
  publishFrontend: (data) =>
    Promise.resolve({ text: "Published", data }).then((res) =>
      console.log(res.text),
    ),
};

export const useMcpCellMutation = ((mutationSettings) => {
  return useMutation((data) => mcpService.mcpCell(data), mutationSettings);
})

export default mcpService;
