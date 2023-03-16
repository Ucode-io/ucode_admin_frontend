import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/auth/authService";
import { authActions } from "./auth.slice";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data, { dispatch }) => {
    try {
      const res = await authService.login(data);
      dispatch(
        authActions.loginSuccess({ ...res, project_id: data.project_id })
      );
      const fcmToken = localStorage.getItem("fcmToken");
      if (res.user.id)
        await authService.sendFcmToken({
          token: fcmToken,
          user_id: res.user.id,
          platform_id: "ANDROID",
        });

      // dispatch(cashboxActions.setData(cashboxData))
    } catch (error) {
      throw new Error(error);
      // dispatch(showAlert('Username or password is incorrect'))
    }
  }
);
