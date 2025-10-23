import LaunchIcon from "@mui/icons-material/Launch";
import { Box } from "@mui/material";
import { get } from "@ngard/tiny-get";
import React, { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { components } from "react-select";
import useDebounce from "@/hooks/useDebounce";
import useTabRouter from "@/hooks/useTabRouter";
import constructorObjectService from "@/services/constructorObjectService";
import { pageToOffset } from "@/utils/pageToOffset";
import { useDispatch, useSelector } from "react-redux";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { useViewContext } from "@/providers/ViewProvider";

export const useAutoCompleteElementProps = ({
  relOptions,
  value,
  name,
  isBlackBg,
  setValue,
  index,
  control,
  setFormValue,
  row,
  newUi,
  objectIdFromJWT,
  relationView,
  newColumn,
  field,
  disabled,
}) => {
  const { view, tableSlug } = useViewContext();
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
      enabled:
        (!field?.attributes?.function_path && Boolean(page > 1)) ||
        (!field?.attributes?.function_path && Boolean(debouncedValue)) ||
        newColumn,
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

  return {
    openFormModal,
    handlePopoverOpen,
    openPopover,
    anchorEl,
    handlePopoverClose,
    tableSlugFromProps,
    inputValue,
    setInputValue,
    inputChangeHandler,
    loadMoreItems,
    computedOptions,
    localValue,
    refetch,
    openedItemValue,
    CustomSingleValue,
    changeHandler,
    navigateToForm,
    customStyles,
    i18n,
    languages,
    setOpen,
    open,
    menuId,
  };
};
