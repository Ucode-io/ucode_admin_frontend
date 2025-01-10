import {Box, Button} from "@mui/material";
import React, {useState} from "react";
import IconGenerator from "../IconPicker/IconGenerator";
import request from "../../utils/request";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

function HFButtonField({
  row,
  field,
  isTableView = false,
  getValues = () => {},
}) {
  const {tableSlug} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);

  const invokeFunction = () => {
    const data = {
      function_id: field?.attributes?.function,
      object_data: row?.guid ? row : getValues(),
      table_slug: tableSlug,
    };

    setBtnLoader(true);
    request
      .post("/invoke_function", data, {
        params: {use_no_limit: event?.attributes?.use_no_limit},
      })
      .then((res) => {
        dispatch(showAlert("Success", "success"));

        let url = res?.link ?? event?.url ?? "";
        if (res?.status === "error") {
          dispatch(showAlert(/*res?.data?.message,*/ "error"));
        } else {
          if (event?.action_type === "HTTP") {
            if (event?.attributes?.use_refresh) {
              navigate("/reloadRelations", {
                state: {
                  redirectUrl: window.location.pathname,
                },
              });
            }
          } else if (url) {
            Object.entries(res?.data ?? {}).forEach(([key, value]) => {
              const computedKey = "${" + key + "}";
              url = url.replaceAll(computedKey, value);
            });
          } else if (url.includes("reload:")) {
            navigate("/reload", {
              state: {
                redirectUrl: url,
              },
            });
          } else if (url === "" || url === "reload") {
            navigate("/reload", {
              state: {
                redirectUrl: window.location.pathname,
              },
            });
          } else if (url === "reloadRelations") {
            navigate("/reloadRelations", {
              state: {
                redirectUrl: window.location.pathname,
              },
            });
          } else if (url?.includes("cdn")) {
            download({link: url, fileName: getLastUnderscorePart(url)});
          } else {
            if (url.includes("http") || url.includes("https")) {
              window.open(url, "_blank");
            } else {
              navigate(`/${url}`);
            }
          }
        }
      })
      .finally(() => setBtnLoader(false));
  };

  return (
    <>
      {isTableView ? (
        <Box sx={{width: "100%", height: "100%", textAlign: "center"}}>
          <Button onClick={invokeFunction} variant="outlined">
            <IconGenerator icon={field?.attributes?.icon} />
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
          }}>
          <Box sx={{height: "30px", width: "100%"}}></Box>
          <Button onClick={invokeFunction} variant="outlined">
            <IconGenerator icon={field?.attributes?.icon} />
          </Button>
        </Box>
      )}
    </>
  );
}

export default HFButtonField;
