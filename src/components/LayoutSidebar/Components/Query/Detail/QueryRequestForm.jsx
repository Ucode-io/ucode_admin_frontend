import { Box, Switch, Typography } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { useTableByIdQuery } from "../../../../../services/constructorTableService";
import { useFieldsListQuery } from "../../../../../services/fieldService";
import HFAutocomplete from "../../../../FormElements/HFAutocomplete";
import InputWithPopUp from "./InputWithPopUp";
import HFSelect from "../../../../FormElements/HFSelect";
import styles from "../style.module.scss";
import { query_types } from "../mock/ApiEndpoints";

const QueryRequstForm = ({
  form,
  control,
  tables,
  setSearch,
  allText,
  setAllText,
}) => {
  const { fields } = useFieldArray({
    control,
    name: "body.query_mapping.request_map.field_match",
  });
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
        form.setValue(
          "body.query_mapping.request_map.field_match",
          res?.fields?.map((item) => {
            return { key: item.slug, value: "", field_type: item.type };
          })
        );
      },
    },
  });

  return (
    <>
      <Box display="flex" alignItems="flex-start" mt={2}>
        <Typography
          minWidth="110px"
          mt="5px"
          pr="10px"
          textAlign="end"
          fontWeight="bold"
        >
          Table
        </Typography>
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
                          `body.query_mapping.request_map.field_match.${index}.key`
                        )}
                      </Typography>
                      <marquee>
                        <Typography>
                          {form.watch(
                            `body.query_mapping.request_map.field_match.${index}.field_type`
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
                        name={`body.query_mapping.request_map.field_match.${index}.value`}
                        form={form}
                        placeholder={"Value"}
                      />
                    </Box>
                    <Box
                      width="100%"
                      display="flex"
                      alignItems="center"
                      pl="5px"
                      maxHeight="32px !important"
                      borderLeft="1px solid #E2E8F0"
                    >
                      <HFSelect
                        name={`body.query_mapping.request_map.field_match.${index}.type`}
                        form={form}
                        placeholder={"Type"}
                        options={query_types}
                        className={styles.query_select}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="flex-start" mt={2}>
        <Typography
          minWidth="110px"
          mt="5px"
          pr="10px"
          textAlign="end"
          fontWeight="bold"
        >
          Relation
        </Typography>

        <Box display="flex" gap="20px" width="100%">
          <Box minWidth="100px">
            <Switch
              checked={form.watch("body.query_mapping.is_relation")}
              onChange={(e) => {
                form.setValue(
                  "body.query_mapping.request_map.is_relation",
                  e.target.checked
                );
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default QueryRequstForm;
