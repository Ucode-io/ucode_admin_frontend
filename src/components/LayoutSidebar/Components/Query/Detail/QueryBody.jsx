import { Box, Typography } from "@mui/material";
import { FormProvider } from "react-hook-form";
import HFSelect from "../../../../FormElements/HFSelect";

const QueryBody = ({ form, control, responseQuery, resourcesList, types }) => {
  const queryType = form.watch("query_type");

  return (
    <FormProvider {...form}>
      <Box p="12px 16px" display="flex" flexDirection="column" gap="12px">
        <Box display="flex" alignItems="flex-start">
          <Typography
            minWidth="110px"
            pr="10px"
            mt="5px"
            textAlign="end"
            fontWeight="bold"
          >
            Resource
          </Typography>

          <Box width="100%">
            <HFSelect
              options={resourcesList ? types : []}
              control={control}
              required
              name="query_type"
              placeholder={"Select..."}
              customOnChange={(e) => form.setValue("body.body", "")}
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
