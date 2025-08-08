import {Box, Skeleton} from "@mui/material";
import React from "react";
import {useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import {Container} from "react-smooth-dnd";
import menuService from "../../../services/menuService";
import {applyDrag} from "../../../utils/applyDrag";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import "./style.scss";

export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

function NewSubMenu({
  subMenuIsOpen,
  openFolderCreateModal,
  setFolderModalType,
  setTableModal,
  setSubMenuIsOpen,
  handleOpenNotify,
  setElement,
  selectedApp,
  isLoading,
  menuStyle: menuStyles,
  setLinkedTableModal,
  menuLanguages,
  languageData = [],
  element,
  folderItem,
  getMenuList = () => {},
}) {
  const queryClient = useQueryClient();
  const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);
  const projectSettingLan = languageData?.find((el) => el?.key === "Setting");

  const onDrop = (dropResult) => {
    const {removedIndex, addedIndex, payload} = dropResult;

    // if dropped outside
    if (removedIndex == null && typeof addedIndex === "number" && payload) {
      const addedData = {...payload};
      addedData.parent_id = element?.id;

      if (addedData) {
        menuService.update(addedData).then(() => {
          getMenuList();
          queryClient.refetchQueries(["MENU"]);
        });
      }
      return;
    }

    const result = applyDrag(menuChilds?.[element?.id]?.children, dropResult);
    if (result) {
      menuService
        .updateOrder({
          menus: result,
        })
        .then(() => {
          queryClient.refetchQueries(["MENU"]);
        });
    }
  };

  const menuStyleNew = {
    background: "#fff",
    borderRadius: "8px",
    color: "#475467",
    height: "32px",
    marginTop: "5px",
  };

  return (
    <div
      className={``}
      style={{
        position: "relative",
        minHeight: "32px",
        padding: "0 0 0 15px",
      }}>
      <div className="body">
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
          <div>
            <Box className="nav-block">
              <div className="menu-element">
                {isLoading ? (
                  <Box px="5px">
                    <Skeleton height={42} animation="wave" />
                    <Skeleton height={42} animation="wave" />
                    <Skeleton height={42} animation="wave" />
                  </Box>
                ) : (
                  <Container
                    dragHandleSelector=".column-drag-handle"
                    groupName="main-menu"
                    getChildPayload={(index) =>
                      menuChilds?.[element?.id]?.children[index]
                    }
                    onDrop={onDrop}>
                    {menuChilds?.[element?.id]?.children?.length ? (
                      menuChilds?.[element?.id]?.children?.map(
                        (childElement, index) => (
                          <RecursiveBlock
                            menuStyles={menuStyles}
                            projectSettingLan={projectSettingLan}
                            key={childElement.id}
                            element={childElement}
                            openFolderCreateModal={openFolderCreateModal}
                            setFolderModalType={setFolderModalType}
                            sidebarIsOpen={subMenuIsOpen}
                            setTableModal={setTableModal}
                            setLinkedTableModal={setLinkedTableModal}
                            handleOpenNotify={handleOpenNotify}
                            setElement={setElement}
                            setSubMenuIsOpen={setSubMenuIsOpen}
                            menuStyle={menuStyleNew}
                            index={index}
                            selectedApp={selectedApp}
                            buttonProps={{className: "highlight-on-hover"}}
                          />
                        )
                      )
                    ) : (
                      <Box
                        sx={{
                          color: "#9f9898",
                          paddingLeft: "25px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                        }}>
                        No pages inside
                      </Box>
                    )}
                  </Container>
                )}
              </div>
            </Box>
          </div>
        </Box>
      </div>
    </div>
  );
}

export default NewSubMenu;
