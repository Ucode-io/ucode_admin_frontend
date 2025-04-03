import {CssBaseline, createTheme} from "@mui/material";
import {ThemeProvider} from "@mui/styles";
import {useEffect, useState} from "react";
import Favicon from "react-favicon";
import {useDispatch} from "react-redux";
import {Outlet, useLocation, useParams} from "react-router-dom";
import LayoutSidebar from "../../components/LayoutSidebar";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";

import styles from "./style.module.scss";
import SubscriptionWarning from "./SubscriptionWarning";
import {SettingsPopup} from "../../views/SettingsPopup/SettingsPopup";
import {differenceInCalendarDays, parseISO} from "date-fns";
import {TAB_COMPONENTS} from "../../utils/constants/settingsPopup";
import useSearchParams from "../../hooks/useSearchParams";

const MainLayout = ({setFavicon, favicon}) => {
  const {appId} = useParams();
  const projectId = store.getState().company.projectId;

  const updateSearchParam = useSearchParams()[2];
  const location = useLocation();

  const {data: projectInfo} = useProjectGetByIdQuery({
    projectId,
    queryParams: {
      onSuccess: (data) => {
        localStorage.setItem("project_status", data?.status);
      },
    },
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    setFavicon(projectInfo?.logo);
    document.title = projectInfo?.title;
  }, [projectInfo]);

  useEffect(() => {
    localStorage.setItem("project_status", projectInfo?.status);
  }, [projectInfo]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const theme = createTheme({
    palette: {
      mode: "light",
    },
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 4,
        },
      },
    },
  });

  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);

  const handleOpenBilling = () => {
    updateSearchParam("activeTab", TAB_COMPONENTS.BILLING);
    handleOpenProfileModal();
  };

  const isWarning =
    differenceInCalendarDays(parseISO(projectInfo?.expire_date), new Date()) +
    1;

  const isWarningActive =
    projectInfo?.subscription_type === "free_trial"
      ? isWarning <= 16
      : isWarning <= 7;

  return (
    <>
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <SubscriptionWarning
          projectInfo={projectInfo}
          handleOpenBilling={handleOpenBilling}
        />
        <div
          className={`${isWarningActive || (projectInfo?.status === "inactive" && !location?.pathname?.includes("constructor")) ? styles.layoutWarning : styles.layout} ${darkMode ? styles.dark : ""}`}>
          {favicon && <Favicon url={favicon} />}
          <LayoutSidebar
            appId={appId}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            handleOpenProfileModal={handleOpenProfileModal}
          />
          <div
            className={
              location.pathname?.includes("constructor") ||
              location.pathname?.includes("object")
                ? styles.contentLayout
                : styles.content
            }>
            <Outlet />
          </div>
        </div>

        <SettingsPopup
          open={openProfileModal}
          onClose={handleCloseProfileModal}
        />
      </ThemeProvider>
    </>
  );
};

export default MainLayout;
