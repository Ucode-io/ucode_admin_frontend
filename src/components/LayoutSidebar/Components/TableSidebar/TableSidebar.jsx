import {Box, Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import IconGeneratorIconjs from "../../../IconPicker/IconGeneratorIconjs";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const projectFolder = {
  label: "Models",
  type: "USER_FOLDER",
  icon: "table.svg",
  parent_id: adminId,
  id: "09",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

const TableSettingSidebar = ({level = 1, projectSettingLan}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {appId} = useParams();
  const {i18n} = useTranslation();

  const clickHandler = (e) => {
    navigate(`/main/${appId}/tables`);
    dispatch(menuActions.setMenuItem(projectFolder));
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle">
        <Button
          style={{borderRadius: "8px", color: "#475467"}}
          className="nav-element"
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label" style={{fontSize: "13px"}}>
            {projectFolder?.icon?.includes(":") ? (
              <IconGeneratorIconjs icon={projectFolder?.icon} size={18} />
            ) : (
              <IconGenerator icon={projectFolder?.icon} size={18} />
            )}
            {/* <IconGenerator icon={projectFolder?.icon} size={18} /> */}
            {generateLangaugeText(
              projectSettingLan,
              i18n?.language,
              "Models"
            ) ?? "Models"}
          </div>
        </Button>
      </div>
    </Box>
  );
};

export default TableSettingSidebar;
