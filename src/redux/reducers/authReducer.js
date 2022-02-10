import {
  SET_AUTH_CREDENTIALS,
  SET_AUTH_TOKENS,
  CLEAR_ON_SIGNOUT,
  IS_LOADING,
  SET_USER_VERIFIED,
  REFRESH_ACCESS_TOKEN,
} from "../constants";

const INITIAL_STATE = {
  phoneNumber: "",
  accessToken: "",
  refreshToken: "",
  isLoading: false,
  permissions: [],
  login: "",
  region_id: "",
  verified: true,
  statusPerission: false,
  nextStagePermission: false,
};

export default function authReducer(state = INITIAL_STATE, { payload, type }) {
  switch (type) {
    case IS_LOADING:
      return {
        ...state,
        isLoading: payload,
      };

    case SET_AUTH_CREDENTIALS:
      return {
        ...state,
        phoneNumber: payload,
      };

    case SET_AUTH_TOKENS:
      return {
        ...state,
        ...payload,
      };

    case SET_USER_VERIFIED:
      return {
        ...state,
        verified: payload ?? false,
      };

    case REFRESH_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
      };

    case CLEAR_ON_SIGNOUT:
      return INITIAL_STATE;

    default:
      return state;
  }
}
