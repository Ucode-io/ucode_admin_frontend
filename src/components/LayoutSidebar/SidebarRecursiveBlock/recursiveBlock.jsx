import "../style.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AiOutlinePlus } from "react-icons/ai";
import { TbReplace } from "react-icons/tb";
import { BsThreeDots } from "react-icons/bs";
import { RiPencilFill } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Collapse, Menu } from "@mui/material";
import IconGenerator from "../../IconPicker/IconGenerator";
import { useState } from "react";
import ButtonsMenu from "../buttonsMenu";
import constructorTableService from "../../../services/constructorTableService";
import { useQueryClient } from "react-query";

const RecursiveBlock = ({
  index,
  element,
  parentClickHandler,
  openedBlock,
  openFolderCreateModal,
  environment,
  onDrop,
  setFolderModalType,
  setSelectedTable,
  level = 1,
  sidebarIsOpen,
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
    <>
      {/* <Container
        lockAxis="y"
        onDrop={onDrop}
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
        dragHandleSelector=".drag-handle"
      >
        <Draggable key={index}> */}
      <div className="parent-block" key={index}>
        <NavLink
          to={element?.isChild && element?.path}
          key={index}
          className={({ isActive }) =>
            `nav-element ${
              isActive &&
              element.isChild &&
              (!openedBlock === element?.id ? "active-with-child" : "active")
            }`
          }
          style={({ isActive }) => ({
            backgroundColor:
              isActive &&
              element.isChild &&
              (!openedBlock === element?.id
                ? "active-with-child"
                : environment?.data?.active_background),
            color:
              isActive &&
              element.isChild &&
              (!openedBlock === element?.id
                ? "active-with-child"
                : environment?.data?.active_color),
            marginLeft: level === 1 || element.isChild ? "" : level * 4,
          })}
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
                !openedBlock === element?.id
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
                color: environment?.data?.color,
              }}
            />
          )}
        </NavLink>
      </div>
      <Collapse in={childBlockVisible} unmountOnExit>
        {element?.children?.map((childElement, index) => (
          <RecursiveBlock
            key={index}
            level={level + 1}
            element={childElement}
            parentClickHandler={parentClickHandler}
            openedBlock={openedBlock}
            openFolderCreateModal={openFolderCreateModal}
            environment={environment}
            onDrop={onDrop}
            setFolderModalType={setFolderModalType}
            setSelectedTable={setSelectedTable}
            sidebarIsOpen={sidebarIsOpen}
          />
        ))}
      </Collapse>
      {/* </Draggable>
      </Container> */}
    </>
  );
};

export default RecursiveBlock;
