import {format} from "date-fns";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import {useQuery} from "react-query";
import constructorObjectService from "../../../services/constructorObjectService";
import {useTranslation} from "react-i18next";
import LookupCellEditor from "./FieldRelationGenerator/LookupCellEditor";

const getColumnEditorParams = (item, columnDef) => {
  const {i18n} = useTranslation();

  if (item?.type === "MULTISELECT" && item?.attributes?.options) {
    columnDef.cellEditor = "agSelectCellEditor";
    columnDef.cellEditorParams = {
      values: item.attributes.options.map((option) => option.label),
    };
  } else if (item?.type === "NUMBER") {
    columnDef.valueFormatter = (params) => {
      return params?.value?.toLocaleString();
    };
  } else if (item?.type === "INTERNATION_PHONE") {
    columnDef.valueFormatter = (params) => {
      return "+" + Number(params?.value).toLocaleString();
    };
  } else if (item?.type === "DATE") {
    columnDef.valueFormatter = (params) => {
      return params?.value && format(new Date(params?.value), "dd-mm-yyyy");
    };

    columnDef.cellEditor = "agDateCellEditor";
    columnDef.cellEditorParams = {
      format: "dd-MM-yyyy",
    };
  } else if (item?.type === "LOOKUP") {
    if (item?.type === "LOOKUP") {
      columnDef.cellEditorParams = {
        field: item,
        getRelationFieldTabsLabel,
      };
    }

    columnDef.valueFormatter = (params) => {
      const slugData = params?.data?.[`${item.slug}_data`];
      if (!slugData) return "";
      return getRelationFieldTabsLabel(item, slugData);
    };

    columnDef.filterValueGetter = (params) => {
      const slugData = params?.data?.[`${item.slug}_data`];
      if (!slugData) return "";
      return getRelationFieldTabsLabel(item, slugData);
    };
  }

  return {};
};
export default getColumnEditorParams;
