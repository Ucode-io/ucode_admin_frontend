import {Box, Button, Tooltip} from "@mui/material";
import React from "react";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import useTabRouter from "../../../hooks/useTabRouter";
import {useNavigate, useParams} from "react-router-dom";
import {mergeStringAndState} from "../../../utils/jsonPath";

function RowIndexField(props) {
  const {value, data, colDef} = props;

  console.log("propsprops", props);
  const {tableSlug, appId} = useParams();

  const {navigateToForm} = useTabRouter();
  const navigate = useNavigate();

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDetailPage = (row) => {
    if (
      colDef?.view?.attributes?.navigate?.params?.length ||
      colDef?.view?.attributes?.navigate?.url
    ) {
      const params = colDef?.view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;
      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      navigateToForm(tableSlug, "EDIT", row, {}, colDef?.menuItem?.id ?? appId);
    }
  };

  return (
    <Box sx={{display: "flex"}}>
      {/* <Tooltip title="Open the row in detail"> */}
      <Button
        onClick={() => {
          navigateToDetailPage(data);
        }}
        className="editButton"
        style={{
          minWidth: "max-content",
        }}>
        <OpenInFullIcon />
      </Button>
      {/* </Tooltip> */}

      <Box className="indexValue">{value}</Box>
    </Box>
  );
}

export default RowIndexField;
