import { useFieldArray } from "react-hook-form";
import { useQuery } from "react-query";
import constructorFieldService from "@/services/constructorFieldService";

export const useAutoFilterProps = ({ control, watch, }) => {

  const {fields, append, remove} = useFieldArray({
    control,
    name: "auto_filters",
  });

  const {data: fieldsToList, isLoading: fieldToListLoading} = useQuery(
    ["GET_FIELDS_LIST", watch("table_to")],
    () =>
      constructorFieldService.getList(
        {
          tableSlug: watch("table_to"),
        },
        watch("table_to")
      ),
    {
      enabled: !!watch("table_to"),
    }
  );

  const {data: fieldFromList, isLoading: fieldFromListLoading} = useQuery(
    ["GET_FIELDS_LIST", watch("table_from")],
    () =>
      constructorFieldService.getList(
        {
          tableSlug: watch("table_from"),
        },
        watch("table_from")
      ),
    {
      enabled: !!watch("table_from"),
    }
  );

  const attributeFields = [
    {
      slug: "field_from",
      isLoading: fieldFromListLoading,
      placeholder: "Field From",
      options: fieldFromList?.fields?.map((field) => ({
        label: field.slug,
        value: field.slug,
      })),
    },
    {
      slug: "field_to",
      isLoading: fieldToListLoading,
      placeholder: "Field to",
      options: fieldsToList?.fields?.map((field) => ({
        label: field.slug,
        value: field.slug,
      })),
    },
  ];

  const addNewAutoFilter = () => append({field_from: "", field_to: ""});
  const deleteAutoFilter = (index) => remove(index);

  return {
    fields,
    attributeFields,
    deleteAutoFilter,
    addNewAutoFilter,
  }
}
