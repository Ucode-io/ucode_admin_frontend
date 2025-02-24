import {Box, Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import {useNavigate, useParams} from "react-router-dom";
import {updateLevel} from "../../../../utils/level";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const apiKeyButton = {
  label: "Api keys",
  type: "USER_FOLDER",
  icon: "key.svg",
  parent_id: adminId,
  id: "009",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const ApiKeyButton = ({projectSettingLan}) => {
  const {appId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {i18n} = useTranslation();

  const clickHandler = () => {
    navigate(`/main/${appId}/api-key`);
    dispatch(menuActions.setMenuItem(apiKeyButton));
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={{
            borderRadius: "8px",
            height: "32px",
            color: "#475465",
          }}
          className="nav-element highlight-on-hover"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label" style={{fontSize: "13px"}}>
            <IconGenerator icon={apiKeyButton?.icon} size={18} />
            {generateLangaugeText(
              projectSettingLan,
              i18n?.language,
              "Api keys"
            ) || "Api keys"}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default ApiKeyButton;
