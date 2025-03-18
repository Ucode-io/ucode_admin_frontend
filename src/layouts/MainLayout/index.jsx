import {CssBaseline, createTheme} from "@mui/material";
import {ThemeProvider} from "@mui/styles";
import {useEffect, useState} from "react";
import Favicon from "react-favicon";
import {useDispatch} from "react-redux";
import {Outlet, useParams} from "react-router-dom";
import LayoutSidebar from "../../components/LayoutSidebar";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import {isOnlineReducerAction} from "../../store/isOnline/isOnline.slice";
import styles from "./style.module.scss";
import SubscriptionWarning from "./SubscriptionWarning";

const MainLayout = ({setFavicon, favicon}) => {
  const {appId} = useParams();
  const projectId = store.getState().company.projectId;
  const updateSearchParam = useSearchParams()[2];

  const dispatch = useDispatch();
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

  return (
    <>
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <SubscriptionWarning projectInfo={projectInfo} />
        <div className={`${styles.layout} ${darkMode ? styles.dark : ""}`}>
          {favicon && <Favicon url={favicon} />}
          <LayoutSidebar
            appId={appId}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            handleOpenProfileModal={handleOpenProfileModal}
          />
          <div className={styles.content}>
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
