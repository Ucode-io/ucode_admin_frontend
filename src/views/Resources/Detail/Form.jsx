import {Box, Stack, Typography} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useWatch} from "react-hook-form";
import Footer from "../../../components/Footer";
import HFSelect from "../../../components/FormElements/HFSelect";
import HFTextField from "../../../components/FormElements/HFTextField";
import VariableResources from "../../../components/LayoutSidebar/Components/Resources/VariableResource";
import {resourceTypes, resources} from "../../../utils/resourceConstants";
import HFNumberField from "../../../components/FormElements/HFNumberField";
import {useLocation, useSearchParams} from "react-router-dom";
import githubService from "../../../services/githubService";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import HFSwitch from "../../../components/FormElements/HFSwitch";

const headerStyle = {
  width: "100",
  height: "50px",
  borderBottom: "1px solid #e5e9eb",
  display: "flex",
  padding: "15px",
};

const Form = ({
  control,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
  settingLan,
  watch = () => {},
  setValue = () => {},
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const {i18n} = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("access_token");

  const environments = useMemo(() => {
    return projectEnvironments?.map((item) => ({
      value: item.environment_id ?? item.id,
      label: item.name,
      name: item.name,
      project_id: item.project_id,
      description: item.description,
      display_color: item.display_color,
      is_configured: item.is_configured,
      id: item?.id,
    }));
  }, [projectEnvironments]);

  const resurceType = useWatch({
    control,
    name: "resource_type",
  });

  const type = useWatch({
    control,
    name: "type",
  });

  const onResourceTypeChange = (value) => {
    if (value !== 5 && value !== 8) return;
    if (value === 5) {
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_BASE_DOMAIN;

      const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${redirectUri}`;

      window.open(url, "_blank", "noopener,noreferrer");
    } else if (value === 8) {
      const clientId = import.meta.env.VITE_CLIENT_ID_GITLAB;
      const redirectUri = import.meta.env.VITE_BASE_DOMAIN_GITLAB;

      const url = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=api read_api read_user read_repository write_repository read_registry write_registry admin_mode read_service_ping openid profile email`;

      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    const params = {
      token: token,
    };

    if (token?.includes("gho")) {
      githubService
        .githubUsername(params)
        .then((res) => {
          if (!res?.login) {
            dispatch(showAlert("No username found", "error"));
            setValue("integration_resource.username", res?.login);
          } else setValue("integration_resource.username", res?.login);
        })
        .catch((err) => {
          setValue("integration_resource.username", "");
          console.log("errrrrr", err);
        });
    } else if (token) {
      githubService
        .gitlabUsername(params)
        .then((res) => {
          if (!res?.username) {
            dispatch(showAlert("No username found", "error"));
            setValue("integration_resource.username", res?.username);
          } else setValue("integration_resource.username", res?.username);
        })
        .catch((err) => {
          setValue("integration_resource.username", "");
          console.log("errrrrr", err);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setValue("token", token);
    }
  }, [token]);

  useEffect(() => {
    if (location?.state?.onFill) {
      setValue("resource_type", location?.state?.id);
    }
  }, []);

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
                placeholder: "Resource name",
              }}
            />

            <Box
              sx={{fontSize: "14px", marginTop: "10px", marginBottom: "10px"}}>
              {generateLangaugeText(settingLan, i18n?.language, "Type") ||
                "Type"}
            </Box>
            <HFSelect
              options={resourceTypes}
              control={control}
              onChange={onResourceTypeChange}
              required
              name="resource_type"
              resurceType={resurceType}
              disabled={isEditPage}
            />

            {resurceType === 2 && (
              <>
                <Box
                  sx={{
                    fontSize: "12px",
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}>
                  Do you need superset
                </Box>
                <HFSwitch
                  control={control}
                  onChange={() => {
                    onResourceTypeChange(11);
                  }}
                  required
                  name="is_superset"
                  resurceType={resurceType}
                  disabled={isEditPage}
                />
              </>
            )}

            {Boolean(resurceType === 7 || type === "SMTP") && (
              <>
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}>
                  {generateLangaugeText(settingLan, i18n?.language, "Email") ||
                    "Email"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name={`settings.smtp.email`}
                  fullWidth
                  inputProps={{
                    placeholder: "Email",
                  }}
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
                    "Password"
                  ) || "Password"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.smtp.password"
                  fullWidth
                  inputProps={{
                    placeholder: "Password",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}>
                  {generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Default otp"
                  ) || "Default otp"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name={`settings.smtp.default_otp`}
                  fullWidth
                  inputProps={{
                    placeholder: "Default otp",
                  }}
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
                    "Number of otp"
                  ) || "Number of otp"}
                </Box>
                <HFNumberField
                  control={control}
                  required
                  name="settings.smtp.number_of_otp"
                  fullWidth
                  type="number"
                  inputProps={{
                    placeholder: "Number of otp",
                  }}
                />
              </>
            )}

            {Boolean(resurceType === 6 || type === "SMS") && (
              <>
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}>
                  {generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Default otp"
                  ) || "Default otp"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name={`settings.sms.default_otp`}
                  fullWidth
                  inputProps={{
                    placeholder: "Default otp",
                  }}
                />
                <Box
                  sx={{
                    fontSize: "14px",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}>
                  {generateLangaugeText(settingLan, i18n?.language, "Login") ||
                    "Login"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.sms.login"
                  fullWidth
                  inputProps={{
                    placeholder: "Login",
                  }}
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
                    "Number of otp"
                  ) || "Number of otp"}
                </Box>
                <HFNumberField
                  control={control}
                  required
                  name="settings.sms.number_of_otp"
                  fullWidth
                  type="number"
                  inputProps={{
                    placeholder: "Number of otp",
                  }}
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
                    "Originator"
                  ) || "Originator"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.sms.originator"
                  fullWidth
                  inputProps={{
                    placeholder: "Originator",
                  }}
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
                    "Password"
                  ) || "Password"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="settings.sms.password"
                  fullWidth
                  inputProps={{
                    placeholder: "Password",
                  }}
                />
              </>
            )}

            {resurceType === 5 || type === "GITHUB" ? (
              <>
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
                  // required
                  name="integration_resource.username"
                  fullWidth
                  // disabled
                  inputProps={{
                    placeholder: "Github username",
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
                  disabled={Boolean(token)}
                  name="token"
                  fullWidth
                  inputProps={{
                    placeholder: "Token",
                  }}
                />
              </>
            ) : null}

            {resurceType === 8 ? (
              <>
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
                  // required
                  name="integration_resource.username"
                  fullWidth
                  disabled
                  inputProps={{
                    placeholder: "Github username",
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
                  disabled
                  name="token"
                  fullWidth
                  inputProps={{
                    placeholder: "Token",
                  }}
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
                    "Base URL"
                  ) || "Base URL"}
                </Box>
                <HFTextField
                  control={control}
                  required
                  name="base_url"
                  fullWidth
                  inputProps={{
                    placeholder: "Base URL",
                  }}
                />
              </>
            ) : null}
          </Box>

          {!isEditPage && (
            <Box sx={{marginTop: "0px", padding: "15px"}} px={2}>
              <Box sx={{fontSize: "14px", marginBottom: "10px"}}>
                {generateLangaugeText(
                  settingLan,
                  i18n?.language,
                  "Environment"
                ) || "Environment"}
              </Box>
              <HFSelect
                options={environments}
                control={control}
                required
                name="environment_id"
                onChange={(value) => {
                  setSelectedEnvironment(value);
                }}
              />
            </Box>
            // </h2>
          )}
        </Stack>
      </Box>

      {resurceType === 4 && (
        <VariableResources settingLan={settingLan} control={control} />
      )}

      <Footer></Footer>
    </Box>
  );
};

export default Form;
