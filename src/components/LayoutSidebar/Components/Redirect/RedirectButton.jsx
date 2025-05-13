import MoveUpIcon from "@mui/icons-material/MoveUp";
import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import "../../style.scss";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const redirectButton = {
  label: "Custom endpoint",
  type: "USER_FOLDER",
  icon: "key.svg",
  parent_id: adminId,
  id: "0010",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const RedirectButton = ({
  level = 1,
  menuStyle,
  menuItem,
  projectSettingLan,
}) => {
  const {appId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {i18n} = useTranslation();

  const clickHandler = () => {
    navigate(`/main/${appId}/redirects`);
    dispatch(menuActions.setMenuItem(redirectButton));
  };

  return (
    <Box sx={{paddingLeft: "10px"}}>
      <div className="parent-block column-drag-handle">
        <Button
          style={{
            color: "#475465",
            height: "32px",
            borderRadius: "8px",
            paddingLeft: "25px",
          }}
          className="nav-element highlight-on-hover"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label" style={{fontSize: "13px"}}>
            <MoveUpIcon size={18} />
            {generateLangaugeText(
              projectSettingLan,
              i18n?.language,
              "Custom endpoint"
            ) || "Custom endpoint"}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default RedirectButton;
