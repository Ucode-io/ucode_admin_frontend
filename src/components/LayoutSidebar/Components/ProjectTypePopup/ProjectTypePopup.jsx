import HFSelect from "../../../FormElements/HFSelect";
import cls from "./styles.module.scss";
import { Box, Menu } from "@mui/material";
import { useProjectTypePopupProps } from "./useProjectTypePopupProps";
import clsx from "clsx";

export const ProjectTypePopup = ({
  anchorEl,
  handleClose = () => {},
  handleSuccess = () => {},
  isLoading,
}) => {
  const {
    control,
    errors,
    onSubmit,
    onCancel,
    handleSubmit,
    projectTypeOptions,
    getManagementOptions,
    watch,
    setValue,
  } = useProjectTypePopupProps({ handleClose, handleSuccess });

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          padding: 0,
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 52,
            height: 32,
            ml: -0.5,
            mr: 1,
            bottom: 4,
          },
        },
      }}
      transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      anchorOrigin={{ horizontal: "left", vertical: "top" }}
    >
      <Box
        sx={{
          width: "600px",
          borderRadius: "10px",
          overflow: "hidden",
          padding: "20px",
        }}
      >
        <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
          <h3 className={cls.title}>Select Project Type</h3>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "40px",
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
            />
            {watch("project_type") && (
              <HFSelect
                control={control}
                name="management_system"
                label="Management System"
                options={getManagementOptions(watch("project_type"))}
                error={errors.type}
                helperText={errors.type?.message}
                isClearable={false}
              />
            )}
          </Box>
          <Box className={cls.buttonBox}>
            <button type="button" className={cls.button} onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className={clsx(cls.save, cls.button)}
              disabled={
                !watch("project_type") ||
                !watch("management_system") ||
                isLoading
              }
            >
              Save
            </button>
          </Box>
        </form>
      </Box>
    </Menu>
  );
};
