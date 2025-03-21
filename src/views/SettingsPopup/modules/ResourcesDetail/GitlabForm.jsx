import {Box, Button, Stack} from "@mui/material";
import React from "react";
import Footer from "@/components/Footer";
import HFSelect from "@/components/FormElements/HFSelect";
import HFTextField from "@/components/FormElements/HFTextField";
import {resources} from "@/utils/resourceConstants";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "@/utils/generateLanguageText";

const headerStyle = {
  width: "100",
  height: "50px",
  borderBottom: "1px solid #e5e9eb",
  display: "flex",
  padding: "15px",
};

const GitLabForm = ({
  control,
  btnLoading,
  selectedEnvironment,
  watch,
  settingLan,
}) => {
  const {i18n} = useTranslation();
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
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{
                fontSize: "14px",
                marginTop: "10px",
                marginBottom: "10px",
              }}>
              {generateLangaugeText(settingLan, i18n?.language, "Type") ||
                "Type"}
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
                "Gitlab username"
              ) || "Gitlab username"}
            </Box>
            <HFTextField
              control={control}
              required
              name="settings.gitlab.username"
              fullWidth
              disabled
              inputProps={{
                placeholder: "Gitlab username",
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
              name="settings.gitlab.token"
              fullWidth
              disabled
              inputProps={{
                placeholder: "Gitlab username",
              }}
            />
          </Box>
        </Stack>
      </Box>

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

export default GitLabForm;
