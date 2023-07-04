import { useEffect } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import styles from "./style.module.scss";
import projectService from "@/services/projectService";
import Favicon from "react-favicon";
import environmentService from "../../services/environmentService";
import LayoutSidebar from "../../components/LayoutSidebar";

const MainLayout = ({ setFavicon, favicon }) => {
  const projectId = useSelector((state) => state.auth.projectId);
  const envId = useSelector((state) => state.auth.environmentId);
  const { appId } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const keyDownHandler = (event) => {
  //     if (event.key === "Escape") {
  //       event.preventDefault();
  //       navigate(-1);
  //     }
  //   };

  //   document.addEventListener("keydown", keyDownHandler);
  //   return () => {
  //     document.removeEventListener("keydown", keyDownHandler);
  //   };
  // }, []);

  const { data: environment } = useQuery(["GET_ENVIRONMENT", envId], () => {
    return environmentService.getEnvironments(envId);
  });

  const { data: projectInfo } = useQuery(
    ["GET_PROJECT_BY_ID", projectId],
    () => {
      return projectService.getById(projectId);
    }
  );

  useEffect(() => {
    setFavicon(projectInfo?.logo);
    document.title = projectInfo?.title;
  }, [projectInfo]);

  return (
    <div className={styles.layout}>
      <Favicon url={favicon} />
      <LayoutSidebar appId={appId} environment={environment} />
      <div className={styles.content}>
        {/* <RouterTabsBlock selectedTable={selectedTable} /> */}

        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
