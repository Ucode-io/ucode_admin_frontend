import { useViewContext } from "@/providers/ViewProvider";
import relationService from "@/services/relationService";
import constructorViewService from "@/services/viewsService/views.service";
import calculateWidthFixedColumn from "@/utils/calculateWidthFixedColumn";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import FunctionsIcon from "@mui/icons-material/Functions";

export const useThProps = ({
  getAllData = () => {},
  column,
  relationAction,
  isRelationTable,
  tableSettings,
  pageName,
  columns,
  tableSize,
}) => {

  const { tableSlug, view } = useViewContext();

  const {i18n} = useTranslation();

  const [summaryOpen, setSummaryOpen] = useState(null);
  const queryClient = useQueryClient();
  const summaryIsOpen = Boolean(summaryOpen);

  const permissions = useSelector(
    (state) => state.permissions?.permissions?.[tableSlug]
  )

  const formulaTypes = [
    {
      icon: <FunctionsIcon />,
      id: 1,
      label: "Sum ()",
      value: "sum",
    },
    {
      icon: <FunctionsIcon />,
      id: 1,
      label: "Avg ()",
      value: "avg",
    },
  ];

  const handleSummaryClose = () => {
    setSummaryOpen(null);
  };

  const updateRelationView = (data) => {
    relationService.update(data, view?.relatedTable).then((res) => {
      getAllData();
      handleSummaryClose();
    });
  };

  const handleAddSummary = (item, type) => {
    let result = [];

    if (type === "add") {
      const newSummary = {
        field_name: column?.id,
        formula_name: item?.value,
      };
      result = Array.from(
        new Map(
          [newSummary, ...(view?.attributes?.summaries ?? [])]?.map((item) => [
            item.field_name,
            item,
          ])
        ).values()
      );
    } else if (type === "unset") {
      result = view?.attributes?.summaries?.filter(
        (element) => element?.field_name !== item?.id
      );
    }

    const computedValues = {
      ...view,
      attributes: {
        ...view?.attributes,
        summaries: result ?? [],
      },
    };

    const relationData = {
      ...relationAction?.relation,
      table_from: relationAction?.relation?.table_from?.slug,
      table_to: relationAction?.relation?.table_to?.slug,
    };

    const computedValuesForRelationView = {
      ...relationData,
      table_from: view?.table_from?.slug,
      table_to: view?.table_to?.slug,
      view_fields: view?.view_fields?.map((el) => el.id),
      attributes: {
        ...relationData?.attributes,
        summaries: result ?? [],
      },
      relation_table_slug:
        relationAction?.relation_table_slug || column?.table_slug,
      id: relationAction?.relation_id,
    };

    if (isRelationTable) {
      updateRelationView(computedValuesForRelationView);
    } else {
      constructorViewService.update(tableSlug, computedValues).then(() => {
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", { tableSlug });
        handleSummaryClose();
      });
    }
  };

  const position =
    tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
      ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
      ? "sticky"
      : "relative";

  const left = view?.attributes?.fixedColumns?.[column?.id]
    ? `${calculateWidthFixedColumn({ columns, column }) + 45}px`
    : "0";

  const bg =
    tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
      ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
      ? "#F6F6F6"
      : "#F9FAFB";

  const zIndex =
    tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
      ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
      ? "1"
      : "0";

  const label =
    column?.attributes?.[`label_${i18n?.language}`] ||
    column?.attributes?.[`title_${i18n?.language}`] ||
    column?.attributes?.[`name_${i18n?.language}`] ||
    column.label;

  const minWidth = tableSize?.[pageName]?.[column.id]
    ? tableSize?.[pageName]?.[column.id]
    : "auto";

  const width = tableSize?.[pageName]?.[column.id]
    ? tableSize?.[pageName]?.[column.id]
    : "auto";


  return {
    queryClient,
    position,
    left,
    bg,
    zIndex,
    label,
    minWidth,
    width,
    formulaTypes,
    handleAddSummary,
    handleSummaryClose,
    summaryIsOpen,
    permissions,
    summaryOpen,
  }
}