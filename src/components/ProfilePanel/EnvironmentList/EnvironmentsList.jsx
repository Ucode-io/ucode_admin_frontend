import { Menu } from "@mui/material";
import styles from "./environment.module.scss";
import { useDispatch } from "react-redux";
import ProfileItem from "../ProfileItem";
import { companyActions } from "../../../store/company/company.slice";
import authService from "../../../services/auth/authService";
import { store } from "../../../store";
import { authActions } from "../../../store/auth/auth.slice";

const EnvironmentsList = ({
  environmentListEl,
  closeEnvironmentList,
  environmentVisible,
  environmentList,
}) => {
  const dispatch = useDispatch();
  const refreshToken = store.getState().auth.refreshToken;
  const environmentId = store.getState().company.environmentId;
  const projectId = store.getState().company.projectId;

  const params = {
    refresh_token: refreshToken,
    env_id: environmentId,
    project_id: projectId,
  };

  const refreshTokenFunc = (env_id) => {
    authService
      .updateToken({ ...params, env_id: env_id })
      .then((res) => {
        console.log("res", res);
        store.dispatch(authActions.setTokens(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Menu
      id="lock-menu"
      anchorEl={environmentListEl}
      open={environmentVisible}
      onClose={closeEnvironmentList}
      classes={{
        list: styles.environmentslist,
        paper: styles.environmentpaper,
      }}
    >
      <div className={styles.block}>
        {environmentList.map((item) => (
          <ProfileItem
            children={
              <>
                <p
                  className={styles.projectavatar}
                  style={{
                    background: item?.display_color,
                  }}
                >
                  {item?.name?.charAt(0).toUpperCase()}
                </p>
                {item?.name}
              </>
            }
            onClick={() => {
              dispatch(companyActions.setEnvironmentItem(item));
              dispatch(companyActions.setEnvironmentId(item.id));
              closeEnvironmentList();
              refreshTokenFunc(item.id);
            }}
            className={styles.menuItem}
          />
        ))}
      </div>
    </Menu>
  );
};

export default EnvironmentsList;
