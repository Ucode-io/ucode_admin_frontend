import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Collapse,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { TbReplace } from "react-icons/tb";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import applicationService from "../../../services/applicationService";
import constructorTableService from "../../../services/constructorTableService";
import { fetchConstructorTableListAction } from "../../../store/constructorTable/constructorTable.thunk";
import { applyDrag } from "../../../utils/applyDrag";
import IconGenerator from "../../IconPicker/IconGenerator";
import ButtonsMenu from "../buttonsMenu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import "../style.scss";
import menuSettingsService from "../../../services/menuSettingsService";

const RecursiveBlock = ({
  index,
  element,
  parentClickHandler,
  openedBlock,
  openFolderCreateModal,
  environment,
  setFolderModalType,
  setSelectedTable,
  level = 1,
  sidebarIsOpen,
  getMenuList,
  setTableModal,
}) => {
  const { tableSlug } = useParams();
  const { appId } = useParams();
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState();
  const [child, setChild] = useState();
  const [menuType, setMenuType] = useState();
  const openMenu = Boolean(menu);
  const queryClient = useQueryClient();

  const getListMenu = (id) => {
    menuSettingsService
      .getList({
        parent_id: id,
      })
      .then((res) => {
        console.log("res", res);
        setChild(res.menus);
      });
  };

  const activeStyle = {
    backgroundColor:
      element.isChild &&
      (tableSlug === element.slug ? environment?.data?.active_background : ""),
    color:
      element.isChild &&
      (tableSlug !== element.slug ? environment?.data?.active_color : ""),
    paddingLeft: level === 1 || level === 2 ? "" : level * 6,
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    element.type === "TABLE" && parentClickHandler(element);
    setChildBlockVisible((prev) => !prev);
    getListMenu(element.id);
  };
  useEffect(() => {
    if (
      element.id === "0" ||
      element.id === "c57eedc3-a954-4262-a0af-376c65b5a284"
    ) {
      setChildBlockVisible(true);
    }
  }, []);
  const applicationElements = useSelector(
    (state) => state.constructorTable.applications
  );

  const handleOpenNotify = (event, type) => {
    setMenu(event?.currentTarget);
    setMenuType(type);
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };

  const deleteFolder = (element) => {
    menuSettingsService
      .delete(element.id)
      .then(() => {
        getListMenu(element.id);
        setChildBlockVisible(false);
        queryClient.refetchQueries(["GET_MENU", appId]);
        getMenuList();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onDrop = (dropResult) => {
    const result = applyDrag(element.children, dropResult);
    const computedTables = [
      ...result?.map((el) => ({
        table_id: el?.id,
        is_visible: Boolean(el.is_visible),
        is_own_table: Boolean(el.is_own_table),
      })),
    ];
    if (result) {
      applicationService
        .update({
          ...applicationElements,
          tables: computedTables,
        })
        .then(() => {
          dispatch(fetchConstructorTableListAction(appId));
        });
    }
  };

  return (
    <Draggable key={index}>
      {element?.parent_id === "0" ||
      element?.parent_id === "c57eedc3-a954-4262-a0af-376c65b5a284" ? (
        <ListItemButton
          key={index}
          onClick={() => {
            clickHandler();
          }}
          className="parent-folder"
        >
          <IconGenerator
            icon={element?.icon}
            size={18}
            className="folder-icon"
          />
          {sidebarIsOpen && <ListItemText primary={element?.label} />}
          {sidebarIsOpen && (
            <>
              <Tooltip title="Folder settings" placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNotify(e, "folder");
                    }}
                  />
                </Box>
              </Tooltip>
              <Tooltip title="Create folder" placement="top">
                <Box className="extra_icon">
                  <AddIcon
                    size={13}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // openFolderCreateModal("parent", element);
                      handleOpenNotify(e, "tableMenu");
                    }}
                  />
                </Box>
              </Tooltip>
            </>
          )}
          {sidebarIsOpen &&
            (childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            ))}
          <ButtonsMenu
            element={element}
            menu={menu}
            openMenu={openMenu}
            handleCloseNotify={handleCloseNotify}
            sidebarIsOpen={sidebarIsOpen}
            openFolderCreateModal={openFolderCreateModal}
            deleteFolder={deleteFolder}
            menuType={menuType}
            setFolderModalType={setFolderModalType}
            setSelectedTable={setSelectedTable}
            appId={appId}
            setTableModal={setTableModal}
          />
        </ListItemButton>
      ) : (
        <div className="parent-block column-drag-handle" key={index}>
          <Button
            key={index}
            style={activeStyle}
            className={`nav-element ${
              element.isChild &&
              (tableSlug !== element.slug ? "active-with-child" : "active")
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              element.type === "TABLE" &&
                navigate(`/main/${appId}/object/${element?.table?.slug}`);
              clickHandler();
              setSelectedTable(element);
            }}
          >
            {/* {!element.isChild && childBlockVisible ? (
            <KeyboardArrowDownIcon
              style={{
                color: environment?.data?.color,
              }}
            />
          ) : !element.isChild ? (
            <KeyboardArrowRightIcon
              style={{
                color: environment?.data?.color,
              }}
            />
          ) : (
            ""
          )} */}
            <div
              className="label"
              style={{
                color:
                  tableSlug === element.slug && element.isChild
                    ? environment?.data?.active_color
                    : environment?.data?.color,
                opacity: element?.isChild && 0.6,
              }}
            >
              <IconGenerator icon={element?.icon} size={18} />

              {sidebarIsOpen && element?.label}
            </div>
            {!element?.isChild && sidebarIsOpen ? (
              <Box className="icon_group">
                <Tooltip title="Folder settings" placement="top">
                  <Box className="extra_icon">
                    <BsThreeDots
                      size={13}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenNotify(e, "folder");
                      }}
                      style={{
                        color: environment?.data?.color,
                      }}
                    />
                  </Box>
                </Tooltip>
                <Tooltip title="Create folder" placement="top">
                  <Box className="extra_icon">
                    <AddIcon
                      size={13}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // openFolderCreateModal("parent", element);
                        handleOpenNotify(e, "tableMenu");
                      }}
                      style={{
                        color: environment?.data?.color,
                      }}
                    />
                  </Box>
                </Tooltip>
              </Box>
            ) : (
              ""
            )}
            <ButtonsMenu
              element={element}
              menu={menu}
              openMenu={openMenu}
              handleCloseNotify={handleCloseNotify}
              sidebarIsOpen={sidebarIsOpen}
              openFolderCreateModal={openFolderCreateModal}
              deleteFolder={deleteFolder}
              menuType={menuType}
              setFolderModalType={setFolderModalType}
              setSelectedTable={setSelectedTable}
              appId={appId}
              setTableModal={setTableModal}
            />
            {element?.isChild && sidebarIsOpen ? (
              <Tooltip title="Table settings" placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenNotify(e, "table");
                    }}
                    style={{
                      color:
                        tableSlug === element.slug
                          ? environment?.data?.active_color
                          : environment?.data?.color,
                    }}
                  />
                </Box>
              </Tooltip>
            ) : (
              ""
            )}
          </Button>
        </div>
      )}

      <Collapse in={childBlockVisible} unmountOnExit>
        {child && (
          <Container dragHandleSelector=".column-drag-handle" onDrop={onDrop}>
            {child?.map((childElement, index) => (
              <RecursiveBlock
                key={index}
                level={level + 1}
                element={childElement}
                parentClickHandler={parentClickHandler}
                openedBlock={openedBlock}
                openFolderCreateModal={openFolderCreateModal}
                environment={environment}
                setFolderModalType={setFolderModalType}
                setSelectedTable={setSelectedTable}
                sidebarIsOpen={sidebarIsOpen}
                getMenuList={getMenuList}
                setTableModal={setTableModal}
              />
            ))}
          </Container>
        )}
      </Collapse>
    </Draggable>
  );
};

export default RecursiveBlock;
