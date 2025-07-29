import { Box, Popover } from "@mui/material"
import { FieldParams } from "../FieldParams";
import { useFieldPopoverProps } from "./useFieldPopoverProps";
import { AdvancedSettings } from "../AdvancedSettings";

export const FieldPopover = ({ 
  open,
  anchorEl,
  onClose = () => {},
  mainForm,
  getRelationFields,
  slug,
  isTableView,
  selectedTabIndex,
  menuItem,
  formType,
  field,
  selectedField,
  popoverProps= {},
}) => {

  const {
    SETTING_TYPES,
    selectedSettings,
    handleSelectSetting,
    languages,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    register,
    tableName,
    getSelectedSettings,
    tableLan,
    onSubmit,
  } = useFieldPopoverProps({
    mainForm,
    onClose,
    getRelationFields,
    slug,
    isTableView,
    selectedTabIndex,
    menuItem,
    formType,
    selectedAutofillFieldSlug: selectedField?.slug,
    field,
  });

  return <Popover
    open={open}
    onClose={onClose}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    PaperProps={{
      style: {
        overflowY: "visible",
        overflowX: "visible",
      },
    }}
    {...popoverProps}
  >
    <Box padding="12px 8px" minWidth="292px" maxHeight="500px" overflow="auto">
      {
        selectedSettings 
          ? <AdvancedSettings
              title={selectedSettings}
              onClose={() => {
                onClose();
                handleSelectSetting("");
              }}
              onBackClick={() => handleSelectSetting("")}
            >
              {getSelectedSettings(selectedSettings)}
            </AdvancedSettings>
          : <FieldParams
              onClose={onClose}
              control={control}
              languages={languages}
              tableName={tableName}
              setValue={setValue}
              watch={watch}
              register={register}
              SETTING_TYPES={SETTING_TYPES}
              handleSelectSetting={handleSelectSetting}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              reset={reset}
              tableLan={tableLan}
              field={field}
              formType={formType}
              menuItem={menuItem}
              selectedAutofillFieldSlug={selectedField?.slug}
              tableSlug={slug}
            />
      }
    </Box>
  </Popover>
};
