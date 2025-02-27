import {Box} from "@mui/material";
import {useMemo} from "react";
import {useFieldArray, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import FormCard from "../../../../components/FormCard";
import FRow from "../../../../components/FormElements/FRow";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";
import HFMultipleSelect from "../../../../components/FormElements/HFMultipleSelect";
import HFSelect from "../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../components/FormElements/HFTextField";
import HFTextFieldWithMultiLanguage from "../../../../components/FormElements/HFTextFieldWithMultiLanguage";
import {LoginStrategy} from "../../../../mock/FolderSettings";
import constructorObjectService from "../../../../services/constructorObjectService";
import style from "./main.module.scss";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";

const MainInfo = ({
  control,
  watch,
  exist,
  authData,
  getData = () => {},
  tableLan,
}) => {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const languages = useSelector((state) => state.languages.list);

  const params = {
    language_setting: i18n?.language,
  };

  const tableName = useWatch({
    control,
    name: "label",
  });

  const {fields} = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  });

  const {fields: relations} = useFieldArray({
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

  const {data: computedTableFields} = useQuery(
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
    <div className="p-2">
      <FormCard
        title={
          generateLangaugeText(tableLan, i18n?.language, "General") || "General"
        }>
        <FRow
          label={
            generateLangaugeText(tableLan, i18n?.language, "Name") || "Name"
          }>
          <Box style={{display: "flex", gap: "6px"}}>
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
          }>
          <HFTextField
            control={control}
            name="slug"
            exist={exist}
            fullWidth
            placeholder="KEY"
            required
            withTrim
            id={"create_table_key"}
          />
        </FRow>

        <Box
          sx={{display: "flex", alignItems: "center", margin: "30px 0"}}
          className={style.checkbox}>
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
            label="Cache"
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
          <HFCheckbox control={control} name="order_by" required label="Sort" />
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
                  }}>
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
                  }}>
                  <FRow
                    label={
                      generateLangaugeText(tableLan, i18n?.language, "Roles") ||
                      "Roles"
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
                  }}>
                  <FRow
                    label={
                      generateLangaugeText(tableLan, i18n?.language, "Login") ||
                      "Login"
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
                  }}>
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
                  }}>
                  <FRow
                    label={
                      generateLangaugeText(tableLan, i18n?.language, "Email") ||
                      "Email"
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
                  }}>
                  <FRow
                    label={
                      generateLangaugeText(tableLan, i18n?.language, "Phone") ||
                      "Phone"
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
                width: "500px",
                alignItems: "center",
                margin: "10px 0",
              }}>
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
    </div>
  );
};

export default MainInfo;
