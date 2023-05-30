import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { TbReplace } from "react-icons/tb";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import applicationService from "../../../services/applicationSercixe";
import constructorTableService from "../../../services/constructorTableService";
import { fetchConstructorTableListAction } from "../../../store/constructorTable/constructorTable.thunk";
import { applyDrag } from "../../../utils/applyDrag";
import IconGenerator from "../../IconPicker/IconGenerator";
import ButtonsMenu from "../buttonsMenu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import "../style.scss";

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
}) => {
  const { tableSlug } = useParams();
  const { appId } = useParams();
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [menuType, setMenuType] = useState(null);
  const queryClient = useQueryClient();
  const openMenu = Boolean(menu);

  const activeStyle = {
    backgroundColor:
      element.isChild &&
      (tableSlug === element.slug ? environment?.data?.active_background : ""),
    color:
      element.isChild &&
      (tableSlug !== element.slug ? environment?.data?.active_color : ""),
    paddingLeft: level === 1 || level === 2 ? "" : level * 6,
    display: element.id === "0" && "none",
  };

  const clickHandler = () => {
    !element.isChild && parentClickHandler(element);
    setChildBlockVisible((prev) => !prev);
  };
  useEffect(() => {
    if (element.id === "0") {
      setChildBlockVisible(true);
    }
  }, []);
  const applicationElements = useSelector(
    (state) => state.constructorTable.applications
  );

  const handleOpenNotify = (event, type) => {
    setMenu(event.currentTarget);
    setMenuType(type);
  };
  const handleCloseNotify = () => {
    setMenu(null);
  };

  const deleteFolder = (element) => {
    constructorTableService
      .deleteFolder(element.id)
      .then(() => {
        queryClient.refetchQueries(["GET_TABLE_FOLDER"]);
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
            element.isChild && navigate(element?.path);
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

            {sidebarIsOpen && element?.title}
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
                      openFolderCreateModal("parent", element);
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
      <Collapse in={childBlockVisible} unmountOnExit>
        {element?.children && (
          <Container dragHandleSelector=".column-drag-handle" onDrop={onDrop}>
            {element?.children?.map((childElement, index) => (
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
              />
            ))}
          </Container>
        )}
      </Collapse>
    </Draggable>
  );
};

export default RecursiveBlock;
