import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { useTranslation } from "react-i18next";
import { FilterDropdown } from "../FilterDropdown";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilterContext } from "@/views/views/providers/FilterProvider";
import { DefaultFilterRelation } from "../DefaultFilterRelation";
import { DefaultFilterDate } from "../DefaultFilterDate";
import useDebounce from "@/hooks/useDebounce";
import menuSettingsService from "@/services/menuSettingsService";
import { menuActions } from "@/store/menuItem/menuItem.slice";

export const useDefaultFiltersProps = ({ handleClosePopover }) => {
  const { i18n } = useTranslation();

  const { activeTable } = useSelector((state) => state.menu);

  const { fieldsMap } = useFieldsContext();
  const { defaultFiltersMap, setDefaultFiltersMap } = useFilterContext();

  const dispatch = useDispatch();

  const isChanged = useRef(false);

  const updateDefaultFilter = () => {
    if (isChanged.current) {
      const attributes = {
        ...activeTable?.attributes,
        default_filters: defaultFiltersMap,
      };

      const updatedTable = {
        ...activeTable,
        attributes,
      };

      menuSettingsService.update(updatedTable).finally(() => {
        handleClosePopover();
      });
      dispatch(menuActions.setActiveTable(updatedTable));
    }
  };

  const allFields = Object.values(fieldsMap).filter((el) => {
    return (
      el.type === FIELD_TYPES.LOOKUP ||
      el.type === FIELD_TYPES.STATUS ||
      el.type === FIELD_TYPES.MULTISELECT ||
      el.type === FIELD_TYPES.DATE ||
      el.type === FIELD_TYPES.DATE_TIME ||
      el.type === FIELD_TYPES.DATE_TIME_WITHOUT_TIME_ZONE ||
      el.type === FIELD_TYPES.SINGLE_LINE ||
      el.type === FIELD_TYPES.MULTI_LINE ||
      el.type === FIELD_TYPES.NUMBER
    );
  });

  const handleChange = (value, name) => {
    isChanged.current = true;

    if (value?.length === 0 || !value) {
      const newDefaultFiltersMap = { ...defaultFiltersMap };
      delete newDefaultFiltersMap[name];
      setDefaultFiltersMap(newDefaultFiltersMap);
      return;
    }

    const newDefaultFilters = {
      ...defaultFiltersMap,
    };

    if (Array.isArray(value)) {
      newDefaultFilters[name] = value?.map((item) => item.value);
    } else {
      newDefaultFilters[name] = value;
    }

    setDefaultFiltersMap(newDefaultFilters);
  };

  const debouncedHandleChange = useDebounce(handleChange, 500);

  const filterGenerator = (field) => {
    const todoOptions = field?.attributes?.todo?.options ?? [];
    const completeOptions = field?.attributes?.complete?.options ?? [];
    const progressOptions = field?.attributes?.progress?.options ?? [];

    const statusOptions = [
      ...todoOptions,
      ...completeOptions,
      ...progressOptions,
    ].map((option) => {
      return {
        ...option,
        label: option?.[`label_${i18n.language}`] || option.label,
      };
    });

    const multiSelectOptions = field?.attributes?.options?.map((option) => {
      return {
        ...option,
        value: option.slug,
        label: option?.[`label_${i18n.language}`] || option.label,
      };
    });

    const multiSelectDefaultValue = multiSelectOptions?.filter((option) => {
      return defaultFiltersMap[field.slug]?.includes(option.value);
    });

    const statusDefaultValue = statusOptions?.filter((option) => {
      return defaultFiltersMap[field.slug]?.includes(option.value);
    });

    switch (field.type) {
      case FIELD_TYPES.STATUS:
        return (
          <FilterDropdown
            defaultValue={statusDefaultValue}
            onChange={(value) => handleChange(value, field.slug)}
            options={statusOptions}
            placeholder={"Filter by"}
            multiple
          />
        );
      case FIELD_TYPES.MULTISELECT:
        return (
          <FilterDropdown
            defaultValue={multiSelectDefaultValue}
            onChange={(value) => handleChange(value, field.slug)}
            options={multiSelectOptions}
            placeholder={"Filter by"}
            multiple
          />
        );
      case FIELD_TYPES.LOOKUP:
        return (
          <DefaultFilterRelation
            defaultValue={defaultFiltersMap[field.slug]}
            field={field}
            handleChange={handleChange}
          />
        );
      case FIELD_TYPES.DATE:
      case FIELD_TYPES.DATE_TIME:
      case FIELD_TYPES.DATE_TIME_WITHOUT_TIME_ZONE:
        return (
          <DefaultFilterDate
            field={field}
            value={defaultFiltersMap[field.slug]}
            handleChange={(value) => handleChange(value, field.slug)}
          />
        );
      case FIELD_TYPES.NUMBER:
        return (
          <input
            defaultValue={defaultFiltersMap[field.slug]}
            placeholder="Filter by"
            type="number"
            onChange={(e) =>
              debouncedHandleChange(Number(e.target.value), field.slug)
            }
          />
        );
      default:
        return (
          <input
            defaultValue={defaultFiltersMap[field.slug]}
            placeholder="Filter by"
            type="text"
            onChange={(e) => debouncedHandleChange(e.target.value, field.slug)}
          />
        );
    }
  };

  return {
    allFields,
    i18n,
    filterGenerator,
    updateDefaultFilter,
  };
};
