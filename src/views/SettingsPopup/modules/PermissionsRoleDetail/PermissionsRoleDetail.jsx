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
          <Box display={"flex"} alignItems={"center"} columnGap={"8px"}>
            <span className={cls.clientType}>{activeClientType?.name}</span>
            <button className={cls.iconBtn} onClick={handleOpenUpdateModal}>
              <span>
                <EditIcon />
              </span>
            </button>
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
                  transform: isCategoryOpen ? "rotate(180deg)" : "rotate(0)",
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
                    <span className={clsx(cls.categoryLabelBadge, cls.table)}>
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
                    <span className={clsx(cls.categoryLabelBadge, cls.menu)}>
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
                      className={clsx(cls.categoryLabelBadge, cls.permission)}>
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
        <RoleCreateModal closeModal={handleCloseRoleModal} modalType={"NEW"} />
      )}
      {isUpdateModalOpen && (
        <FolderCreateModal
          clientType={activeClientType}
          closeModal={handleCloseUpdateModal}
          modalType={"UPDATE"}
        />
      )}
    </Box>
  );
};
