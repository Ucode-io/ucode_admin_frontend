import AddIcon from "@mui/icons-material/Add";
import { Popover, Typography } from "@mui/material";
import Select from "react-select";
import {
  getRelationFieldTabsLabel,
  getRelationFieldTabsLabelLang,
} from "@/utils/getRelationFieldLabel";

import ModalDetailPage from "@/views/Objects/ModalDetailPage/ModalDetailPage";
import styles from "./styles.module.scss";
import { useAutoCompleteElementProps } from "./useAutoCompleteElementProps";

export const AutoCompleteElement = ({
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
  newColumn,
}) => {
  const {
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
    menuId,
  } = useAutoCompleteElementProps({
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
  });

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
        }}
        onChange={(newValue) => {
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
