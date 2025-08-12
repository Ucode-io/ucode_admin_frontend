import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { store } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";
import menuSettingsService from "../../../../services/menuSettingsService";

export const usePermissionsRoleDetail = () => {
  const { control, reset, watch, setValue, handleSubmit } = useForm();
  const projectId = store.getState().company.projectId;

  const [changedData, setChangedData] = useState([]);

  const [isCreateRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("table");
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState("");

  // const activeRoleId = useSelector((state) => state.settingsModal.roleId);

  const dispatch = useDispatch();

  const permissionId = useSelector((state) => state.settingsModal.permissionId);

  const { permissionChild } = useSettingsPopupContext();

  const activeClientType = permissionChild?.find(
    (item) => item?.id === permissionId
  );

  const handleOpenRoleModal = () => setCreateRoleModalOpen(true);
  const handleCloseRoleModal = () => setCreateRoleModalOpen(false);

  const handleOpenUpdateModal = () => setIsUpdateModalOpen(true);
  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);

  const handleChangeTab = (tab) => setActiveTab(tab);

  const handleOpenCategory = () => setCategoryOpen(true);
  const handleCloseCategory = () => setCategoryOpen(false);

  const onBackClick = () => {
    dispatch(settingsModalActions.resetParams());
  };

  const [menuList, setMenuList] = useState({
    menus: [],
  });
  const [isMenuListLoading, setIsMenuListLoading] = useState([]);

  const getMenuList = () => {
    setIsMenuListLoading(true);

    menuSettingsService
      .getList({
        parent_id: "c57eedc3-a954-4262-a0af-376c65b5a284",
      })
      .then((res) => {
        setMenuList({
          menus: res?.menus?.map((item) => ({
            ...item,
            permission: item?.data?.permission,
          })),
        });
        setIsMenuListLoading(false);
      })
      .catch((error) => {
        setIsMenuListLoading(false);
        console.log("error", error);
      })
      .finally(() => {
        setIsMenuListLoading(false);
      });
  };

  useEffect(() => {
    getMenuList();
  }, [activeClientType]);

  const { data: rolePermissionData, isLoading: rolePermissionGetByIdLoading } =
    useRolePermissionGetByIdQuery({
      projectId: projectId,
      roleId: activeRoleId,
      queryParams: {
        enabled: Boolean(activeRoleId),
      },
    });

  const { data: permissionData, isLoading: permissionGetByIdLoading } =
    useMenuPermissionGetByIdQuery({
      projectId: projectId,
      roleId: activeRoleId,
      parentId: "c57eedc3-a954-4262-a0af-376c65b5a284",
      queryParams: {
        enabled: Boolean(activeRoleId),
      },
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

  const { data: roles } = useQuery(
    ["GET_ROLE_LIST", permissionId],
    () => {
      return roleServiceV2.getList({
        "client-type-id": permissionId,
      });
    },
    {
      onSuccess(res) {
        setActiveRoleId(res?.data?.response[0]?.guid);
        dispatch(settingsModalActions.setRoleId(res?.data?.response[0]?.guid));
      },
    }
  );

  const onSubmit = (values) => {
    updateRolePermissionMutate({
      data: {
        ...values?.data,
      },
      project_id: values?.project_id,
      role_id: activeRoleId,
    });
    updatePermissionMutate({
      menus: [...changedData],
      project_id: values?.project_id,
      role_id: activeRoleId,
    });

    queryClient.refetchQueries([
      "rolePermissionGetById",
      { projectId, activeRoleId },
    ]);
  };

  const onTabClick = (element, index) => {
    dispatch(settingsModalActions.setRoleId(element?.guid));
    setActiveRoleId(element?.guid);
    // const newSearchParams = new URLSearchParams(searchParams);
    // newSearchParams.set("roleId", element?.guid);
    // setSearchParams(newSearchParams);

    // updateSearchParam("roleId", element?.guid);
    // updateSearchParam(
    //   "tab",
    //   TAB_COMPONENTS?.PERMISSIONS?.PERMISSIONS_ROLE_DETAIL
    // );
  };

  useEffect(() => {
    if (rolePermissionData || menuList) {
      reset({ ...menuList, ...rolePermissionData });
    }
  }, [menuList, rolePermissionData, activeClientType]);

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
    onBackClick,
    onTabClick,
    roles: roles?.data?.response,
    activeTabId: activeRoleId,
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