import cls from "./styles.module.scss";
import {Box, Dialog, DialogActions, DialogContent} from "@mui/material";
import { useLayoutPopupProps } from "./useLayoutPopupProps";
import FormCard from "@/components/FormCard";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { CloseButton } from "@/components/CloseButton";
import TextFieldWithMultiLanguage from "@/components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import HFTextField from "@/components/FormElements/HFTextField";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import HFSelect from "@/components/FormElements/HFSelect";
import HFMultipleSelect from "@/components/FormElements/HFMultipleSelect";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { LoginStrategy } from "@/mock/FolderSettings";

export const LayoutPopup = ({
  onClose = () => {},
  open = false,
  tableLan,
  control,
  handleSubmit,
  viewForm,
}) => {

  const {
    languages,
    btnLoader,
    onSubmit,
    tableName,
    loginTable,
    loginRequired,
    computedLoginFields,
    t,
    i18n,
    handleClose,
    authInfo,
  } = useLayoutPopupProps({
    control,
    viewForm,
    onClose,
    open,
  })
  
  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "470px",
        },
      }}
      fullWidth
      open={open}
      onClose={handleClose}
    >
      <DialogContent style={{ padding: "0px" }}>
        <FormCard
          contentStyle={{ paddingBottom: "0px" }}
          maxWidth="100%"
          title={
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <span>
                {generateLangaugeText(tableLan, i18n?.language, "General") ||
                  "General"}
              </span>
              <CloseButton onClick={handleClose} />
            </Box>
          }
        >
          <Box display="flex" flexDirection="column" gap="16px">
            <Box style={{ display: "flex", gap: "6px" }}>
              <TextFieldWithMultiLanguage
                control={control}
                name={`attributes.label`}
                placeholder="Name"
                defaultValue={tableName}
                languages={languages}
                id={"create_table_name"}
                style={{ width: "100%", height: "36px" }}
                watch={viewForm?.watch}
              />
              {/* <HFTextFieldWithMultiLanguage
                control={control}
                name="attributes.label"
                fullWidth
                placeholder="Name"
                defaultValue={tableName}
                languages={languages}
                id={"create_table_name"}
              /> */}
            </Box>
            <HFTextField
              control={control}
              name="slug"
              fullWidth
              placeholder="KEY"
              required
              withTrim
              id={"create_table_key"}
            />
          </Box>

          <Box className={cls.checkbox}>
            <CustomCheckbox
              id="login_table_check"
              control={control}
              name="is_login_table"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Login Table") ||
                "Login Table"}
            </CustomCheckbox>
            <CustomCheckbox
              control={control}
              name="is_cached"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Cache") ||
                "Cache"}
            </CustomCheckbox>
            <CustomCheckbox
              control={control}
              name="soft_delete"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Soft delete") ||
                "Soft delete"}
            </CustomCheckbox>
            <CustomCheckbox
              control={control}
              name="order_by"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Sort") || "Sort"}
            </CustomCheckbox>
          </Box>

          {loginTable && (
            <Box
              display="grid"
              gap="16px"
              gridTemplateColumns="repeat(2, 1fr)"
              marginTop="16px"
            >
              {authInfo?.login_strategy?.length >= 1 && (
                <>
                  <Box>
                    {/* <FRow
                    label={
                      generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "User type"
                      ) || "User type"
                    }
                  /> */}
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.client_type_id"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "User type"
                        ) || "User type"
                      }
                      options={computedLoginFields}
                      required
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.role_id"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Roles"
                        ) || "Roles"
                      }
                      options={computedLoginFields}
                      required
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.login"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Login"
                        ) || "Login"
                      }
                      options={computedLoginFields}
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.password"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Password"
                        ) || "Password"
                      }
                      options={computedLoginFields}
                      required={loginRequired}
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.email"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Email"
                        ) || "Email"
                      }
                      options={computedLoginFields}
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.phone"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Phone"
                        ) || "Phone"
                      }
                      options={computedLoginFields}
                    />
                  </Box>
                </>
              )}
              <Box>
                <HFMultipleSelect
                  id="login_strategy"
                  control={control}
                  name="attributes.auth_info.login_strategy"
                  fullWidth
                  placeholder={
                    generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Login strategy"
                    ) || "Login strategy"
                  }
                  options={LoginStrategy}
                />
              </Box>
            </Box>
          )}
        </FormCard>
      </DialogContent>
      <DialogActions style={{ padding: "16px" }}>
        <PrimaryButton
          loader={btnLoader}
          loading={btnLoader}
          onClick={handleSubmit(onSubmit)}
        >
          {t("save")}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
