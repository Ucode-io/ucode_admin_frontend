import { Divider, Menu, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { authActions } from "../../store/auth/auth.slice";
import UserAvatar from "../UserAvatar";
import styles from "./newprofile.module.scss";
import { store } from "../../store";
import { companyActions } from "../../store/company/company.slice";
import ProfileItem from "./ProfileItem";
import { PlusIcon } from "../../assets/icons/icon";
import CompanyModal from "../../layouts/MainLayout/CompanyModal";
import {
  useCompanyListQuery,
  useEnvironmentListQuery,
  useProjectListQuery,
} from "../../services/companyService";
import ProjectList from "./ProjectList/ProjectsList";
import EnvironmentsList from "./EnvironmentList/EnvironmentsList";

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
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const [projectListEl, setProjectListEl] = useState(null);
  const [environmentListEl, setEnvironmentListEl] = useState(null);
  const [companyModal, setCompanyModal] = useState(null);
  const menuVisible = Boolean(anchorEl || anchorProfileEl);
  const projectVisible = Boolean(projectListEl);
  const environmentVisible = Boolean(environmentListEl);
  console.log("companies", companies);

  const handleClick = () => {
    navigate(`/main/${appId}/api-key`);
  };

  const handleEnvNavigate = () => {
    navigate(`/main/${appId}/environments`);
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
        <Divider />
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
          <ProfileItem text={"Settings"} />
        </div>
        <Divider />
        <div className={styles.block}>
          <ProfileItem text={"Projects"} onClick={openProjectList} />
          {projectItem.project_id === projectId && (
            <ProfileItem
              children={
                <>
                  <p className={styles.projectavatar}>
                    {projectItem?.title?.charAt(0).toUpperCase()}
                  </p>
                  {projectItem?.title}
                </>
              }
            />
          )}
          <ProfileItem text={"Environments"} onClick={openEnvironmentList} />
          {environmentItem.id === environmentId && (
            <ProfileItem
              children={
                <>
                  <p
                    className={styles.environmentavatar}
                    style={{
                      background: environmentItem.display_color,
                    }}
                  >
                    {environmentItem?.name?.charAt(0).toUpperCase()}
                  </p>
                  {environmentItem?.name}
                </>
              }
            />
          )}
        </div>
        <Divider />
        <div className={styles.block}>
          <ProfileItem text={"Api Keys"} onClick={handleClick} />
          <ProfileItem text={"Environments"} onClick={handleEnvNavigate} />
          <ProfileItem text={"Projects"} onClick={handleProjectNavigate} />
          <ProfileItem text={"Redirects"} onClick={handleRedirectNavigate} />
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
        <Divider />

        <div className={styles.block}>
          <ProfileItem
            text={"Menu settings"}
            onClick={() => {
              handleMenuSettingModalOpen();
              closeMenu();
            }}
          />
        </div>
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
