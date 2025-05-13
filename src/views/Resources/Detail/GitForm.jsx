import {Box, Button, Stack} from "@mui/material";
import React from "react";
import Footer from "../../../components/Footer";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import {resources} from "../../../utils/resourceConstants";

const headerStyle = {
  width: "100",
  height: "50px",
  borderBottom: "1px solid #e5e9eb",
  display: "flex",
  padding: "15px",
};

const GitForm = ({control, btnLoading, selectedEnvironment, settingLan}) => {
  return (
    <Box
      flex={1}
      sx={{borderRight: "1px solid #e5e9eb", height: `calc(100vh - 50px)`}}>
      <Box sx={headerStyle}>
        <h2 variant="h6">Resource info</h2>
      </Box>

      <Box
        style={{
          overflow: "auto",
        }}>
        <Stack spacing={4}>
          <Box
            sx={{
              padding: "15px",
              fontWeight: "bold",
            }}>
            <Box sx={{fontSize: "14px", marginBottom: "15px"}}>
              {generateLangaugeText(settingLan, i18n?.language, "Name") ||
                "Name"}
            </Box>
            <HFTextField
              control={control}
              required
              name="name"
              fullWidth
              inputProps={{
                placeholder:
                  generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Resource name"
                  ) || "Resource name",
              }}
            />

            <Box
              sx={{
                fontSize: "14px",
                marginTop: "10px",
                marginBottom: "10px",
              }}>
              Type
            </Box>
            <HFSelect
              options={resources}
              control={control}
              required
              name="type"
              disabled={true}
            />
            <Box
              sx={{
                fontSize: "14px",
                marginTop: "10px",
                marginBottom: "15px",
              }}>
              {generateLangaugeText(
                settingLan,
                i18n?.language,
                "Github username"
              ) || "Github username"}
            </Box>
            <HFTextField
              control={control}
              required
              name="settings.github.username"
              fullWidth
              disabled
              inputProps={{
                placeholder:
                  generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Github username"
                  ) || "Github username",
              }}
            />
            <Box
              sx={{
                fontSize: "14px",
                marginTop: "10px",
                marginBottom: "15px",
              }}>
              {generateLangaugeText(settingLan, i18n?.language, "Token") ||
                "Token"}
            </Box>
            <HFTextField
              control={control}
              required
              name="settings.github.token"
              fullWidth
              disabled
              inputProps={{
                placeholder: "Github username",
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Footer>
        {selectedEnvironment?.length && (
          <Button type="submit" variant="contained" disabled={btnLoading}>
            {generateLangaugeText(settingLan, i18n?.language, "Save") || "Save"}
            Save
          </Button>
        )}
      </Footer>
    </Box>
  );
};

export default GitForm;
