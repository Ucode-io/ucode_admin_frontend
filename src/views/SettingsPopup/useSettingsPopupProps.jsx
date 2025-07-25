import ActivityLogsIcon from "@/assets/icons/archive.svg";
import BillingIcon from "@/assets/icons/billing.svg";
import CodeIcon from "@/assets/icons/code-square.svg";
import EnvironmentsIcon from "@/assets/icons/environment.svg";
import ApiKeyIcon from "@/assets/icons/key-outline.svg";
import LanguageIcon from "@/assets/icons/language.svg";
import PermissionsIcon from "@/assets/icons/lock.svg";
import UserIcon from "@/assets/icons/profile.svg";
import ResourcesIcon from "@/assets/icons/rows.svg";
import MicroFrontendIcon from "@/assets/icons/server.svg";
import ProjectSettingsIcon from "@/assets/icons/setting.svg";
import ModelsIcon from "@/assets/icons/share.svg";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import { useDispatch, useSelector } from "react-redux";
import LanguageControl from "../../components/LayoutSidebar/Components/LanguageControl";
import { useGetLang } from "../../hooks/useGetLang";
import useSearchParams from "../../hooks/useSearchParams";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import { store } from "../../store";
import { TAB_COMPONENTS } from "../../utils/constants/settingsPopup";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import { UserClientTypes } from "./client-types";
import { Account } from "./modules/Account";
import { ActivityLogs } from "./modules/ActivityLogs";
import { ActivityLogsDetail } from "./modules/ActivityLogsDetail";
import { ApiKeys } from "./modules/ApiKeys";
import { ApiKeysDetail } from "./modules/ApiKeysDetail";
import { Billing } from "./modules/Billing";
import { BillingFares } from "./modules/Billing/BillingFares";
import { Environment } from "./modules/Environment";
import { EnvironmentDetail } from "./modules/EnvironmentDetail";
import { Functions } from "./modules/Functions";
import { FunctionsDetail } from "./modules/FunctionsDetail";
import { MicroFrontend } from "./modules/MicroFrontend";
import { MicroFrontendDetail } from "./modules/MicroFrontendDetail";
import { Models } from "./modules/Models";
import { PermissionsRoleDetail } from "./modules/PermissionsRoleDetail";
import { ProjectSettings } from "./modules/ProjectSettings";
import { Redirect } from "./modules/Redirect";
import { RedirectForm } from "./modules/RedirectForm";
import { Resources } from "./modules/Resources";
import NewResourceDetail from "./modules/ResourcesDetail/NewResourceDetail";
import cls from "./styles.module.scss";
import AddConnectionDetail from "../ExternalDatabases/AddConnectionDetail";
import { useMenuListQuery } from "../../services/menuService";
import MinioPage from "../../components/LayoutSidebar/Components/Minio";
import FilesSinglePage from "./Files/FilesSinglePage";
import { settingsModalActions } from "../../store/settingsModal/settingsModal.slice";

const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const permissionFolder = {
  label: "Permissionss",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: adminId,
  id: "14",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

export const useSettingsPopupProps = ({ onClose }) => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const globalPermissions = useSelector(
    (state) => state?.permissions?.globalPermissions
  );
  const userInfo = useSelector((state) => state?.auth?.userInfo);
  const activeTab = useSelector((state) => state.settingsModal.activeTab);
  const tab = useSelector((state) => state.settingsModal.tab);
  const activeChildId = useSelector(
    (state) => state.settingsModal.activeChildId
  );

  const showSettings = globalPermissions?.settings_button;

  const [searchParams, setSearchParams, updateSearchParam] = useSearchParams();

  // const [activeTab, setActiveTab] = useState("profile");

  const setActiveTab = (tab) => {
    dispatch(settingsModalActions.setActiveTab(tab));
  };

  const [isClientTypeModalOpen, setIsClientTypeModalOpen] = useState(false);

  const [permissionChild, setPermissionChild] = useState([]);
  const [filesChild, setFilesChild] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const lang = useGetLang("Setting");

  const auth = store.getState().auth;

  const isDefaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";

  useQuery(
    ["GET_CLIENT_TYPE_PERMISSION", permissionFolder],
    () => {
      setIsLoading(true);
      return clientTypeServiceV2.getList();
    },
    {
      cacheTime: 10,
      enabled: Boolean(permissionFolder),
      onSuccess: (res) => {
        setIsLoading(false);
        setPermissionChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "PERMISSION",
            id: row.guid,
            parent_id: "13",
            data: {
              permission: {
                read: true,
              },
            },
          }))
        );
      },
      onError: () => {
        setIsLoading(false);
      },
    }
  );

  const { isLoading: loading } = useMenuListQuery({
    params: {
      parent_id: "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9",
    },
    queryParams: {
      onSuccess: (res) => {
        setFilesChild(res?.menus ?? []);
        // setChild(res.menus ?? []);
      },
    },
  });

  const accountTabs = [
    {
      key: "profile",
      title: userInfo?.email || t("profile"),
      icon: <div className={cls.profileIcon}>{userInfo?.login?.[0]}</div>,
    },
    {
      key: "billing",
      title: "Billing",
      icon: <img src={BillingIcon} alt="" width={20} height={20} />,
    },
    // {
    //   key: "fares",
    //   title: "Fares",
    //   icon: <img src={TariffsIcon} alt="" width={20} height={20} />,
    // },
  ];

  const tabs = [
    {
      key: "account",
      title: t("account"),
      tabs: accountTabs,
    },
    {
      key: "advancedSettings",
      title:
        generateLangaugeText(lang, i18n?.language, "Project Settings") ||
        "Project Settings",
      tabs: [
        {
          key: "projectSettings",
          title:
            generateLangaugeText(lang, i18n?.language, "Project Settings") ||
            "Project Settings",
          icon: <img src={ProjectSettingsIcon} alt="" width={20} height={20} />,
        },
        {
          key: "environments",
          title:
            generateLangaugeText(lang, i18n?.language, "Environments") ||
            "Environments",
          icon: <img src={EnvironmentsIcon} alt="" width={20} height={20} />,
        },
        {
          key: "languageControl",
          title:
            generateLangaugeText(lang, i18n?.language, "Language Control") ||
            "Language Control",
          icon: <img src={LanguageIcon} alt="" width={20} height={20} />,
        },
        {
          key: "users",
          title: generateLangaugeText(lang, i18n?.language, "Users") || "Users",
          icon: <img src={UserIcon} alt="" width={20} height={20} />,
        },

        {
          key: "Files",
          title: generateLangaugeText(lang, i18n?.language, "Files") || "Files",
          icon: <img src={PermissionsIcon} alt="" width={20} height={20} />,
          children: filesChild,
        },
      ],
    },
    {
      key: "permissions",
      title: t("advanced_settings"),
      tabs: [
        {
          key: "permissions",
          title:
            generateLangaugeText(lang, i18n?.language, "Permissions") ||
            "Permissions",
          icon: <img src={PermissionsIcon} alt="" width={20} height={20} />,
          children: permissionChild,
        },
        {
          key: "resources",
          title:
            generateLangaugeText(lang, i18n?.language, "Resources") ||
            "Resources",
          icon: <img src={ResourcesIcon} alt="" width={20} height={20} />,
        },
        {
          key: "apiKeys",
          title:
            generateLangaugeText(lang, i18n?.language, "API Keys") ||
            "API Keys",
          icon: <img src={ApiKeyIcon} alt="" width={20} height={20} />,
        },
        {
          key: "redirect",
          title:
            generateLangaugeText(lang, i18n?.language, "Custom endpoint") ||
            "Custom endpoint",
          icon: <img src={ProjectSettingsIcon} alt="" width={20} height={20} />,
        },
        {
          key: "activityLogs",
          title:
            generateLangaugeText(lang, i18n?.language, "Activity Logs") ||
            "Activity Logs",
          icon: <img src={ActivityLogsIcon} alt="" width={20} height={20} />,
        },
        {
          key: "models",
          title:
            generateLangaugeText(lang, i18n?.language, "Models") || "Models",
          icon: <img src={ModelsIcon} alt="" width={20} height={20} />,
        },
        {
          key: "functions",
          title:
            generateLangaugeText(lang, i18n?.language, "Functions") ||
            "Functions",
          icon: <img src={CodeIcon} alt="" width={20} height={20} />,
        },
        {
          key: "microFrontend",
          title:
            generateLangaugeText(lang, i18n?.language, "Microfrontend") ||
            "Microfrontend",
          icon: <img src={MicroFrontendIcon} alt="" width={20} height={20} />,
        },
      ],
    },
  ];

  if (!isDefaultAdmin) {
    accountTabs.splice(1, 1);
  }

  if (!showSettings) {
    accountTabs.splice(1, 2);
    tabs.splice(1);
  }

  const handleClose = () => {
    onClose();
    setSearchParams({});
    setActiveTab("profile");
  };

  const handleChangeTab = (key) => {
    dispatch(settingsModalActions.resetParams());
    if (key !== activeTab) {
      setActiveTab(key);
    }
  };

  const handlePermissionClick = (element) => {
    setActiveTab(TAB_COMPONENTS?.PERMISSIONS.PERMISSIONS);
    dispatch(settingsModalActions.setActiveChildId(element?.guid));
    dispatch(settingsModalActions.setPermissionId(element?.guid));
    dispatch(settingsModalActions.setRoleId(""));
    // updateSearchParam("permissionId", element?.guid);
  };

  const handleFilesClick = (element) => {
    setActiveTab(TAB_COMPONENTS?.FILES?.FILES);
    dispatch(settingsModalActions.setMenuId(element?.id));
    dispatch(settingsModalActions.setActiveChildId(element?.guid));
    // updateSearchParam("menuId", element?.id);
  };

  const handleOpenClientTypeModal = () => {
    setIsClientTypeModalOpen(true);
  };

  const handleCloseClientTypeModal = () => {
    setIsClientTypeModalOpen(false);
  };

  const tabComponents = {
    profile: <Account />,
    billing: {
      billing: <Billing />,
      fares: <BillingFares />,
    },

    projectSettings: <ProjectSettings />,
    environments: {
      environments: <Environment />,
      createEnvironment: <EnvironmentDetail />,
      editEnvironment: <EnvironmentDetail />,
    },
    languageControl: <LanguageControl withHeader={false} />,
    users: <UserClientTypes />,
    permissions: <PermissionsRoleDetail />,
    files: {
      files: <MinioPage modal={true} />,
      filesDetail: <FilesSinglePage />,
    },
    // permissions: {
    //   permissions: <Permissions />,
    //   // permissionsDetail: <PermissionsDetail />,
    //   permissionsDetail: <PermissionsRoleDetail />,
    //   permissionsRoleDetail: <PermissionsRoleDetail />,
    // },
    resources: {
      resources: <Resources handleClose={handleClose} />,
      resourcesDetail: <NewResourceDetail handleClose={handleClose} />,
    },
    apiKeys: {
      apiKeys: <ApiKeys />,
      apiKeysDetail: <ApiKeysDetail />,
    },
    redirect: {
      redirect: <Redirect />,
      redirectForm: <RedirectForm />,
    },
    activityLogs: {
      activityLogs: <ActivityLogs />,
      activityLogsDetail: <ActivityLogsDetail />,
    },
    models: {
      models: <Models />,
      connectionDetail: <AddConnectionDetail />,
    },
    functions: {
      functions: <Functions />,
      functionsDetail: <FunctionsDetail />,
    },
    microFrontend: {
      microFrontend: <MicroFrontend />,
      microFrontendDetail: <MicroFrontendDetail />,
    },
  };

  useEffect(() => {
    return () => {
      setActiveTab("profile");
    };
  }, []);

  return {
    handleClose,
    t,
    tabs,
    activeTab,
    handleChangeTab,
    tabComponents,
    searchParams,
    setSearchParams,
    updateSearchParam,
    isDefaultAdmin,
    handlePermissionClick,
    handleFilesClick,
    activeChildId,
    handleOpenClientTypeModal,
    handleCloseClientTypeModal,
    isClientTypeModalOpen,
    permissionChild,
    tab,
  };
};
