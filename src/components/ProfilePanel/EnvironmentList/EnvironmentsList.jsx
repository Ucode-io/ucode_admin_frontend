import { Menu } from "@mui/material";
import styles from "./environment.module.scss";
import { useDispatch } from "react-redux";
import ProfileItem from "../ProfileItem";
import { companyActions } from "../../../store/company/company.slice";

const EnvironmentsList = ({
  environmentListEl,
  closeEnvironmentList,
  environmentVisible,
  environmentList,
  refreshTokenFunc,
}) => {
  const dispatch = useDispatch();

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
