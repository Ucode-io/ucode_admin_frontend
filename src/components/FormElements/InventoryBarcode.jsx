import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { TextField } from "@mui/material";

import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import request from "../../utils/request";
import { showAlert } from "../../store/alert/alert.thunk";

const InventoryBarCode = ({
  control,
  watch,
  name = "",
  tableSlug,
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  field,
  setFormValue,
  ...props
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { id } = useParams();
  const [elmValue, setElmValue] = useState("");
  const time = useRef();

  useDebouncedWatch(
    () => {
      if (elmValue.length > field.attributes?.length) {
        request
          .get(`/${field.attributes?.request_url}/${tableSlug}/${id}`, {
            params: { barcode: elmValue, branch_id: watch("branch_table_id") },
          })
          .then((res) => {
            if (res === "Updated successfully!") {
              dispatch(showAlert("Успешно обновлено!", "success"));
            }
          })
          .finally(() => {
            setFormValue(name, "");
            setElmValue("");
            queryClient.refetchQueries(["GET_OBJECT_LIST", tableSlug]);
          });
      }
    },
    [elmValue],
    300
  );

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextField
            size="medium"
            value={value}
            onChange={(e) => {
              const currentTime = new Date().getTime();

              if (
                currentTime - time.current > 50 &&
                !field.attributes?.automatic
              )
                onChange(
                  e.target.value.substring(value.length, e.target.value.length)
                );
              else {
                onChange(e.target.value);
              }
              setElmValue(e.target.value);
              time.current = currentTime;
            }}
            name={name}
            error={error}
            fullWidth={fullWidth}
            InputProps={{
              readOnly: disabled,
              style: disabled
                ? {
                    background: "#c0c0c039",
                  }
                : {},
            }}
            helperText={!disabledHelperText && error?.message}
            {...props}
          />
        </>
      )}
    />
  );
};

export default InventoryBarCode;
