import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import { store } from "../../../../store";
import { RiPencilFill } from "react-icons/ri";
import activeStyles from "../MenuUtils/activeStyles";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
export const analyticsId = `${import.meta.env.VITE_ANALYTICS_FOLDER_ID}`;

const PermissionSidebarRecursiveBlock = ({
  customFunc = () => {},
  element,
  level = 1,
  setElement,
  menuStyle,
  selectedApp,
  openUserFolderModal,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = store.getState().auth;
  const defaultAdmin = auth.roleInfo.name === "DEFAULT ADMIN";
  const { i18n } = useTranslation();
  const defaultLanguage = i18n.language;
  const readPermission = element?.data?.permission?.read;
  const withoutPermission =
    element?.parent_id === adminId || element?.parent_id === analyticsId
      ? true
      : false;
  const permission = defaultAdmin
    ? readPermission || withoutPermission
    : readPermission;
    const menuItem = useSelector((state) => state.menu.menuItem);
    const activeStyle = activeStyles({ menuItem, element, menuStyle, level });

  const navigateMenu = () => {
    return navigate(`/main/${adminId}/permission/${element?.guid}`);
  };

  const clickHandler = (e) => {
    dispatch(menuActions.setMenuItem(element));
    e.stopPropagation();
    navigateMenu();
    setElement(element);
  };

  const menuSettingsClick = (e) => {
    e?.stopPropagation();
    openUserFolderModal(element, "UPDATE");
    setElement(element);
    dispatch(menuActions.setMenuItem(element));
  };

  return (
    <Box sx={{ padding: "0 5px" }}>
      <div className="parent-block column-drag-handle" key={element.id}>
        {permission ? (
          <Button
            key={element.id}
            style={activeStyle}
            className="nav-element"
            onClick={(e) => {
              customFunc(e);
              clickHandler(e);
            }}
          >
            <div
              className="label"
              style={{
                color:
                  menuItem?.id === element?.id
                    ? menuStyle?.active_text
                    : menuStyle?.text,
                opacity: element?.isChild && 0.6,
              }}
            >
              {element?.type === "USER" && (
                <PersonIcon
                  style={{
                    color:
                      menuItem?.id === element?.id
                        ? "#fff"
                        : "rgb(45, 108, 229)",
                  }}
                />
              )}
              <IconGenerator
                icon={
                  element?.icon ||
                  element?.data?.microfrontend?.icon ||
                  element?.data?.webpage?.icon
                }
                size={18}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box>
                  <Tooltip
                    title={
                      element?.attributes?.[`label_${defaultLanguage}`] ??
                      element?.attributes?.[`title_${defaultLanguage}`] ??
                      element?.label ??
                      element?.name
                    }
                    placement="top"
                  >
                    <p>
                      {element?.attributes?.[`label_${defaultLanguage}`] ??
                        element?.attributes?.[`title_${defaultLanguage}`] ??
                        element?.label ??
                        element?.name}
                    </p>
                  </Tooltip>
                </Box>
                {selectedApp?.id !== adminId && (
                  <Box>
                    <Tooltip title="Edit client type" placement="top">
                      <Box className="extra_icon">
                        <RiPencilFill
                          size={13}
                          onClick={(e) => {
                            menuSettingsClick(e);
                          }}
                          style={{
                            color:
                              menuItem?.id === element?.id
                                ? menuStyle?.active_text
                                : menuStyle?.text || "",
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </div>
          </Button>
        ) : null}
      </div>
    </Box>
  );
};

export default PermissionSidebarRecursiveBlock;
