import React, { useMemo } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import Footer from "../../../components/Footer";
import HFTextField from "../../../components/FormElements/HFTextField";
import HFSelect from "../../../components/FormElements/HFSelect";
import { resourceTypes } from "../../../utils/resourceConstants";

const headerStyle = {
  width: '100',
  height: '50px',
  borderBottom: '1px solid #e5e9eb',
  display: 'flex',
  padding: '15px'
}

const Form = ({
  control,
  btnLoading,
  selectedEnvironment,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
}) => {
  const environments = useMemo(() => {
    return projectEnvironments?.map((item) => ({
      value: item.id,
      label: item.name,
      name: item.name,
      project_id: item.project_id,
      description: item.description,
      display_color: item.display_color,
      is_configured: item.is_configured,
      id: item.id,
    }));
  }, [projectEnvironments]);

  console.log('environments', environments)
  return (
    <Box flex={1} sx={{borderRight: '1px solid #e5e9eb'}}>
      <Box sx={headerStyle}>
        <h2 variant="h6">Resource info</h2>
      </Box>

      <Box style={{ height: "calc(100vh - 170px)", overflow: "auto" }}>
        <Stack  spacing={4}>
        <Box sx={{borderBottom: '1px solid #e5e9eb', padding: '15px', fontWeight: 'bold'}}>
        <Box sx={{fontSize: '14px', marginBottom: '15px'}}>Name</Box>
            <HFTextField
              control={control}
              required
              name="title"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

          <Box sx={{fontSize: '14px', marginTop: '10px', marginBottom: '10px'}}>Type</Box>
            <HFSelect
              options={resourceTypes}
              control={control}
              required
              name="resource_type"
              defaultValue={0}
            />
        </Box>
          {!isEditPage && (
            <Box px={2}>
              <Box sx={{fontSize: '14px', marginBottom: '10px'}}>Environment</Box>
              <HFSelect
                options={environments}
                control={control}
                required
                name="environment_id"
                customOnChange={(value) => {
                  setSelectedEnvironment(value);
                }}
              />
            </Box>
            // </h2>
          )}
        </Stack>

        {/* <Divider /> */}

        {selectedEnvironment?.length && (
          <>
            <Box sx={{padding: '15px', fontSize: '24px'}}>
              <Typography variant="h6" >Credentials</Typography>
            </Box>

            <Grid px={2} container spacing={2}>
              <Grid item xs={6} sx={{paddingLeft: '0px'}}>
                  <Box width={50} sx={{fontSize: '14px'}}>Host</Box>
                  <HFTextField fullWidth control={control} required name="credentials.host" />
              </Grid>
              <Grid item xs={6}>
                  <Box sx={{fontSize: '14px'}}>Port</Box>
                  <HFTextField fullWidth control={control} required name="credentials.port" />
              </Grid>
              <Grid item xs={6}>
                  <Box sx={{fontSize: '14px'}}>Username</Box>
                  <HFTextField
                    control={control}
                    required
                    fullWidth
                    name="credentials.username"
                  />
              </Grid>
              <Grid item xs={6}>
                  <Box sx={{fontSize: '14px'}}>Database</Box>
                  <HFTextField
                    control={control}
                    required
                    fullWidth
                    name="credentials.database"
                  />
              </Grid>
              {true && (
                <Grid item xs={6}>
                  <Box mb={4}>
                  <Box sx={{fontSize: '14px', }}>Password</Box>
                  <HFTextField fullWidth control={control} name="credentials.password" />
                </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Box>

      <Footer>
        {selectedEnvironment?.length && (
          <Button type="submit" variant="contained" disabled={btnLoading}>
            Save
          </Button>
        )}
      </Footer>
    </Box>
  );
};

export default Form;
