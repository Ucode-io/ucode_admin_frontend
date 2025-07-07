import HFSelect from "../../../../FormElements/HFSelect";
import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useTablesProps } from "./useTablesProps";
import listToOptions from "@/utils/listToOptions";
import { ChatBox } from "../ChatBox";

export const Tables = ({ control, errors, disabled }) => {
  const { tables, handleOnChange } = useTablesProps();
  return (
    <ChatBox>
      <Box
        sx={{
          width: "100%",
          borderRadius: "10px",
          // overflow: "hidden",
          paddingTop: "10px",
          fontSize: "14px",
          // padding: "10px",
          // backgroundColor: "#F5F6FA",
        }}
      >
        <div className={cls.form}>
          <h3 className={cls.title}>Select table</h3>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "6px",
            }}
          >
            <HFSelect
              control={control}
              name="table"
              // label="Project Type"
              placeholder="Select table"
              options={listToOptions(tables?.tables, "label", "slug")}
              error={errors.type}
              helperText={errors.type?.message}
              isClearable={false}
              displayEmpty={false}
              isSearchable
              autoFocus
              disabled={disabled}
              fieldProps={{
                onChange: handleOnChange,
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
