import {Box, Stack} from "@mui/material";
import React from "react";
import HFTextField from "../../../../components/FormElements/HFTextField";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import HFSelect from "../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../components/FormElements/HFSwitch";
import HFPasswordField from "../../../../components/FormElements/HFPasswordField";

function PostgresCreate({
  control,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
  settingLan,
  watch = () => {},
  setValue = () => {},
}) {
  const {i18n} = useTranslation();

  return (
    <Box
      flex={1}
      sx={{borderRight: "1px solid #e5e9eb", height: `calc(100vh - 50px)`}}>
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "nowrap",
                justifyContent: "space-between",
              }}>
              <Box sx={{width: "48%"}}>
                <FieldLabel
                  children={
                    generateLangaugeText(settingLan, i18n?.language, "Host") ||
                    "Host"
                  }
                />
                <HFTextField
                  inputHeight={"15px"}
                  control={control}
                  required
                  name="settings.postgres.host"
                  fullWidth
                  inputProps={{
                    placeholder: "Host",
                  }}
                />
              </Box>

              <Box sx={{width: "48%"}}>
                <FieldLabel
                  children={
                    generateLangaugeText(settingLan, i18n?.language, "Port") ||
                    "Port"
                  }
                />
                <HFTextField
                  inputHeight={"15px"}
                  control={control}
                  required
                  name="settings.postgres.port"
                  fullWidth
                  inputProps={{
                    placeholder: "Port",
                  }}
                />
              </Box>
            </Box>

            <Box sx={{width: "100%", marginTop: "20px"}}>
              <FieldLabel
                children={
                  generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Database name"
                  ) || "Database name"
                }
              />
              <HFTextField
                inputHeight={"15px"}
                control={control}
                required
                name="settings.postgres.database"
                fullWidth
                inputProps={{
                  placeholder: "Host",
                }}
              />
            </Box>

            <Box sx={{width: "100%", marginTop: "20px"}}>
              <FieldLabel
                children={
                  generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Username"
                  ) || "Username"
                }
              />
              <HFTextField
                inputHeight={"15px"}
                control={control}
                required
                name="settings.postgres.username"
                fullWidth
                inputProps={{
                  placeholder: "Host",
                }}
              />
            </Box>

            <Box sx={{width: "100%", marginTop: "20px"}}>
              <FieldLabel
                required={false}
                children={
                  generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Password"
                  ) || "Password"
                }
              />
              <HFPasswordField
                type="password"
                inputHeight={"15px"}
                control={control}
                name="settings.postgres.password"
                fullWidth
                inputProps={{
                  placeholder: "Host",
                }}
              />
            </Box>

            <Box sx={{width: "100%", marginTop: "20px"}}>
              <FieldLabel
                children={
                  generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Display name"
                  ) || "Display name"
                }
              />
              <HFTextField
                inputHeight={"15px"}
                defaultValue="PostgreSQL"
                control={control}
                required
                name="settings.postgres.connection_name"
                fullWidth
                inputProps={{
                  placeholder: "display name",
                }}
              />
            </Box>

            <Box sx={{width: "100%", marginTop: "20px"}}>
              <FieldLabel
                required={false}
                children={
                  generateLangaugeText(settingLan, i18n?.language, "SSL") ||
                  "SSL"
                }
              />
              <HFSwitch
                control={control}
                name="settings.postgres.ssl_mode"
                fullWidth
                inputProps={{
                  placeholder: "Host",
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

const FieldLabel = ({children, required = true}) => {
  return (
    <>
      <Box sx={{fontSize: "13px", marginBottom: "8px", fontWeight: "400"}}>
        {children} {required && <span style={{color: "red"}}>*</span>}
      </Box>
    </>
  );
};

export default PostgresCreate;
