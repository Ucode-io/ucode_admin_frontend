import { Controller } from "react-hook-form";
import { Box } from "@mui/material";
import Editor from "./Editor";

const EditorJs = ({
  name,
  control,
  defaultValue = "",
  required = false,
  form,
  isLoading,
  loadingFromTokenDoc,
}) => {
  return (
    <Box pr="40px" pl="60px" height={"100%"}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{ required }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Editor
            value={value}
            onChange={onChange}
            isLoading={isLoading}
            loadingFromTokenDoc={loadingFromTokenDoc}
          />
        )}
      />
    </Box>
  );
};

export default EditorJs;
