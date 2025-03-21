import { useMemo } from "react";
import resourceService, { useResourceListQuery, useResourceListQueryV2 } from "../../../../services/resourceService";
import { store } from "../../../../store";
import { useQuery } from "react-query";
import { useGetLang } from "../../../../hooks/useGetLang";
import { useTranslation } from "react-i18next";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";

export const useResourcesProps = () => {

  const company = store.getState().company;
  const authStore = store.getState().auth;

  const { setSearchParams } = useSettingsPopupContext();

  const lang = useGetLang("Setting");

  const { t, i18n } = useTranslation()

  const handleItemClick = (row) => {
    setSearchParams({
      tab: TAB_COMPONENTS?.RESOURCES?.RESOURCES_DETAIL,
      resourceId: row?.id,
      resourceType: row?.type,
    })
  }

  const handleAddClick = () => {
    setSearchParams({
      tab: TAB_COMPONENTS?.RESOURCES?.RESOURCES_DETAIL,
    })
  }

  const {data: {resources} = {}} = useResourceListQuery({
      params: {
        project_id: company?.projectId,
      },
    });

  const {data: clickHouseList} = useQuery(
      ["GET_OBJECT_LIST"],
      () => {
        return resourceService.getListClickHouse({
          data: {
            environment_id: authStore.environmentId,
            limit: 0,
            offset: 0,
            project_id: company?.projectId,
          },
        });
      },
      {
        enabled: true,
        select: (res) => {
          return (
            res?.airbytes?.map((item) => ({
              ...item,
              type: "CLICK_HOUSE",
              name: "Click house",
            })) ?? []
          );
        },
      }
    );
  

  const {data = {}, isLoading} = useResourceListQueryV2({
      params: {
        project_id: company?.projectId,
      },
    });

    const computedResources = useMemo(() => {
      return [
        ...(data?.resources || []),
        // ...(resources || []),
        ...(clickHouseList || []),
      ];
    }, [data, resources, clickHouseList]);

  return {
    computedResources,
    i18n,
    t,
    lang,
    isLoading,
    handleItemClick,
    handleAddClick,
  }
};
