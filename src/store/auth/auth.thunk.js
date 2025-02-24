import {createAsyncThunk} from "@reduxjs/toolkit";
import authService from "../../services/auth/authService";
import {authActions} from "./auth.slice";
import {store} from "..";
import {companyActions} from "../company/company.slice";
import {permissionsActions} from "../permissions/permissions.slice";
import languageService from "../../services/languageService";
import {saveGroupedToDB} from "../../utils/languageDB";

export const loginAction = createAsyncThunk(
  "auth/login",
  async (data, {dispatch}) => {
    try {
      const res = await authService.login(data);
      dispatch(
        authActions.loginSuccess({
          ...res,
          project_id: data.project_id,
          environment_ids: data?.environment_ids,
          currencies: data?.currencies,
        })
      );
      dispatch(companyActions.setCompanyId(res?.user?.company_id));
      dispatch(companyActions.setProjectId(data.project_id));
      dispatch(companyActions.setEnvironmentId(res?.environment_id));
      dispatch(companyActions.setDefaultPage(data?.default_page));
      dispatch(permissionsActions.setPermissions(res?.permissions));

      await languageService.getLanguageList().then((res) => {
        const grouped = {};
        for (const field of res?.languages) {
          if (!grouped[field.category]) {
            grouped[field.category] = [];
          }
          grouped[field.category].push(field);
        }
        saveGroupedToDB(grouped);
      });

      await authService
        .updateToken({
          refresh_token: res.token.access_token,
          env_id: res.environment_id,
          project_id: data.project_id,
        })
        .then((res) => {
          store.dispatch(authActions.setTokens(res));
        })
        .catch((err) => {
          console.log(err);
        });

      const fcmToken = localStorage.getItem("fcmToken");
      // if (res.user.id)
      //   await authService.sendFcmToken({
      //     token: fcmToken,
      //     user_id: res.user.id,
      //     platform_id: "ANDROID",
      //   });

      // dispatch(cashboxActions.setData(cashboxData))
    } catch (error) {
      throw new Error(error);
      // dispatch(showAlert('Username or password is incorrect'))
    }
  }
);
