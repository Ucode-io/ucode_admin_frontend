import { createSlice } from "@reduxjs/toolkit";

const name = "settingsModal"
const initialState = {
  activeTab: "profile",
  tab: "",
  menuId: "",
  permissionId: "",
  envId: "",
  invite: false,
  roleId: "",
  resourceType: "",
  edit: false,
  resourceId: "",
  redirectId: "",
  apiKeyId: "",
  view: false,
  activityLogId: "",
  functionId: "",
  microfrontendId: "",
  activeChildId: "",
  create: false,
}

export const {reducer: settingsModalReducer, actions: settingsModalActions} = createSlice({
  name,
  initialState,
  reducers: {
    setActiveTab: (state, {payload}) => {
      state.activeTab = payload
    },
    
    setInvite: (state, {payload}) => {
      state.invite = payload
    },
    
    setEdit: (state, {payload}) => {
      state.edit = payload
    },
    
    setView: (state, {payload}) => {
      state.view = payload
    },
    
    setTab: (state, {payload}) => {
      state.tab = payload
    },
    
    setMenuId: (state, {payload}) => {
      state.menuId = payload
    },
    
    setPermissionId: (state, {payload}) => {
      state.permissionId = payload
    },
    
    setEnvId: (state, {payload}) => {
      state.envId = payload
    },
    
    setRoleId: (state, {payload}) => {
      state.roleId = payload
    },
    
    setResourceType: (state, {payload}) => {
      state.resourceType = payload
    },
    
    setResourceId: (state, {payload}) => {
      state.resourceId = payload
    },
    
    setApiKeyId: (state, {payload}) => {
      state.apiKeyId = payload
    },
    
    setActivityLogId: (state, {payload}) => {
      state.activityLogId = payload
    },
    
    setFunctionId: (state, {payload}) => {
      state.functionId = payload
    },

    setActiveChildId: (state, {payload}) => {
      state.activeChildId = payload
    },

    setCreate: (state, {payload}) => {
      state.create = payload
    },

    setRedirectId: (state, {payload}) => {
      state.redirectId = payload
    },

    setMicrofrontendId: (state, {payload}) => {
      state.microfrontendId = payload
    },
    
    reset: (state) => {
      for (const key in state) {
        if (Object.hasOwnProperty.call(state, key)) {
          state[key] = initialState[key]
        }
      }
    },

    resetParams: (state) => {
      for (const key in state) {
        if (Object.hasOwnProperty.call(state, key) && key !== "activeTab") {
          state[key] = initialState[key]
        }
      }
    }
  }
})
