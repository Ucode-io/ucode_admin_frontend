import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useFieldsListQuery } from "@/services/constructorFieldService";
import { useGetLang } from "@/hooks/useGetLang";
import { useTranslation } from "react-i18next";
import { FIELD_TYPES } from "../../../../../../../utils/constants/fieldTypes";
import {
  getFieldIcon,
  getFunctionsByFieldType,
  menuIcons,
} from "./formulaFieldIcons";

export const useFormulaFieldProps = ({
  mainForm,
  menuItem,
  tableSlug,
  control,
  watch,
  setValue = () => {},
}) => {
  const { i18n } = useTranslation();
  const tableLan = useGetLang("Table");

  const [editorValue, setEditorValue] = useState("");
  const [editorSearchText, setEditorSearchText] = useState("");
  const [exampleType, setExampleType] = useState("");

  const [fields, setFields] = useState([]);

  const editorRef = useRef(null);

  const fieldsList =
    mainForm
      .getValues("fields")
      ?.filter(
        (item) =>
          item?.type !== FIELD_TYPES.UUID &&
          !item?.type?.includes("FRONTEND") &&
          item?.label
      ) ?? [];

  const lastField = fieldsList?.find((item) => {
    const label = item?.attributes?.[`label_${i18n.language}`] || item?.label;
    const splittedVal = editorValue
      ?.split(" ")
      ?.[editorValue?.split(" ")?.length - 1]?.toLowerCase();

    if (!editorValue) return false;

    const splittedLabel = label?.split(" ");
    return (
      splittedLabel?.[splittedLabel.length - 1]?.toLowerCase() ===
        splittedVal?.toLowerCase() ||
      splittedLabel?.[splittedLabel.length - 1]?.toLowerCase() ===
        splittedVal?.toLowerCase() + "."
    );
  });

  const menuList = useMemo(() => {
    if (lastField?.type) {
      setEditorSearchText("");
    }

    return getFunctionsByFieldType({
      fieldType: lastField?.type || "ALL",
      fieldsList,
    });
  }, [editorValue]);

  const onEditorChange = (value) => {
    setEditorValue(value);
    setValue("attributes.formula", value);
  };

  const onItemMouseEnter = (type) => setExampleType(type);
  const onItemMouseLeave = () => setExampleType(null);

  const handleFilterFields = (value) => {
    if (
      value.substring(value.length - 1) === "." ||
      value.substring(value.length - 1) === ")" ||
      value.substring(value.length - 1) === "(" ||
      value.substring(value.length - 1) === " "
    ) {
      setEditorSearchText("");
    } else {
      const splittedValSpace = value?.split(" ");
      const splittedValDot = value?.split(".");

      const lastSplittedValText = splittedValSpace[splittedValSpace.length - 1];

      if (lastSplittedValText && !lastSplittedValText.includes(".")) {
        setEditorSearchText(lastSplittedValText);
      } else if (splittedValDot[splittedValDot.length - 1]) {
        setEditorSearchText(splittedValDot[splittedValDot.length - 1]);
      } else {
        setEditorSearchText("");
      }
    }
  };

  const formulaTypes = [
    { label: "Сумма", value: "SUMM" },
    { label: "Максимум", value: "MAX" },
    { label: "Среднее", value: "AVG" },
  ];

  const {
    fields: relation,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "attributes.formula_filters",
  });

  const deleteSummary = (index) => {
    remove(index);
  };

  const addNewSummary = () => {
    append({
      key: "",
      value: "",
    });
  };

  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  });

  const selectedTableSlug = useWatch({
    control,
    name: "attributes.table_from",
  });

  const type = useWatch({
    control,
    name: "attributes.type",
  });

  const computedTables = useMemo(() => {
    return tableRelations?.map((relation) => {
      const relatedTable = relation[relation.relatedTableSlug];

      return {
        label: relatedTable?.label,
        value: `${relatedTable?.slug}#${relation?.id}`,
      };
    });
  }, [tableRelations]);

  const { isLoading: fieldLoading } = useFieldsListQuery({
    params: {
      table_id: menuItem?.table_id,
      tableSlug: tableSlug,
      table_slug: tableSlug,
    },
    tableSlug,
    queryParams: {
      enabled: Boolean(menuItem?.table_id),
      onSuccess: (res) => {
        setFields(
          res?.fields?.map((item) => {
            return { value: item.slug, label: item.label };
          })
        );
      },
    },
  });

  useEffect(() => {
    let result = watch("attributes.formula") || "";

    if (result) {
      fieldsList.forEach(({ attributes, label, slug }) => {
        const currentLabel = attributes?.[`label_${i18n?.language}`] || label;

        const regex = new RegExp(`\\b${slug}\\b`, "gi");
        result = result.replace(regex, currentLabel);
      });
    }

    setEditorValue(result ?? "");
  }, []);

  useEffect(() => {
    const menuLists = menuList?.map((item) => item.list).flat();
    const filteredMenuLists = menuLists.filter((item) => {
      const label = item?.attributes?.[`label_${i18n.language}`] || item?.label;
      return label?.toLowerCase()?.includes(editorSearchText?.toLowerCase());
    });
    setExampleType(filteredMenuLists[0] || "");
  }, [editorSearchText, menuList]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (exampleType) {
        const splittedVal = editorValue?.split(" ");
        const splittedDotVal = editorValue?.split(".");
        const label =
          exampleType?.attributes?.[`label_${i18n.language}`] ||
          exampleType?.label;

        if (
          splittedVal.length > 1 &&
          label
            ?.toLowerCase()
            .includes(splittedVal[splittedVal.length - 1]?.toLowerCase())
        ) {
          e.preventDefault();
          setEditorValue(
            splittedVal.slice(0, splittedVal.length - 1).join(" ") + " " + label
          );
        } else if (
          splittedDotVal.length > 1 &&
          label
            ?.toLowerCase()
            .includes(splittedDotVal[splittedDotVal.length - 1]?.toLowerCase())
        ) {
          e.preventDefault();
          setEditorValue(
            splittedDotVal.slice(0, splittedDotVal.length - 1).join(".") +
              "." +
              label
          );
        } else if (label?.includes("()")) {
          e.preventDefault();
          setEditorValue(editorValue + "." + label);
        } else if (
          splittedVal.length === 1
          // &&
          // label?.toLowerCase().includes(splittedVal[0]?.toLowerCase())
        ) {
          e.preventDefault();
          setEditorValue(label);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editorValue]);

  return {
    formulaTypes,
    computedTables,
    fields,
    selectedTableSlug,
    relation,
    addNewSummary,
    deleteSummary,
    type,
    onEditorChange,
    editorValue,
    handleFilterFields,
    editorRef,
    menuList,
    onItemMouseEnter,
    onItemMouseLeave,
    exampleType,
    i18n,
    fieldsList,
    editorSearchText,
    setEditorSearchText,
    setExampleType,
    lastField,
  };
};
