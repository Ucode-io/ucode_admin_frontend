import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { store } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useMenuPermissionGetByIdQuery,
  useMenuPermissionUpdateMutation,
  useRolePermissionGetByIdQuery,
  useRolePermissionUpdateMutation,
} from "@/services/rolePermissionService";
import { showAlert } from "@/store/alert/alert.thunk";
import queryClient from "@/queries";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import { useQuery } from "react-query";
import roleServiceV2 from "@/services/roleServiceV2";
import cls from "./styles.module.scss";

export const usePermissionsRoleDetail = () => {
  const { control, reset, watch, setValue, handleSubmit } = useForm();
  const { clientId } = useParams();
  const projectId = store.getState().company.projectId;

  const [changedData, setChangedData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const [isCreateRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("table");
  const [isCategoryOpen, setCategoryOpen] = useState(false);

  const dispatch = useDispatch();

  const { searchParams, setSearchParams, updateSearchParam, permissionChild } =
    useSettingsPopupContext();

  const roleId = searchParams.get("roleId");

  const activeClientType = permissionChild?.find(
    (item) => item?.id === searchParams?.get("permissionId")
  );

  const handleOpenRoleModal = () => setCreateRoleModalOpen(true);
  const handleCloseRoleModal = () => setCreateRoleModalOpen(false);

  const handleOpenUpdateModal = () => setIsUpdateModalOpen(true);
  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

  const handleChangeTab = (tab) => setActiveTab(tab);

  const handleOpenCategory = () => setCategoryOpen(true);
  const handleCloseCategory = () => setCategoryOpen(false);

  const onBackClick = () => {
    setSearchParams({
      tab: TAB_COMPONENTS?.PERMISSIONS?.PERMISSIONS_DETAIL,
      permissionId: searchParams?.permissionId,
    });
  };

  const { data: rolePermissionData, isLoading: rolePermissionGetByIdLoading } =
    useRolePermissionGetByIdQuery({
      projectId: projectId,
      roleId: roleId,
      queryParams: {
        enabled: Boolean(roleId),
      },
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

  const { data: roles, isRolesLoading } = useQuery(
    ["GET_ROLE_LIST", searchParams?.get("permissionId")],
    () => {
      return roleServiceV2.getList({
        "client-type-id": searchParams?.get("permissionId"),
      });
    },
    {
      onSuccess(res) {
        updateSearchParam("roleId", res?.data?.response[0]?.guid);
      },
    }
  );

  const onSubmit = (values) => {

    if (activeTab === "menu") {
      updatePermissionMutate({
        menus: values?.menus,
        project_id: values?.project_id,
        role_id: roleId,
      });
    } else {
      updateRolePermissionMutate({
        data: {
          ...values?.data,
        },
        project_id: values?.project_id,
        role_id: roleId,
      });
    }

    queryClient.refetchQueries([
      "rolePermissionGetById",
      { projectId, roleId },
    ]);
  };

  const onTabClick = (element, index) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("roleId", element?.guid);
    setSearchParams(newSearchParams);

    // updateSearchParam("roleId", element?.guid);
    // updateSearchParam(
    //   "tab",
    //   TAB_COMPONENTS?.PERMISSIONS?.PERMISSIONS_ROLE_DETAIL
    // );
  };

  useEffect(() => {
    if (rolePermissionData || permissionData) {
      reset({ ...permissionData, ...rolePermissionData });
    }
  }, [permissionData, rolePermissionData]);

  const categories = {
    table: "Table",
    permission: "Global Permission",
    menu: "Menu",
  };

  const handleWindowClick = (e) => {
    if (!e.target.matches(`.${cls.categoryDropdownBtn}`)) {
      handleCloseCategory();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);

    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

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
    onTabClick,
    roles: roles?.data?.response,
    activeTabId: searchParams.get("roleId"),
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
  };
};