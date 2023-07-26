import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import Header from "../../../../components/Header";
import FormCard from "../../../../components/FormCard";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import { useRoleGetByIdQuery } from "../../../../services/roleServiceV2";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Permissions from "./Permissions";
import {
  useMenuPermissionGetByIdQuery,
  useMenuPermissionUpdateMutation,
  useRolePermissionGetByIdQuery,
  useRolePermissionUpdateMutation,
} from "../../../../services/rolePermissionService";
import { store } from "../../../../store";
import queryClient from "../../../../queries";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../store/alert/alert.thunk";
import CreateButton from "../../../../components/Buttons/CreateButton";

const RoleDetail = () => {
  const { control, reset, watch, setValue, handleSubmit } = useForm();
  const { roleId } = useParams();
  const projectId = store.getState().company.projectId;
  const [changedData, setChangedData] = useState([]);
  const dispatch = useDispatch();

  const { data: rolePermissionData, isLoading: rolePermissionGetByIdLoading } =
    useRolePermissionGetByIdQuery({
      projectId: projectId,
      roleId: roleId,
    });

  const { data: permissionData, isLoading: permissionGetByIdLoading } =
    useMenuPermissionGetByIdQuery({
      projectId: projectId,
      roleId: roleId,
      parentId: "c57eedc3-a954-4262-a0af-376c65b5a284",
    });

  const {
    mutate: updateRolePermissionMutate,
    isLoading: updateRolePermissionLoading,
  } = useRolePermissionUpdateMutation({
    onSuccess: () => {
      dispatch(showAlert("Successfully updated", "success"));
    },
  });

  const { mutate: updatePermissionMutate, isLoading: updatePermissionLoading } =
    useMenuPermissionUpdateMutation({
      onSuccess: () => {
        dispatch(showAlert("Successfully updated", "success"));
      },
    });

  const onSubmit = (values) => {
    updateRolePermissionMutate({
      data: {
        ...values?.data,
      },
      project_id: values?.project_id,
    });
    updatePermissionMutate({
      menus: [...changedData],
      project_id: values?.project_id,
      role_id: roleId,
    });

    queryClient.refetchQueries([
      "rolePermissionGetById",
      { projectId, roleId },
    ]);
  };

  useEffect(() => {
    if (rolePermissionData || permissionData) {
      reset({ ...permissionData, ...rolePermissionData });
    }
  }, [permissionData, rolePermissionData]);

  return (
    <Box flex={1}>
      <Header
        title="Role"
        extra={
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        }
      />

      <div style={{ padding: "20px" }}>
        <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
          <div>
            <FRow label="Name">
              <HFTextField control={control} name="data.name" fullWidth />
            </FRow>
          </div>
        </FormCard>
        <FormCard title="Разрешения" icon="address-card.svg" maxWidth="100%">
          <Permissions
            control={control}
            setChangedData={setChangedData}
            changedData={changedData}
            setValue={setValue}
            watch={watch}
          />
        </FormCard>
      </div>
    </Box>
  );
};

export default RoleDetail;
