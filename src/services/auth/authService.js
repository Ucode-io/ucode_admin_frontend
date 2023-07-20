import authRequestV2 from "../../utils/authRequest";
import request from "../../utils/request";
import requestAuth from "../../utils/requestAuth";
import requestAuthV2 from "../../utils/requestAuthV2";

const authService = {
  login: (data) =>
    requestAuthV2.post(`/login`, data, {
      headers: { "environment-id": data.environment_id },
    }),
  sendFcmToken: (data) =>
    request.post(`/notification/user-fcmtoken`, data, {
      headers: { "environment-id": data.environment_id },
    }),
  multiCompanyLogin: (data) => requestAuthV2.post("/multi-company/login", data),
  register: (data) => requestAuth.post("/company", data),
  sendResetMessageToEmail: (data) =>
    requestAuth.post(`/user/send-message`, data),
  resetPassword: (data) => requestAuth.put(`/user/reset-password`, data),
  refreshToken: (data) => requestAuthV2.put(`/refresh`, data),
  updateToken: (data) => authRequestV2.put(`/v2/refresh`, data),
  sendCode: (data) => requestAuth.post(`/send-code`, data),
  verifyCode: (sms_id, otp, data) =>
    requestAuth.post(`/verify/${sms_id}/${otp}`, data),
  sendMessage: (data) => requestAuth.post(`/send-message`, data),
  verifyEmail: (sms_id, otp, data) =>
    requestAuth.post(`/verify-email/${sms_id}/${otp}`, data),
};

export default authService;
