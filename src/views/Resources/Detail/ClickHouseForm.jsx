import stringifyQueryParams from "@/utils/stringifyQueryParams";
import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import React, {useMemo} from "react";
import {useWatch} from "react-hook-form";
import Footer from "../../../components/Footer";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import VariableResources from "../../../components/LayoutSidebar/Components/Resources/VariableResource";
import {resourceTypes, resources} from "../../../utils/resourceConstants";
import HFNumberField from "../../../components/FormElements/HFNumberField";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "../../../utils/generateLanguageText";

const headerStyle = {
  width: "100",
  height: "50px",
  borderBottom: "1px solid #e5e9eb",
  display: "flex",
  padding: "15px",
};

const ClickHouseForm = ({
  control,
  btnLoading,
  selectedEnvironment,
  settingLan,
}) => {
  const resurceType = useWatch({
    control,
    name: "resource_type",
  });
  const {i18n} = useTranslation();

  // host, port, username, password, database
  return (
    <Box
      flex={1}
      sx={{borderRight: "1px solid #e5e9eb", height: `calc(100vh - 50px)`}}>
      <Box sx={headerStyle}>
        <h2 variant="h6">
          {generateLangaugeText(settingLan, i18n?.language, "Resource info") ||
            "Resource info"}
        </h2>
      </Box>

      <Box
        style={{
          overflow: "auto",
        }}>
        <Stack spacing={4}>
          <Box
            sx={{
              // borderBottom: "1px solid #e5e9eb",
              padding: "15px",
              fontWeight: "bold",
            }}>
            <Box sx={{fontSize: "14px", marginBottom: "15px"}}>
              {generateLangaugeText(settingLan, i18n?.language, "Host") ||
                "Host"}
            </Box>
            <HFTextField
              control={control}
              required
              disabled={true}
              name="host"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              {generateLangaugeText(settingLan, i18n?.language, "Port") ||
                "Port"}
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="port"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              {generateLangaugeText(settingLan, i18n?.language, "Username") ||
                "Username"}
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="username"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              {generateLangaugeText(settingLan, i18n?.language, "Password") ||
                "Password"}
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="password"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              {generateLangaugeText(settingLan, i18n?.language, "Database") ||
                "Database"}
            </Box>

            <HFTextField
              control={control}
              required
              disabled={true}
              name="database"
              fullWidth
              inputProps={{
                placeholder: "Resource name",
              }}
            />
          </Box>
        </Stack>
      </Box>
      {resurceType === 4 && <VariableResources control={control} />}

      <Footer>
        {selectedEnvironment?.length && (
          <Button type="submit" variant="contained" disabled={btnLoading}>
            {generateLangaugeText(settingLan, i18n?.language, "Save") || "Save"}
          </Button>
        )}
      </Footer>
    </Box>
  );
};

export default ClickHouseForm;
