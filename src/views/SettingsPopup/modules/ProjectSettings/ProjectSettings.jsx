import cls from './styles.module.scss';
import { useProjectSettings } from "./useProjectSettings";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import FRow from "../../../../components/FormElements/FRow";
import HFAvatarUpload from "../../../../components/FormElements/HFAvatarUpload";
import HFMultipleSelect from "../../../../components/FormElements/HFMultipleSelect";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";
import { Box, FormControlLabel, FormGroup, Grid, Switch } from "@mui/material";
import { ContentTitle } from "../../components/ContentTitle";
import { Field } from "../../components/Field";
import { Flex } from "@chakra-ui/react";

export const ProjectSettings = () => {
  const {
    navigate,
    i18n,
    lang,
    control,
    register,
    handleSubmit,
    onSubmit,
    watch,
    languageOptions,
    timezoneOptions,
    currencyOptions,
    btnLoading,
  } = useProjectSettings();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <ContentTitle subtitle={watch("title")}>
        {generateLangaugeText(lang, i18n?.language, "Project Settings") ||
          "Project settings"}
      </ContentTitle>
      <Flex alignItems="flex-end" mb="48px">
        <HFAvatarUpload
          size="xs"
          defaultImage={<div className={cls.avatar}>Logo</div>}
          control={control}
          name="logo"
        />
        <Box className={cls.nameWrapper}>
          <p className={cls.name}>
            {generateLangaugeText(lang, i18n?.language, "Name") || "Name"}
          </p>
          <Field register={register} name="title" type="text" />
        </Box>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FRow
              label={
                generateLangaugeText(lang, i18n?.language, "Language") ||
                "Language"
              }
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFMultipleSelect
                options={languageOptions}
                name="language"
                control={control}
                fullWidth
              />
            </FRow>
          </Grid>
          <Grid item xs={6}>
            <FRow
              label={
                generateLangaugeText(lang, i18n?.language, "Currency") ||
                "Currency"
              }
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFAutocomplete
                disabledHelperText
                options={currencyOptions}
                name="currency"
                control={control}
                fullWidth
              />
            </FRow>
          </Grid>
          <Grid item xs={6}>
            <FRow
              label={
                generateLangaugeText(lang, i18n?.language, "Timezone") ||
                "Timezone"
              }
              componentClassName="flex gap-2 align-center"
              required
            >
              <HFAutocomplete
                disabledHelperText
                options={timezoneOptions}
                name="timezone"
                control={control}
                fullWidth
              />
            </FRow>
          </Grid>
          <Grid item xs={6} alignSelf="flex-end">
            <FormGroup
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={watch("new_design")}
                    {...register("new_design")}
                    color="primary"
                  />
                }
                label={<span style={{ fontWeight: "bold" }}>New Design</span>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={watch("new_layout")}
                    {...register("new_layout")}
                    color="primary"
                  />
                }
                label={<span style={{ fontWeight: "bold" }}>New Layout</span>}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </form>

      <SaveCancelBtns
        cancelProps={{
          onClick: () => navigate(-1),
        }}
        saveProps={{
          loading: btnLoading,
          onClick: handleSubmit(onSubmit),
        }}
        marginTop="auto"
      />
    </Box>
  );
};
