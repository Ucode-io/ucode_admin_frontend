import { Box } from "@mui/material";
import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import FormCard from "../../../../components/FormCard";
import FRow from "../../../../components/FormElements/FRow";
import HFIconPicker from "../../../../components/FormElements/HFIconPicker";
import HFSelect from "../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../components/FormElements/HFTextField";
import constructorObjectService from "../../../../services/constructorObjectService";
import listToOptions from "../../../../utils/listToOptions";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import HFMultipleSelect from "../../../../components/FormElements/HFMultipleSelect";
import { LoginStrategy } from "../../../../mock/FolderSettings";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";
import style from "./main.module.scss";
import HFTextFieldWithMultiLanguage from "../../../../components/FormElements/HFTextFieldWithMultiLanguage";
import constructorTableService from "../../../../services/constructorTableService";

const MainInfo = ({ control, watch }) => {
  const { tableSlug } = useParams();
  const { i18n } = useTranslation();

  const params = {
    language_setting: i18n?.language,
  };

  const tableName = useWatch({
    control,
    name: "label",
  });

  const description = useWatch({
    control,
    name: "description",
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

  const authInfo = useWatch({
    control,
    name: "attributes.auth_info",
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

  const computedFields = useMemo(() => {
    const computedRelations = relations.map((relation) => {
      const tableSlug = relation.id.split("#")[0];
      const viewFields =
        relation.attributes?.fields?.map(
          (viewField) => `${tableSlug}.${viewField.slug}`
        ) ?? [];

      const slug = viewFields.join("#");

      return {
        ...relation,
        slug: slug,
      };
    });

    return listToOptions([...fields, ...computedRelations], "label", "slug");
  }, [fields]);

  const computedLoginFields = useMemo(() => {
    return computedTableFields?.map((item) => ({
      label: item?.label ?? "",
      value: item?.slug ?? "",
    }));
  }, [computedTableFields]);

  const languages = useSelector((state) => state.languages.list);

  return (
    <div className="p-2">
      <FormCard title="General">
        <FRow label="Name">
          <Box style={{ display: "flex", gap: "6px" }}>
            {/* {languages?.map((language) => {
              const languageFieldName = `attributes.label_${language?.slug}`;
              const fieldValue = watch(languageFieldName);
              return (
                <HFTextField
                  control={control}
                  name={languageFieldName}
                  fullWidth
                  placeholder={`Name (${language?.slug})`}
                  defaultValue={fieldValue || tableName} // Set default value if fieldValue is empty
                />
              );
            })} */}

            <HFTextFieldWithMultiLanguage
              control={control}
              name="attributes.label"
              fullWidth
              placeholder="Name"
              defaultValue={tableName}
              languages={languages}
            />
          </Box>
        </FRow>
        <FRow label="Key">
          <HFTextField
            control={control}
            name="slug"
            fullWidth
            placeholder="KEY"
            required
            withTrim
          />
        </FRow>

        <Box
          sx={{ display: "flex", alignItems: "center", margin: "30px 0" }}
          className={style.checkbox}
        >
          <HFCheckbox
            control={control}
            name="is_login_table"
            required
            label="Login Table"
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
            label="Soft delete"
          />
          <HFCheckbox control={control} name="order_by" required label="Sort" />
        </Box>

        {loginTable && (
          <Box>
            <Box
              sx={{
                display: "flex",
                width: "500px",
                alignItems: "center",
                margin: "10px 0",
              }}
            >
              <FRow label="Тип пользователья" />
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
              <FRow label="Роли" />
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
              <FRow label="Логин" />
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
              <FRow label="Пароль" />
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
              <FRow label="Почта" />
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
              <FRow label="Телефон" />
              <HFSelect
                control={control}
                name="attributes.auth_info.phone"
                fullWidth
                placeholder="phone"
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
              <FRow label="Login strategy" />
              <HFMultipleSelect
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
