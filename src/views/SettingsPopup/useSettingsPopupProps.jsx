import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetLang } from "../../hooks/useGetLang";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import { ProjectSettings } from "./modules/ProjectSettings";
import useSearchParams from "../../hooks/useSearchParams";
import { Environment } from "./modules/Environment";
import { EnvironmentDetail } from "./modules/EnvironmentDetail";
import { useSelector } from "react-redux";
import BillingIcon from "@/assets/icons/billing.svg";
import TariffsIcon from "@/assets/icons/fares.svg";
import ProjectSettingsIcon from "@/assets/icons/setting.svg";
import EnvironmentsIcon from "@/assets/icons/environment.svg";
import LanguageIcon from "@/assets/icons/language.svg";
import cls from "./styles.module.scss";
import { Fares } from "./modules/Fares";
import { Account } from "./modules/Account";
import { Billing } from "./modules/Billing";
import LanguageControl from "../../components/LayoutSidebar/Components/LanguageControl";
import { Permissions } from "./modules/Permissions";
import { PermissionsDetail } from "./modules/PermissionsDetail";
import { PermissionsRoleDetail } from "./modules/PermissionsRoleDetail";
import { Resources } from "./modules/Resources";
import { ResourcesDetail } from "./modules/ResourcesDetail";
import { Storage } from "@mui/icons-material";
import { ApiKeys } from "./modules/ApiKeys";
import { ApiKeysDetail } from "./modules/ApiKeysDetail";

export const useSettingsPopupProps = ({ onClose }) => {
  const { t, i18n } = useTranslation();

  const userInfo = useSelector((state) => state?.auth?.userInfo);

  const [searchParams, setSearchParams, updateSearchParam] = useSearchParams();

  const defaultTab = searchParams.get("activeTab");

  const [activeTab, setActiveTab] = useState("profile");

  const lang = useGetLang("Setting");

  const tabs = [
    {
      key: "account",
      title: t("account"),
      tabs: [
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
      ],
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
          icon: <img src={ProjectSettingsIcon} alt="" width={20} height={20} />,
        },
        {
          key: "resources",
          title:
            generateLangaugeText(lang, i18n?.language, "Resources") ||
            "Resources",
          icon: (
            <Storage
              sx={{ width: 20, height: 20 }}
              color="rgba(55, 53, 47, 0.85)"
            />
          ),
        },
        {
          key: "apiKeys",
          title:
            generateLangaugeText(lang, i18n?.language, "API Keys") ||
            "API Keys",
          icon: <img src={ProjectSettingsIcon} alt="" width={20} height={20} />,
        },
      ],
    },
  ];

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

  const tabComponents = {
    profile: <Account handleClose={handleClose} />,
    billing: <Billing />,
    fares: <Fares />,
    projectSettings: <ProjectSettings />,
    environments: {
      environments: <Environment />,
      createEnvironment: <EnvironmentDetail />,
      editEnvironment: <EnvironmentDetail />,
    },
    languageControl: <LanguageControl withHeader={false} />,
    permissions: {
      permissions: <Permissions />,
      permissionsDetail: <PermissionsDetail />,
      permissionsRoleDetail: <PermissionsRoleDetail />,
    },
    resources: {
      resources: <Resources />,
      resourcesDetail: <ResourcesDetail />,
    },
    apiKeys: {
      apiKeys: <ApiKeys />,
      apiKeysDetail: <ApiKeysDetail />,
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
  };
};
