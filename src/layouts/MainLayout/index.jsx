import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import useSidebarElements from "../../hooks/useSidebarElements";
import { fetchConstructorTableListAction } from "../../store/constructorTable/constructorTable.thunk";
import RouterTabsBlock from "./RouterTabsBlock";
import styles from "./style.module.scss";
import projectService from "@/services/projectService";
import Favicon from "react-favicon";
import environmentService from "../../services/environmentService";
import LayoutSidebar from "../../components/LayoutSidebar";

const MainLayout = ({ setFavicon, favicon }) => {
  const projectId = useSelector((state) => state.auth.projectId);
  const envId = useSelector((state) => state.auth.environmentId);
  const { appId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { elements } = useSidebarElements();

  useEffect(() => {
    dispatch(fetchConstructorTableListAction(appId));
  }, [dispatch, appId]);

  const getAppById = () => {
    dispatch(fetchConstructorTableListAction(appId));
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        navigate(-1);
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

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
      {/* <Sidebar elements={elements} environment={environment} /> */}
      <LayoutSidebar
        elements={elements}
        appId={appId}
        environment={environment}
        getAppById={getAppById}
      />
      <div className={styles.content}>
        <RouterTabsBlock />

        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
