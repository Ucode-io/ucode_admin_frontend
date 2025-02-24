import {Box, Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import "../../style.scss";
import {useNavigate, useParams} from "react-router-dom";
import InventoryIcon from "@mui/icons-material/Inventory";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import IconGenerator from "../../../IconPicker/IconGenerator";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const activityFeedData = {
  label: "Activity logs",
  type: "USER_FOLDER",
  icon: "key.svg",
  parent_id: adminId,
  id: "123430",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ActivityFeedButton = ({
  level = 1,
  menuStyle,
  menuItem,
  setSubMenuIsOpen,
  pinIsEnabled,
  projectSettingLan,
}) => {
  const {appId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {i18n} = useTranslation();

  const clickHandler = () => {
    navigate(`/main/${appId}/activity`);
    dispatch(menuActions.setMenuItem(activityFeedData));
    if (!pinIsEnabled) {
      setSubMenuIsOpen(false);
    }
  };

  return (
    <Box margin="0 5px">
      <div className="parent-block column-drag-handle">
        <Button
          style={{color: "#475467", borderRadius: "8px", height: "32px"}}
          className="nav-element highlight-on-hover"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label">
            <InventoryIcon size={18} />
            <IconGenerator icon={"lock.svg"} size={18} />
            {generateLangaugeText(
              projectSettingLan,
              i18n?.language,
              "Activity logs"
            ) ?? "Activity logs"}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default ActivityFeedButton;
