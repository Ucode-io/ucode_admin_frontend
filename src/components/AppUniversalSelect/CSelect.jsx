import React, { useMemo, useEffect, useState } from "react";
import Select, { components } from "react-select";
import { Controller, useWatch, useForm } from "react-hook-form";
import { Box, ListSubheader, Dialog, Popover } from "@mui/material";
import { useTranslation } from "react-i18next";
import { get } from "@ngard/tiny-get";
import { useSelectLogic } from "./useSelectLogic";
import LaunchIcon from "@mui/icons-material/Launch";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RippleLoader from "@/components/Loaders/RippleLoader";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import HFColorPicker from "@/components/FormElementsOptimization/HFColorPicker";
import HFIconPicker from "@/components/FormElementsOptimization/HFIconPicker";
import HFTextField from "@/components/FormElementsOptimization/HFTextField";
import FRow from "@/components/FormElementsOptimization/FRow";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import IconGeneratorIconjs from "@/components/IconPicker/IconGeneratorIconjs";
import constructorFieldService from "@/services/constructorFieldService";
import { generateGUID } from "@/utils/generateID";
import useTabRouter from "@/hooks/useTabRouter";
import { useDispatch } from "react-redux";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import ModalDetailPage from "@/views/Objects/ModalDetailPage/ModalDetailPage";

// --- Custom Components ---

const StatusMenuList = (props) => {
  const { i18n } = useTranslation();
  const type = props?.type;
  const field = props?.field;

  if (type !== "status" && type !== "STATUS")
    return <components.MenuList {...props} />;

  const groups = [
    { label: "To do", options: field?.attributes?.todo?.options || [] },
    {
      label: "In Progress",
      options: field?.attributes?.progress?.options || [],
    },
    { label: "Complete", options: field?.attributes?.complete?.options || [] },
  ];

  return (
    <components.MenuList {...props}>
      {groups.map(
        (group, index) =>
          group.options?.length > 0 && (
            <React.Fragment key={group.label}>
              <ListSubheader
                disableSticky
                sx={{
                  fontSize: "12px",
                  fontWeight: "400",
                  height: "30px",
                  lineHeight: "30px",
                  display: "flex",
                  alignItems: "center",
                  borderTop: index > 1 ? "1px solid #eee" : "none",
                  bgcolor: "transparent",
                  color: "#000",
                  // paddingLeft: '16px'
                }}
              >
                {group.label}
              </ListSubheader>
              {group.options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    props.setValue(opt, "set-value");
                  }}
                  style={{
                    fontSize: "12.8px",
                    fontWeight: "500",
                    borderRadius: "4px",
                    cursor: "pointer",
                    margin: "0 0 6px 15px",
                    width: "fit-content",
                    textAlign: "center",
                    backgroundColor: `${opt.color}30`,
                    color: opt.color || "#000",
                    padding: "6px 12px",
                  }}
                >
                  {opt[`label_${i18n.language}`] || opt.label}
                </div>
              ))}
            </React.Fragment>
          ),
      )}
    </components.MenuList>
  );
};

const AddOptionBlock = ({ field, dialogState, handleClose, addNewOption }) => {
  const hasColor = field.attributes?.has_color;
  const hasIcon = field.attributes?.has_icon;
  const [loader, setLoader] = useState(false);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      label: dialogState,
      value: dialogState,
      id: generateGUID(),
    },
  });

  const onSubmit = (newOption) => {
    setLoader(true);
    const data = {
      ...field,
      attributes: {
        ...field?.attributes,
        options: [...(field.attributes.options || []), newOption],
      },
    };

    constructorFieldService
      .update({ ...data })
      .then(() => {
        handleClose();
        addNewOption(newOption);
      })
      .catch((err) => {
        console.error("Error creating option", err);
        setLoader(false);
      });
  };

  return (
    <div style={{ padding: "20px", width: "400px" }}>
      <h2
        style={{ marginBottom: "15px", fontSize: "16px", fontWeight: "bold" }}
      >
        Add option
      </h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <div>
          {hasColor && (
            <HFColorPicker
              control={control}
              name="color"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          )}
          {hasColor && (
            <h4 style={{ fontSize: "12px", marginTop: "5px" }}>Color</h4>
          )}
        </div>
        <div>
          {hasIcon && (
            <HFIconPicker shape="rectangle" control={control} name="icon" />
          )}
          {hasIcon && (
            <h4 style={{ fontSize: "12px", marginTop: "5px" }}>Icon</h4>
          )}
        </div>
      </div>
      <form>
        <div style={{ marginBottom: "10px" }}>
          <FRow label="Label">
            <HFTextField
              defaultValue=""
              control={control}
              name="label"
              fullWidth
            />
          </FRow>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <FRow label="Value">
            <HFTextField
              defaultValue=""
              control={control}
              name="value"
              fullWidth
            />
          </FRow>
        </div>
      </form>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <PrimaryButton onClick={handleSubmit(onSubmit)}>
          Add
          {loader ? (
            <span style={{ marginLeft: "5px" }}>
              <RippleLoader size="btn_size" height="20px" />
            </span>
          ) : (
            <AddIcon style={{ marginLeft: "5px", fontSize: "18px" }} />
          )}
        </PrimaryButton>
      </div>
    </div>
  );
};

// --- Main Base Component ---

const CSelectBase = ({
  value,
  onChange,
  field,
  row,
  variant = "standard",
  isMulti = false,
  disabled = false,
  placeholder = "",
  onClose = () => {},
  defaultOpen = false,
  setFormValue,
  autoFiltersValue = {},
  name,
  updateObject = () => {},
  menuPortalTarget,
  autoFocus,
  rowData,
  ...props
}) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { navigateToForm } = useTabRouter();

  const currentField = field || row;
  const isMultiselectType =
    currentField?.type === "multiselect" ||
    currentField?.type === "MULTISELECT" ||
    currentField?.attributes?.is_multiselect;
  const isStatusType =
    currentField?.type === "status" || currentField?.type === "STATUS";

  // Use hook logic
  const { options, isFetching, handleSearch, loadMoreItems, refetch } =
    useSelectLogic({
      field: currentField,
      type: isMultiselectType
        ? "multiselect"
        : isStatusType
          ? "status"
          : "relation",
      value,
      autoFiltersValue,
      rowData,
      row,
    });

  const [dialogState, setDialogState] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // For relation creation
  const [modalTableSlug, setModalTableSlug] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Derive final selected value object(s)
  const selectValue = useMemo(() => {
    if ((isMulti || isMultiselectType) && !value) return [];
    if (!value) return null;

    const allOptions = options || [];

    const findOption = (val) => {
      if (typeof val === "object" && val !== null) return val;
      return allOptions.find((option) => {
        if (option.slug === val) return true;
        if (option.value === val) return true;
        if (option.label === val) return true;
        if (option.guid === val) return true;
        if (option.id === val) return true;
        return false;
      });
    };

    if (isMulti || isMultiselectType) {
      const valArray = Array.isArray(value) ? value : [value];
      return valArray
        .map((v) => findOption(v) || { label: v, value: v })
        .filter(Boolean);
    }

    // For single select
    return findOption(value) || null;
  }, [value, options, isMulti, isMultiselectType]);

  // Autofill logic
  useEffect(() => {
    if (!value || !currentField?.attributes?.autofill || !setFormValue) return;
    const selectedId = Array.isArray(value) ? value[0] : value;
    // Find option if value is just ID
    const selectedObj =
      typeof selectedId === "object"
        ? selectedId
        : options.find(
            (o) =>
              o.guid === selectedId ||
              o.value === selectedId ||
              o.slug === selectedId,
          );

    if (selectedObj) {
      currentField.attributes.autofill.forEach(
        ({ field_from, field_to, automatic }) => {
          const path = name?.includes(".")
            ? `${name.split(".").slice(0, -1).join(".")}.${field_to}`
            : field_to;
          if (automatic) {
            setTimeout(() => {
              setFormValue(path, get(selectedObj, field_from));
            }, 1);
          } else {
            setFormValue(path, get(selectedObj, field_from));
          }
        },
      );
    }
  }, [value, currentField, setFormValue, name]);

  // Styles
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: variant === "table" ? "26px" : "35px",
      height: variant === "table" ? "100%" : "34px",
      border: "none",
      backgroundColor: variant === "table" ? "transparent" : "#fff",
      boxShadow: "none",
      fontSize: "13px",
      borderRadius: variant === "table" ? 0 : "4px",
      padding: 0,
      "&:hover": {
        border: "none",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
      height: "100%",
      display: "flex",
      alignItems: "center",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      height: "100%",
      color: "#000",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      paddingLeft: "6px",
      paddingRight: "6px",
      ...(variant === "table"
        ? {
            width: "calc(100% + 16px)", // Account for approximate cell padding
            minWidth: "calc(100% + 16px)",
            left: "-11px",
            marginTop: "3px",
            borderRadius: "0 0 6px 6px",
            boxShadow:
              "rgba(0, 0, 0, 0.1) 0px 14px 28px -6px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px, rgba(84, 72, 49, 0.08) 0px 0px 0px 1px",
            borderTop: "none",
          }
        : {}),
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    clearIndicator: (base) => ({
      ...base,
      cursor: "pointer",
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      zIndex: 1,
      ...(variant === "table"
        ? {
            position: "absolute",
            right: "30px",
            padding: "2px 4px",
            top: "50%",
            transform: "translateY(-50%)",
          }
        : {}),
    }),
    option: (base, state) => {
      const color = state.data?.color;
      let bg = state.isSelected ? "#F2F1EE" : "#fff";
      let fg = "#222";

      const isBadgeType = isStatusType || isMultiselectType;

      if (color && !isBadgeType) {
        bg = state.isSelected ? color : `${color}15`;
        fg = state.isSelected ? "#fff" : color;
      }

      // For badge types, we want the row neutral, so the inner badge stands out
      if (isBadgeType) {
        bg = state.isSelected ? "#f5f5f5" : "#fff";
      }

      return {
        ...base,
        borderRadius: "6px",
        padding: "4px 8px",
        background: bg,
        color: fg,
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "400",
        "&:hover": {
          backgroundColor:
            color && !isBadgeType ? color : "rgba(242, 241, 238, 0.6)",
          color: color && !isBadgeType ? "#fff" : "#222",
        },
      };
    },
    singleValue: (base, state) => {
      const color = state.data?.color;
      if ((isStatusType || isMultiselectType) && color) {
        return {
          ...base,
          margin: 0,
          padding: 0,
          display: "flex",
          maxWidth: "100%",
          width: "fit-content",
        };
      }
      return base;
    },
  };

  // Custom Components for Select
  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        {(isStatusType || isMultiselectType) && props.data?.color ? (
          <span
            style={{
              background: `${props.data.color}30`,
              color: props.data.color,
              borderRadius: "4px",
              padding: "2px 8px",
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {currentField?.attributes?.has_icon && props.data.icon && (
              <span style={{ marginRight: "6px", display: "flex" }}>
                {props.data.icon?.includes(":") ? (
                  <IconGeneratorIconjs icon={props.data.icon} size={14} />
                ) : (
                  <IconGenerator icon={props.data.icon} size={14} />
                )}
              </span>
            )}
            {props.children}
          </span>
        ) : (
          <span
            style={{
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props.children}
          </span>
        )}
        {!disabled && !isStatusType && !isMultiselectType && (
          <Box
            sx={{
              marginLeft: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              const itemData = props.data;
              dispatch(detailDrawerActions.openDrawer());
              dispatch(groupFieldActions.clearViewsPath());
              dispatch(groupFieldActions.clearViews());
              dispatch(
                groupFieldActions.addView({
                  id: itemData?.table_id,
                  detailId: itemData?.guid,
                  is_relation_view: true,
                  table_slug: itemData?.table_slug,
                  label:
                    currentField?.attributes?.[`label_${i18n?.language}`] || "",
                  relation_table_slug: itemData?.table_slug,
                }),
              );
              updateQueryWithoutRerender("p", itemData?.guid);
              updateQueryWithoutRerender(
                "field_slug",
                currentField?.table_slug,
              );
            }}
          >
            <LaunchIcon style={{ fontSize: "16px", color: "#666" }} />
          </Box>
        )}
      </div>
    </components.SingleValue>
  );

  const CustomMultiValue = (props) => {
    if (isMultiselectType) {
      const hasColor = row?.attributes?.has_color;
      const { data } = props;

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: hasColor && data.color ? `${data.color}30` : "#e0e0e0",
            color: (hasColor && data.color) || "#000",
            borderRadius: "4px",
            padding: "2px 6px",
            margin: "1px 2px",
            fontSize: "12px",
            maxWidth: "90%",
          }}
        >
          {currentField.attributes?.has_icon && (
            <span style={{ marginRight: "4px", display: "flex" }}>
              {data.icon?.includes(":") ? (
                <IconGeneratorIconjs icon={data.icon} size={14} />
              ) : (
                <IconGenerator icon={data.icon} size={14} />
              )}
            </span>
          )}
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props.children}
          </span>
          {!disabled && (
            <CloseIcon
              style={{ fontSize: "14px", marginLeft: "4px", cursor: "pointer" }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.removeProps.onClick(e);
              }}
            />
          )}
        </div>
      );
    }
    // Default multi value for relation
    return (
      <components.MultiValue {...props}>{props.children}</components.MultiValue>
    );
  };

  // Handle create new option or open modal
  const handleCreateOption = (inputValue) => {
    if (currentField?.attributes?.creatable) {
      if (isMultiselectType) {
        setDialogState(inputValue);
      } else if (!isStatusType) {
        // Relation
        const slug =
          currentField?.table_slug || currentField?.id?.split("#")?.[0];
        setModalTableSlug(slug);
        setModalOpen(true);
      }
    }
  };

  const handleOpenModal = () => {
    const slug = currentField?.table_slug || currentField?.id?.split("#")?.[0];
    setModalTableSlug(slug);
    setModalOpen(true);
  };

  // Custom Option Component to render badge inside the option row
  const CustomOption = (props) => {
    const { data } = props;
    const color = data.color;
    // We already check isStatusType in StatusMenuList, so this is mainly for Multiselect or if we switched Status back to standard.
    // Multiselect options come here.

    if (color && (isStatusType || isMultiselectType)) {
      return (
        <components.Option {...props}>
          <div
            style={{
              backgroundColor: `${color}30`,
              color: color,
              borderRadius: "4px",
              padding: "2px 8px",
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {currentField?.attributes?.has_icon && data.icon && (
              <span style={{ marginRight: "6px", display: "flex" }}>
                {data.icon?.includes(":") ? (
                  <IconGeneratorIconjs icon={data.icon} size={14} />
                ) : (
                  <IconGenerator icon={data.icon} size={14} />
                )}
              </span>
            )}
            {props.label}
          </div>
        </components.Option>
      );
    }
    return <components.Option {...props} />;
  };

  return (
    <>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        {/* Plus icon for Relation creation if outside Select (like in CellRelationFormElementNew) */}
        {currentField?.attributes?.creatable &&
          !isMultiselectType &&
          !isStatusType &&
          !value &&
          variant !== "table" && (
            <span
              onClick={handleOpenModal}
              style={{
                color: "#007AFF",
                cursor: "pointer",
                fontWeight: 500,
                position: "absolute",
                right: "-25px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <AddIcon
                aria-owns={openPopover ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                style={{ fontSize: 20 }}
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
                <p style={{ padding: "5px 10px", fontSize: "12px" }}>
                  Select an option or create one
                </p>
              </Popover>
            </span>
          )}

        <div style={{ width: "100%" }}>
          <Select
            {...props}
            autoFocus={autoFocus || variant === "table" || defaultOpen}
            options={options}
            value={selectValue}
            isMulti={isMulti || isMultiselectType}
            isDisabled={disabled}
            isLoading={isFetching}
            placeholder={placeholder || (isMultiselectType ? "" : "Select...")}
            defaultMenuIsOpen={defaultOpen}
            menuPortalTarget={menuPortalTarget || document.body}
            maxMenuHeight={200}
            styles={customStyles}
            onMenuClose={onClose}
            onMenuOpen={() => {
              refetch();
            }}
            onInputChange={(val, { action }) => {
              if (action !== "input-blur" && action !== "menu-close") {
                handleSearch(val);
              }
            }}
            menuShouldScrollIntoView={true}
            blurInputOnSelect={false}
            closeMenuOnSelect={!isMulti && !isMultiselectType}
            isClearable={true}
            filterOption={null}
            captureMenuScroll={true}
            onMenuScrollToBottom={() => {
              if (isStatusType || isMultiselectType) return;
              loadMoreItems();
            }}
            getOptionLabel={(opt) => {
              if (currentField?.attributes?.enable_multi_language) {
                return (
                  opt[`label_${i18n.language}`] ||
                  opt[`name_${i18n.language}`] ||
                  opt.label ||
                  opt.name ||
                  opt.value ||
                  ""
                );
              }
              return (
                opt[`label_${i18n.language}`] ||
                opt.label ||
                opt.name ||
                opt.value ||
                ""
              );
            }}
            getOptionValue={(opt) =>
              opt.guid || opt.value || opt.slug || opt.id
            }
            onChange={(newValue) => {
              if (isMulti || isMultiselectType) {
                const val = newValue?.map((n) => n.guid || n.slug || n.value);
                const last = newValue[newValue.length - 1];
                if (last && (last.value === "NEW" || last.__isNew__)) {
                  handleCreateOption(last.inputValue);
                  return;
                }
                onChange(val, newValue);
              } else {
                const val = newValue
                  ? newValue.guid || newValue.slug || newValue.value
                  : null;
                onChange(val, newValue);
              }
              if (updateObject) updateObject();
            }}
            components={{
              ...(isStatusType
                ? {
                    MenuList: (menuListProps) => (
                      <StatusMenuList
                        {...menuListProps}
                        type={currentField?.type}
                        field={currentField}
                      />
                    ),
                  }
                : {}),
              Option: CustomOption,
              SingleValue: CustomSingleValue,
              MultiValue: CustomMultiValue,
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
              ClearIndicator: (props) => {
                const { clearValue, innerProps, getStyles } = props;
                const baseStyle =
                  typeof getStyles === "function"
                    ? getStyles("clearIndicator", props)
                    : {};
                return (
                  <div
                    {...innerProps}
                    style={{
                      ...baseStyle,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearValue();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearValue();
                    }}
                  >
                    <CloseIcon style={{ fontSize: "14px" }} />
                  </div>
                );
              },
            }}
            noOptionsMessage={({ inputValue }) => {
              if (currentField?.attributes?.creatable) {
                if (isMultiselectType && inputValue) {
                  return (
                    <div
                      style={{ cursor: "pointer", color: "#007AFF" }}
                      onClick={() => handleCreateOption(inputValue)}
                    >
                      <AddIcon
                        style={{ fontSize: 16, verticalAlign: "middle" }}
                      />{" "}
                      Create {inputValue}
                    </div>
                  );
                }
                if (!isMultiselectType && !isStatusType) {
                  // Relation create link
                  return (
                    <div
                      style={{ cursor: "pointer", color: "#007AFF" }}
                      onClick={() => {
                        navigateToForm(
                          currentField?.table_slug,
                          "CREATE",
                          {},
                          {},
                          null,
                        );
                      }}
                    >
                      <AddIcon
                        style={{ fontSize: 16, verticalAlign: "middle" }}
                      />{" "}
                      Create {inputValue ? `"${inputValue}"` : "new"}
                    </div>
                  );
                }
              }
              return "No options";
            }}
          />
        </div>
      </div>

      {/* Create Option Dialog (Multiselect) */}
      <Dialog open={!!dialogState} onClose={() => setDialogState(null)}>
        <AddOptionBlock
          field={currentField}
          dialogState={dialogState}
          handleClose={() => setDialogState(null)}
          addNewOption={() => {}}
        />
      </Dialog>

      {/* Create Relation Modal */}
      {modalTableSlug && (
        <ModalDetailPage
          open={modalOpen}
          setOpen={setModalOpen}
          tableSlug={modalTableSlug}
          handleClose={() => {
            setModalOpen(false);
            setModalTableSlug(null);
          }}
        />
      )}
    </>
  );
};

// --- Controlled Wrapper ---

const CSelectControlled = ({
  control,
  name,
  rules,
  row,
  field,
  handleChange,
  ...props
}) => {
  const currentField = field || row;
  const autoFilters = currentField?.attributes?.auto_filters;

  // Watch all possible filter fields
  const watchedFilters = useWatch({
    control,
    name: autoFilters ? autoFilters.map((f) => f.field_from) : [],
  });

  const autoFiltersValue = useMemo(() => {
    if (!autoFilters) return {};
    return autoFilters.reduce((acc, filter, index) => {
      acc[filter.field_to] = watchedFilters[index];
      return acc;
    }, {});
  }, [watchedFilters, autoFilters]);

  // Merge autoFiltersValue from props with calculated one
  const combinedAutoFilters = {
    ...props.autoFiltersValue,
    ...autoFiltersValue,
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <CSelectBase
            {...props}
            name={name}
            row={row}
            field={currentField}
            value={value}
            autoFiltersValue={combinedAutoFilters}
            onChange={(val) => {
              onChange(val);
              handleChange?.({
                name: row?.slug || name,
                value: val,
                rowId: row?.guid,
              });
            }}
          />
          {error && (
            <p style={{ color: "red", fontSize: "11px", margin: "2px 0 0 0" }}>
              {error.message}
            </p>
          )}
        </>
      )}
    />
  );
};

// --- Exported Component ---

const CSelect = ({
  control,
  name,
  row,
  field,
  handleOnClose,
  onClose,
  defaultMenuIsOpen,
  defaultOpen,
  handleChange,
  ...props
}) => {
  const finalOnClose = onClose || handleOnClose;
  const finalDefaultOpen = defaultOpen || defaultMenuIsOpen;

  if (control && name) {
    return (
      <CSelectControlled
        control={control}
        name={name}
        row={row}
        field={field}
        onClose={finalOnClose}
        defaultOpen={finalDefaultOpen}
        handleChange={handleChange}
        {...props}
      />
    );
  }

  return (
    <CSelectBase
      row={row}
      field={field}
      onClose={finalOnClose}
      defaultOpen={finalDefaultOpen}
      handleChange={handleChange}
      value={props.value ?? row?.value}
      onChange={(val) => {
        handleChange?.({
          name: row?.slug || name,
          value: val,
          rowId: row?.guid,
        });
      }}
      {...props}
    />
  );
};

export default CSelect;
