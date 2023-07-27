import { Menu } from "@mui/material";
import styles from "./environment.module.scss";
import { useDispatch, useSelector } from "react-redux";
import ProfileItem from "../ProfileItem";
import { companyActions } from "../../../store/company/company.slice";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const EnvironmentsList = ({
  environmentListEl,
  closeEnvironmentList,
  environmentVisible,
  environmentList,
  handleEnvNavigate,
}) => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.auth.globalPermissions);

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

              // refreshTokenFunc(item.id);
            }}
            className={styles.menuItem}
          />
        ))}
        {permissions?.environments_button && (
          <ProfileItem
            children={
              <LocalOfferIcon
                style={{
                  color: "#747474",
                }}
              />
            }
            className={styles.menuItem}
            text={"Environments"}
            onClick={() => {
              handleEnvNavigate();
              closeEnvironmentList();
            }}
          />
        )}
      </div>
    </Menu>
  );
};

export default EnvironmentsList;
