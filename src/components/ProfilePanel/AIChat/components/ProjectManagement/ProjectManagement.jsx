import cls from "./styles.module.scss";
import { Box, Paper } from "@mui/material";
import HFCheckbox from "../../../../FormElements/HFCheckbox";
import { store } from "../../../../../store";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import clsx from "clsx";
import { motion } from "framer-motion";

export const ProjectManagement = ({
  fields,
  control,
  watch,
  setMessages,
  handleSubmit,
  onSubmit,
  disabled,
}) => {
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
            <p className={cls.title}>Choose management system</p>
            <Box display="flex" flexDirection="column">
              {fields?.map((el, index) => (
                <HFCheckbox
                  control={control}
                  name={`management_system.${index}.is_checked`}
                  value={`management_system.${index}.is_checked`}
                  label={el.label}
                  key={el.value}
                  disabled={disabled}
                  id={`management_system${index}`}
                  style={{
                    transform: "translateY(-1px)",
                    margin: "3px 3px 3px -1px",
                    padding: 0,
                  }}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <button
                type="button"
                disabled={
                  !watch("management_system")?.some((item) => item?.is_checked)
                }
                onClick={() => {
                  if (
                    watch("management_system")?.some((item) => item?.is_checked)
                  ) {
                    handleSubmit(onSubmit)();
                  } else {
                    store.dispatch(
                      showAlert("You must choose at least one item.")
                    );
                  }
                }}
                className={clsx(cls.save, cls.button)}
              >
                Send
              </button>
            </Box>
          </Box>
        </motion.div>
      </Paper>
    </Box>
  );
};
