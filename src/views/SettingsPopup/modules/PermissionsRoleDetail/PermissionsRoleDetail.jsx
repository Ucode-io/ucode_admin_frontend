import { Box } from "@mui/material";
import { usePermissionsRoleDetail } from "./usePermissionsRoleDetail";
import { ContentTitle } from "../../components/ContentTitle";
import { Button } from "../../components/Button";
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import Permissions from "./Permissions";
import AddIcon from "@mui/icons-material/Add";
import cls from "./styles.module.scss";
import clsx from "clsx";
import RoleCreateModal from "./RoleCreateModal";

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
          }}
        >
          <span>{activeClientType?.name}</span>

          {/* <div>
            <HFTextField
              control={control}
              name="data.name"
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  border: "none !important",
                  color: "#101828 !important",
                  fontSize: "18px !important",
                  lineHeight: "28px !important",
                  fontWeight: "600 !important",
                  outline: "none",
                },
              }}
            />
          </div> */}
          <Button primary onClick={handleSubmit(onSubmit)} variant="contained">
            Save
          </Button>
        </Box>
      </ContentTitle>

      <Box display="flex">
        <Box className={cls.tabs}>
          {roles?.map((el, index) => (
            <button
              className={clsx(cls.tabBtn, {
                [cls.active]: el?.guid === activeTabId,
              })}
              key={el?.guid}
              onClick={() => {
                onTabClick(el, index);
              }}
            >
              {el?.name}
            </button>
          ))}
          <button className={cls.addRoleBtn} onClick={handleOpenRoleModal}>
            <span>
              <AddIcon />
            </span>
          </button>
        </Box>
      </Box>

      {rolePermissionGetByIdLoading || permissionGetByIdLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <div style={{ padding: "10px", background: "#fff" }}>
          <Permissions
            control={control}
            setChangedData={setChangedData}
            changedData={changedData}
            setValue={setValue}
            watch={watch}
          />
        </div>
      )}
      {isCreateRoleModalOpen && (
        <RoleCreateModal closeModal={handleCloseRoleModal} modalType={"NEW"} />
      )}
    </Box>
  );
};
