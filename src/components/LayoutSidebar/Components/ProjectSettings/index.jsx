import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Button, Collapse, Tooltip} from "@mui/material";
import React, {useState} from "react";
import IconGenerator from "../../../IconPicker/IconGenerator";
import {useDispatch, useSelector} from "react-redux";
import {menuActions} from "../../../../store/menuItem/menuItem.slice";
import RecursiveBlock from "./RecursiveBlock";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";

export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
const projectSettings = {
  label: "Project Settings",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: adminId,
  id: "122223",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

function ProjectSettings({level = 1, menuStyle, projectSettingLan}) {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const menuItem = useSelector((state) => state.menu.menuItem);
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const clickHandler = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
    dispatch(menuActions.setMenuItem(projectSettings));
  };

  return (
    <Box sx={{padding: "0 5px"}} style={{marginBottom: 5}}>
      <div className="parent-block column-drag-handle ">
        <Button
          style={menuStyle}
          className="nav-element childMenuFolderBtn highlight-on-hover "
          onClick={(e) => {
            clickHandler(e);
          }}>
          <div className="label">
            <div className="childMenuFolderArrow">
              {childBlockVisible ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowRightIcon />
              )}
            </div>

            <div className="childMenuIcon">
              <IconGenerator icon={"lock.svg"} size={18} />
            </div>

            {generateLangaugeText(
              projectSettingLan,
              i18n?.language,
              "Project Settings"
            ) ?? "Project Settings"}
          </div>
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        <RecursiveBlock
          level={2}
          menuStyle={menuStyle}
          menuItem={menuItem}
          projectSettingLan={projectSettingLan}
        />
      </Collapse>
    </Box>
  );
}

export default ProjectSettings;
