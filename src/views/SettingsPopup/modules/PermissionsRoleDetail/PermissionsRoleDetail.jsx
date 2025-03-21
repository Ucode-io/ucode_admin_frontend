import { Box } from "@mui/material";
import { usePermissionsRoleDetail } from "./usePermissionsRoleDetail";
import { ContentTitle } from "../../components/ContentTitle";
import { Button } from "../../components/Button";
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import Permissions from "./Permissions";

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
  } = usePermissionsRoleDetail();

  return (
    <Box flex={1}>
      <ContentTitle withBackBtn onBackClick={onBackClick}>
        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"}}>
          <span>Role</span>
          <Button
            primary
            onClick={handleSubmit(onSubmit)}
            variant="contained">
            Save
          </Button>
        </Box>
      </ContentTitle>

      {rolePermissionGetByIdLoading || permissionGetByIdLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <div style={{padding: "10px", background: "#fff"}}>
          <div>
            <FRow label="Name">
              <HFTextField control={control} name="data.name" fullWidth />
            </FRow>
          </div>
          <Permissions
            control={control}
            setChangedData={setChangedData}
            changedData={changedData}
            setValue={setValue}
            watch={watch}
          />
        </div>
      )}
    </Box>
  );
}
