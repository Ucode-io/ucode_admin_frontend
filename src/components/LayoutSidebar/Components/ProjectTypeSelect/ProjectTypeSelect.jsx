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
  } = useProjectTypeSelect({
    handleSuccess,
    handleError,
    handleClose,
    appendMessage,
    setShowInput,
    handleChangeEntityType,
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
            rowGap: "8px",
          }}
        >
          <HFSelect
            control={control}
            name="project_type"
            // label="Project Type"
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

          <Box display="flex" flexDirection="column">
            {fields?.map((el, index) => (
              <HFCheckbox
                control={control}
                name={`management_system.${index}.is_checked`}
                value={`management_system.${index}.is_checked`}
                label={el.label}
                key={el.value}
                disabled={disabled}
                style={{
                  transform: "translateY(-1px)",
                  margin: "3px 3px 3px -1px",
                  padding: 0,
                }}
              />
            ))}
          </Box>
        </Box>
        <Box className={cls.buttonBox}>
          {/* <button type="button" className={cls.button} onClick={onCancel}>
            Cancel
          </button> */}
          {!disabled && (
            <button
              type="submit"
              className={clsx(cls.save, cls.button)}
              disabled={
                !watch("project_type") ||
                !watch("management_system")?.some((item) => item?.is_checked)
              }
            >
              Confirm
            </button>
          )}
        </Box>
      </form>
    </Box>
  );
};
