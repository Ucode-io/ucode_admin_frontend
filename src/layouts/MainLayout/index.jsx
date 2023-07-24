import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import styles from "./style.module.scss";
import Favicon from "react-favicon";
import LayoutSidebar from "../../components/LayoutSidebar";
import { useProjectGetByIdQuery } from "../../services/projectService";
import { store } from "../../store";

const MainLayout = ({ setFavicon, favicon }) => {
  const { appId } = useParams();
  const projectId = store.getState().company.projectId;

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  useEffect(() => {
    setFavicon(projectInfo?.logo);
    document.title = projectInfo?.title;
  }, [projectInfo]);

  return (
    <div className={styles.layout}>
      {favicon && <Favicon url={favicon} />}
      <LayoutSidebar appId={appId} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
