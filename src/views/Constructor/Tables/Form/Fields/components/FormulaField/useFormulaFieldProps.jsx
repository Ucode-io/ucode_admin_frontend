import { useMemo, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useFieldsListQuery } from "@/services/constructorFieldService";
import { useGetLang } from "@/hooks/useGetLang";
import { useTranslation } from "react-i18next";

export const useFormulaFieldProps = ({
  mainForm,
  menuItem,
  tableSlug,
  control,
  watch,
}) => {
  const { i18n } = useTranslation();
  const tableLan = useGetLang("Table");

  const [fields, setFields] = useState([]);

  const [mathEl, setMathEl] = useState(null);

  const mathType = watch("attributes.math");

  const openMath = Boolean(mathEl);

  const fieldsList = useMemo(() => {
    return mainForm.getValues("fields") ?? [];
  }, []);

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

  const handleCloseMath = () => {
    setMathEl(null);
  };

  return {
    formulaTypes,
    fieldsList,
    computedTables,
    fields,
    selectedTableSlug,
    relation,
    addNewSummary,
    deleteSummary,
    type,
    i18n,
    tableLan,
    mathEl,
    setMathEl,
    mathType,
    openMath,
    handleCloseMath,
  };
};
