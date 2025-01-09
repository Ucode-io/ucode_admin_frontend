import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import {useParams} from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import GeneratePdfFromTable from "../../../components/DataTable/GeneratePdfFromTable";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

function ActionButtons(props) {
  const {colDef, data} = props;

  const {tableSlug} = useParams();
  return (
    <>
      {data?.new_field ? (
        <>
          <RectangleIconButton
            style={{border: "1px solid #7777"}}
            color="error"
            onClick={() => colDef.removeRow(data?.guid)}>
            <CloseIcon color="error" />
          </RectangleIconButton>

          <RectangleIconButton
            color="success"
            onClick={() => {
              colDef.addRow(data);
            }}>
            <DoneIcon color="success" />
          </RectangleIconButton>
        </>
      ) : (
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
      )}
    </>
  );
}

export default ActionButtons;
