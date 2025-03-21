import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { store } from "../../../../store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMenuPermissionGetByIdQuery, useMenuPermissionUpdateMutation, useRolePermissionGetByIdQuery, useRolePermissionUpdateMutation } from "../../../../services/rolePermissionService";
import { showAlert } from "../../../../store/alert/alert.thunk";
import queryClient from "../../../../queries";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";

export const usePermissionsRoleDetail = () => {

  const {control, reset, watch, setValue, handleSubmit} = useForm();
  const {roleId} = useParams();
  const projectId = store.getState().company.projectId;
  const [changedData, setChangedData] = useState([]);
  const dispatch = useDispatch();

  const { searchParams, setSearchParams, } = useSettingsPopupContext();

  const onBackClick = () => {
    setSearchParams({
      tab: TAB_COMPONENTS?.PERMISSIONS?.PERMISSIONS_DETAIL,
      permissionId: searchParams?.permissionId
    })
  }

  const {data: rolePermissionData, isLoading: rolePermissionGetByIdLoading} =
    useRolePermissionGetByIdQuery({
      projectId: projectId,
      roleId: roleId,
    });

  const {data: permissionData, isLoading: permissionGetByIdLoading} =
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

  const {mutate: updatePermissionMutate, isLoading: updatePermissionLoading} =
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
      role_id: roleId,
    });
    updatePermissionMutate({
      menus: [...changedData],
      project_id: values?.project_id,
      role_id: roleId,
    });

    queryClient.refetchQueries(["rolePermissionGetById", {projectId, roleId}]);
  };

  useEffect(() => {
    if (rolePermissionData || permissionData) {
      reset({...permissionData, ...rolePermissionData});
    }
  }, [permissionData, rolePermissionData]);

  return {
    handleSubmit,
    onSubmit,
    rolePermissionGetByIdLoading,
    permissionGetByIdLoading,
    control,
    setChangedData,
    changedData,
    setValue,
    watch,
    searchParams,
    setSearchParams,
    onBackClick,
  }
}