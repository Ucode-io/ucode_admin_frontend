import {Box, Button, CircularProgress} from "@mui/material";
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import request from "../../../../utils/request";
import {showAlert} from "../../../../store/alert/alert.thunk";

function HFButtonFieldEditor(props) {
  const {value, setValue, field, data} = props;
  const {tableSlug} = useParams();
  const dispatch = useDispatch();

  const [btnLoader, setBtnLoader] = useState(false);

  const invokeFunction = () => {
    const data = {
      function_id: field?.attributes?.function,
      object_data: data,
      table_slug: tableSlug,
    };

    setBtnLoader(true);
    request
      .post("/invoke_function", data, {
        params: {use_no_limit: event?.attributes?.use_no_limit},
      })
      .then((res) => {
        dispatch(showAlert("Success", "success"));
      })
      .finally(() => setBtnLoader(false));
  };
  console.log("fieldfield", field);
  return (
    <>
      <Box sx={{width: "100%", height: "100%", textAlign: "center"}}>
        <Button
          id="button_field"
          disabled={btnLoader}
          onClick={invokeFunction}
          variant="outlined">
          {btnLoader ? (
            <CircularProgress size={20} />
          ) : (
            <IconGenerator icon={field?.attributes?.icon} />
          )}
        </Button>
      </Box>
    </>
  );
}

export default HFButtonFieldEditor;
