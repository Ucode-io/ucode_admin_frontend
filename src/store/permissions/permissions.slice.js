import {createSlice} from "@reduxjs/toolkit";

const permissionsMap = {
  read: true,
  write: true,
  update: true,
  delete: true,
  pdf_action: true,
  add_field: true,
  automation: true,
  language_btn: true,
  settings: true,
  share_modal: true,
  view_create: true,
  add_filter: true,
  field_filter: true,
  fix_column: true,
  columns: true,
  group: true,
  excel_menu: true,
  tab_group: true,
  search_button: true,
}

export const {actions: permissionsActions, reducer: permissionsReducer} =
  createSlice({
    name: "permissions",
    initialState: {
      permissions: {},
      globalPermissions: {},
    },
    reducers: {
      setPermissions: (state, {payload}) => {
        state.permissions = payload.reduce((acc, curr) => {
          acc[curr.table_slug] = {
            read: curr.read !== "No",
            write: curr.write !== "No",
            update: curr.update !== "No",
            delete: curr.delete !== "No",
            pdf_action: curr.pdf_action !== "No",
            add_field: curr.add_field !== "No",
            automation: curr.automation !== "No",
            language_btn: curr.language_btn !== "No",
            settings: curr.settings !== "No",
            share_modal: curr.share_modal !== "No",
            view_create: curr.view_create !== "No",
            add_filter: curr.add_filter !== "No",
            field_filter: curr.field_filter !== "No",
            fix_column: curr.fix_column !== "No",
            columns: curr.columns !== "No",
            group: curr.group !== "No",
            excel_menu: curr.excel_menu !== "No",
            tab_group: curr.tab_group !== "No",
            search_button: curr.search_button !== "No",
          };
          return acc;
        }, {});
      },
      setGlobalPermissions: (state, {payload}) => {
        state.globalPermissions = payload;
      },
      setPermissionsForNewTable: (state, {payload}) => {
        state.permissions[payload.table_slug] = permissionsMap;
      },
    },
  });
