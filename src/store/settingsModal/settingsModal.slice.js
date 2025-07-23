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
  resource_type: "",
  edit: false,
  resourceId: "",
  apiKeyId: "",
  view: false,
  id: "",
  functionId: "",
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
      state.resource_type = payload
    },
    
    setResourceId: (state, {payload}) => {
      state.resourceId = payload
    },
    
    setApiKeyId: (state, {payload}) => {
      state.apiKeyId = payload
    },
    
    setId: (state, {payload}) => {
      state.id = payload
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
