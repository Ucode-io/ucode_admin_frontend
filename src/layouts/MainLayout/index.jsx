import {useEffect, useState} from "react";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import styles from "./style.module.scss";
import Favicon from "react-favicon";
import LayoutSidebar from "../../components/LayoutSidebar";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import {isOnlineReducerAction} from "../../store/isOnline/isOnline.slice";
import {useDispatch} from "react-redux";
import {ThemeProvider} from "@mui/styles";
import {Box, CssBaseline, Typography, createTheme} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {differenceInCalendarDays, differenceInDays, parseISO} from "date-fns";
import { SettingsPopup } from "../../views/SettingsPopup";
import useSearchParams from "../../hooks/useSearchParams";
import { TAB_COMPONENTS } from "../../utils/constants/settingsPopup";

const MainLayout = ({setFavicon, favicon}) => {
  const {appId} = useParams();
  const projectId = store.getState().company.projectId;
  const updateSearchParam = useSearchParams()[2];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: projectInfo } = useProjectGetByIdQuery({
    projectId,
    queryParams: {
      onSuccess: (data) => {
        localStorage.setItem("project_status", data?.status);
      },
    },
  });

  const project_status = localStorage.getItem("project_status");

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

  const getDaysLeft = (expireDate) => {
    const today = new Date();
    const expiration = parseISO(expireDate);

    return differenceInCalendarDays(expiration, today) + 1;
  };
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);

  const handleOpenBilling = () => {
    handleOpenProfileModal();
    updateSearchParam("activeTab", TAB_COMPONENTS.BILLING);
  };

  return (
    <>
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        {getDaysLeft(projectInfo?.expire_date) <= 5 &&
          (project_status === "insufficient_funds" ? (
            <SubscriptionError
              onClick={handleOpenBilling}
              projectInfo={projectInfo}
              getDaysLeft={getDaysLeft}
            />
          ) : project_status === "inactive" ? (
            <SubscriptionWarning
              onClick={handleOpenBilling}
              projectInfo={projectInfo}
              getDaysLeft={getDaysLeft}
            />
          ) : (
            ""
          ))}

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

const SubscriptionError = ({
  projectInfo,
  getDaysLeft = () => {},
  onClick = () => {},
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "sticky",
        top: 0,
        height: "32px",
        width: "100%",
        background: "rgb(255, 244, 180)",
        left: 0,
        padding: "10px 10px 10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 9,
        // gap: "30px",
        cursor: "pointer",
      }}>
      <Box sx={{display: "flex", alignItems: "center"}}>
        <WarningAmberIcon
          sx={{color: "#000", fontSize: 20, marginRight: "10px"}}
        />
        <Typography sx={{fontSize: "12px", fontWeight: "bold", color: "#000"}}>
          Your subscription will expire in{" "}
          <strong>{getDaysLeft(projectInfo?.expire_date)}</strong> days.
        </Typography>
      </Box>
      <Typography sx={{fontSize: "12px", color: "#000"}}>
        Please <strong>Click here</strong> to avoid service interruptions, to
        upgrade your plan.
      </Typography>
    </Box>
  );
};

const SubscriptionWarning = ({
  projectInfo,
  getDaysLeft = () => {},
  onClick = () => {}
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "sticky",
        top: 0,
        height: "32px",
        width: "100%",
        background: "#FFBDB8",
        left: 0,
        padding: "10px 10px 10px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        zIndex: 9,
        cursor: "pointer",
      }}>
      <Box sx={{display: "flex", alignItems: "center"}}>
        <WarningAmberIcon
          sx={{color: "#000", fontSize: 20, marginRight: "10px"}}
        />
        <Typography sx={{fontSize: "12px", fontWeight: "bold", color: "#000"}}>
          Your subscription has expired.
        </Typography>
      </Box>
      <Typography sx={{fontSize: "12px", color: "#000"}}>
        Please renew to continue accessing our services.{" "}
        <strong style={{textDecoration: "underline"}}>
          Click here to upgrade your plan
        </strong>
      </Typography>
    </Box>
  );
};

export default MainLayout;
