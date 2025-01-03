import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {useParams} from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import GeneratePdfFromTable from "../../../components/DataTable/GeneratePdfFromTable";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";

function ActionButtons(props) {
  const {colDef, data} = props;

  const {tableSlug} = useParams();
  return (
    <>
      <RectangleIconButton
        style={{border: "1px solid #7777"}}
        color="error"
        onClick={() => colDef.deleteFunction(data)}>
        <DeleteIcon color="error" />
      </RectangleIconButton>
      <PermissionWrapperV2 tableSlug={tableSlug} type={"pdf_action"}>
        <GeneratePdfFromTable view={colDef?.view} row={data} />
      </PermissionWrapperV2>
    </>
  );
}

export default ActionButtons;
