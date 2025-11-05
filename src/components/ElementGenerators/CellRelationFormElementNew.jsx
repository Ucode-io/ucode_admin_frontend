import AddIcon from "@mui/icons-material/Add";
import LaunchIcon from "@mui/icons-material/Launch";
import { Box, Popover, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { get } from "@ngard/tiny-get";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Select, { components } from "react-select";
import useDebounce from "@/hooks/useDebounce";
import useTabRouter from "@/hooks/useTabRouter";
import constructorObjectService from "@/services/constructorObjectService";
import {
  getRelationFieldTabsLabel,
  getRelationFieldTabsLabelLang,
} from "@/utils/getRelationFieldLabel";
import { pageToOffset } from "@/utils/pageToOffset";
import ModalDetailPage from "@/views/Objects/ModalDetailPage/ModalDetailPage";
import CascadingElement from "./CascadingElement";
import RelationGroupCascading from "./RelationGroupCascading";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import clsx from "clsx";
import { CustomSingleValue } from "./components/CustomSingleValue";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { useViewContext } from "@/providers/ViewProvider";

const useStyles = makeStyles(() => ({
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
  objectIdFromJWT,
  relationView,
  newColumn,
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
              objectIdFromJWT={objectIdFromJWT}
              relationView={relationView}
              newColumn={newColumn}
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
  setFormValue = () => {},
  row,
  newUi,
  objectIdFromJWT,
  relationView,
}) => {
  const { view } = useViewContext();
  const isNewRouter = localStorage.getItem("new_router") === "true";
  const { navigateToForm } = useTabRouter();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const [page, setPage] = useState(1);
  const [allOptions, setAllOptions] = useState();
  const [count, setCount] = useState(0);
  const [localValue, setLocalValue] = useState(
    row?.[`${field?.slug}_data`] ?? null,
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableSlugFromProps, setTableSlugFromProps] = useState("");
  const openPopover = Boolean(anchorEl);
  const autoFilters = field?.attributes?.auto_filters;
  // const menuId = searchParams.get("menuId");
  const { menuId } = useParams();
  const { i18n } = useTranslation();
  const languages = useSelector((state) => state.languages.list)?.map(
    (el) => el.slug,
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      background: isBlackBg
        ? "#2A2D34"
        : disabled
          ? "rgb(248, 248, 248)"
          : "transparent",
      color: isBlackBg ? "#fff" : "",
      width: "100%",
      display: "flex",
      alignItems: "center",
      boxShadow: "none",
      border: "0px solid #fff",
      outline: "none",
      minHeight: newUi ? "25px" : undefined,
      height: newUi ? "25px" : undefined,
    }),
    input: (provided, state) => {
      return {
        ...provided,
        // position: "absolute",
        // left: "0",
        // height: "100%",
        width: "100%",
        border: "none",
        // backgroundColor: "rgba(242, 241, 238, 0.6)",
      };
    },
    placeholder: (provided) => ({
      ...provided,
      display: "flex",
    }),
    option: (provided, state) => ({
      ...provided,
      background: "#fff",
      color: provided.color === "hsl(0, 0%, 100%)" ? "#222" : provided.color,
      cursor: "pointer",
      height: "28px",
      fontSize: "12px",
      lineHeigh: "20px",
      fontWeight: "400",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0",
      paddingLeft: "8px",
      paddingRight: "8px",
      borderRadius: "6px",
      "&:hover": {
        backgroundColor: "rgba(242, 241, 238, 0.6)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      width: "calc(100% + 10px)",
      left: "-5px",
      top: "-3px",
      zIndex: 9999,
      borderRadius: "6px",
      borderTopRightRadius: "0px",
      borderTopLeftRadius: "0px",
      // boxShadow: "rgba(55, 53, 47, 0.16) 0px -1px inset",
      padding: "4px",
      height: "auto",
      boxShadow:
        "rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      cursor: "pointer",
      marginRight: "20px",
      padding: "0",
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
    [
      "GET_OBJECT_LIST",
      debouncedValue,
      autoFiltersValue,
      value,
      page,
      field?.table_slug,
    ],
    () => {
      if (!field?.table_slug) return null;

      const requestData = {
        ...autoFiltersValue,
        additional_request: {
          additional_field: "guid",
        },
        view_fields: field?.view_fields?.map((f) => f.slug),
        search: debouncedValue.trim(),
        limit: 10,
        offset: pageToOffset(page, 10),
        with_relations: false,
      };

      if (value) {
        const additionalValues = [value];
        requestData.additional_request.additional_values =
          additionalValues?.flat();
      }

      return constructorObjectService.getListV2(
        field?.table_slug,
        {
          data: requestData,
        },
        {
          language_setting: i18n?.language,
        },
      );
    },
    {
      // enabled:
      //   (!field?.attributes?.function_path && Boolean(page > 1)) ||
      //   (!field?.attributes?.function_path && Boolean(debouncedValue)) ||
      //   newColumn,
      enabled: false,
      select: (res) => {
        const options = res?.data?.response ?? [];

        return {
          options,
          count: res?.data?.count,
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
        setCount(data?.count);
      },
    },
  );

  const computedOptions = useMemo(() => {
    const uniqueObjects = Array.from(
      new Set(allOptions?.map(JSON.stringify)),
    ).map(JSON.parse);

    if (field?.table_slug === "client_type") {
      return uniqueObjects?.filter(
        (item) => item?.table_slug === view?.table_slug,
      );
    }

    if (field?.attributes?.object_id_from_jwt && objectIdFromJWT) {
      return uniqueObjects?.filter((item) => {
        return item?.guid === objectIdFromJWT;
      });
    }

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
    if (count >= optionsFromLocale?.count) return;
    setPage((prevPage) => prevPage + 1);
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
                const { data } = props;
                dispatch(detailDrawerActions.openDrawer());
                dispatch(groupFieldActions.clearViewsPath());
                dispatch(groupFieldActions.clearViews());
                dispatch(
                  groupFieldActions.addView({
                    id: data?.table_id,
                    detailId: data?.guid,
                    is_relation_view: true,
                    table_slug: data?.table_slug,
                    label: field?.attributes?.[`label_${i18n?.language}`] || "",
                    relation_table_slug: data?.table_slug,
                  }),
                );
                dispatch(
                  groupFieldActions.addViewPath({
                    id: data?.table_id,
                    detailId: data?.guid,
                    is_relation_view: true,
                    table_slug: data?.table_slug,
                    label: field?.attributes?.[`label_${i18n?.language}`] || "",
                  }),
                );
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

  const openedItemValue = useMemo(() => {
    const query = new URLSearchParams(window.location.search);
    const itemId = query.get("p");

    const openedItemOption = allOptions?.find((item) => item?.guid === itemId);

    if (relationView && openedItemOption) {
      return [openedItemOption];
    } else {
      return null;
    }
  }, [relationView, allOptions]);

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
            <p className={styles.noOptionText}>
              Select an option or create one
            </p>
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
        className={styles.select}
        id="relation-lookup"
        inputValue={inputValue}
        onInputChange={(newInputValue, { action }) => {
          if (action !== "reset") {
            setInputValue(newInputValue);
            inputChangeHandler(newInputValue);
          }
        }}
        isDisabled={disabled}
        onMenuScrollToBottom={loadMoreItems}
        options={openedItemValue ?? computedOptions ?? []}
        value={localValue}
        menuPortalTarget={document.body}
        onMenuOpen={() => {
          refetch();
        }}
        isClearable={!openedItemValue}
        components={{
          SingleValue: CustomSingleValue,
          DropdownIndicator: null,
          ClearIndicator: null,
        }}
        onChange={(newValue) => {
          changeHandler(newValue);
        }}
        noOptionsMessage={() => (
          <span
            onClick={() => navigateToForm(tableSlug, "CREATE", {}, {}, menuId)}
            className={styles.noOptionText}
          >
            + Create one
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
                languages,
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
