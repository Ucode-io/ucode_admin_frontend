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
import {
  Box,
  CssBaseline,
  Typography,
  createMuiTheme,
  createTheme,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const MainLayout = ({setFavicon, favicon}) => {
  const {appId} = useParams();
  const projectId = store.getState().company.projectId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});
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

  return (
    <>
      <ThemeProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <div className={`${styles.layout} ${darkMode ? styles.dark : ""}`}>
          {favicon && <Favicon url={favicon} />}
          <LayoutSidebar
            appId={appId}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          <div className={styles.content}>
            {project_status === "insufficient_funds" && (
              <Box
                onClick={() =>
                  navigate(`/settings/auth/matrix/profile/crossed`, {
                    state: {
                      tab: 2,
                    },
                  })
                }
                sx={{
                  position: "sticky",
                  top: 0,
                  height: "45px",
                  width: "100%",
                  background: "rgb(255, 244, 180)",
                  left: 0,
                  padding: "10px 10px 10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  zIndex: 9,
                  gap: "30px",
                  cursor: "pointer",
                }}>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <WarningAmberIcon sx={{color: "#000", fontSize: 20}} />
                  <Typography
                    sx={{fontSize: "12px", fontWeight: "bold", color: "#000"}}>
                    Your invoice is past due
                  </Typography>
                </Box>
                <Typography sx={{fontSize: "12px", color: "#000"}}>
                  Please pay your invoice before your team is locked and your
                  subscription is downgraded.
                </Typography>
              </Box>
            )}
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default MainLayout;
