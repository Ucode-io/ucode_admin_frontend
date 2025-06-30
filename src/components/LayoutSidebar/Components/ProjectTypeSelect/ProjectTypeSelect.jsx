import HFSelect from "../../../FormElements/HFSelect";
import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useProjectTypeSelect } from "./useProjectTypeSelect";
import clsx from "clsx";
import HFCheckbox from "../../../FormElements/HFCheckbox";

export const ProjectTypeSelect = ({
  handleSuccess = () => {},
  handleError = () => {},
  handleClose = () => {},
  appendMessage = () => {},
  setShowInput = () => {},
  handleChangeEntityType = () => {},
  setMessages = () => {},
}) => {
  const {
    control,
    errors,
    onSubmit,
    handleSubmit,
    projectTypeOptions,
    getManagementOptions,
    watch,
    setValue,
    fields,
    disabled,
    handleSelectProjectType,
    showConfirmButton,
  } = useProjectTypeSelect({
    handleSuccess,
    handleError,
    handleClose,
    appendMessage,
    setShowInput,
    handleChangeEntityType,
    setMessages,
  });

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        paddingTop: "10px",
      }}
    >
      <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
        {/* <h3 className={cls.title}>Select Project Type</h3> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "6px",
          }}
        >
          <HFSelect
            control={control}
            name="project_type"
            // label="Project Type"
            placeholder="Select project type"
            options={projectTypeOptions}
            error={errors.type}
            helperText={errors.type?.message}
            onChange={(value) => {
              setValue(
                "management_system",
                getManagementOptions(value)?.map((item) => ({
                  ...item,
                  is_checked: false,
                })) || []
              );
            }}
            isClearable={false}
            displayEmpty={false}
            isSearchable
            autoFocus
            disabled={disabled}
            fieldProps={{
              sx: {
                "& .MuiInputBase-root.Mui-disabled, & .MuiInputBase-root, & .MuiOutlinedInput-input":
                  {
                    backgroundColor: "#F5F6FA",
                    color: "#1B1B1B",
                    "-webkit-text-fill-color": "#1B1B1B",
                  },
              },
            }}
          />
          {/* <HFSelect
            control={control}
            name="management_system"
            label="Management System"
            options={getManagementOptions(watch("project_type")) || []}
            error={errors.type}
            helperText={errors.type?.message}
            isClearable={false}
            displayEmpty={false}
            isSearchable
          /> */}
        </Box>
        <Box className={cls.buttonBox}>
          {/* <button type="button" className={cls.button} onClick={onCancel}>
            Cancel
          </button> */}
          {!disabled && showConfirmButton && (
            <button
              type="button"
              className={clsx(cls.save, cls.button)}
              disabled={
                !watch("project_type")
                // !watch("management_system")?.some((item) => item?.is_checked)
              }
              onClick={handleSelectProjectType}
            >
              Confirm
            </button>
          )}
        </Box>
      </form>
    </Box>
  );
};
