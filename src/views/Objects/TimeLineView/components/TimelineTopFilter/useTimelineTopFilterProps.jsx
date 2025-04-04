import { useState } from "react";
import { useTranslation } from "react-i18next";
import constructorViewService from "../../../../../services/constructorViewService";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";

export const useTimelineTopFilterProps = ({ views, selectedTabIndex, form }) => {

  const queryClient = useQueryClient();

  const { i18n } = useTranslation();

  const { tableSlug } = useParams();


  const [anchorElType, setAnchorElType] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);

  const [anchorElGroup, setAnchorElGroup] = useState(null);

  const openGroup = Boolean(anchorElGroup);
  const openSettings = Boolean(anchorElSettings);
  const openType = Boolean(anchorElType);

  const [updateLoading, setUpdateLoading] = useState(false);
  
  const updateView = () => {
    setUpdateLoading(true);
    constructorViewService
      .update(tableSlug, {
        ...views?.[selectedTabIndex],
        attributes: {
          ...views?.[selectedTabIndex]?.attributes,
          group_by_columns: form
            .watch("group_fields")
            ?.filter((el) => el !== "" && el !== null && el !== undefined),
        },
        group_fields: form
          .watch("group_fields")
          ?.filter((el) => el !== "" && el !== null && el !== undefined),
      })
      .then(() => {})
      .finally(() => {
        setUpdateLoading(false);
        queryClient.refetchQueries(["GET_TABLE_INFO"]);
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST_WITH_RELATIONS"]);
      });
  };

  const handleClickSettings = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorElSettings(null);
  };

  const handleClickType = (event) => {
    setAnchorElType(event.currentTarget);
  };

  const handleCloseType = () => {
    setAnchorElType(null);
  };

  const handleClickGroup = (event) => {
    setAnchorElGroup(event.currentTarget);
  };
  const handleCloseGroup = () => {
    setAnchorElGroup(null);
  };

  const types = [
    {
      title: "Day",
      value: "day",
    },
    {
      title: "Week",
      value: "week",
    },
    {
      title: "Month",
      value: "month",
    },
  ];
  
  return {
    openType,
    handleClickType,
    handleCloseType,
    anchorElType,
    i18n,
    types,
    openSettings,
    handleClickSettings,
    handleCloseSettings,
    anchorElSettings,
    openGroup,
    handleClickGroup,
    handleCloseGroup,
    anchorElGroup,
    updateView,
    updateLoading,
  }
}
