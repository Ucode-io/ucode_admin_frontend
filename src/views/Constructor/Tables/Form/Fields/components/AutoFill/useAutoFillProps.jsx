import { useQuery } from "react-query";
import constructorFieldService from "@/services/constructorFieldService";
import { useWatch } from "react-hook-form";
import { useMemo } from "react";

export const useAutoFillProps = ({ control, mainForm }) => {

  const selectedAutofillTableSlug = useWatch({
    control,
    name: "autofill_table",
  });

  const layoutRelations = useWatch({
    control: mainForm.control,
    name: "layoutRelations",
  });

  const selectedAutofillSlug = selectedAutofillTableSlug?.split("#")?.[0];

  const { data: computedRelationFields } = useQuery(
    ["GET_TABLE_FIELDS", selectedAutofillSlug],
    () => {
      if (!selectedAutofillSlug) return [];
      return constructorFieldService.getList(
        {
          table_slug: selectedAutofillSlug,
          with_one_relation: true,
        },
        selectedAutofillSlug
      );
    },
    {
      select: (res) => {
        const fields = res?.fields ?? [];
        const oneRelationFields = res?.data?.one_relation_fields ?? [];

        return [...fields, ...oneRelationFields]
          .filter(
            (field) => field.type !== "LOOKUPS" && field?.type !== "LOOKUP"
          )
          .map((el) => ({
            value: el?.path_slug ? el?.path_slug : el?.slug,
            label: el?.label,
          }));
      },
    }
  );

  const computedRelationTables = useMemo(() => {
    return layoutRelations?.map((table) => ({
      value: `${table.id?.split("#")?.[0]}#${table?.field_from}`,
      label: table.label,
    }));
  }, [layoutRelations]);

  return {
    computedRelationFields,
    computedRelationTables,
  }
};
