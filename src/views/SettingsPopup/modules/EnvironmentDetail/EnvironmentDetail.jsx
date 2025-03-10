import { Box } from "@mui/material";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import { ContentTitle } from "../../components/ContentTitle";
import { useEnvironmentDetailProps } from "./useEnvironmentDetailProps";
import NewColorInput from "../../../../components/FormElements/HFNewColorPicker";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";
import cls from "./styles.module.scss";

export const EnvironmentDetail = () => {

  const { 
    lang,
    i18n,
    mainForm,
    envId,
    onSubmit,
    navigate,
    createLoading,
   } = useEnvironmentDetailProps();

  return (
    <div>
      <ContentTitle
        subtitle={envId ? mainForm.watch("name") : generateLangaugeText(
          lang,
          i18n?.language,
          "Create new"
        )}
      >
          {
            generateLangaugeText(
              lang,
              i18n?.language,
              "Environments"
            ) || "Environments"
          }
        </ContentTitle>

      <Box>
        <form
          onSubmit={mainForm.handleSubmit(onSubmit)}
          style={{overflow: "auto"}}>
          {/* <ContentTitle>{generateLangaugeText(lang, i18n?.language, "Details") || "Details"}</ContentTitle> */}
          <Box maxWidth={500}>
            <FRow
              label={"Названия"}
              componentClassName="flex gap-2 align-center"
              required>
              <HFTextField
                disabledHelperText
                name="name"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
            <FRow
              label={"Цвет"}
              componentClassName="flex gap-2 align-center"
              required>
              <Box className={cls.colorpicker}>
                <NewColorInput control={mainForm.control} name="display_color" />
                <HFTextField
                  control={mainForm.control}
                  name="display_color"
                  fullWidth
                  className={cls.formcolorinput}
                />
              </Box>
            </FRow>
            <FRow label="Описания">
              <HFTextField
                name="description"
                control={mainForm.control}
                multiline
                rows={4}
                fullWidth
              />
            </FRow>
          </Box>
        </form>
      </Box>

      <SaveCancelBtns
        cancelProps={{
          onClick: () => navigate(-1)
        }}
        saveProps={{
          onClick: mainForm.handleSubmit(onSubmit),
          loading: createLoading,
        }}
        maxWidth={500}
      />
    </div>
  );
};
