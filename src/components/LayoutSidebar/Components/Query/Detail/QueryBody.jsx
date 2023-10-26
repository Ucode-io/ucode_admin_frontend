import {Box, Typography} from "@mui/material";
import {FormProvider} from "react-hook-form";
import HFSelect from "../../../../FormElements/HFSelect";
import {useResourceListQueryV2} from "../../../../../services/resourceService";
import {useMemo} from "react";

const QueryBody = ({
  form,
  control,
  responseQuery,
  resourcesList,
  types,
  resources,
}) => {
  const queryType = form.watch("query_type");

  const computedOptions = useMemo(() => {
    return resources?.map((el) => ({
      label: el?.name,
      value: el?.id,
    }));
  }, [resources]);

  // useEffect(() => {
  //   setValue('query_variables', form.get)
  // }, [])

  return (
    <FormProvider {...form}>
      <Box display="flex" flexDirection="column" gap="12px">
        <Box display="flex" alignItems="flex-start" px="16px">
          <Typography
            minWidth="110px"
            pr="10px"
            mt="5px"
            textAlign="end"
            fontWeight="bold"
          >
            Resource
          </Typography>

          <Box width="50%">
            <HFSelect
              options={resourcesList ? types : []}
              control={control}
              required
              name="query_type"
              placeholder={"Select..."}
              customOnChange={(e) => form.setValue("body.body", "")}
            />
          </Box>

          <Box width="50%">
            <HFSelect
              options={computedOptions ?? []}
              control={control}
              clearable
              name="project_resource_id"
              placeholder={"Select..."}
              // customOnChange={(e) => form.setValue("body.body", "")}
            />
          </Box>
        </Box>

        {types.map((type) => {
          if (type?.value === queryType) {
            return type?.component;
          }
        })}
      </Box>
    </FormProvider>
  );
};

export default QueryBody;
