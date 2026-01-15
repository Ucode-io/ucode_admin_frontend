import httpsRequest from "@/utils/httpsRequest"

const mcpService = {
  generateFrontend: (data) => httpsRequest.post('http://localhost:8001/v1/mcp-front', data)
}

export default mcpService
