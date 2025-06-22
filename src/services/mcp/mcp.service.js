import { useMutation } from "react-query";
import request from "../../utils/request";

const mcpServices = {
  mcpCell: (data) => request.post('/mcp-call', data),
}

export const useMcpCellMutation = ((mutationSettings) => {
  return useMutation(data => mcpServices.mcpCell(data), mutationSettings);
})
