import AddIcon from "@mui/icons-material/Add";
import DeleteIconFromMui from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {Box, Button, Collapse, Tooltip} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {BsThreeDots} from "react-icons/bs";
import {useMutation, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useMenuListQuery} from "../../../services/menuService";
import pivotService from "../../../services/pivotService";
import {store} from "../../../store";
import {showAlert} from "../../../store/alert/alert.thunk";
import {updateLevel} from "../../../utils/level";
import {menuActions} from "../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../IconPicker/IconGenerator";
import ApiSidebar from "../Components/Api/ApiSidebar";
import DataBase from "../Components/DataBase";
import FunctionSidebar from "../Components/Functions/FunctionSIdebar";
import MicroServiceSidebar from "../Components/MicroService/MicroServiceSidebar";
import QuerySidebar from "../Components/Query/QuerySidebar";
import Resources from "../Components/Resources";
import ScenarioSidebar from "../Components/Scenario/ScenarioSidebar";
import DeleteIcon from "../DeleteIcon";
import MenuIcon from "../MenuIcon";
import PersonIcon from "@mui/icons-material/Person";
import "../style.scss";
import {analyticItems, folderIds} from "./mock/folders";
import MicrofrontendSettingSidebar from "../Components/Microfrontend/MicrofrontendSidebar";
import TableSettingSidebar from "../Components/TableSidebar/TableSidebar";
import {Draggable} from "react-smooth-dnd";
import ApiKeyButton from "../Components/ApiKey/ApiKeyButton";
import RedirectButton from "../Components/Redirect/RedirectButton";
import SmsOtpButton from "../Components/SmsOtp/SmsOtpButton";
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
  menuItem,
  selectedApp,
  index,
  setCheck,
  check,
}) => {
  const {appId, tableSlug} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const [id, setId] = useState();
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);
  const auth = store.getState().auth;
  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const {i18n} = useTranslation();
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
  const permissionButton =
    element?.id === analyticItems.pivot_id ||
    element?.id === analyticItems.report_setting;

  const navigateAndSaveHistory = (elementItem) => {
    const computedData = {
      from_date: element?.data?.pivot?.from_data,
      pivot_table_slug: element?.data?.pivot?.pivot_table_slug,
      to_date: element?.data?.pivot?.to_date,
      instance_id: element?.data?.pivot?.id,
      template_name: element?.data?.pivot?.pivot_table_slug,
      id: undefined,
      status: "HISTORY",
    };
    if (elementItem?.data?.pivot?.status === "SAVED") {
      pivotService.upsertPivotTemplate(computedData).then((res) => {
        navigate(`/main/${appId}/pivot-template/${element?.pivot_template_id}`);
      });
    } else {
      navigate(`/main/${appId}/pivot-template/${element?.pivot_template_id}`);
    }
  };

  const navigateMenu = () => {
    switch (element?.type) {
      case "FOLDER":
        return navigate(`/main/${appId}`);
      case "MINIO_FOLDER":
        return navigate(`/main/${appId}/backet/${element?.id}`);
      case "TABLE":
        return navigate(`/main/${appId}/object/${element?.data?.table?.slug}`);
      case "WIKI":
        return navigate(
          `/main/${appId}/docs/note/${element?.parent_id}/${element?.wiki_id}`
        );
      case "MICROFRONTEND":
        console.log("elemeentttttttt", element);
        let obj = {};
        element?.attributes?.params.forEach((el) => {
          obj[el.key] = el.value;
        });
        const searchParams = new URLSearchParams(obj || {});
        return navigate({
          pathname: `/main/${appId}/code`,
          search: `?${searchParams.toString()}`,
        });
      case "WEBPAGE":
        return navigate(
          `/main/${appId}/web-page/${element?.data?.webpage?.id}`
        );
      case "USER":
        return navigate(`/main/${appId}/user-page/${element?.guid}`);

      case "REPORT_SETTING":
        return navigate(
          `/main/${appId}/report-setting/${element?.report_setting_id}`
        );

      case "PERMISSION":
        return navigate(`/main/${appId}/permission/${element?.guid}`);

      case "PIVOT":
        return navigateAndSaveHistory(element);

      default:
        return navigate(`/main/${appId}`);
    }
  };

  const {isLoading} = useMenuListQuery({
    params: {
      parent_id: id,
    },
    queryParams: {
      cacheTime: 10,
      enabled: Boolean(check),
      onSuccess: (res) => {
        setCheck(false);
        setChild(res.menus);
      },
    },
  });

  const clickHandler = (e) => {
    dispatch(menuActions.setMenuItem(element));
    e.stopPropagation();
    if (element.type === "PERMISSION") {
      queryClient.refetchQueries("GET_CLIENT_TYPE_LIST");
    } else {
      setCheck(true);
    }
    navigateMenu();
    if (
      !pinIsEnabled &&
      element.type !== "FOLDER" &&
      element.type !== "USER_FOLDER" &&
      element.type !== "MINIO_FOLDER" &&
      element.type !== "WIKI_FOLDER"
    ) {
      setSubMenuIsOpen(false);
    }
    element.type !== "USER" && setChildBlockVisible((prev) => !prev);
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

  const menuSettingsClick = (e) => {
    e?.stopPropagation();
    if (element?.type === "MINIO_FOLDER") {
      handleOpenNotify(e, "MINIO_FOLDER");
    } else {
      handleOpenNotify(e, "FOLDER");
    }
    setElement(element);
    dispatch(menuActions.setMenuItem(element));
  };

  useEffect(() => {
    if (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284") {
      setChildBlockVisible(true);
    }
  }, []);

  const {mutate: deleteReportSetting} = useMutation(
    (id) => pivotService.deleteReportSetting(id),
    {
      onSuccess: () => {
        dispatch(showAlert("Успешно удалено", "success"));
        queryClient.refetchQueries(["MENU"]);
      },
    }
  );

  const {mutate: onDeleteTemplate} = useMutation(
    (id) =>
      pivotService.deletePivotTemplate({
        id,
      }),
    {
      onSuccess: () => {
        dispatch(showAlert("Успешно удалено", "success"));
        queryClient.refetchQueries(["MENU"]);
      },
    }
  );

  return (
    <Draggable key={index}>
      <Box sx={{padding: "0 5px"}}>
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
                {childBlockVisible ? (
                  element?.type === "PERMISSION" ||
                  (element?.type !== "FOLDER" &&
                    element?.type !== "WIKI_FOLDER") ? (
                    ""
                  ) : (
                    <KeyboardArrowDownIcon />
                  )
                ) : element?.type === "PERMISSION" ||
                  (element?.type !== "FOLDER" &&
                    element?.type !== "WIKI_FOLDER") ? (
                  ""
                ) : (
                  <KeyboardArrowRightIcon />
                )}
                {childBlockVisible && element?.type === "MINIO_FOLDER" ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  element?.type === "MINIO_FOLDER" && <KeyboardArrowRightIcon />
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
                  {(selectedApp?.id !== adminId &&
                    element?.type === "FOLDER") ||
                  element?.type === "WIKI_FOLDER" ? (
                    <Box>
                      <Tooltip title="Folder settings" placement="top">
                        <Box className="extra_icon">
                          <BsThreeDots
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
                  ) : null}
                  {selectedApp?.id !== adminId && element?.type === "TABLE" ? (
                    <Box>
                      <Tooltip title="Table settings" placement="top">
                        <Box className="extra_icon">
                          <BsThreeDots
                            size={13}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNotify(e, "TABLE");
                              setElement(element);
                              dispatch(menuActions.setMenuItem(element));
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
                  ) : null}
                  {selectedApp?.id !== adminId && element?.type === "WIKI" ? (
                    <Box>
                      <Tooltip title="Table settings" placement="top">
                        <Box className="extra">
                          <BsThreeDots
                            size={13}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNotify(e, "WIKI");
                              setElement(element);
                              dispatch(menuActions.setMenuItem(element));
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
                  ) : null}
                </Box>
              </div>
              {element?.type === "FOLDER" &&
              element?.id === "c57eedc3-a954-4262-a0af-376c65b5a274" ? (
                <Box className="icon_group">
                  <Tooltip title="Create report settings" placement="top">
                    <Box className="extra_icon">
                      {element?.data?.permission?.write || permissionButton ? (
                        <AddIcon
                          size={13}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/main/${appId}/report-setting/create`);
                            // handleOpenNotify(e, "CREATE_TO_REPORT_SETTING");
                            setElement(element);
                          }}
                          style={{
                            color:
                              menuItem?.id === element?.id
                                ? menuStyle?.active_text
                                : menuStyle?.text || "",
                          }}
                        />
                      ) : null}
                    </Box>
                  </Tooltip>
                  {element?.type === "FOLDER" && childBlockVisible ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <KeyboardArrowRightIcon />
                  )}
                </Box>
              ) : element?.type === "FOLDER" ||
                (element?.type === "MINIO_FOLDER" && sidebarIsOpen) ||
                element?.type === "WIKI_FOLDER" ? (
                <Box className="icon_group">
                  <Tooltip title="Create folder" placement="top">
                    <Box className="extra_icon">
                      {element?.data?.permission?.write ||
                      element?.id === analyticItems.pivot_id ||
                      element?.id === analyticItems.report_setting ? (
                        <AddIcon
                          size={13}
                          onClick={(e) => {
                            menuAddClick(e);
                          }}
                          style={{
                            color:
                              menuItem?.id === element?.id
                                ? menuStyle?.active_text
                                : menuStyle?.text || "",
                          }}
                        />
                      ) : null}
                    </Box>
                  </Tooltip>
                </Box>
              ) : element?.type === "USER_FOLDER" ? (
                <>
                  {childBlockVisible ? (
                    <KeyboardArrowDownIcon />
                  ) : (
                    <KeyboardArrowRightIcon />
                  )}
                </>
              ) : element?.type === "PIVOT" ? (
                <Tooltip title="Delete Pivot" placement="top">
                  <Box className="extra_icon">
                    <DeleteIconFromMui
                      size={13}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTemplate(element.pivot_template_id);
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
              ) : (
                ""
              )}
              {element?.type === "TABLE" && (
                <MenuIcon
                  title="Table settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNotify(e, "TABLE");
                    setElement(element);
                    dispatch(menuActions.setMenuItem(element));
                  }}
                  style={{
                    color:
                      menuItem?.id === element?.id
                        ? menuStyle?.active_text
                        : menuStyle?.text || "",
                  }}
                />
              )}
              {element?.type === "MICROFRONTEND" && (
                <MenuIcon
                  title="Microfrontend settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNotify(e, "MICROFRONTEND");
                    setElement(element);
                    dispatch(menuActions.setMenuItem(element));
                  }}
                  style={{
                    color:
                      menuItem?.id === element?.id
                        ? menuStyle?.active_text
                        : menuStyle?.text || "",
                  }}
                />
              )}

              {element?.type === "WEBPAGE" && (
                <MenuIcon
                  title="Webpage settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenNotify(e, "WEBPAGE");
                    setElement(element);
                    dispatch(menuActions.setMenuItem(element));
                  }}
                  style={{
                    color:
                      menuItem?.id === element?.id
                        ? menuStyle?.active_text
                        : menuStyle?.text || "",
                  }}
                />
              )}
              {element?.type === "REPORT_SETTING" && (
                <DeleteIcon
                  title="Delete report settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteReportSetting(element?.report_setting_id);
                    // handleOpenNotify(e, "REPORT_SETTING");
                    // setElement(element);
                  }}
                  style={{
                    color:
                      menuItem?.id === element?.id
                        ? menuStyle?.active_text
                        : menuStyle?.text || "",
                  }}
                />
              )}
            </Button>
          ) : null}
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
              setCheck={setCheck}
              check={check}
            />
          ))}
          {element.id === folderIds.data_base_folder_id && (
            <>
              <DataBase
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                menuItem={menuItem}
                level={2}
              />
              <MicroServiceSidebar
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
              <TableSettingSidebar
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
              <ApiKeyButton
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
              <RedirectButton
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
              <SmsOtpButton
                menuStyle={menuStyle}
                menuItem={menuItem}
                level={2}
              />
            </>
          )}

          {element.id === folderIds.code_folder_id && (
            <>
              <ScenarioSidebar
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                menuItem={menuItem}
                level={2}
              />

              <FunctionSidebar
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                menuItem={menuItem}
                level={2}
                integrated={false}
              />
              <MicrofrontendSettingSidebar
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                menuItem={menuItem}
                element={element}
                level={2}
              />
            </>
          )}

          {element.id === folderIds.api_folder_id && (
            <>
              <QuerySidebar
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                level={2}
                menuItem={menuItem}
              />
              <ApiSidebar
                menuStyle={menuStyle}
                setSubMenuIsOpen={setSubMenuIsOpen}
                level={2}
                menuItem={menuItem}
              />
            </>
          )}
        </Collapse>
      </Box>
    </Draggable>
  );
};

export default RecursiveBlock;
