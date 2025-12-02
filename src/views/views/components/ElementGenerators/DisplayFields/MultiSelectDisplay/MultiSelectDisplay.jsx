import IconGeneratorIconjs from "@/components/IconPicker/IconGeneratorIconjs";
import cls from "./styles.module.scss";
import { useMemo } from "react";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import { useTranslation } from "react-i18next";

export const MultiSelectDisplay = ({ row, onClick = () => {} }) => {

  const { i18n } = useTranslation();

  const options = row.attributes?.options ?? [];
  const hasColor = row.attributes?.has_color;
  const hasIcon = row.attributes?.has_icon;
  const isMultiSelect = row.attributes?.is_multiselect;

  const value = row?.value;

  const computedValue = useMemo(() => {
    if (!value?.length) return [];

    if (isMultiSelect)
      if (Array.isArray(value)) {
        return (
          value?.map((el) =>
            options?.find((option) => {
              if (option.slug) return option.slug === el;
              if (option.value) return option.value === el;
              return option.label === el;
            }),
          ) ?? []
        );
      } else {
        return options?.find((item) => {
          if (item?.slug) return item?.slug === value;
          if (item?.value) return item?.value === value;
          if (item?.label) return item?.label === value;
        });
      }
    else {
      return [
        options?.find((option) => {
          if (option.slug) return option.slug === value[0];
          if (option.value) return option.value === value[0];
          if (option.label) return option.label === value[0];
        }),
      ];
    }
  }, [value, options, isMultiSelect]);

  return <div className={cls.valuesWrapper} onClick={onClick}>
    {computedValue?.map((el) => (
      <div
        key={el?.value}
        className={cls.multipleAutocompleteTags}
        style={
          hasColor
            ? { color: el?.color, background: `${el?.color}30` }
            : {}
        }
      >
        {hasIcon &&
          (row?.attributes?.icon?.includes(":") ? (
            <IconGeneratorIconjs icon={el?.icon} />
          ) : (
            <IconGenerator icon={el?.icon} />
          ))}
        <p
          className={cls.value}
        >
          {el?.[`label_${i18n?.language}`] ?? el?.label ?? el?.value}
        </p>
      </div>
    ))}
  </div>
}