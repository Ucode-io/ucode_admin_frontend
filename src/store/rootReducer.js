import {combineReducers} from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import {alertReducer} from "./alert/alert.slice";
import {authReducer} from "./auth/auth.slice";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import {constructorTableReducer} from "./constructorTable/constructorTable.slice";
import {tableColumnReducer} from "./tableColumn/tableColumn.slice";
import {tabRouterReducer} from "./tabRouter/tabRouter.slice";
import {applicationReducer} from "./application/application.slice";
import {menuReducer} from "./menuItem/menuItem.slice";
import {quickFiltersReducer} from "./filter/quick_filter";
import {companyReducer} from "./company/company.slice";
import {cashboxReducer} from "./cashbox/cashbox.slice";
import {filterReducer} from "./filter/filter.slice";
import {tableSizeReducer} from "./tableSize/tableSizeSlice";
import {mainReducer} from "./main/main.slice";
import {selectedRowReducer} from "./selectedRow/selectedRow.slice";
import {languagesReducer} from "./globalLanguages/globalLanguages.slice";
import {paginationReducer} from "./pagination/pagination.slice";
import {relationTabReducer} from "./relationTab/relationTab.slice";
import {viewsReducer} from "./views/view.slice";
import {isOnlineReducer} from "./isOnline/isOnline.slice";
import {permissionsReducer} from "./permissions/permissions.slice";
import {menuAccordionReducer} from "./menus/menus.slice";
import {groupFieldReducer} from "./groupField/groupField.slice";
import {detailDrawerReducer} from "./detailDrawer/detailDrawer.slice";
import {tableReducer} from "./table/table.slice";
import {settingsModalReducer} from "./settingsModal/settingsModal.slice";
import {iconCategoryReducer} from "./IconCategory/iconCategory.slice";

const mainPersistConfig = {
  key: "main",
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const constructorTablePersistConfig = {
  key: "constructorTable",
  storage,
};

const applicationPersistConfig = {
  key: "application",
  storage,
};

const menuPersistConfig = {
  key: "menu",
  storage,
};

const menuAccordionPersistConfig = {
  key: "menuAccordion",
  storage,
};

const languagesPersistConfig = {
  key: "languages",
  storage,
};

const companyPersistConfig = {
  key: "company",
  storage,
};

const tableColumnTablePersistConfig = {
  key: "tableColumn",
  storage,
};

const filtersPersistConfig = {
  key: "filter",
  storage,
};
const tableSizePersistConfig = {
  key: "tableSize",
  storage,
};

const tabRouterPersistConfig = {
  key: "tabRoute",
  storage,
};

const cashboxPersistConfig = {
  key: "cashbox",
  storage,
};

const selectedRowPersistConfig = {
  key: "selectedRow",
  storage,
};

const tablePagination = {
  key: "selectedPagination",
  storage,
};

const quickFiltersCount = {
  key: "quick_filters",
  storage,
};

const relationTab = {
  key: "relationTab",
  storage,
};

const views = {
  key: "views",
  storage,
};

const isOnline = {
  key: "isOnline",
  storage,
};

const permissions = {
  key: "permissions",
  storage,
};

const settingsModal = {
  key: "settingsModal",
  storage: sessionStorage,
};

const iconCategoriesPersistConfig = {
  key: "iconCategories",
  storage,
};

const detailDrawerConfig = {
  key: "detailDrawer",
  storage,
};

const rootReducer = combineReducers({
  main: persistReducer(mainPersistConfig, mainReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  constructorTable: persistReducer(
    constructorTablePersistConfig,
    constructorTableReducer
  ),
  application: persistReducer(applicationPersistConfig, applicationReducer),
  menu: persistReducer(menuPersistConfig, menuReducer),
  menuAccordion: persistReducer(
    menuAccordionPersistConfig,
    menuAccordionReducer
  ),
  quick_filter: persistReducer(quickFiltersCount, quickFiltersReducer),
  pagination: persistReducer(tablePagination, paginationReducer),
  languages: persistReducer(languagesPersistConfig, languagesReducer),
  company: persistReducer(companyPersistConfig, companyReducer),
  tableColumn: persistReducer(
    tableColumnTablePersistConfig,
    tableColumnReducer
  ),
  filter: persistReducer(filtersPersistConfig, filterReducer),
  iconCategories: persistReducer(
    iconCategoriesPersistConfig,
    iconCategoryReducer
  ),
  tableSize: persistReducer(tableSizePersistConfig, tableSizeReducer),
  tabRouter: persistReducer(tabRouterPersistConfig, tabRouterReducer),
  relationTab: persistReducer(relationTab, relationTabReducer),
  cashbox: persistReducer(cashboxPersistConfig, cashboxReducer),
  selectedRow: persistReducer(selectedRowPersistConfig, selectedRowReducer),
  views: persistReducer(views, viewsReducer),
  groupField: groupFieldReducer,
  alert: alertReducer,
  isOnline: persistReducer(isOnline, isOnlineReducer),
  drawer: detailDrawerReducer,
  permissions: persistReducer(permissions, permissionsReducer),
  settingsModal: persistReducer(settingsModal, settingsModalReducer),
  table: tableReducer,
});

export default rootReducer;
