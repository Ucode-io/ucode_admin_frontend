import { Box, Dialog, DialogActions, DialogContent } from "@mui/material";
import FormCard from "../../components/FormCard";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import FRow from "../../components/FormElements/FRow";
import HFTextFieldWithMultiLanguage from "../../components/FormElements/HFTextFieldWithMultiLanguage";
import HFTextField from "../../components/FormElements/HFTextField";
import HFCheckbox from "../../components/FormElements/HFCheckbox";
import HFSelect from "../../components/FormElements/HFSelect";
import HFMultipleSelect from "../../components/FormElements/HFMultipleSelect";
import { useTranslation } from "react-i18next";
import style from "./popup.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useWatch } from "react-hook-form";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import { LoginStrategy } from "../../mock/FolderSettings";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import constructorTableService from "../../services/constructorTableService";
import { constructorTableActions } from "../../store/constructorTable/constructorTable.slice";

export const LayoutPopup = ({
  onClose = () => {},
  open = false,
  tableLan,
  control,
  authData,
  handleSubmit,
}) => {
  const { i18n, t } = useTranslation();

  const languages = useSelector((state) => state.languages.list);

  const { tableSlug } = useParams();

  const [btnLoader, setBtnLoader] = useState(false);
  const projectId = useSelector((state) => state.auth.projectId);

  const dispatch = useDispatch();

  const params = {
    language_setting: i18n?.language,
  };

  const handleClose = () => {
    onClose();
  };

  const updateConstructorTable = (data) => {
    setBtnLoader(true);
    const updateTableData = constructorTableService.update(data, projectId);

    Promise.all([updateTableData])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data));
        handleClose();
        setBtnLoader(false);
      })
      .catch(() => setBtnLoader(false));
  };

  const onSubmit = async (data) => {
    const computedData = {
      ...data,
      id: data?.id,
      show_in_menu: true,
    };

    if (data?.id) {
      updateConstructorTable(computedData);
    }
  };

  const tableName = useWatch({
    control,
    name: "label",
  });

  const { fields } = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  });

  const { fields: relations } = useFieldArray({
    control: control,
    name: "layoutRelations",
    keyName: "key",
  });

  const loginTable = useWatch({
    control,
    name: "is_login_table",
  });

  const login = useWatch({
    control,
    name: "attributes.auth_info.login",
  });

  const { data: computedTableFields } = useQuery(
    ["GET_OBJECT_LIST", tableSlug, i18n?.language],
    () => {
      if (!tableSlug) return false;
      return constructorObjectService.getList(
        tableSlug,
        {
          data: {},
        },
        params
      );
    },
    {
      enabled: Boolean(tableSlug),
      select: (res) => {
        return res?.data?.fields ?? [];
      },
    }
  );

  const loginRequired = useMemo(() => {
    if (login) {
      return true;
    } else {
      return false;
    }
  }, [login]);

  const computedLoginFields = useMemo(() => {
    return computedTableFields?.map((item) => ({
      label:
        item?.type === "LOOKUP" || item?.type === "LOOKUPS"
          ? item?.attributes?.[`label_${i18n?.language}`] ||
            item?.attributes?.[`label_to_${i18n?.language}`] ||
            item?.label
          : item?.attributes?.[`label_${i18n?.language}`] || item?.label,
      value: item?.slug ?? "",
    }));
  }, [computedTableFields]);

  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "520px",
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
            generateLangaugeText(tableLan, i18n?.language, "General") ||
            "General"
          }
        >
          <FRow
            label={
              generateLangaugeText(tableLan, i18n?.language, "Name") || "Name"
            }
          >
            <Box style={{ display: "flex", gap: "6px" }}>
              <HFTextFieldWithMultiLanguage
                control={control}
                name="attributes.label"
                fullWidth
                placeholder="Name"
                defaultValue={tableName}
                languages={languages}
                id={"create_table_name"}
              />
            </Box>
          </FRow>
          <FRow
            label={
              generateLangaugeText(tableLan, i18n?.language, "Key") || "Key"
            }
          >
            <HFTextField
              control={control}
              name="slug"
              fullWidth
              placeholder="KEY"
              required
              withTrim
              id={"create_table_key"}
            />
          </FRow>

          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "30px" }}
            className={style.checkbox}
          >
            <HFCheckbox
              id="login_table_check"
              control={control}
              name="is_login_table"
              required
              label={
                generateLangaugeText(tableLan, i18n?.language, "Login Table") ||
                "Login Table"
              }
            />
            <HFCheckbox
              control={control}
              name="is_cached"
              required
              label={
                generateLangaugeText(tableLan, i18n?.language, "Cache") ||
                "Cache"
              }
            />
            <HFCheckbox
              control={control}
              name="soft_delete"
              required
              label={
                generateLangaugeText(tableLan, i18n?.language, "Soft delete") ||
                "Soft delete"
              }
            />
            <HFCheckbox
              control={control}
              name="order_by"
              required
              label={
                generateLangaugeText(tableLan, i18n?.language, "Sort") || "Sort"
              }
            />
          </Box>

          {loginTable && (
            <Box>
              {authData?.login_strategy?.length >= 1 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      width: "500px",
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <FRow
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "User type"
                        ) || "User type"
                      }
                    />
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.client_type_id"
                      fullWidth
                      placeholder="client"
                      options={computedLoginFields}
                      required
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "500px",
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <FRow
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Roles"
                        ) || "Roles"
                      }
                    />
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.role_id"
                      fullWidth
                      placeholder="role"
                      options={computedLoginFields}
                      required
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "500px",
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <FRow
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Login"
                        ) || "Login"
                      }
                    />
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.login"
                      fullWidth
                      placeholder="login"
                      options={computedLoginFields}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "500px",
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <FRow
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Password"
                        ) || "Password"
                      }
                    />
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.password"
                      fullWidth
                      placeholder="password"
                      options={computedLoginFields}
                      required={loginRequired}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "500px",
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <FRow
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Email"
                        ) || "Email"
                      }
                    />
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.email"
                      fullWidth
                      placeholder="email"
                      options={computedLoginFields}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      width: "500px",
                      alignItems: "center",
                      margin: "10px 0",
                    }}
                  >
                    <FRow
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Phone"
                        ) || "Phone"
                      }
                    />
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.phone"
                      fullWidth
                      placeholder="phone"
                      options={computedLoginFields}
                    />
                  </Box>
                </>
              )}

              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  maxWidth: "500px",
                  alignItems: "center",
                  marginTop: "30px",
                }}
              >
                <FRow
                  label={
                    generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Login strategy"
                    ) || "Login strategy"
                  }
                />
                <HFMultipleSelect
                  id="login_strategy"
                  control={control}
                  name="attributes.auth_info.login_strategy"
                  fullWidth
                  placeholder="Select..."
                  options={LoginStrategy}
                />
              </Box>
            </Box>
          )}
        </FormCard>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={handleClose}>{t("cancel")}</SecondaryButton>
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
