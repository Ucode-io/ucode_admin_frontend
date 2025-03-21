import cls from './styles.module.scss';
import { useProjectSettings } from "./useProjectSettings";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import FRow from "../../../../components/FormElements/FRow";
import HFAvatarUpload from "../../../../components/FormElements/HFAvatarUpload";
import HFMultipleSelect from "../../../../components/FormElements/HFMultipleSelect";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import { ContentTitle } from "../../components/ContentTitle";
import { Field } from "../../components/Field";
import { Flex } from "@chakra-ui/react";

export const ProjectSettings = () => {
  const {
    handleClose,
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
    setValue,
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
          {/* <Grid item xs={6}>
            <HFAvatarUpload control={control} name="logo" />
          </Grid> */}
        </Grid>
        <ContentTitle style={{ marginTop: "24px" }}>Beta version</ContentTitle>
        <FormGroup
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "16px",
            marginTop: "16px",
          }}
        >
          <FormControlLabel
            style={{ marginLeft: "0", columnGap: "5px" }}
            labelPlacement="start"
            label={<span style={{ fontWeight: "bold" }}>Design: </span>}
            control={
              <Checkbox
                icon={
                  <img
                    src="/img/checbkox.svg"
                    alt="checkbox"
                    style={{ width: 20 }}
                  />
                }
                checkedIcon={
                  <img
                    src="/img/checkbox-checked.svg"
                    alt="checked"
                    style={{ width: 20 }}
                  />
                }
                style={{
                  transform: "translate(-1px)",
                  marginRight: "8px",
                  padding: "4px",
                }}
                checked={watch("new_design")}
                onChange={() => setValue("new_design", !watch("new_design"))}
                {...register("new_design")}
                color="primary"
              />
            }
          />
          <FormControlLabel
            style={{ marginLeft: "0", columnGap: "5px" }}
            labelPlacement="start"
            label={<span style={{ fontWeight: "bold" }}>Layout: </span>}
            control={
              <Checkbox
                icon={
                  <img
                    src="/img/checbkox.svg"
                    alt="checkbox"
                    style={{ width: 20 }}
                  />
                }
                checkedIcon={
                  <img
                    src="/img/checkbox-checked.svg"
                    alt="checked"
                    style={{ width: 20 }}
                  />
                }
                style={{
                  transform: "translate(-1px)",
                  marginRight: "8px",
                  padding: "4px",
                }}
                checked={watch("new_layout")}
                onChange={() => setValue("new_layout", !watch("new_layout"))}
                color="primary"
              />
            }
          />
        </FormGroup>
      </form>

      <SaveCancelBtns
        cancelProps={{
          onClick: handleClose,
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
