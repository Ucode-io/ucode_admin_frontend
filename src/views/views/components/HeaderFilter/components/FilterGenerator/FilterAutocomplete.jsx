import {Checkbox, Divider, Fade, Menu} from "@mui/material";
import {useMemo, useState} from "react";
import styles from "./style.module.scss";
import {Chip} from "./chip";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import {useTranslation} from "react-i18next";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

const FilterAutoComplete = ({
  options = [],
  setSearchText,
  value = [],
  onChange,
  label,
  field,
  setChosenField = () => {},
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuVisible = Boolean(anchorEl);
  const { i18n } = useTranslation();
  const computedValue = useMemo(() => {
    return value
      ?.map((el) => options?.find((option) => option.value === el))
      .filter((el) => el);
  }, [value, options]);

  const openMenu = (event) => {
    setChosenField(field);
    setAnchorEl(event.currentTarget);
  };

  const inputChangeHandler = useDebounce((val) => {
    setSearchText(val);
  }, 300);

  const closeMenu = () => {
    setAnchorEl(null);
    setSearchText("");
  };

  const rowClickHandler = (option) => {
    if (field.type === FIELD_TYPES.MULTISELECT) {
      // Keep this for backward compatibility
      if (option?.slug) {
        if (value?.includes(option.slug)) {
          onChange(value.filter((item) => item !== option.slug));
        } else {
          onChange([...value, option.slug]);
        }
      } else {
        if (value?.includes(option.value)) {
          onChange(value.filter((item) => item !== option.value));
        } else {
          onChange([...value, option.value]);
        }
      }
    } else {
      if (value?.includes(option.value)) {
        onChange(value.filter((item) => item !== option.value));
      } else {
        onChange([...value, option.value]);
      }
    }
  };

  const onClearButtonClick = (e) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const isChecked = (option) => {
    // const computedSlugs = options.map((item) => item.slug);
    // const computedValues = options.map((item) => item.value);
    if (field.type === FIELD_TYPES.STATUS) {
      return value.includes(option.value);
    } else if (field.type === FIELD_TYPES.MULTISELECT) {
      return value.includes(option.slug) || value.includes(option.value);
    } else return value.includes(option.value);
  };

  return (
    <>
      <Chip
        field={field}
        onClick={openMenu}
        onClearButtonClick={onClearButtonClick}
        showCloseIcon={value?.length ?? 0}
        {...props}
      >
        {computedValue?.[0]?.[`label_${i18n?.language}`] ??
          computedValue?.[0]?.label ??
          (field?.attributes?.[`label_${i18n?.language}`] || value[0])}
        {(value?.length ?? 0) > 1 && (
          <span style={{ color: "#6d757e" }}>{` +${value.length - 1}`}</span>
        )}
      </Chip>

      <Menu
        anchorEl={anchorEl}
        open={menuVisible}
        TransitionComponent={Fade}
        onClose={closeMenu}
        classes={{ list: styles.menu, paper: styles.paper }}
      >
        <SearchInput
          id="filter_search_input"
          fullWidth
          onChange={inputChangeHandler}
          placeholder={label}
          style={{ paddingTop: 8 }}
        />

        <div className={styles.scrollBlock}>
          <Divider />

          {options?.map((option) => (
            <div
              onClick={() => rowClickHandler(option)}
              key={option.value}
              className={styles.option}
            >
              <Checkbox id="filter_checkbox" checked={isChecked(option)} />
              {/* {computedValue.includes(option.value) ? (
              ) : (
                <Checkbox id="filter_checkbox" />
              )} */}
              <p className={styles.label}>
                {option?.[`label_${i18n?.language}`] ?? option.label}
              </p>
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
};

export default FilterAutoComplete;
