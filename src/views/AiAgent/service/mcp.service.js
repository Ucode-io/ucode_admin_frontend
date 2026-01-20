import httpsRequest from "@/utils/httpsRequest"

const mcpService = {
  generateFrontend: (data) => httpsRequest.post('/v1/mcp-front', data, { timeout: 540000 }),
  getFrontend: (params) => Promise.resolve({ data: { frontend: 'frontend', params } }),
  updateFrontend: (data, projectId) => httpsRequest.post(`/v1/mcp-front-update/${projectId}`, data, { timeout: 540000 }),
  updateFrontendCode: (data) => Promise.resolve({ data: { frontend: 'frontend', data } }).then(res => console.log(res)),
  publishFrontend: (data) => Promise.resolve({text: 'Published', data}).then(res => console.log(res.text)),
}

export default mcpService
