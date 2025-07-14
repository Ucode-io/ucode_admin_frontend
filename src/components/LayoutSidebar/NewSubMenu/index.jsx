import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useSearchParams} from "react-router-dom";
import {store} from "../../../store";
import menuService, {useMenuListQuery} from "../../../services/menuService";
import {Box, Skeleton} from "@mui/material";
import {Container} from "react-smooth-dnd";
import RecursiveBlock from "../SidebarRecursiveBlock/RecursiveBlockComponent";
import {applyDrag} from "../../../utils/applyDrag";

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
}) {
  const queryClient = useQueryClient();
  const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);
  const projectSettingLan = languageData?.find((el) => el?.key === "Setting");

  const onDrop = (dropResult) => {
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
                ) : menuChilds?.[element?.id]?.children?.length ? (
                  <Container
                    dragHandleSelector=".column-drag-handle"
                    onDrop={onDrop}>
                    {menuChilds?.[element?.id]?.children?.map(
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
                    )}
                  </Container>
                ) : (
                  <>
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
                  </>
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
