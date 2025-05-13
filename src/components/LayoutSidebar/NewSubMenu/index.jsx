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

  // const handleClick = () => {
  //   navigator.clipboard.writeText(
  //     `https://wiki.u-code.io/main/744d63e6-0ab7-4f16-a588-d9129cf959d1?project_id=${company.projectId}&env_id=${company.environmentId}`
  //   );
  //   setIsCopied(true);
  //   dispatch(showAlert("Скопировано в буфер обмена", "success"));
  //   setTimeout(() => setIsCopied(false), 3000);
  // };

  // const exception =
  //   selectedApp?.id !== "c57eedc3-a954-4262-a0af-376c65b5a282" &&
  //   selectedApp?.id !== "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9" &&
  //   selectedApp?.id !== "9e988322-cffd-484c-9ed6-460d8701551b" &&
  //   selectedApp?.id !== "c57eedc3-a954-4262-a0af-376c65b5a280" &&
  //   selectedApp?.id !== "31a91a86-7ad3-47a6-a172-d33ceaebb35f";

  // const setPinIsEnabledFunc = (val) => {
  //   dispatch(mainActions.setPinIsEnabled(val));
  // };

  // const clickHandler = (e) => {
  //   if (selectedApp?.id === "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9") {
  //     handleOpenNotify(e, "CREATE_TO_MINIO");
  //   } else if (selectedApp?.id === "744d63e6-0ab7-4f16-a588-d9129cf959d1") {
  //     handleOpenNotify(e, "WIKI_FOLDER");
  //   } else if (selectedApp?.id === "c57eedc3-a954-4262-a0af-376c65b5a282") {
  //     handleOpenNotify(e, "FAVOURITE");
  //   } else {
  //     handleOpenNotify(e, "ROOT");
  //   }
  //   setElement(selectedApp);
  //   dispatch(menuActions.setMenuItem(selectedApp));
  // };

  const onDrop = (dropResult) => {
    const result = applyDrag(menuChilds?.[element?.id], dropResult);
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
              {/* {selectedApp?.id === adminId && (
                <ProjectSettings
                  handleOpenNotify={handleOpenNotify}
                  menuStyle={menuStyleNew}
                  setSubMenuIsOpen={setSubMenuIsOpen}
                  pinIsEnabled={pinIsEnabled}
                  projectSettingLan={projectSettingLan}
                />
              )}
              {selectedApp?.id === adminId && (
                <Permissions
                  projectSettingLan={projectSettingLan}
                  menuStyle={{
                    ...menuStyles,
                    background: "#fff",
                  }}
                  setElement={setElement}
                />
              )}
              {selectedApp?.id === adminId && (
                <Resources
                  projectSettingLan={projectSettingLan}
                  handleOpenNotify={handleOpenNotify}
                  menuStyle={menuStyleNew}
                  setSubMenuIsOpen={setSubMenuIsOpen}
                  pinIsEnabled={pinIsEnabled}
                />
              )}
              {selectedApp?.id === adminId && (
                <ApiMenu
                  projectSettingLan={projectSettingLan}
                  handleOpenNotify={handleOpenNotify}
                  menuStyle={menuStyleNew}
                  setSubMenuIsOpen={setSubMenuIsOpen}
                  pinIsEnabled={pinIsEnabled}
                />
              )}
              {selectedApp?.id === "9e988322-cffd-484c-9ed6-460d8701551b" && (
                <Users
                  projectSettingLan={projectSettingLan}
                  menuStyle={menuStyleNew}
                  setSubMenuIsOpen={setSubMenuIsOpen}
                  child={child}
                  selectedApp={selectedApp}
                />
              )} */}
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
