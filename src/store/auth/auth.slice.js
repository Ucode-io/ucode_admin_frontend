import { createSlice } from "@reduxjs/toolkit"
// import { listToMap } from "../../utils/listToMap";

const initialState = {
  isAuth: false,
  token: null,
  refreshToken: null,
  userInfo: null,
  roleInfo: null,
  permissions: {},
  loginTableSlug: "",
  userId: "",
  profileSettings: {
    lang: "ru",
    time_frame: "+5",
    time_format: "24",
    date_format: "dd/mm/yyyy",
  },
}

export const { actions: authActions, reducer: authReducer } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, { payload }) {
      state.isAuth = true
      state.token = payload.token.access_token
      state.refreshToken = payload.token.refresh_token
      state.userInfo = payload.user
      state.roleInfo = payload.role
      state.loginTableSlug = payload.login_table_slug
      state.userId = payload.user_id

      // state.permissions = listToMap(payload.permissions?.map(el => ({...el, name: el.name?.replace('ROOT/', '')})), "name")
      state.permissions = payload?.permissions
        ? payload?.permissions?.reduce((acc, curr) => {
            acc[curr.table_slug] = {
              // there is 3 cases ['Yes', 'No', 'Dynamic (Connection name)']
              read: curr.read !== "No",
              write: curr.write !== "No",
              update: curr.update !== "No",
              delete: curr.delete !== "No",
            }
            return acc
          }, {})
        : []
      state.loading = false
    },
    setTokens(state, { payload }) {
      state.token = payload.token.access_token
      state.refreshToken = payload.token.refresh_token
    },
    setPermission(state, { payload }) {
      state.permissions =
        payload?.permissions?.reduce((acc, curr) => {
          acc[curr.table_slug] = {
            // there is 3 cases ['Yes', 'No', 'Dynamic (Connection name)']
            read: curr.read !== "No",
            write: curr.write !== "No",
            update: curr.update !== "No",
            delete: curr.delete !== "No",
          }
          return acc
        }, {}) || []
    },
    logout: (state) => initialState,
    setProfileSettings(state, { payload }) {
      state.profileSettings = {
        lang: "ru",
        time_frame: "+5",
        time_format: "24",
        date_format: "24",
        ...payload,
      }
    },
  },
})
