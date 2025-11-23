import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {useQueryClient} from "react-query";
import {InputAdornment, TextField, Tooltip} from "@mui/material";

import {showAlert} from "../../store/alert/alert.thunk";
import constructorFunctionService from "../../services/constructorFunctionService";
import {Lock} from "@mui/icons-material";

const InventoryBarCode = ({
  name = "",
  fullWidth = false,
  disabled = false,
  handleChange = () => {},
  row,
  ...props
}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const value = row?.value;

  const { id } = useParams();
  const [elmValue, setElmValue] = useState("");
  const time = useRef();

  const barcode = row?.value;

  const sendRequestOpenFaas = () => {
    const params = {
      form_input: true,
    };
    constructorFunctionService
      .invoke(
        {
          function_id: row?.attributes?.function,
          object_ids: [id, elmValue],
          attributes: {
            barcode: elmValue.length > 0 ? elmValue : barcode,
          },
        },
        params,
      )
      .then(() => {
        dispatch(showAlert("Успешно!", "success"));

        // navigate("/reloadRelations", {
        //   state: {
        //     redirectUrl: window.location.pathname
        //   },
        // });
      })
      .finally(() => {
        // setFormValue(name, "");
        // setElmValue("");
        queryClient.refetchQueries(["GET_OBJECT_LIST"]);
      });
  };

  // useDebouncedWatch(
  //   () => {
  //     if (elmValue.length >= field.attributes?.length && !field.attributes?.pressEnter && field.attributes?.automatic) {
  //       sendRequestOpenFaas();
  //     }
  //   },
  //   [elmValue],
  //   300
  // );

  useEffect(() => {
    if (
      elmValue.length >= row?.attributes?.length &&
      !row?.attributes?.pressEnter &&
      row?.attributes?.automatic
    ) {
      sendRequestOpenFaas();
    }
  }, [elmValue]);

  const keyPress = (e) => {
    if (e.keyCode == 13) {
      if (row?.attributes?.pressEnter) {
        sendRequestOpenFaas();
      }
    }
  };

  const onChange = (e) => {
    setElmValue(e.target.value);
  };

  const onBlur = (e) => {
    const currentTime = new Date().getTime();
    if (currentTime - time.current > 50 && !row?.attributes?.automatic) {
      handleChange({
        value: e.target.value.substring(value.length, e.target.value.length),
        name: row?.slug,
        rowId: row?.guid,
      });
    } else {
      onChange({
        value: e.target.value,
        name: row?.slug,
        rowId: row?.guid,
      });
    }
    time.current = currentTime;
  };

  return (
    <>
      <TextField
        id="barcode"
        size="small"
        value={elmValue}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={(e) => keyPress(e)}
        name={name}
        sx={{ padding: 0 }}
        fullWidth={fullWidth}
        InputProps={{
          readOnly: disabled,
          style: disabled
            ? {
                background: "#c0c0c039",
                paddingRight: "0px",
              }
            : {
                background: "inherit",
                color: "#000",
                height: "25px",
                padding: 0,
              },

          endAdornment: disabled && (
            <Tooltip title="This field is disabled for this role!">
              <InputAdornment position="start">
                <Lock style={{ fontSize: "20px" }} />
              </InputAdornment>
            </Tooltip>
          ),
        }}
        className="custom_textfield"
        // helperText={!disabledHelperText && error?.message}
        {...props}
      />
    </>
  );
};

export default InventoryBarCode;
