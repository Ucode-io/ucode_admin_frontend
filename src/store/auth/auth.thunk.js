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
  async (data, { dispatch, rejectWithValue }) => {
    try {

      let loginData = {};

      if (data?.isSubmitDialog) {
        loginData = await authService.login({
          password: data?.password,
          username: data?.username,
          tables: data?.tables,
          client_type: data?.tempData?.client_type,
          company_id: data?.tempData?.project_data?.company_id,
          currencies: data?.tempData?.project_data?.currencies,
          environment_id: data?.tempData?.environment,
          project_id: data?.tempData?.project,
        });
      } else {
        try {
          loginData = await authService.defaultLogin(data);
          data?.setTempData(loginData);
        } catch (e) {
          return rejectWithValue(e);
        }
        
      }

      const res = data?.isSubmitDialog ? loginData : loginData?.response;
      const projectData = data?.isSubmitDialog
        ? data?.tempData?.project_data
        : loginData?.project_data;

      if (Array.isArray(res) && !data.isSubmitDialog) {
        data?.setConnectionOptions(res);
        data?.setProjectListDialogOpen(true);
        return;
      }

      dispatch(
        authActions.loginSuccess({
          ...res,

          // project_id: data.project_id,
          // environment_ids: data?.environment_ids,
          // currencies: data?.currencies,
        }),
      );

      localStorage.setItem("new_router", projectData?.new_router || "false");
      localStorage.setItem("newUi", projectData?.new_design || false);
      projectData?.new_layout
        ? localStorage.setItem("detailPage", "SidePeek")
        : localStorage.setItem("detailPage", "");
      localStorage.setItem("newLayout", projectData?.new_layout || false);

      dispatch(companyActions.setCompanyId(projectData?.company_id));
      dispatch(companyActions.setProjectId(projectData.project_id));
      dispatch(companyActions.setEnvironmentId(res?.environment_id));
      dispatch(companyActions.setDefaultPage(projectData?.default_page));
      dispatch(permissionsActions.setPermissions(res?.permissions));
      dispatch(permissionsActions.setGlobalPermissions(res?.global_permission));

      await languageService
        .getLanguageList()
        .then((res) => {
          const grouped = {};

          if (Array.isArray(res?.languages) && res?.languages?.length > 0) {
            for (const field of res.languages) {
              if (!grouped[field.category]) {
                grouped[field.category] = [];
              }
              grouped[field.category].push(field);
            }
          }

          saveGroupedToDB(grouped);
        })
        .catch(() => {
          saveGroupedToDB({});
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
          console.log("Error updating token:", err);
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
      return rejectWithValue(error.response?.data || error.message);
      // dispatch(showAlert('Username or password is incorrect'))
    }
  },
);
