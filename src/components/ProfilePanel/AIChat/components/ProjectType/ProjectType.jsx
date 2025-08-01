import HFSelect from "../../../../FormElements/HFSelect";
import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useProjectTypeProps } from "./useProjectTypeProps";
import { ChatBox } from "../ChatBox";

export const ProjectType = ({ control, errors, setValue = () => {}, disabled }) => {
  const { getManagementOptions, projectTypeOptions } = useProjectTypeProps();

  return (
    <ChatBox>
      <Box
        sx={{
          width: "100%",
          borderRadius: "10px",
          // paddingTop: "10px",
          // fontSize: "14px",
          // padding: "10px",
          // backgroundColor: "#F5F6FA",
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
    </ChatBox>
  );
};
