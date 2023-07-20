import ApartmentIcon from "@mui/icons-material/Apartment";
import KeyIcon from "@mui/icons-material/Key";
import LayersIcon from "@mui/icons-material/Layers";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { Box, Divider, Menu, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PlusIcon } from "../../assets/icons/icon";
import CompanyModal from "../../layouts/MainLayout/CompanyModal";
import authService from "../../services/auth/authService";
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
import { useQueryClient } from "react-query";

const NewProfilePanel = ({
  anchorEl,
  handleMenuSettingModalOpen,
  projectInfo,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appId } = useParams();
  const queryClient = useQueryClient();
  const company = store.getState().company;
  const auth = store.getState().auth;
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const [projectListEl, setProjectListEl] = useState(null);
  const [environmentListEl, setEnvironmentListEl] = useState(null);
  const [companyModal, setCompanyModal] = useState(null);
  const [selected, setSelected] = useState(false);
  const menuVisible = Boolean(anchorEl || anchorProfileEl);
  const projectVisible = Boolean(projectListEl);
  const environmentVisible = Boolean(environmentListEl);
  const location = useLocation();
  const settings = location.pathname.includes("settings");

  const params = {
    refresh_token: auth.refreshToken,
    env_id: company.environmentId,
    project_id: company.projectId,
  };

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
    // refreshTokenFunc();
  };
  const openMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleCompanySelect = (item, e) => {
    setSelected(true);
    dispatch(companyActions.setCompanyItem(item));
    dispatch(companyActions.setCompanyId(item.id));
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

  const refreshTokenFunc = (env_id) => {
    authService
      .updateToken(params)
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    dispatch(
      companyActions.setCompanyItem(
        company.companies.find((item) => item.id === company.companyId)
      )
    );
    dispatch(
      companyActions.setEnvironmentItem(
        company.environments?.find((item) => item.id === company.environmentId)
      )
    );
    dispatch(
      companyActions.setProjectItem(
        company.projects?.find((item) => item.project_id === company.projectId)
      )
    );
  }, [company.companies, company.environments]);

  const { isLoading } = useCompanyListQuery({
    params: {
      owner_id: auth.userId,
    },
    queryParams: {
      onSuccess: (res) => {
        dispatch(companyActions.setCompanies(res.companies));
      },
    },
  });

  const { isLoading: projectLoading } = useProjectListQuery({
    params: {
      company_id: company.companyId,
    },
    queryParams: {
      enabled: Boolean(company.companyId),
      onSuccess: (res) => {
        dispatch(companyActions.setProjects(res.projects));
        if (selected) {
          dispatch(companyActions.setProjectItem(res.projects[0]));
          dispatch(companyActions.setProjectId(res.projects[0].project_id));
        }
      },
    },
  });

  const { isLoading: environmentLoading } = useEnvironmentListQuery({
    params: {
      project_id: company.projectId,
    },
    queryParams: {
      enabled: Boolean(company.projectId),
      onSuccess: (res) => {
        if (selected) {
          dispatch(companyActions.setEnvironmentItem(res.environments[0]));
          dispatch(companyActions.setEnvironmentId(res.environments[0].id));
        }
        dispatch(companyActions.setEnvironments(res.environments));
        setSelected(false);
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
        onClose={() => {
          closeMenu();
          refreshTokenFunc();
        }}
        classes={{
          list: styles.profilemenu,
          paper: settings ? styles.settingspaper : styles.profilepaper,
        }}
      >
        <Box className={styles.leftblock}>
          <div className={styles.block}>
            <div className={styles.companyblock}>
              {company.companies?.map((item) => (
                <ProfileItem
                  children={
                    <Tooltip title={item?.name}>
                      <p
                        className={
                          item.id === company.companyId
                            ? styles.avatarborder
                            : styles.avatar
                        }
                        onClick={(e) => {
                          handleCompanySelect(item, e);
                          queryClient.refetchQueries(["PROJECT"], item.id);
                        }}
                      >
                        {item?.name?.charAt(0).toUpperCase()}
                      </p>
                    </Tooltip>
                  }
                  key={item.id}
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
                    {company.companyItem?.name?.charAt(0).toUpperCase()}
                  </p>
                  {company.companyItem?.name}
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
            <ProfileItem
              children={
                <ResourceList
                  item={company.projectItem?.title || "No project"}
                  className={styles.projectavatar}
                  colorItem={company.projectItem}
                />
              }
              onClick={openProjectList}
            />
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
            <ProfileItem
              children={
                <ResourceList
                  item={company.environmentItem?.name || "No environment"}
                  className={styles.environmentavatar}
                  colorItem={company.environmentItem}
                />
              }
              onClick={openEnvironmentList}
            />
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
        projectList={company.projects}
        setSelected={setSelected}
      />
      <EnvironmentsList
        environmentListEl={environmentListEl}
        closeEnvironmentList={closeEnvironmentList}
        environmentVisible={environmentVisible}
        environmentList={company.environments}
        refreshTokenFunc={refreshTokenFunc}
      />
      {companyModal && <CompanyModal closeModal={closeCompanyModal} />}
    </div>
  );
};

export default NewProfilePanel;
