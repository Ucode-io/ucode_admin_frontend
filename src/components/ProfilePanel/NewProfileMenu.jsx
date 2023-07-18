import ApartmentIcon from "@mui/icons-material/Apartment";
import LayersIcon from "@mui/icons-material/Layers";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Box, Divider, Menu, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PlusIcon } from "../../assets/icons/icon";
import CompanyModal from "../../layouts/MainLayout/CompanyModal";
import {
  useCompanyListQuery,
  useEnvironmentListQuery,
  useProjectListQuery,
} from "../../services/companyService";
import { store } from "../../store";
import { authActions } from "../../store/auth/auth.slice";
import { companyActions } from "../../store/company/company.slice";
import UserAvatar from "../UserAvatar";
import EnvironmentsList from "./EnvironmentList/EnvironmentsList";
import ProfileItem from "./ProfileItem";
import ProjectList from "./ProjectList/ProjectsList";
import ResourceList from "./ResourceList";
import styles from "./newprofile.module.scss";
import KeyIcon from "@mui/icons-material/Key";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import WidgetsIcon from "@mui/icons-material/Widgets";
const NewProfilePanel = ({
  anchorEl,
  handleMenuSettingModalOpen,
  projectInfo,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const companies = store.getState().company.companies;
  const projects = store.getState().company.projects;
  const environments = store.getState().company.environments;
  const companyItem = store.getState().company.companyItem;
  const environmentItem = store.getState().company.environmentItem;
  const companyId = store.getState().company.companyId;
  const projectId = store.getState().company.projectId;
  const environmentId = store.getState().company.environmentId;
  const projectItem = store.getState().company.projectItem;
  const user_id = store.getState().auth.userId;
  const auth = store.getState().auth;
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const [projectListEl, setProjectListEl] = useState(null);
  const [environmentListEl, setEnvironmentListEl] = useState(null);
  const [companyModal, setCompanyModal] = useState(null);
  const menuVisible = Boolean(anchorEl || anchorProfileEl);
  const projectVisible = Boolean(projectListEl);
  const environmentVisible = Boolean(environmentListEl);

  const handleClick = () => {
    navigate(`/main/${appId}/api-key`);
  };

  const handleEnvNavigate = () => {
    navigate(`/main/${appId}/environments`);
  };
  const handleCompanyNavigate = () => {
    navigate(`/main/${appId}/company`);
  };
  const handleProjectNavigate = () => {
    navigate(`/main/${appId}/projects`);
  };
  const handleRedirectNavigate = () => {
    navigate(`/main/${appId}/redirects`);
  };
  const closeMenu = () => {
    setProfileAnchorEl(null);
  };
  const openMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleCompanySelect = (item, e) => {
    dispatch(companyActions.setCompanyItem(item));
    dispatch(companyActions.setCompanyId(item.id));
    dispatch(companyActions.setProjectItem({}));
    dispatch(companyActions.setEnvironmentItem({}));
    setProfileAnchorEl(e.currentTarget);
  };

  const openProjectList = (event) => {
    setProjectListEl(event.currentTarget);
    setProfileAnchorEl(event.currentTarget);
  };

  const closeProjectList = () => {
    setProjectListEl(null);
  };

  const openEnvironmentList = (event) => {
    setEnvironmentListEl(event.currentTarget);
    setProfileAnchorEl(event.currentTarget);
  };

  const closeEnvironmentList = () => {
    setEnvironmentListEl(null);
  };

  const closeCompanyModal = () => {
    setCompanyModal(null);
  };

  const logoutClickHandler = () => {
    dispatch(authActions.logout());
    dispatch(companyActions.setCompanies([]));
    closeMenu();
  };

  useEffect(() => {
    dispatch(
      companyActions.setCompanyItem(
        companies.find((item) => item.id === companyId)
      )
    );
    dispatch(
      companyActions.setEnvironmentItem(
        environments?.find((item) => item.id === environmentId)
      )
    );
    dispatch(
      companyActions.setProjectItem(
        projects?.find((item) => item.project_id === projectId)
      )
    );
  }, []);

  //   useEffect(() => {
  //     dispatch(
  //       companyActions.setProjectItem(
  //         projects?.find((item) => item.project_id === projectId)
  //       )
  //     );
  //   }, [companyId]);

  const { isLoading } = useCompanyListQuery({
    params: {
      owner_id: user_id,
    },
    queryParams: {
      onSuccess: (res) => {
        dispatch(companyActions.setCompanies(res.companies));
      },
    },
  });
  const { isLoading: projectLoading } = useProjectListQuery({
    params: {
      company_id: companyId,
    },
    queryParams: {
      enabled: Boolean(companyId),
      onSuccess: (res) => {
        dispatch(companyActions.setProjects(res.projects));
        dispatch(companyActions.setProjectItem(res.projects[0]));
        dispatch(companyActions.setProjectId(res.projects[0].project_id));
      },
    },
  });
  const { isLoading: environmentLoading } = useEnvironmentListQuery({
    params: {
      project_id: projectId,
    },
    queryParams: {
      enabled: Boolean(projectId),
      onSuccess: (res) => {
        dispatch(companyActions.setEnvironments(res.environments));
        dispatch(companyActions.setEnvironmentItem(res.environments[0]));
        dispatch(companyActions.setEnvironmentId(res.environments[0].id));
      },
    },
  });

  return (
    <div>
      <UserAvatar
        user={{
          name: "User",
          photo_url: "https://image.emojisky.com/71/8041071-middle.png",
        }}
        onClick={openMenu}
      />
      <Menu
        id="lock-menu"
        anchorEl={anchorProfileEl || anchorEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.profilemenu, paper: styles.profilepaper }}
      >
        <Box className={styles.leftblock}>
          <div className={styles.block}>
            <div className={styles.companyblock}>
              {companies?.map((item) => (
                <ProfileItem
                  children={
                    <Tooltip title={item?.name}>
                      <p
                        className={
                          item.id === companyId
                            ? styles.avatarborder
                            : styles.avatar
                        }
                        onClick={(e) => {
                          handleCompanySelect(item, e);
                        }}
                      >
                        {item?.name?.charAt(0).toUpperCase()}
                      </p>
                    </Tooltip>
                  }
                  type="company"
                  className={styles.company}
                />
              ))}
              <p
                className={styles.createbutton}
                onClick={() => {
                  setCompanyModal(true);
                }}
              >
                <PlusIcon fill={"#007AFF"} />
              </p>
            </div>
          </div>
        </Box>
        <Box className={styles.centerblock}>
          <div className={styles.block}>
            <ProfileItem
              children={
                <>
                  <p className={styles.companyavatar}>
                    {companyItem?.name?.charAt(0).toUpperCase()}
                  </p>
                  {companyItem?.name}
                </>
              }
            />
            <ProfileItem
              children={
                <ApartmentIcon
                  style={{
                    color: "#747474",
                  }}
                />
              }
              text={"Settings"}
              onClick={handleCompanyNavigate}
            />
          </div>
          <Divider />
          <div className={styles.block}>
            {projectItem.project_id === projectId && (
              <ProfileItem
                children={
                  <ResourceList
                    item={projectItem?.title}
                    className={styles.projectavatar}
                    colorItem={projectItem}
                  />
                }
                onClick={openProjectList}
              />
            )}
            <ProfileItem
              children={
                <LayersIcon
                  style={{
                    color: "#747474",
                  }}
                />
              }
              text={"Projects"}
              onClick={handleProjectNavigate}
            />
            {environmentItem.id === environmentId && (
              <ProfileItem
                children={
                  <ResourceList
                    item={environmentItem?.name}
                    className={styles.environmentavatar}
                    colorItem={environmentItem}
                  />
                }
                onClick={openEnvironmentList}
              />
            )}
            <ProfileItem
              children={
                <LocalOfferIcon
                  style={{
                    color: "#747474",
                  }}
                />
              }
              text={"Environments"}
              onClick={handleEnvNavigate}
            />
          </div>
          <Divider />
          <div className={styles.block}>
            <ProfileItem
              children={
                <KeyIcon
                  style={{
                    color: "#747474",
                  }}
                />
              }
              text={"Api Keys"}
              onClick={handleClick}
            />
            <ProfileItem
              children={
                <MoveUpIcon
                  style={{
                    color: "#747474",
                  }}
                />
              }
              text={"Redirects"}
              onClick={handleRedirectNavigate}
            />
          </div>
          <Divider />

          <div className={styles.block}>
            <ProfileItem
              children={
                <WidgetsIcon
                  style={{
                    color: "#747474",
                  }}
                />
              }
              text={"Menu settings"}
              onClick={() => {
                handleMenuSettingModalOpen();
                closeMenu();
              }}
            />
          </div>
        </Box>
        <Box className={styles.centerblock}>
          <div className={styles.block}>
            <ProfileItem
              children={
                <>
                  <p className={styles.companyavatar}>
                    {auth?.userInfo?.name?.charAt(0).toUpperCase() ||
                      auth?.userInfo?.login?.charAt(0).toUpperCase()}
                  </p>
                  {auth?.userInfo?.name || auth?.userInfo?.login}
                </>
              }
            />
          </div>
          <Divider />
          <div className={styles.block}>
            <ProfileItem
              text={"Profile settings"}
              onClick={() => {
                navigate(`/settings/auth/matrix/profile/crossed`);
              }}
            />
            <ProfileItem
              text={"Настройки"}
              onClick={() => {
                navigate(`/settings/constructor/apps`);
              }}
            />
            <ProfileItem text={"Logout"} onClick={logoutClickHandler} />
          </div>
        </Box>
      </Menu>

      <ProjectList
        projectListEl={projectListEl}
        closeProjectList={closeProjectList}
        projectVisible={projectVisible}
        projectList={projects}
      />
      <EnvironmentsList
        environmentListEl={environmentListEl}
        closeEnvironmentList={closeEnvironmentList}
        environmentVisible={environmentVisible}
        environmentList={environments}
      />
      {companyModal && <CompanyModal closeModal={closeCompanyModal} />}
    </div>
  );
};

export default NewProfilePanel;
