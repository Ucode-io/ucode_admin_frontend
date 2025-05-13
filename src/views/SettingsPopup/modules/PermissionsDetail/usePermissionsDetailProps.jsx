import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import { useGetLang } from "../../../../hooks/useGetLang";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import roleServiceV2 from "../../../../services/roleServiceV2";

export const usePermissionsDetailProps = () => {
  const lang = useGetLang("Setting");

  const { clientId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const { control, reset } = useForm();
  const [connections, setConnections] = useState([]);
  const { i18n } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);

  const { searchParams, setSearchParams, updateSearchParam } =
    useSettingsPopupContext();

  const { isLoading } = useQuery(
    ["GET_CLIENT_TYPE_BY_ID", clientId],
    () => {
      return clientTypeServiceV2.getById(clientId);
    },
    {
      enabled: !!clientId,
      onSuccess: (res) => {
        setConnections([res?.data?.response]);
        reset(res.data.response);
      },
    }
  );

  const { data: roles, isRolesLoading } = useQuery(
    ["GET_ROLE_LIST", clientId, searchParams?.get("permissionId")],
    () => {
      return roleServiceV2.getList({ "client-type-id": clientId });
    },
    {
      onSuccess(res) {
        updateSearchParam("roleId", res?.data?.response[0]?.guid);
      },
    }
  );

  const onRowClick = (element) => {
    setSearchParams({
      permissionId: element?.guid,
      tab: TAB_COMPONENTS?.PERMISSIONS?.PERMISSIONS_ROLE_DETAIL,
    });
  };

  const onTabClick = (element, index) => {
    console.log({ element });
    updateSearchParam("roleId", element?.guid);
    updateSearchParam(
      "tab",
      TAB_COMPONENTS?.PERMISSIONS?.PERMISSIONS_ROLE_DETAIL
    );
    setTabIndex(index);
  };

  return {
    lang,
    clientId,
    selectedTab,
    control,
    reset,
    connections,
    i18n,
    isLoading,
    setSelectedTab,
    setSearchParams,
    onRowClick,
    roles: roles?.data?.response ?? [],
    isRolesLoading,
    tabIndex,
    setTabIndex,
    onTabClick,
    activeTabId: searchParams.get("roleId"),
  };
};
