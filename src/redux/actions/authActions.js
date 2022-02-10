import {
  CLEAR_ON_SIGNOUT,
  REFRESH_ACCESS_TOKEN,
  SET_AUTH_TOKENS,
  SET_AUTH_CREDENTIALS,
  IS_LOADING,
  SET_USER_VERIFIED,
} from "../constants"

export const setAuthTokens = (data) => ({
  type: SET_AUTH_TOKENS,
  payload: {
    accessToken: data && data.access_token,
    refreshToken: data && data.refresh_token,
    user_id: data && data.user_id,
    user_info: data && data.user_info,
    user_role_id: data && data.user_role_id,
  },
})

export const refreshAccessToken = (token) => ({
  type: REFRESH_ACCESS_TOKEN,
  payload: token,
})

export const isLoadingOverlay = (val) => ({
  type: IS_LOADING,
  payload: val,
})

export const logout = () => ({
  type: CLEAR_ON_SIGNOUT,
})

export const setAuthCredentials = (phoneNumber) => ({
  type: SET_AUTH_CREDENTIALS,
  payload: phoneNumber,
})

export const setUserVerified = (payload) => ({
  type: SET_USER_VERIFIED,
  payload,
})
