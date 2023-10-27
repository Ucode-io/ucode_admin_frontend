import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import { updateLevel } from "../../../../utils/level";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../../IconPicker/IconGenerator";
import { store } from "../../../../store";
import { RiPencilFill } from "react-icons/ri";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
export const analyticsId = `${import.meta.env.VITE_ANALYTICS_FOLDER_ID}`;

const PermissionSidebarRecursiveBlock = ({
  customFunc = () => {},
  element,
  level = 1,
  handleOpenNotify,
  setElement,
  menuStyle,
  menuItem,
  selectedApp,
  openUserFolderModal,
}) => {
  const { appId, tableSlug } = useParams();
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
  const activeStyle = {
    height: "40px",
    backgroundColor:
      menuItem?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      menuItem?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    borderRadius: "10px",
    margin: "0 0px",
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const navigateMenu = () => {
    return navigate(`/main/${appId}/permission/${element?.guid}`);
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
            className={`nav-element ${
              element.isChild &&
              (tableSlug !== element.slug ? "active-with-child" : "active")
            }`}
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
