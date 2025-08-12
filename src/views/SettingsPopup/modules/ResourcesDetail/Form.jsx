import HFSelect from "@/components/FormElements/HFSelect";
import HFTextField from "@/components/FormElements/HFTextField";
import VariableResources from "@/components/LayoutSidebar/Components/Resources/VariableResource";
import githubService from "@/services/githubService";
import {showAlert} from "@/store/alert/alert.thunk";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import {resourceTypes} from "@/utils/resourceConstants";
import {Box, Stack} from "@mui/material";
import React, {useEffect, useMemo} from "react";
import {useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useSearchParams} from "react-router-dom";
import MetabaseContent from "./MetabaseContent";
import SmtpResource from "./ResourceContents/SmtpResource";
import SupersetContent from "./ResourceContents/SupersetContent";
import GitLabContent from "./ResourceContents/GitlabContent";
import GithubContent from "./ResourceContents/GithubContent";
import SmsContent from "./ResourceContents/SmsContent";

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
                    generateLangaugeText(settingLan, i18n?.language, "Name") ||
                    "Name"
                  }
                />
                <HFTextField
                  control={control}
                  required
                  name="name"
                  fullWidth
                  inputProps={{
                    placeholder: "Resource name",
                  }}
                />
              </Box>

              <Box sx={{width: "48%"}}>
                <FieldLabel
                  children={
                    generateLangaugeText(settingLan, i18n?.language, "Type") ||
                    "Type"
                  }
                />
                <HFSelect
                  options={resourceTypes}
                  control={control}
                  onChange={onResourceTypeChange}
                  required
                  name="resource_type"
                  resurceType={resurceType}
                  disabled={isEditPage}
                />
              </Box>
            </Box>

            {!isEditPage && (
              <Box sx={{marginTop: "20px", marginBottom: "20px"}}>
                <FieldLabel
                  children={
                    generateLangaugeText(
                      settingLan,
                      i18n?.language,
                      "Environment"
                    ) || "Environment"
                  }
                />
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
            )}

            {Number(resurceType) === 11 && isEditPage && (
              <SupersetContent control={control} settingLan={settingLan} />
            )}

            {Number(resurceType) === 12 && isEditPage && (
              <MetabaseContent
                control={control}
                settingLan={settingLan}
                watch={watch}
              />
            )}

            {Boolean(Number(resurceType) === 7 || type === "SMTP") && (
              <SmtpResource control={control} settingLan={settingLan} />
            )}

            {Boolean(Number(resurceType) === 6 || type === "SMS") && (
              <SmsContent settingLan={settingLan} control={control} />
            )}

            {Number(resurceType) === 5 || type === "GITHUB" ? (
              <GithubContent settingLan={settingLan} control={control} />
            ) : null}

            {Number(resurceType) === 8 ? (
              <GitLabContent settingLan={settingLan} control={control} />
            ) : null}
          </Box>
        </Stack>
      </Box>

      {resurceType === 4 && (
        <VariableResources settingLan={settingLan} control={control} />
      )}
    </Box>
  );
};

export const FieldLabel = ({children}) => {
  return (
    <>
      <Box sx={{fontSize: "14px", marginBottom: "15px"}}>{children}</Box>
    </>
  );
};

export default Form;
