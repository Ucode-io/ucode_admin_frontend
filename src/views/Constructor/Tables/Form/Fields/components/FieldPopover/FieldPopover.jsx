import { Box, Popover } from "@mui/material"
import { FieldParams } from "../FieldParams";
import { useFieldPopoverProps } from "./useFieldPopoverProps";
import { AdvancedSettings } from "../../../components/AdvancedSettings";
import { NButton } from "../../../../../../../components/NButton";

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
  submitCallback = () => {},
  handleUpdateField = () => {},
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
    isFormulaType,
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
    submitCallback,
  });
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: formType === "CREATE" ? "top" : "bottom",
        // horizontal: formType === "CREATE" ? "right" : "left",
        horizontal: "right",
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
    >
      <Box position="relative">
        <Box minWidth="292px" maxHeight="500px" overflow="auto">
          {selectedSettings ? (
            <AdvancedSettings
              title={selectedSettings}
              showBackBtn={!isFormulaType}
              showCloseBtn={!isFormulaType}
              onClose={() => {
                onClose();
                handleSelectSetting("");
              }}
              onBackClick={() => handleSelectSetting("")}
              addonAfter={
                isFormulaType ? (
                  <NButton
                    primary
                    onClick={() => {
                      handleSelectSetting("");
                    }}
                  >
                    Done
                  </NButton>
                ) : null
              }
            >
              {getSelectedSettings(selectedSettings)}
            </AdvancedSettings>
          ) : (
            <Box>
              <FieldParams
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
                handleUpdateField={handleUpdateField}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Popover>
  );
};
