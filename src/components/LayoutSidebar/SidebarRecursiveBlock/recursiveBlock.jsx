import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Collapse } from "@mui/material";
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
  const { appId } = useParams();
  const dispatch = useDispatch();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const queryClient = useQueryClient();
  const openMenu = Boolean(menu);
  const clickHandler = () => {
    !element.isChild && parentClickHandler(element);
    setChildBlockVisible((prev) => !prev);
  };
  useEffect(() => {
    if (element.id === "96ed7568-e086-48db-92b5-658450cbd4a8") {
      setChildBlockVisible(true);
    }
  }, []);
  const applicationElements = useSelector(
    (state) => state.constructorTable.applications
  );
  const { tableSlug } = useParams();

  const handleOpenNotify = (event) => {
    setMenu(event.currentTarget);
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
          style={{
            backgroundColor:
              element.isChild &&
              (tableSlug !== element.slug
                ? "active-with-child"
                : environment?.data?.active_background),
            color:
              element.isChild &&
              (tableSlug !== element.slug
                ? "active-with-child"
                : environment?.data?.active_color),
            marginLeft:
              level === 1 || level === 2 || element.isChild ? "" : level * 4,
            display:
              element.id === "96ed7568-e086-48db-92b5-658450cbd4a8" && "none",
          }}
          className={`nav-element ${
            element.isChild &&
            (tableSlug !== element.slug ? "active-with-child" : "active")
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            element.isChild && navigate(element?.path);
            clickHandler();
          }}
        >
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
              <BsThreeDots
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpenNotify(e);
                }}
                style={{
                  color: environment?.data?.color,
                }}
              />
              <div
                className={`arrow-icon ${
                  openedBlock === element?.id ? "open" : ""
                }`}
                style={{
                  color: environment?.data?.color,
                }}
              >
                <ExpandMoreIcon />
              </div>
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
            environment={environment}
            deleteFolder={deleteFolder}
          />
          {element?.isChild && sidebarIsOpen ? (
            <TbReplace
              size={14}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // setVisible(true);
                setFolderModalType("folder");
                setSelectedTable(element);
              }}
              style={{
                color:
                  tableSlug === element.slug
                    ? environment?.data?.active_color
                    : environment?.data?.color,
              }}
            />
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
