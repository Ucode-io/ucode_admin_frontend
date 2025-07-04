import clsx from "clsx";
import HFSelect from "../../../../FormElements/HFSelect";
import cls from "./styles.module.scss";
import { Box, Paper } from "@mui/material";
import { useProjectTypeProps } from "./useProjectTypeProps";

export const ProjectType = ({
  control,
  errors,
  setValue = () => {},
  watch = () => {},
  handleSelectProjectType = () => {},
  disabled,
}) => {
  const { getManagementOptions, projectTypeOptions } = useProjectTypeProps();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "10px",
        justifyContent: "flex-start",
      }}
    >
      <img width={24} height={24} src="/img/chat.png" alt="" />
      <Paper
        sx={{
          backgroundColor: "#fff",
          alignSelf: "flex-start",
          maxWidth: "80%",
          color: "#000",
          wordBreak: "break-all",
          borderRadius: "20px",
          padding: "10px 15px 10px 10px",
          minHeight: "40px",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            paddingTop: "10px",
            fontSize: "14px",
            padding: "10px",
            backgroundColor: "#F5F6FA",
          }}
        >
          <div className={cls.form}>
            <h3 className={cls.title}>Select Project Type</h3>
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
            </Box>
            {/* {!disabled && (
              <Box className={cls.buttonBox}>
                <button
                  type="button"
                  className={clsx(cls.save, cls.button)}
                  disabled={!watch("project_type")}
                  onClick={handleSelectProjectType}
                >
                  Confirm
                </button>
              </Box>
            )} */}
          </div>
        </Box>
      </Paper>
    </Box>
  );
};
