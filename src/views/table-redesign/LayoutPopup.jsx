import {Box, Dialog, DialogActions, DialogContent} from "@mui/material";
import FormCard from "../../components/FormCard";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import FRow from "../../components/FormElements/FRow";
import HFTextFieldWithMultiLanguage from "../../components/FormElements/HFTextFieldWithMultiLanguage";
import HFTextField from "../../components/FormElements/HFTextField";
import HFCheckbox from "../../components/FormElements/HFCheckbox";
import HFSelect from "../../components/FormElements/HFSelect";
import HFMultipleSelect from "../../components/FormElements/HFMultipleSelect";
import {useTranslation} from "react-i18next";
import style from "./popup.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useFieldArray, useWatch} from "react-hook-form";
import {useMemo, useState} from "react";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import {LoginStrategy} from "../../mock/FolderSettings";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import constructorTableService from "../../services/constructorTableService";
import {constructorTableActions} from "../../store/constructorTable/constructorTable.slice";
import { CloseButton } from "../../components/CloseButton";
import TextFieldWithMultiLanguage from "../../components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import { CustomCheckbox } from "../../components/CustomCheckbox";

export const LayoutPopup = ({
  onClose = () => {},
  open = false,
  tableLan,
  control,
  authData,
  handleSubmit,
  view,
  tableSlug: tableSlugFromProps,
  mainForm,
}) => {
  const { i18n, t } = useTranslation();

  const languages = useSelector((state) => state.languages.list);

  const { tableSlug: tableSlugFromParams } = useParams();
  const tableSlug =
    tableSlugFromParams || tableSlugFromProps || view?.table_slug;

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

  // const tableName = useWatch({
  //   control,
  //   name: `attributes.label_${i18n.language}`,
  // });

  const tableName = mainForm?.watch(`attributes.label_${i18n.language}`);

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
                watch={mainForm?.watch}
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

          <Box className={style.checkbox}>
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
              {authData?.login_strategy?.length >= 1 && (
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
