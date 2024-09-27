import React from "react";
import {Controller} from "react-hook-form";
import {useQuery} from "react-query";
import Select from "react-select";
import constructorObjectService from "../../services/constructorObjectService";
import {useTranslation} from "react-i18next";

function HFRelationFieldSetting({control, name, selectedField}) {
  const {i18n} = useTranslation();

  const {data: optionsFromLocale} = useQuery(
    ["GET_OBJECT_LIST", selectedField],
    () => {
      if (!selectedField?.table_slug) return null;
      return constructorObjectService.getListV2(
        selectedField?.table_slug,
        {
          data: {
            limit: 10,
            offset: 0,
          },
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: Boolean(selectedField?.table_slug),
      select: (res) => {
        return res?.data?.response ?? [];
      },
      onSuccess: (data) => {
        // if (page > 1) {
        //   setAllOptions((prevOptions) => [...prevOptions, ...data.options]);
        // } else {
        //   setAllOptions(data?.options);
        // }
      },
    }
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <>
          <Select
            options={optionsFromLocale}
            menuPortalTarget={document.body}
            getOptionLabel={(option) =>
              optionsFromLocale?.map((el) => {
                if (field?.attributes?.enable_multi_language) {
                  return `${option[`${el}_${activeLang ?? i18n?.language}`] ?? option[`${el}`]} `;
                } else {
                  return `${option[el]} `;
                }
              })
            }
          />
        </>
      )}></Controller>
  );
}

export default HFRelationFieldSetting;
