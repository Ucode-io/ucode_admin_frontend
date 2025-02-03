import {Menu} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import authService from "../../services/auth/authService";
import {store} from "../../store";
import {authActions} from "../../store/auth/auth.slice";
import {companyActions} from "../../store/company/company.slice";
import UserAvatar from "../UserAvatar";
import ProfileItem from "./ProfileItem";
import styles from "./newprofile.module.scss";
import useBooleanState from "../../hooks/useBooleanState";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {languagesActions} from "../../store/globalLanguages/globalLanguages.slice";
import {useTranslation} from "react-i18next";

const NewProfilePanel = ({setSidebarAnchor, sidebarAnchorEl,}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = store.getState().company;
  const auth = store.getState().auth;
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const [selected, setSelected] = useState(false);
  const menuVisible = Boolean(anchorProfileEl || sidebarAnchorEl);
  const location = useLocation();

  const settings = location.pathname.includes("settings");
  const {i18n} = useTranslation();
  const defaultLanguage = useSelector(
    (state) => state.languages.defaultLanguage
  );
  const params = {
    refresh_token: auth?.refreshToken,
    env_id: company.environmentId,
    project_id: company.projectId,
    for_env: true,
  };

  const permissions = useSelector((state) => state.auth.globalPermissions);

  const projectId = useSelector((state) => state.company.projectId);
  const {data: projectInfo = []} = useProjectGetByIdQuery({projectId});

  const closeMenu = (e) => {
    e.stopPropagation();
    setSidebarAnchor(false);
    setProfileAnchorEl(null);
  };
  const openMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const logoutClickHandler = () => {
    dispatch(authActions.logout());
    dispatch(companyActions.setCompanies([]));
    closeMenu();
  };

  const refreshTokenFunc = (env_id) => {
    authService
      .updateToken({...params, env_id: env_id}, {...params})
      .then((res) => {
        store.dispatch(authActions.setTokens(res));
        window.location.reload();
        dispatch(companyActions.setEnvironmentId(env_id));
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


  const languages = useMemo(() => {
    return projectInfo?.language?.map((lang) => ({
      title: lang?.name,
      slug: lang?.short_name,
    }));
  }, [projectInfo]);

  const getDefaultLanguage = () => {
    const isLanguageExist = languages?.some(
      (item) => defaultLanguage === item?.slug
    );

    if (languages?.length) {
      if (languages?.length === 1) {
        dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
        i18n.changeLanguage(languages?.[0]?.slug);
      } else if (languages?.length > 1) {
        if (!defaultLanguage) {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          i18n.changeLanguage(languages?.[0]?.slug);
        } else if (defaultLanguage && isLanguageExist) {
          dispatch(languagesActions.setDefaultLanguage(defaultLanguage));
          i18n.changeLanguage(defaultLanguage);
        } else {
          dispatch(languagesActions.setDefaultLanguage(languages?.[0]?.slug));
          i18n.changeLanguage(languages?.[0]?.slug);
        }
      }
    }
  };

  useEffect(() => {
    if (projectId) {
      dispatch(languagesActions.setLanguagesItems(languages));
    }
  }, [languages, projectId, dispatch]);

  useEffect(() => {
    getDefaultLanguage();
  }, [languages?.length]);

  const onClose = (e) => {
    closeMenu(e);
    if (selected) refreshTokenFunc();
  };

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
        anchorEl={anchorProfileEl || sidebarAnchorEl}
        open={menuVisible}
        onClose={(e) => {
          onClose(e);
        }}
        classes={{
          list: styles.profilemenu,
          paper: settings ? styles.settingspaper : styles.profilepaper,
        }}>
        <div className={styles.block}>
          {permissions?.profile_settings_button && (
            <ProfileItem
              text={"Profile settings"}
              onClick={() => {
                navigate(`/settings/auth/matrix/profile/crossed`);
              }}
            />
          )}

          <ProfileItem text={"Logout"} onClick={logoutClickHandler}/>
        </div>
      </Menu>
    </div>
  );
};

export default NewProfilePanel;
