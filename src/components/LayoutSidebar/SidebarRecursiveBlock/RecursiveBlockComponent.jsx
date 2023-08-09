import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useMenuListQuery } from "../../../services/menuService";
import { menuActions } from "../../../store/menuItem/menuItem.slice";
import IconGenerator from "../../IconPicker/IconGenerator";
import MenuIcon from "../MenuIcon";
import "../style.scss";
import { useQueryClient } from "react-query";

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
}) => {
  const { appId, tableSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [child, setChild] = useState();
  const [check, setCheck] = useState(false);
  const [id, setId] = useState();
  const pinIsEnabled = useSelector((state) => state.main.pinIsEnabled);

  const activeStyle = {
    backgroundColor:
      menuItem?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      menuItem?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const navigateMenu = () => {
    switch (element?.type) {
      case "FOLDER":
        return navigate(`/main/${appId}`);
      case "TABLE":
        return navigate(`/main/${appId}/object/${element?.data?.table?.slug}`);
      case "MICROFRONTEND":
        let obj = {};
        element?.attributes?.params.forEach((el) => {
          obj[el.key] = el.value;
        });
        const searchParams = new URLSearchParams(obj || {});
        return navigate({
          pathname: `/main/${appId}/page/${element?.data?.microfrontend?.id}`,
          search: `?${searchParams.toString()}`,
        });
      case "WEBPAGE":
        return navigate(
          `/main/${appId}/web-page/${element?.data?.webpage?.id}`
        );
      case "USER":
        return navigate(`/main/${appId}/user-page/${element?.guid}`);

      case "PERMISSION":
        return navigate(`/main/${appId}/permission/${element?.guid}`);

      default:
        return navigate(`/main/${appId}`);
    }
  };

  const { isLoading } = useMenuListQuery({
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
      element.type !== "USER_FOLDER"
    ) {
      setSubMenuIsOpen(false);
    }
    element.type !== "USER" && setChildBlockVisible((prev) => !prev);
    setId(element?.id);
    setElement(element);
  };

  useEffect(() => {
    if (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284") {
      setChildBlockVisible(true);
    }
  }, []);

  return (
    <Box>
      <div className="parent-block column-drag-handle" key={element.id}>
        {element?.data?.permission?.read && (
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
              <IconGenerator
                icon={
                  element?.icon ||
                  element?.data?.microfrontend?.icon ||
                  element?.data?.webpage?.icon
                }
                size={18}
              />
              {(sidebarIsOpen && element?.label) ||
                element?.data?.microfrontend?.name ||
                element?.data?.webpage?.title ||
                element?.name}
            </div>
            {element?.type === "FOLDER" && sidebarIsOpen ? (
              <Box className="icon_group">
                <Tooltip title="Folder settings" placement="top">
                  <Box className="extra_icon">
                    <BsThreeDots
                      size={13}
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleOpenNotify(e, "FOLDER");
                        setElement(element);
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
                <Tooltip title="Create folder" placement="top">
                  <Box className="extra_icon">
                    {element?.data?.permission?.write && (
                      <AddIcon
                        size={13}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNotify(e, "CREATE_TO_FOLDER");
                          setElement(element);
                        }}
                        style={{
                          color:
                            menuItem?.id === element?.id
                              ? menuStyle?.active_text
                              : menuStyle?.text || "",
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
                {childBlockVisible ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </Box>
            ) : element?.type === "USER_FOLDER" ? (
              <>
                {childBlockVisible ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </>
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
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default RecursiveBlock;
