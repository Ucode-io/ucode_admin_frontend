import {Box} from "@mui/material";
import {usePermissionsRoleDetail} from "./usePermissionsRoleDetail";
import {ContentTitle} from "../../components/ContentTitle";
import {Button} from "../../components/Button";
import Permissions from "./Permissions";
import AddIcon from "@mui/icons-material/Add";
import cls from "./styles.module.scss";
import clsx from "clsx";
import RoleCreateModal from "./RoleCreateModal";
import {FolderCreateModal} from "../../components/FolderCreateModal";
import {EditIcon} from "@/assets/icons/icon";
import {GreyLoader} from "@/components/Loaders/GreyLoader";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {useState} from "react";
import ConnectionsModal from "./ConnectionsModal";
import {useQuery} from "react-query";
import connectionServiceV2 from "../../../../services/auth/connectionService";
import {useSelector} from "react-redux";

export const PermissionsRoleDetail = () => {
  const {
    handleSubmit,
    onSubmit,
    rolePermissionGetByIdLoading,
    permissionGetByIdLoading,
    control,
    setChangedData,
    changedData,
    setValue,
    watch,
    onBackClick,
    roles,
    onTabClick,
    activeTabId,
    handleOpenRoleModal,
    handleCloseRoleModal,
    isCreateRoleModalOpen,
    activeClientType,
    isUpdateModalOpen,
    handleOpenUpdateModal,
    handleCloseUpdateModal,
    activeTab,
    isCategoryOpen,
    handleChangeTab,
    handleOpenCategory,
    handleCloseCategory,
    categories,
  } = usePermissionsRoleDetail();
  const auth = useSelector((state) => state.auth);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {data: connections, isLoading} = useQuery(
    ["GET_CONNECTION_LIST", activeClientType?.id],
    () => {
      return connectionServiceV2.getList(
        {client_type_id: activeClientType?.id},
        {"Environment-id": auth.environmentId}
      );
    },
    {
      cacheTime: 10,
      enabled: !!activeClientType?.id,
    }
  );

  return (
    <Box flex={1}>
      <ContentTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "3px 4px",
              bgcolor: "#f9fafb",
            }}>
            <Box
              minWidth={"78px"}
              justifyContent={"center"}
              display={"flex"}
              alignItems={"center"}
              columnGap={"8px"}
              padding={"3px"}
              borderRadius={"6px"}
              bgcolor={selectedIndex === 0 ? "#fff" : ""}
              sx={{
                cursor: "pointer",
              }}
              onClick={() => setSelectedIndex(0)}>
              <span className={cls.clientType}>{activeClientType?.name}</span>
              <button
                style={{display: selectedIndex === 0 ? "block" : "none"}}
                className={cls.iconBtn}
                onClick={handleOpenUpdateModal}>
                <span>
                  <EditIcon />
                </span>
              </button>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              columnGap={"8px"}
              padding={"3px"}
              borderRadius={"6px"}
              fontSize={"12px"}
              bgcolor={selectedIndex === 1 ? "#fff" : ""}
              sx={{cursor: "pointer"}}
              onClick={() => setSelectedIndex(1)}>
              <button className={cls.clientTypeConnect}>{"Connections"}</button>
            </Box>
          </Box>

          <Button
            className={cls.saveBtn}
            primary
            onClick={handleSubmit(onSubmit)}
            variant="contained">
            Save
          </Button>
        </Box>
      </ContentTitle>
      {selectedIndex === 0 ? (
        <Box>
          <Box
            display="flex"
            alignItems={"center"}
            justifyContent={"space-between"}>
            <Box className={cls.tabs}>
              {roles?.map((el, index) => (
                <button
                  className={clsx(cls.tabBtn, {
                    [cls.active]: el?.guid === activeTabId,
                  })}
                  key={el?.guid}
                  onClick={() => {
                    onTabClick(el, index);
                  }}>
                  {el?.name}
                </button>
              ))}
              <button className={cls.addRoleBtn} onClick={handleOpenRoleModal}>
                <span>
                  <AddIcon />
                </span>
              </button>
            </Box>
            <div className={cls.categoryDropdown}>
              <button
                className={cls.categoryDropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  isCategoryOpen ? handleCloseCategory() : handleOpenCategory();
                }}>
                <span className={cls.categoryDropdownBtnInner}>
                  <span>Category: {categories[activeTab]}</span>
                  <ExpandMoreOutlinedIcon
                    sx={{
                      transform: isCategoryOpen
                        ? "rotate(180deg)"
                        : "rotate(0)",
                    }}
                    color="inherit"
                  />
                </span>
              </button>
              {isCategoryOpen && (
                <div className={cls.categoryDropdownContent}>
                  <p className={cls.categoryTitle}>Category</p>
                  <ul className={cls.categoryList}>
                    <li className={cls.categoryItem}>
                      <div
                        className={cls.categoryLabel}
                        onClick={() => handleChangeTab("table")}>
                        <span
                          className={clsx(cls.customRadio, {
                            [cls.active]: activeTab === "table",
                          })}>
                          <span></span>
                        </span>
                        <span
                          className={clsx(cls.categoryLabelBadge, cls.table)}>
                          Table
                        </span>
                      </div>
                    </li>
                    <li className={cls.categoryItem}>
                      <div
                        className={cls.categoryLabel}
                        onClick={() => handleChangeTab("menu")}>
                        <span
                          className={clsx(cls.customRadio, {
                            [cls.active]: activeTab === "menu",
                          })}>
                          <span></span>
                        </span>
                        <span
                          className={clsx(cls.categoryLabelBadge, cls.menu)}>
                          Menu
                        </span>
                      </div>
                    </li>
                    <li className={cls.categoryItem}>
                      <div
                        className={cls.categoryLabel}
                        onClick={() => handleChangeTab("permission")}>
                        <span
                          className={clsx(cls.customRadio, {
                            [cls.active]: activeTab === "permission",
                          })}>
                          <span></span>
                        </span>
                        <span
                          className={clsx(
                            cls.categoryLabelBadge,
                            cls.permission
                          )}>
                          Global Permissions
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </Box>

          {rolePermissionGetByIdLoading || permissionGetByIdLoading ? (
            <GreyLoader />
          ) : (
            <Permissions
              control={control}
              setChangedData={setChangedData}
              changedData={changedData}
              setValue={setValue}
              watch={watch}
              activeTab={activeTab}
            />
          )}
          {isCreateRoleModalOpen && (
            <RoleCreateModal
              closeModal={handleCloseRoleModal}
              modalType={"NEW"}
            />
          )}
          {isUpdateModalOpen && (
            <FolderCreateModal
              clientType={activeClientType}
              closeModal={handleCloseUpdateModal}
              modalType={"UPDATE"}
            />
          )}
        </Box>
      ) : (
        <ConnectionsModal
          connections={connections}
          activeClientType={activeClientType}
        />
      )}
    </Box>
  );
};
