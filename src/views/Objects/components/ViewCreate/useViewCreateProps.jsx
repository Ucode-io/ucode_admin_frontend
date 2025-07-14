import { viewTypes } from "@/utils/constants/viewTypes";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { VIEW_TYPES_MAP } from "../../../../utils/constants/viewTypes";

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
  WEBSITE: "globe.svg",
  TREE: "tree.svg",
};

export const useViewCreateProps = ({
  tableRelations,
  relationView,
  view,
  fieldsMap,
  tableSlug,
  views,
  refetchViews,
  selectedViewTab,
}) => {
  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));

  const viewsList = useSelector((state) => state.groupField.viewsList);
  const { menuId } = useParams();

  const newViewJSON = useMemo(() => {
    const menuID = viewsList?.length > 1 ? undefined : menuId;
    return {
      type: selectedViewTab,
      users: [],
      name: "",
      default_limit: "",
      main_field: "",
      time_interval: 60,
      status_field_slug: "",
      disable_dates: {
        day_slug: "",
        table_slug: "",
        time_from_slug: "",
        time_to_slug: "",
      },
      columns: [],
      group_fields: [],
      navigate: {
        params: [],
        url: "",
        headers: [],
        cookies: [],
      },
      table_slug: "",
      updated_fields: [],
      multiple_insert: false,
      multiple_insert_field: "",
      chartOfAccounts: [{}],
      is_relation_view: relationView,
      attributes: {
        chart_of_accounts: [
          {
            chart_of_account: [],
          },
        ],
        percent: {
          field_id: null,
        },
        group_by_columns: [],
        summaries: [],
        name_ru: "",
        treeData: selectedViewTab === "TREE",
      },
      filters: [],
      number_field: "",
      menu_id: menuID,
      order: views.length + 1,
    };
  }, [menuId, selectedViewTab, tableSlug, views]);

  return {
    computedViewTypes,
    viewIcons,
    selectedViewTab,
  };
};
