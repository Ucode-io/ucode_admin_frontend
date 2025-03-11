import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import { useDispatch } from "react-redux";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { useClientTypeDeleteMutation } from "../../../../services/clientTypeService";
import { store } from "../../../../store";
import { useGetLang } from "../../../../hooks/useGetLang";
import { useTranslation } from "react-i18next";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "../../constants";

const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`

const permissionFolder = {
  label: "Permissionss",
  type: "USER_FOLDER",
  icon: "lock.svg",
  parent_id: adminId,
  id: "14",
  data: {
    permission: {
      read: true,
      write: true,
      delete: true,
      update: true,
    },
  },
};

export const usePermissionsProps = () => {

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const company = store.getState().company;
  const lang = useGetLang("Setting");
  const {i18n} = useTranslation();

  const [child, setChild] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserFolder, setSelectedUserFolder] = useState(null);
  const [userFolderModalType, setUserFolderModalType] = useState(null);

  const { setSearchParams } = useSettingsPopupContext();

  const closeUserFolderModal = () => setSelectedUserFolder(null);

  const openUserFolderModal = (folder, type) => {
    setSelectedUserFolder(folder);
    setUserFolderModalType(type);
  };

  const menuSettingsClick = (e, element) => {
    e?.stopPropagation();
    openUserFolderModal(element, "UPDATE");
    dispatch(menuActions.setMenuItem(element));
  };

  const permissionData = useQuery(
    ["GET_CLIENT_TYPE_PERMISSION", permissionFolder],
    () => {
      setIsLoading(true);
      return clientTypeServiceV2.getList();
    },
    {
      cacheTime: 10,
      enabled: Boolean(permissionFolder),
      onSuccess: (res) => {
        setIsLoading(false);
        setChild(
          res.data.response?.map((row) => ({
            ...row,
            type: "PERMISSION",
            id: row.guid,
            parent_id: "13",
            data: {
              permission: {
                read: true,
              },
            },
          }))
        );
      },
      onError: () => {
        setIsLoading(false);
      },
    }
  );

  const {mutate: deleteClientType, isLoading: deleteLoading} =
      useClientTypeDeleteMutation({
        onSuccess: () => {
          queryClient.refetchQueries(["GET_CLIENT_TYPE_PERMISSION"]);
        },
      });

  const deleteRole = async (element) => {
    console.log(element);
    if (element?.guid) {
      await deleteClientType({
        id: element?.guid,
        project_id: company?.projectId,
      });
    }
  };

  const handleItemClick = (element) => {
    setSearchParams({
      permissionId: element?.guid,
      tab: TAB_COMPONENTS?.PERMISSIONS?.PERMISSIONS_DETAIL
    })
  }

  return {
    child,
    isLoading,
    menuSettingsClick,
    selectedUserFolder,
    userFolderModalType,
    closeUserFolderModal,
    deleteRole,
    lang,
    i18n,
    handleItemClick,
  }
};
