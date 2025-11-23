import {Box, Button, CircularProgress} from "@mui/material";
import React, {useState} from "react";
import IconGenerator from "../IconPicker/IconGenerator";
import request from "../../utils/request";
import { useParams } from "react-router-dom";
import {useDispatch} from "react-redux";
import {showAlert} from "../../store/alert/alert.thunk";
import IconGeneratorIconjs from "../IconPicker/IconGeneratorIconjs";

function HFButtonField({ row, isTableView = false, getValues = () => {} }) {
  const { tableSlug } = useParams();
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState(false);

  const invokeFunction = () => {
    const data = {
      function_id: row?.attributes?.function,
      object_data: row?.guid ? row : getValues(),
      table_slug: tableSlug,
    };

    setBtnLoader(true);
    request
      .post("/invoke_function", data, {
        params: { use_no_limit: event?.attributes?.use_no_limit },
      })
      .then(() => {
        dispatch(showAlert("Success", "success"));
      })
      .finally(() => setBtnLoader(false));
  };

  return (
    <>
      {isTableView ? (
        <Box sx={{ width: "100%", height: "100%", textAlign: "center" }}>
          <Button
            id="button_field"
            disabled={btnLoader}
            onClick={invokeFunction}
            variant="outlined"
          >
            {btnLoader ? (
              <CircularProgress size={20} />
            ) : row?.attributes?.icon?.includes(":") ? (
              <IconGeneratorIconjs icon={row?.attributes?.icon} />
            ) : (
              <IconGenerator icon={row?.attributes?.icon} />
            )}
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ height: "30px", width: "100%" }}></Box>
          <Button
            id="button_field_second"
            disabled={btnLoader}
            onClick={invokeFunction}
            variant="outlined"
          >
            {btnLoader ? (
              <CircularProgress size={20} />
            ) : row?.attributes?.icon?.includes(":") ? (
              <IconGeneratorIconjs icon={row?.attributes?.icon} />
            ) : (
              <IconGenerator icon={row?.attributes?.icon} />
            )}
          </Button>
        </Box>
      )}
    </>
  );
}

export default HFButtonField;
