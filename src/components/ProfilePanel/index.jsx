import { Logout, Settings } from "@mui/icons-material";
import { Menu } from "@mui/material";
import { useState } from "react";
import { useAliveController } from "react-activation";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { authActions } from "../../store/auth/auth.slice";
import UserAvatar from "../UserAvatar";
import styles from "./style.module.scss";
import KeyIcon from "@mui/icons-material/Key";

const ProfilePanel = ({ anchorEl, setAnchorEl }) => {
  const [anchorProfileEl, setProfileAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl || anchorProfileEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clear } = useAliveController();
  const { appId } = useParams();

  const handleClick = () => {
    navigate(`/main/${appId}/api-key`);
  };
  const closeMenu = () => {
    setProfileAnchorEl(null);
  };
  const openMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const logoutClickHandler = () => {
    dispatch(authActions.logout());
    closeMenu();
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
        anchorEl={anchorEl || anchorProfileEl}
        open={menuVisible}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <div className={styles.scrollBlocksss}>
          <div className={styles.menuItem} onClick={handleClick}>
            <KeyIcon className={styles.dragIcon} />

            <p className={styles.itemText}>Api Keys</p>
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              navigate(`/settings/auth/matrix/profile/crossed`);
            }}
          >
            <Settings className={styles.dragIcon} />

            <p className={styles.itemText}>Profile settings</p>
          </div>

          <div className={styles.menuItem} onClick={logoutClickHandler}>
            <Logout className={styles.dragIcon} />

            <p className={styles.itemText}>Logout</p>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default ProfilePanel;
