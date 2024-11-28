import React, {useEffect, useState} from "react";
import Select from "react-select";
import {useTranslation} from "react-i18next";
import constructorObjectService from "../../../../services/constructorObjectService";

const LookupCellEditor = (props) => {
  const {i18n} = useTranslation();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (props.field?.table_slug) {
  //     fetchOptions();
  //   }
  // }, [props.field]);
  console.log("propsprops", props);

  // const fetchOptions = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await constructorObjectService.getListV2(
  //       props.field.table_slug,
  //       {
  //         data: {
  //           additional_request: {
  //             additional_field: "guid",
  //           },
  //           view_fields: props.field.view_fields?.map((f) => f.slug),
  //           limit: 10,
  //           offset: 0,
  //           with_relations: false,
  //         },
  //       },
  //       {language_setting: i18n.language}
  //     );
  //     const optionsData = response.data?.response ?? [];
  //     setOptions(
  //       optionsData.map((option) => ({
  //         label: props.getRelationFieldTabsLabel(props.field, option),
  //         value: option.guid,
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Failed to fetch LOOKUP options:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleChange = (selectedOption) => {
    props.stopEditing(selectedOption?.value);
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Select
      options={options}
      onChange={handleChange}
      autoFocus
      defaultValue={options.find((opt) => opt.value === props.value)}
    />
  );
};

export default LookupCellEditor;
// const {data: optionsFromLocale, refetch} = useQuery(
//   ["GET_OBJECT_LIST", debouncedValue, autoFiltersValue, value, page],
//   () => {
//     if (!field?.table_slug) return null;
//     return constructorObjectService.getListV2(
//       field?.table_slug,
//       {
//         data: {
//           ...autoFiltersValue,
//           additional_request: {
//             additional_field: "guid",
//             additional_values: [value],
//           },
//           view_fields: field?.view_fields?.map((f) => f.slug),
//           search: debouncedValue.trim(),
//           limit: 10,
//           offset: pageToOffset(page, 10),
//           with_relations: false,
//         },
//       },
//       {
//         language_setting: i18n?.language,
//       }
//     );
//   },
//   {
//     enabled:
//       (!field?.attributes?.function_path && Boolean(page > 1)) ||
//       (!field?.attributes?.function_path && Boolean(debouncedValue)),
//     select: (res) => {
//       const options = res?.data?.response ?? [];

//       return {
//         options,
//       };
//     },
//   }
// );
