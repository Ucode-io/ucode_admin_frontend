import {Box, Button} from "@mui/material";
import {useDispatch} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {updateLevel} from "../../../../utils/level";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import IconGeneratorIconjs from "../../../IconPicker/IconGeneratorIconjs";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const projectFolder = {
  label: "Microfrontend",
  type: "USER_FOLDER",
  icon: "code.svg",
  parent_id: adminId,
  id: "09989",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const MicrofrontendSettingSidebar = ({projectSettingLan}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {appId} = useParams();
  const {i18n} = useTranslation();

  const clickHandler = (e) => {
    navigate(`/main/${appId}/microfrontend`);

    dispatch(menuActions.setMenuItem(projectFolder));
  };

  return (
    <Box style={{marginBottom: 5}}>
      <div className="parent-block column-drag-handle">
        <Button
          style={{borderRadius: "8px", height: "32px", fontSize: "13px"}}
          className="nav-element highlight-on-hover"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label" style={{color: "#475467"}}>
            {element?.icon?.includes(":") ? (
              <IconGeneratorIconjs icon={projectFolder?.icon} size={18} />
            ) : (
              <IconGenerator icon={projectFolder?.icon} size={18} />
            )}
            {/* <IconGenerator icon={projectFolder?.icon} size={18} /> */}
            {generateLangaugeText(
              projectSettingLan,
              i18n?.language,
              "Microfrontend"
            ) ?? "Microfrontend"}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default MicrofrontendSettingSidebar;
