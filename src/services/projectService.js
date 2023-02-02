import request from "../utils/request"

const projectService = {
  getById: (projectId) => request.get(`/company-project/${projectId}`),
}

export default projectService