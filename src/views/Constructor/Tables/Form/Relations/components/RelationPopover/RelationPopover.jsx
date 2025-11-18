import {Box, Popover} from "@mui/material";
import {useRelationPopoverProps} from "./useRelationPopoverProps";
import {AdvancedSettings} from "../../../components/AdvancedSettings";
import {RelationFieldParams} from "../RelationFieldParams";

export const RelationPopover = ({
  open,
  anchorEl,
  onClose,
  formType,
  relation,
  getRelationFields,
  closeSettingsBlock,
  submitCallback = () => {},
}) => {
  const {
    selectedSettings,
    handleSelectSetting,
    SETTING_TYPES,
    getSelectedSettings,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    register,
    submitHandler,
  } = useRelationPopoverProps({
    relation,
    formType,
    getRelationFields,
    closeSettingsBlock,
    submitCallback,
  });

  const innerClose = () => {
    onClose();
    reset();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={innerClose}
      anchorOrigin={{
        vertical: formType === "CREATE" ? "top" : "bottom",
        horizontal: formType === "CREATE" ? "right" : "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      PaperProps={{
        style: {
          overflowY: "visible",
          overflowX: "visible",
        },
      }}
    >
      <Box position="relative">
        <Box
          padding="12px 8px"
          minWidth="292px"
          maxWidth="350px"
          maxHeight="500px"
          overflow="auto"
        >
          {selectedSettings ? (
            <AdvancedSettings
              onClose={innerClose}
              onBackClick={() => handleSelectSetting(null)}
              title={selectedSettings}
            >
              {getSelectedSettings(selectedSettings)}
            </AdvancedSettings>
          ) : (
            <RelationFieldParams
              onClose={innerClose}
              handleSelectSetting={handleSelectSetting}
              SETTING_TYPES={SETTING_TYPES}
              formType={formType}
              control={control}
              reset={reset}
              watch={watch}
              setValue={setValue}
              register={register}
              handleSubmit={handleSubmit}
              submitHandler={submitHandler}
            />
          )}
        </Box>
      </Box>
    </Popover>
  );
};
