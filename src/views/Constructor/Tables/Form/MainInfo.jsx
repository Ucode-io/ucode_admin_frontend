import { useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import FormCard from "../../../../components/FormCard";
import FRow from "../../../../components/FormElements/FRow";
import HFIconPicker from "../../../../components/FormElements/HFIconPicker";
import HFSelect from "../../../../components/FormElements/HFSelect";
import HFSwitch from "../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../components/FormElements/HFTextField";
import listToOptions from "../../../../utils/listToOptions";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import constructorObjectService from "../../../../services/constructorObjectService";

const MainInfo = ({ control }) => {
  
  const {slug} = useParams();


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
    ["GET_OBJECT_LIST", slug],
    () => {
      return constructorObjectService.getList(slug, {
        data: {
          limit: 0, offset: 0
        },
      });
    },
    {
      select: (res) => {
        return res?.data?.fields ?? [];
      },
    }
  );
  
  
  const loginRequired = useMemo(() => {
    if(login) {
        return true
      } else {
        return false
      }
  }, [login])

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
    return computedTableFields?.map((item) => (
      {
        label: item?.label ?? '',
        value: item?.slug ?? ''
      }
    ))

  }, [computedTableFields]);

  return (
    <div className="p-2">
      <FormCard title="Общие сведение">
        <div className="flex">
          <FRow label="Иконка">
            <HFIconPicker control={control} name="icon" required />
          </FRow>
        </div>

        <FRow label="Название">
          <HFTextField
            control={control}
            name="label"
            fullWidth
            placeholder="Название"
            required
          />
        </FRow>
        <FRow label="Описание">
          <HFTextField
            control={control}
            name="description"
            fullWidth
            placeholder="Описание"
            multiline
            required
            rows={4}
          />
        </FRow>
        <FRow label="SLUG">
          <HFTextField
            control={control}
            name="slug"
            fullWidth
            placeholder="SLUG"
            required
            withTrim
          />
        </FRow>
        <FRow label="Subtitle field">
          <HFSelect
            control={control}
            name="subtitle_field_slug"
            fullWidth
            placeholder="Subtitle field"
            options={computedFields}
          />
        </FRow>

        <Box sx={{ display: "flex", alignItems: "center", margin: "30px 0" }}>
          <FRow label="Login Table">
            <HFSwitch
              control={control}
              name="is_login_table"
              required
            />
          </FRow>
          <FRow label="Показать в меню">
            <HFSwitch control={control} name="show_in_menu" required />
          </FRow>
          <FRow label="Кеш">
            <HFSwitch control={control} name="is_cached" required />
          </FRow>
          <FRow label="Софт Удаление">
            <HFSwitch control={control} name="soft_delete" required />
          </FRow>
          <FRow label="Сортировка">
            <HFSwitch control={control} name="order_by" required />
          </FRow>
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
          </Box>
        )}
      </FormCard>
    </div>
  );
};

export default MainInfo;
