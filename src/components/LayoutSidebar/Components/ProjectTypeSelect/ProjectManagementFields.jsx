import clsx from "clsx";
import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import HFCheckbox from "../../../FormElements/HFCheckbox";
import { store } from "../../../../store";
import { showAlert } from "../../../../store/alert/alert.thunk";

export const ProjectManagementFields = ({
  fields,
  control,
  watch,
  setMessages,
  handleSubmit,
  onSubmit,
}) => {
  return (
    <Box>
      <p className={cls.title}>Choose management system</p>
      <Box display="flex" flexDirection="column">
        {fields?.map((el, index) => (
          <HFCheckbox
            control={control}
            name={`management_system.${index}.is_checked`}
            value={`management_system.${index}.is_checked`}
            label={el.label}
            key={el.value}
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
          onClick={() => {
            if (watch("management_system")?.some((item) => item?.is_checked)) {
              setMessages([]);
              handleSubmit(onSubmit)();
            } else {
              store.dispatch(showAlert("You must choose at least one item."));
            }
          }}
          className={clsx(cls.save, cls.button)}
        >
          Send
        </button>
      </Box>
    </Box>
  );
};
