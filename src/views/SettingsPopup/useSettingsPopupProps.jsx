import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useGetLang} from "../../hooks/useGetLang";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {ProjectSettings} from "./modules/ProjectSettings";
import useSearchParams from "../../hooks/useSearchParams";
import {Environment} from "./modules/Environment";
import {EnvironmentDetail} from "./modules/EnvironmentDetail";
import {useSelector} from "react-redux";
import BillingIcon from "@/assets/icons/billing.svg";
import TariffsIcon from "@/assets/icons/fares.svg";
import ResourcesIcon from "@/assets/icons/rows.svg";
import ApiKeyIcon from "@/assets/icons/key-outline.svg";
import CodeIcon from "@/assets/icons/code-square.svg";
import MicroFrontendIcon from "@/assets/icons/server.svg";
import ModelsIcon from "@/assets/icons/share.svg";
import CustomEndpointIcon from "@/assets/icons/route.svg";
import ActivityLogsIcon from "@/assets/icons/archive.svg";
import PermissionsIcon from "@/assets/icons/lock.svg";
import ProjectSettingsIcon from "@/assets/icons/setting.svg";
import EnvironmentsIcon from "@/assets/icons/environment.svg";
import LanguageIcon from "@/assets/icons/language.svg";
import cls from "./styles.module.scss";
import {Fares} from "./modules/Fares";
import {Account} from "./modules/Account";
import {Billing} from "./modules/Billing";
import LanguageControl from "../../components/LayoutSidebar/Components/LanguageControl";
import {Storage} from "@mui/icons-material";
import {ApiKeys} from "./modules/ApiKeys";
import {ApiKeysDetail} from "./modules/ApiKeysDetail";
import {Redirect} from "./modules/Redirect";
import {RedirectForm} from "./modules/RedirectForm";
import {ActivityLogs} from "./modules/ActivityLogs";
import {ActivityLogsDetail} from "./modules/ActivityLogsDetail";
import {Models} from "./modules/Models";
import {Functions} from "./modules/Functions";
import {FunctionsDetail} from "./modules/FunctionsDetail";
import {MicroFrontend} from "./modules/MicroFrontend";
import {MicroFrontendDetail} from "./modules/MicroFrontendDetail";
import {Permissions} from "./modules/Permissions";
import {PermissionsDetail} from "./modules/PermissionsDetail";
import {PermissionsRoleDetail} from "./modules/PermissionsRoleDetail";
import {Resources} from "./modules/Resources";
import {ResourcesDetail} from "./modules/ResourcesDetail";
import {store} from "../../store";
import {useQuery} from "react-query";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import {TAB_COMPONENTS} from "../../utils/constants/settingsPopup";
import NewResourceDetail from "./modules/ResourcesDetail/NewResourceDetail";
import {UserClientTypes} from "./client-types";
import PersonIcon from "@mui/icons-material/Person";

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

export const useSettingsPopupProps = ({onClose}) => {
  const {t, i18n} = useTranslation();

  const userInfo = useSelector((state) => state?.auth?.userInfo);
  const globalPermissions = useSelector(
    (state) => state?.permissions?.globalPermissions
  );

  const showSettings = globalPermissions?.settings_button;

  const [searchParams, setSearchParams, updateSearchParam] = useSearchParams();

  const defaultTab = searchParams.get("activeTab");

  const [activeTab, setActiveTab] = useState("profile");

  const [isClientTypeModalOpen, setIsClientTypeModalOpen] = useState(false);

  const [permissionChild, setPermissionChild] = useState([]);
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
    {
      key: "fares",
      title: "Fares",
      icon: <img src={TariffsIcon} alt="" width={20} height={20} />,
    },
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
          icon: <PersonIcon />,
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
    setSearchParams({});
    if (key !== activeTab) {
      setActiveTab(key);
    }
  };

  const handlePermissionClick = (element) => {
    setActiveTab(TAB_COMPONENTS?.PERMISSIONS.PERMISSIONS);
    updateSearchParam("permissionId", element?.guid);
  };

  const handleOpenClientTypeModal = () => {
    setIsClientTypeModalOpen(true);
  };

  const handleCloseClientTypeModal = () => {
    setIsClientTypeModalOpen(false);
  };

  const tabComponents = {
    profile: <Account />,
    billing: <Billing />,
    fares: <Fares />,
    projectSettings: <ProjectSettings />,
    environments: {
      environments: <Environment />,
      createEnvironment: <EnvironmentDetail />,
      editEnvironment: <EnvironmentDetail />,
    },
    languageControl: <LanguageControl withHeader={false} />,
    users: <UserClientTypes />,
    permissions: <PermissionsRoleDetail />,
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
    models: <Models />,
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
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

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
    activeChildId: searchParams.get("permissionId"),
    handleOpenClientTypeModal,
    handleCloseClientTypeModal,
    isClientTypeModalOpen,
    permissionChild,
  };
};
