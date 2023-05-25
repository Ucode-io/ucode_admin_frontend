import "../style.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TbReplace } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Collapse, Menu } from "@mui/material";
import IconGenerator from "../../IconPicker/IconGenerator";
import { useState } from "react";
import ButtonsMenu from "../buttonsMenu";
import constructorTableService from "../../../services/constructorTableService";
import { useQueryClient } from "react-query";
import { Container, Draggable } from "react-smooth-dnd";
import { FaGripLines } from "react-icons/fa";

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
  onDrop,
}) => {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const queryClient = useQueryClient();
  const openMenu = Boolean(menu);
  const clickHandler = () => {
    !element.isChild && parentClickHandler(element);
    setChildBlockVisible((prev) => !prev);
  };
  const { tableSlug } = useParams();
  console.log("tableSlug", tableSlug);
  console.log("element", element);

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

  return (
    <Draggable key={element.id}>
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
            marginLeft: level === 1 || element.isChild ? "" : level * 4,
          }}
          className={`nav-element column-drag-handle ${
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
                tableSlug === element.slug
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
          {element?.isChild && (
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
                onDrop={onDrop}
              />
            ))}
          </Container>
        )}
      </Collapse>
    </Draggable>
  );
};

export default RecursiveBlock;
