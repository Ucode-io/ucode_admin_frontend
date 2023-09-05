import { Box, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { useTableByIdQuery } from "../../../../../services/constructorTableService";
import { useFieldsListQuery } from "../../../../../services/fieldService";
import HFAutocomplete from "../../../../FormElements/HFAutocomplete";
import InputWithPopUp from "./InputWithPopUp";

const QueryResponseForm = ({
  form,
  control,
  tables,
  setSearch,
  allText,
  setAllText,
}) => {
  const { fields } = useFieldArray({
    control,
    name: "body.query_mapping.response_map.field_match",
  });
  const tableId = form.watch("body.query_mapping.response_map.table");
  const { isLoading } = useTableByIdQuery({
    id: tableId,
    queryParams: {
      enabled: !!tableId,
      onSuccess: (res) => {
        form.setValue("body.query_mapping.response_map.table_slug", res.slug);
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
        form.setValue(
          "body.query_mapping.response_map.field_match",
          res?.fields?.map((item) => {
            return { key: item.slug, value: "", field_type: item.type };
          })
        );
      },
    },
  });

  return (
    <Box width="100%">
      <Box>
        <Box mt={2} mb={2}>
          <HFAutocomplete
            name="body.query_mapping.response_map.table"
            control={control}
            placeholder="Type Error id"
            fullWidth
            options={tables}
            onFieldChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </Box>
        <Box border="1px solid #E2E8F0" borderRadius="0.375rem">
          <Box>
            {fields?.map((item, index) => (
              <Box
                borderBottom="1px solid #E2E8F0"
                display="flex"
                justifyContent="space-between"
              >
                <Box
                  width="100%"
                  display="flex"
                  alignItems="center"
                  pl="5px"
                  maxHeight="32px !important"
                  columnGap={"8px"}
                >
                  <Typography>
                    {form.watch(
                      `body.query_mapping.response_map.field_match.${index}.key`
                    )}
                  </Typography>
                  <marquee>
                    <Typography>
                      {form.watch(
                        `body.query_mapping.response_map.field_match.${index}.field_type`
                      )}
                    </Typography>
                  </marquee>
                </Box>

                <Box
                  width="100%"
                  display="flex"
                  alignItems="center"
                  pl="5px"
                  maxHeight="32px !important"
                  borderLeft="1px solid #E2E8F0"
                >
                  <InputWithPopUp
                    name={`body.query_mapping.response_map.field_match.${index}.value`}
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

export default QueryResponseForm;
