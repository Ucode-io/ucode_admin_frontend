import requestAuth from "../../utils/requestAuth"
import requestAuthV2 from "../../utils/requestAuthV2"

const authService = {
  login: (data) => requestAuthV2.post(`/login`, data),
  sendResetMessageToEmail: (data) =>
  requestAuth.post(`/user/send-message`, data),
  resetPassword: (data) => requestAuth.put(`/user/reset-password`, data),
  refreshToken: (data) => requestAuthV2.put(`/refresh`, data),
}

export default authService
