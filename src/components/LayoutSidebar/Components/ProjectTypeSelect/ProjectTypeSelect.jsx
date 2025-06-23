import HFSelect from "../../../FormElements/HFSelect";
import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useProjectTypeSelect } from "./useProjectTypeSelect";
import clsx from "clsx";

export const ProjectTypeSelect = ({
  handleSuccess = () => {},
  handleError = () => {},
  handleClose = () => {},
  appendMessage = () => {},
  setShowInput = () => {},
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
  } = useProjectTypeSelect({
    handleSuccess,
    handleError,
    handleClose,
    appendMessage,
    setShowInput,
  });

  return (
    <Box
      sx={{
        width: "600px",
        borderRadius: "10px",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
        {/* <h3 className={cls.title}>Select Project Type</h3> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
          }}
        >
          <HFSelect
            control={control}
            name="project_type"
            label="Project Type"
            options={projectTypeOptions}
            error={errors.type}
            helperText={errors.type?.message}
            onChange={() => {
              setValue("management_system", null);
            }}
            isClearable={false}
            displayEmpty={false}
            isSearchable
            autoFocus
          />
          <HFSelect
            control={control}
            name="management_system"
            label="Management System"
            options={getManagementOptions(watch("project_type")) || []}
            error={errors.type}
            helperText={errors.type?.message}
            isClearable={false}
            displayEmpty={false}
            isSearchable
          />
        </Box>
        <Box className={cls.buttonBox}>
          {/* <button type="button" className={cls.button} onClick={onCancel}>
            Cancel
          </button> */}
          <button
            type="submit"
            className={clsx(cls.save, cls.button)}
            disabled={!watch("project_type") || !watch("management_system")}
          >
            Send
          </button>
        </Box>
      </form>
    </Box>
  );
};
