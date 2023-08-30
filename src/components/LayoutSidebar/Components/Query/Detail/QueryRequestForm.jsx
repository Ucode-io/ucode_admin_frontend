import { Box } from "@mui/material";
import { useState } from "react";
import { useTableByIdQuery } from "../../../../../services/constructorTableService";
import { useFieldsListQuery } from "../../../../../services/fieldService";
import HFSelect from "../../../../FormElements/HFSelect";
import InputWithPopUp from "./InputWithPopUp";
import HFTextField from "../../../../FormElements/HFTextField";
import HFAutocomplete from "../../../../FormElements/HFAutocomplete";
import { useQueryClient } from "react-query";

const QueryRequstForm = ({
  form,
  control,
  tables,
  setSearch,
  allText,
  setAllText,
}) => {
  const [tableFields, setTableFields] = useState();
  const tableId = form.watch("body.query_mapping.request_map.table");
  const { isLoading } = useTableByIdQuery({
    id: tableId,
    queryParams: {
      enabled: !!tableId,
      onSuccess: (res) => {
        form.setValue("body.query_mapping.request_map.table_slug", res.slug);
      },
    },
  });

  const { isLoading: fieldLoading } = useFieldsListQuery({
    params: {
      table_id: tableId,
    },
    queryParams: {
      enabled: Boolean(tableId),
      onSuccess: (res) => {
        const queryMapping = {};
        res?.fields?.forEach((item) => {
          queryMapping[item?.slug] = "";
        });
        setTableFields(res?.fields);
        form.setValue(
          "body.query_mapping.request_map.field_match",
          queryMapping
        );
      },
    },
  });

  return (
    <Box width="100%">
      <Box>
        <Box mt={2} mb={2}>
          <HFAutocomplete
            name="body.query_mapping.request_map.table"
            control={control}
            placeholder="Type Error id"
            fullWidth
            options={tables}
            onFieldChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Box>
        <Box
          border={tableFields && "1px solid #E2E8F0"}
          borderRadius="0.375rem"
        >
          <Box>
            {tableFields?.map((field, index) => (
              <Box borderBottom="1px solid #E2E8F0" display="flex">
                <HFTextField
                  name={``}
                  form={form}
                  defaultValue={field.slug}
                  placeholder={"Key"}
                  disabled
                  fullWidth
                />

                <Box
                  width="100%"
                  display="flex"
                  alignItems="center"
                  borderLeft="1px solid #E2E8F0"
                  pl="5px"
                >
                  <InputWithPopUp
                    alltext={allText}
                    setAllText={setAllText}
                    name={`body.query_mapping.request_map.field_match.${field.slug}`}
                    form={form}
                    placeholder={"Value"}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QueryRequstForm;
