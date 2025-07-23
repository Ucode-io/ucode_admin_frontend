import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import {Box, Button, Collapse, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {BsThreeDots} from "react-icons/bs";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Draggable} from "react-smooth-dnd";
import {useMenuListQuery} from "../../../services/menuService";
import {store} from "../../../store";
import {menuActions} from "../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../IconPicker/IconGenerator";
import FunctionSidebar from "../Components/Functions/FunctionSIdebar";
import {MenuFolderArrows, NavigateByType} from "../Components/MenuSwitchCase";

import MicrofrontendSettingSidebar from "../Components/Microfrontend/MicrofrontendSidebar";
import TableSettingSidebar from "../Components/TableSidebar/TableSidebar";
import "../style.scss";
import {folderIds} from "./mock/folders";
import FileUploadMenu from "../Components/Functions/FileUploadMenu";
import {groupFieldActions} from "../../../store/groupField/groupField.slice";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";
import {NavigateByTypeOldRoute} from "../Components/OldMenuSwitchCase";
import IconGeneratorIconjs from "../../IconPicker/IconGeneratorIconjs";

export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;
export const analyticsId = `${import.meta.env.VITE_ANALYTICS_FOLDER_ID}`;

const RecursiveBlock = ({
  customFunc = () => {},
  element,
  openFolderCreateModal,
  environment,
  setFolderModalType,
  level = 1,
  sidebarIsOpen,
  setTableModal,
  handleOpenNotify,
  setElement,
  setSubMenuIsOpen,
  menuStyle,
  index,
  menuItemId,
  selectedApp,
  userType = false,
  buttonProps,
  projectSettingLan,
  menuStyles,
}) => {
  const menuItem = useSelector((state) => state.menu.menuItem);
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const auth = store.getState().auth;
  const {menuId, appId} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const [id, setId] = useState();
  const [searchParams] = useSearchParams();
  const newRouter = localStorage.getItem("new_router");
  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const activeRequest =
    element?.type === "FOLDER" || element?.type === "WIKI_FOLDER";
  const defaultLanguage = i18n?.language;
  const readPermission = element?.data?.permission?.read;
  const withoutPermission =
    element?.parent_id === adminId || element?.parent_id === analyticsId
      ? true
      : false;
  const permission = defaultAdmin
    ? readPermission || withoutPermission
    : readPermission;
  const addButtonPermission =
    element?.type === "FOLDER" ||
    (element?.type === "MINIO_FOLDER" && sidebarIsOpen) ||
    element?.type === "WIKI_FOLDER";
  const settingsButtonPermission =
    (element?.id !== "cd5f1ab0-432c-459d-824a-e64c139038ea" &&
      selectedApp?.id !== adminId) ||
    !selectedApp?.is_static;

  const {isLoading} = useMenuListQuery({
    params: {
      parent_id: id,
    },
    queryParams: {
      enabled: Boolean(activeRequest),
      onSuccess: (res) => {
        setChild(res.menus);
      },
    },
  });

  const activeMenu =
    element?.type === "FOLDER"
      ? Boolean(selectedApp?.id === element?.id)
      : element?.id === menuItem?.id;

  const clickHandler = (e) => {
    dispatch(menuActions.setMenuItem(element));

    if (Boolean(newRouter === "true")) {
      if (element?.type === "FOLDER") {
        setSubMenuIsOpen(true);
      } else {
        dispatch(detailDrawerActions.setMainTabIndex(0));
        dispatch(groupFieldActions.clearViews());
        dispatch(groupFieldActions.clearViewsPath());
        NavigateByType({element, appId, navigate});
      }
    } else {
      NavigateByTypeOldRoute({element, menuId: element?.id, navigate});
    }

    if (element?.type === "FOLDER" || element?.type === "WIKI_FOLDER") {
      setChildBlockVisible((prev) => !prev);
    }
    if (element.type === "PERMISSION") {
      queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    }

    if (element?.type === "TABLE") {
      setSubMenuIsOpen(false);
    }
    if (
      !pinIsEnabled &&
      element.type !== "FOLDER" &&
      element.type !== "USER_FOLDER" &&
      element.type !== "MINIO_FOLDER" &&
      element.type !== "WIKI_FOLDER"
    ) {
      setSubMenuIsOpen(false);
    }
    setId(element?.id);
    setElement(element);
  };

  const menuAddClick = (e) => {
    e.stopPropagation();
    setElement(element);
    dispatch(menuActions.setMenuItem(element));
    if (element?.type === "MINIO_FOLDER") {
      handleOpenNotify(e, "CREATE_TO_MINIO");
    } else if (appId === folderIds.wiki_id) {
      handleOpenNotify(e, "WIKI_FOLDER");
    } else {
      handleOpenNotify(e, "CREATE_TO_FOLDER");
    }
  };

  const folderSettings = (e) => {
    e.stopPropagation();
    setElement(element);
    dispatch(menuActions.setMenuItem(element));
    if (selectedApp?.id !== adminId) {
      if (
        element?.type === "FOLDER" ||
        (element?.type === "WIKI_FOLDER" &&
          element?.id !== "cd5f1ab0-432c-459d-824a-e64c139038ea")
      ) {
        handleOpenNotify(e, "FOLDER");
      } else if (element?.type === "TABLE") {
        handleOpenNotify(e, "TABLE");
      } else if (element?.type === "WIKI") {
        handleOpenNotify(e, "WIKI");
      } else if (element?.type === "MICROFRONTEND") {
        handleOpenNotify(e, "MICROFRONTEND");
      } else if (element?.type === "MINIO_FOLDER") {
        handleOpenNotify(e, "MINIO_FOLDER");
      } else if (element?.type === "LINK") {
        handleOpenNotify(e, "LINK");
      }
    }
  };

  useEffect(() => {
    if (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284") {
      setChildBlockVisible(true);
    }
  }, []);

  const getMenuLabel = (item) => {
    const label =
      item?.attributes?.[`label_${defaultLanguage}`] ??
      item?.attributes?.[`title_${defaultLanguage}`] ??
      item?.label ??
      item?.name;

    return label?.length > 18 ? `${label?.slice(0, 18)}..` : label;
  };

  function isValidUrl(str) {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  return (
    <Draggable key={index}>
      <Box sx={{padding: `0 0 0 ${level * 10}px`}} style={{marginBottom: 5}}>
        <div
          className="parent-block column-drag-handle"
          key={element.id}
          style={{marginBottom: 5}}>
          {permission && (
            <Button
              id="more-button"
              data-cy="three-dots-button"
              key={element.id}
              style={{
                marginTop: "2px",
                marginBottom: "2px",
                borderRadius: "8px",
                color: "#475767",
                height: "30px",
                background: activeMenu ? "#F0F0EF" : menuStyles?.background,
                color: activeMenu ? "#32302B" : "#5F5E5A",
              }}
              className={`nav-element ${element?.type === "FOLDER" ? "childMenuFolderBtn" : "childRegularBtn"}`}
              onClick={(e) => {
                customFunc(e);
                clickHandler(e);
              }}>
              <div className="label">
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
                {element?.type === "FOLDER" && (
                  <Box>
                    <div className="childMenuFolderArrow">
                      {MenuFolderArrows({element, childBlockVisible})}
                    </div>

                    <div className="childMenuIcon">
                      {element?.icon ||
                      element?.data?.microfrontend?.icon ||
                      element?.data?.webpage?.icon ? (
                        isValidUrl(element?.icon) ? (
                          <img
                            width={"24px"}
                            height={"24px"}
                            src={element?.icon}
                          />
                        ) : (
                            element?.icon ||
                            element?.data?.microfrontend?.icon ||
                            element?.data?.webpage?.icon
                          )?.includes(":") ? (
                          <IconGeneratorIconjs
                            icon={
                              element?.icon ||
                              element?.data?.microfrontend?.icon ||
                              element?.data?.webpage?.icon
                            }
                            size={20}
                          />
                        ) : (
                          <IconGenerator
                            icon={
                              element?.icon ||
                              element?.data?.microfrontend?.icon ||
                              element?.data?.webpage?.icon
                            }
                            size={20}
                          />
                        )
                      ) : (
                        // <IconGenerator
                        //   icon={
                        //     element?.icon ||
                        //     element?.data?.microfrontend?.icon ||
                        //     element?.data?.webpage?.icon
                        //   }
                        //   size={20}
                        // />
                        <Box
                          sx={{
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <Box
                            sx={{
                              width: "5px",
                              height: "5px",
                              background: "#787774",
                              borderRadius: "50%",
                            }}></Box>
                        </Box>
                      )}
                    </div>
                  </Box>
                )}

                {(element?.type !== "FOLDER" && element?.icon) ||
                element?.data?.microfrontend?.icon ||
                element?.data?.webpage?.icon ? (
                  <div
                    style={{
                      marginRight: "4px",
                    }}
                    className="childMenuIcon">
                    {
                      isValidUrl(element?.icon) ? (
                        <img
                          width={"24px"}
                          height={"24px"}
                          src={element?.icon}
                        />
                      ) : (
                          element?.icon ||
                          element?.data?.microfrontend?.icon ||
                          element?.data?.webpage?.icon
                        )?.includes(":") ? (
                        <IconGeneratorIconjs
                          icon={
                            element?.icon ||
                            element?.data?.microfrontend?.icon ||
                            element?.data?.webpage?.icon
                          }
                          size={18}
                        />
                      ) : (
                        <IconGenerator
                          icon={
                            element?.icon ||
                            element?.data?.microfrontend?.icon ||
                            element?.data?.webpage?.icon
                          }
                          size={18}
                        />
                      )
                      // <IconGenerator
                      //   icon={
                      //     element?.icon ||
                      //     element?.data?.microfrontend?.icon ||
                      //     element?.data?.webpage?.icon
                      //   }
                      //   size={18}
                      // />
                    }
                  </div>
                ) : element?.type !== "FOLDER" ? (
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <Box
                      sx={{
                        width: "5px",
                        height: "5px",
                        background: "#787774",
                        borderRadius: "50%",
                      }}></Box>
                  </Box>
                ) : (
                  ""
                )}

                <Tooltip
                  title={
                    Boolean(level > 2 && getMenuLabel(element)?.length > 14) &&
                    getMenuLabel(element)
                  }>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      position: "relative",
                      color: "#465766",
                    }}>
                    <Box>
                      <p>
                        {level > 2
                          ? getMenuLabel(element)?.length > 14
                            ? `${getMenuLabel(element)?.slice(0, 12)}...`
                            : getMenuLabel(element)
                          : getMenuLabel(element)}
                      </p>
                    </Box>
                    {settingsButtonPermission && !userType && (
                      <Box
                        id="moreicon"
                        className="icon_group"
                        style={{
                          position: "absolute",
                          right: 0,
                          // backgroundColor: "#EAECF0",
                          padding: "2px 4px",
                          borderRadius: 4,
                        }}>
                        {(element?.data?.permission?.delete ||
                          element?.data?.permission?.update ||
                          element?.data?.permission?.write) && (
                          <Tooltip title="Settings" placement="top">
                            <Box className="extra_icon" data-cy={"three-dots"}>
                              <BsThreeDots
                                size={13}
                                onClick={(e) => {
                                  folderSettings(e);
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
                        )}
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              </div>
              {addButtonPermission && element?.data?.permission?.write ? (
                <Box className="icon_group">
                  <Tooltip title="Create folder" placement="top">
                    <Box className="extra_icon">
                      <AddIcon
                        size={13}
                        onClick={(e) => {
                          menuAddClick(e);
                        }}
                        style={{
                          color: "#475767",
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
              ) : null}
            </Button>
          )}
        </div>

        <Collapse in={childBlockVisible} unmountOnExit>
          {child?.map((childElement) => (
            <RecursiveBlock
              customFunc={customFunc}
              key={childElement.id}
              level={level + 1}
              element={childElement}
              openFolderCreateModal={openFolderCreateModal}
              environment={environment}
              setFolderModalType={setFolderModalType}
              sidebarIsOpen={sidebarIsOpen}
              setTableModal={setTableModal}
              handleOpenNotify={handleOpenNotify}
              setElement={setElement}
              setSubMenuIsOpen={setSubMenuIsOpen}
              menuStyle={menuStyle}
              menuItem={menuItem}
              index={index}
              selectedApp={selectedApp}
              buttonProps={buttonProps}
            />
          ))}

          {element.id === folderIds.data_base_folder_id && (
            <>
              <TableSettingSidebar
                projectSettingLan={projectSettingLan}
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
            </>
          )}
          {element.id === folderIds.code_folder_id && (
            <>
              <FunctionSidebar
                projectSettingLan={projectSettingLan}
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
                integrated={false}
              />
              <MicrofrontendSettingSidebar
                projectSettingLan={projectSettingLan}
                menuStyle={menuStyle}
                menuItem={menuItem}
                element={element}
                level={2}
              />
              <FileUploadMenu
                projectSettingLan={projectSettingLan}
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                menuItem={menuItem}
                element={element}
                level={2}
              />
            </>
          )}
        </Collapse>
      </Box>
    </Draggable>
  );
};

export default RecursiveBlock;
