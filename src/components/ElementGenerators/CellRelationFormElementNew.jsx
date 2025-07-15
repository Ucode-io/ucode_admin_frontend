import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import LaunchIcon from "@mui/icons-material/Launch";
import {Box, Popover, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {get} from "@ngard/tiny-get";
import React, {useEffect, useMemo, useState} from "react";
import {Controller, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery} from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import Select, { components } from "react-select";
import useDebounce from "../../hooks/useDebounce";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import {
  getRelationFieldTabsLabel,
  getRelationFieldTabsLabelLang,
} from "../../utils/getRelationFieldLabel";
import { pageToOffset } from "../../utils/pageToOffset";
import ModalDetailPage from "../../views/Objects/ModalDetailPage/ModalDetailPage";
import CascadingElement from "./CascadingElement";
import RelationGroupCascading from "./RelationGroupCascading";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { detailDrawerActions } from "../../store/detailDrawer/detailDrawer.slice";
import { updateQueryWithoutRerender } from "../../utils/useSafeQueryUpdater";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const CellRelationFormElementNew = ({
  relOptions,
  tableView,
  isBlackBg,
  isFormEdit,
  control,
  name,
  updateObject,
  disabled,
  placeholder,
  field,
  isLayout,
  disabledHelperText,
  setFormValue,
  index,
  defaultValue = null,
  relationfields,
  data,
  isTableView = false,
  row,
  newUi,
}) => {
  const classes = useStyles();

  if (!isLayout)
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return field?.attributes?.cascading_tree_table_slug ? (
            <RelationGroupCascading
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={(e) => {
                onChange(e);
                updateObject();
              }}
            />
          ) : field?.attributes?.cascadings?.length > 1 ? (
            <CascadingElement
              field={field}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              value={value ?? ""}
              setFormValue={setFormValue}
              classes={classes}
              name={name}
              control={control}
              index={index}
              setValue={(e) => {
                onChange(e);
                updateObject();
              }}
            />
          ) : (
            <AutoCompleteElement
              row={row}
              relOptions={relOptions}
              tableView={tableView}
              disabled={disabled}
              isFormEdit={isFormEdit}
              placeholder={placeholder}
              isBlackBg={isBlackBg}
              value={value}
              classes={classes}
              name={name}
              setValue={(e) => {
                onChange(e);
                isTableView && updateObject();
              }}
              field={field}
              isTableView={isTableView}
              defaultValue={defaultValue}
              tableSlug={field.table_slug}
              error={error}
              disabledHelperText={disabledHelperText}
              setFormValue={setFormValue}
              control={control}
              index={index}
              relationfields={relationfields}
              data={data}
              newUi={newUi}
            />
          );
        }}
      />
    );
};

// ============== AUTOCOMPLETE ELEMENT =====================

const AutoCompleteElement = ({
  relOptions,
  field,
  value,
  tableSlug,
  name,
  disabled,
  isBlackBg,
  setValue,
  index,
  control,
  isTableView = false,
  relationfields,
  setFormValue = () => {},
  row,
  newUi,
}) => {
  const isNewRouter = localStorage.getItem("new_router") === "true";
  const { navigateToForm } = useTabRouter();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState();
  const [localValue, setLocalValue] = useState(
    row?.[`${field?.slug}_data`] ?? null
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableSlugFromProps, setTableSlugFromProps] = useState("");
  const openPopover = Boolean(anchorEl);
  const autoFilters = field?.attributes?.auto_filters;
  const [searchParams] = useSearchParams();
  // const menuId = searchParams.get("menuId");
  const { menuId } = useParams();
  const { i18n } = useTranslation();
  const languages = useSelector((state) => state.languages.list)?.map(
    (el) => el.slug
  );

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: isBlackBg ? "#2A2D34" : disabled ? "#FFF" : "transparent",
      color: isBlackBg ? "#fff" : "",
      width: "100%",
      display: "flex",
      alignItems: "center",
      border: "0px solid #fff",
      outline: "none",
      minHeight: newUi ? "25px" : undefined,
      height: newUi ? "25px" : undefined,
    }),
    input: (provided) => ({
      ...provided,
      width: "100%",
      border: "none",
    }),
    placeholder: (provided) => ({
      ...provided,
      display: "flex",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? "#007AFF" : provided.background,
      color: state.isSelected ? "#fff" : provided.color,
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      cursor: "pointer",
      marginRight: "15px",
    }),
  };

  const autoFiltersFieldFroms = useMemo(() => {
    return autoFilters?.map((el) => `multi.${index}.${el.field_from}`) ?? [];
  }, [autoFilters, index]);

  const filtersHandler = useWatch({
    control,
    name: autoFiltersFieldFroms,
  });

  const autoFiltersValue = useMemo(() => {
    const result = {};
    filtersHandler?.forEach((value, index) => {
      const key = autoFilters?.[index]?.field_to;
      if (key) result[key] = value;
    });
    return result;
  }, [autoFilters, filtersHandler, value]);

  const { data: optionsFromLocale, refetch } = useQuery(
    ["GET_OBJECT_LIST", debouncedValue, autoFiltersValue, value, page],
    () => {
      if (!field?.table_slug) return null;
      return constructorObjectService.getListV2(
        field?.table_slug,
        {
          data: {
            ...autoFiltersValue,
            additional_request: {
              additional_field: "guid",
              additional_values: [value],
            },
            view_fields: field?.view_fields?.map((f) => f.slug),
            search: debouncedValue.trim(),
            limit: 10,
            offset: pageToOffset(page, 10),
            with_relations: false,
          },
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled:
        (!field?.attributes?.function_path && Boolean(page > 1)) ||
        (!field?.attributes?.function_path && Boolean(debouncedValue)),
      select: (res) => {
        const options = res?.data?.response ?? [];

        return {
          options,
        };
      },
      onSuccess: (data) => {
        if (Object.keys(autoFiltersValue)?.length) {
          setAllOptions(data?.options);
        } else if (data?.options?.length) {
          setAllOptions((prevOptions) => [
            ...(prevOptions ?? []),
            ...(data.options ?? []),
          ]);
        }
      },
    }
  );

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(
      new Set(allOptions?.map(JSON.stringify))
    ).map(JSON.parse);
    return uniqueObjects ?? [];
  }, [allOptions]);

  const computedValue = useMemo(() => {
    const findedOption = allOptions?.find((el) => el?.guid === value);
    return findedOption ? [findedOption] : [];
  }, [allOptions, value, relOptions]);

  const handleOpen = () => {
    setOpen(true);
  };

  const openFormModal = (tableSlug) => {
    handleOpen();
    setTableSlugFromProps(tableSlug);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const changeHandler = (value) => {
    const val = value;
    setValue(val?.guid ?? null);
    setLocalValue(value);

    if (!field?.attributes?.autofill) return;
    field.attributes.autofill.forEach(({ field_from, field_to }) => {
      const setName = name.split(".");
      setName.pop();
      setName.push(field_to);
      setFormValue(setName.join("."), get(val, field_from));
    });
  };

  function loadMoreItems() {
    if (field?.attributes?.function_path) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage((prevPage) => prevPage + 1);
    }
  }

  useEffect(() => {
    let val;

    if (Array.isArray(computedValue)) {
      val = computedValue[computedValue.length - 1];
    } else {
      val = computedValue;
    }

    if (!field?.attributes?.autofill || !val) {
      return;
    }

    field.attributes.autofill.forEach(({ field_from, field_to, automatic }) => {
      const setName = name?.split(".");
      setName?.pop();
      setName?.push(field_to);

      if (automatic) {
        setTimeout(() => {
          setFormValue(setName.join("."), get(val, field_from));
        }, 1);
      }
    });
  }, [computedValue, field]);

  useEffect(() => {
    setLocalValue(row?.[`${field?.slug}_data`]);
  }, [row]);

  const dispatch = useDispatch();

  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <div
        className="select_icon"
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => {
          refetch();
        }}
      >
        {props?.data?.[`name_${i18n?.language}`] ||
          props?.data?.name ||
          props.children}
        {!disabled && (
          <Box
            sx={{ position: "relative", zIndex: 99999 }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isNewRouter) {
                dispatch(detailDrawerActions.openDrawer());
                updateQueryWithoutRerender("p", props?.data?.guid);
                updateQueryWithoutRerender("field_slug", field?.table_slug);
              } else {
                navigateToForm(tableSlug, "EDIT", localValue, {}, menuId);
              }
            }}
          >
            <LaunchIcon
              style={{
                fontSize: "18px",
                marginLeft: "5px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            />
          </Box>
        )}
      </div>
    </components.SingleValue>
  );

  const autofilterDisable = useMemo(() => {
    if (isTableView && Boolean(Object.keys(autoFiltersValue)?.length)) {
      return true;
    } else return false;
  }, [autoFiltersValue]);

  return (
    <div className={styles.autocompleteWrapper}>
      {field.attributes.creatable && (
        <span
          onClick={() => openFormModal(tableSlug)}
          style={{ color: "#007AFF", cursor: "pointer", fontWeight: 500 }}
        >
          <AddIcon
            aria-owns={openPopover ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "none",
            }}
            open={openPopover}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography sx={{ p: 1 }}>Create new object</Typography>
          </Popover>
        </span>
      )}

      {tableSlugFromProps && (
        <ModalDetailPage
          open={open}
          setOpen={setOpen}
          tableSlug={tableSlugFromProps}
        />
      )}

      <Select
        id="relation-lookup"
        inputValue={inputValue}
        onInputChange={(newInputValue, { action }) => {
          if (action !== "reset") {
            setInputValue(newInputValue);
            inputChangeHandler(newInputValue);
          }
        }}
        isDisabled={disabled || autofilterDisable}
        onMenuScrollToBottom={loadMoreItems}
        options={computedOptions ?? []}
        value={localValue}
        menuPortalTarget={document.body}
        onMenuOpen={(e) => {
          refetch();
        }}
        isClearable
        components={{
          // ClearIndicator: (props) => {
          //   console.log({ props });
          //   return (
          //     ((Array.isArray(localValue) && localValue?.length) ||
          //       Boolean(localValue)) && (
          //       <div
          //         style={{
          //           marginRight: "20px",
          //           cursor: "pointer",
          //         }}
          //         onClick={(e) => {
          //           e.stopPropagation();
          //           setLocalValue([]);
          //         }}
          //       >
          //         <ClearIcon />
          //       </div>
          //     )
          //   );
          // },
          SingleValue: CustomSingleValue,
          DropdownIndicator: null,
        }}
        onChange={(newValue, { action }) => {
          changeHandler(newValue);
        }}
        noOptionsMessage={() => (
          <span
            onClick={() => navigateToForm(tableSlug, "CREATE", {}, {}, menuId)}
            style={{ color: "#007AFF", cursor: "pointer", fontWeight: 500 }}
          >
            Create new
          </span>
        )}
        menuShouldScrollIntoView
        styles={customStyles}
        getOptionLabel={(option) =>
          field?.attributes?.enable_multi_language
            ? getRelationFieldTabsLabelLang(
                field,
                option,
                i18n?.language,
                languages
              )
            : `${getRelationFieldTabsLabel(field, option)}`
        }
        getOptionValue={(option) => option.value}
        isOptionSelected={(option, value) =>
          value.some((val) => val.guid === value)
        }
        blurInputOnSelect
      />
    </div>
  );
};

export default CellRelationFormElementNew;
