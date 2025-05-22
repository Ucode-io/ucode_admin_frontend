import FRow from "@/components/FormElements/FRow";
import HFSelect from "@/components/FormElements/HFSelect";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import HFTextField from "@/components/FormElements/HFTextField";
import {SaveCancelBtns} from "../../../../components/SaveCancelBtns";
import {Box, Grid} from "@mui/material";
import HFNumberField from "../../../../../../components/FormElements/HFNumberField";
import {useRef} from "react";

export const CodeForm = ({
  onSubmit,
  control,
  handleClose,
  lang,
  resourceOptions,
  functionId,
  resourceId,
  branches,
  branchesGitlab,
  resourcesOptions,
  watch,
  type,
}) => {
  const { i18n } = useTranslation();
  return (
    <Box marginTop={2}>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FRow
              label={
                generateLangaugeText(lang, i18n?.language, "Resource") ||
                "Resource"
              }
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFSelect
                disabledHelperText
                name="resource_id"
                control={control}
                fullWidth
                options={resourceOptions}
                required
                disabled={functionId}
              />
            </FRow>
          </Grid>
          <Grid item xs={6}>
            <FRow
              label={
                generateLangaugeText(lang, i18n?.language, "Function type") ||
                "Function type"
              }
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFSelect
                disabledHelperText
                name="type"
                control={control}
                fullWidth
                options={[
                  {
                    label: "Knative",
                    value: "KNATIVE",
                  },
                  {
                    label: "Openfaas",
                    value: "FUNCTION",
                  },
                ]}
                required
                disabled={functionId}
              />
            </FRow>
          </Grid>
          {resourceId !== "ucode_gitlab" && (
            <Grid item xs={6}>
              <FRow
                label={
                  generateLangaugeText(lang, i18n?.language, "Repository") ||
                  "Repository"
                }
                required
              >
                {functionId ? (
                  <HFTextField disabled={true} name="path" control={control} />
                ) : (
                  <HFSelect
                    name="repo_name"
                    control={control}
                    options={resourcesOptions}
                    required
                    disabled={functionId}
                  />
                )}
              </FRow>
            </Grid>
          )}
          {resourceId !== "ucode_gitlab" && (
            <Grid item xs={6}>
              <FRow
                label={
                  generateLangaugeText(lang, i18n?.language, "Branch") ||
                  "Branch"
                }
                required
              >
                {functionId ? (
                  <HFTextField name="branch" control={control} disabled />
                ) : (
                  <HFSelect
                    name="branch"
                    control={control}
                    options={branches || branchesGitlab}
                    required
                    disabled={functionId}
                  />
                )}
              </FRow>
            </Grid>
          )}
          {resourceId === "ucode_gitlab" && (
            <Grid item xs={6}>
              <FRow
                label={
                  generateLangaugeText(lang, i18n?.language, "Ссылка") ||
                  "Ссылка"
                }
                componentClassName="flex gap-2 align-center"
                required
              >
                <HFTextField
                  disabledHelperText
                  name="path"
                  control={control}
                  fullWidth
                  required
                  disabled={functionId}
                  showLockWhenDisabled={false}
                  inputStyleProps={{
                    backgroundColor: functionId ? "#f5f5f5" : "#fff",
                  }}
                />
              </FRow>
            </Grid>
          )}
          <Grid item xs={6}>
            <FRow
              label={
                generateLangaugeText(lang, i18n?.language, "Name") || "Name"
              }
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFTextField
                disabledHelperText
                name="name"
                control={control}
                fullWidth
                required
                disabled={
                  watch("resource_id") === "ucode_gitlab" ? false : true
                }
                showLockWhenDisabled={false}
                inputStyleProps={{
                  backgroundColor: (
                    watch("resource_id") === "ucode_gitlab" ? false : true
                  )
                    ? "#f5f5f5"
                    : "#fff",
                }}
              />
            </FRow>
          </Grid>
          <Grid item xs={6}>
            <FRow
              label={
                generateLangaugeText(lang, i18n?.language, "Replica count") ||
                "Replica count"
              }
              componentClassName="flex gap-2 align-center"
              required
            >
              <Box sx={{ width: "100%" }}>
                <HFNumberField name="max_scale" control={control} required />
              </Box>
            </FRow>
          </Grid>
          {resourceId === "ucode_gitlab" && (
            <Grid item xs={6}>
              <FRow
                label={
                  generateLangaugeText(lang, i18n?.language, "Description") ||
                  "Description"
                }
              >
                <HFTextField
                  name="description"
                  control={control}
                  multiline
                  rows={4}
                  fullWidth
                />
              </FRow>
            </Grid>
          )}
        </Grid>
      </form>
      <PermissionWrapperV2 tableSlug="app" type="update">
        <SaveCancelBtns
          saveProps={{
            onClick: onSubmit,
          }}
          cancelProps={{
            onClick: handleClose,
          }}
        />
      </PermissionWrapperV2>
    </Box>
  );
};
