import React from "react";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import DoneIcon from "@mui/icons-material/Done";

function AddRow({computedColumn}) {
  return (
    <tr style={{overflow: "scroll"}}>
      <td
        style={{
          padding: "5px",
        }}>
        <RectangleIconButton
          color="success"
          // onClick={handleSubmit(onSubmit)}
        >
          <DoneIcon color="success" />
        </RectangleIconButton>
      </td>
      {computedColumn?.map((item) => (
        <td>{item?.label}</td>
      ))}
    </tr>
  );
}

export default AddRow;
