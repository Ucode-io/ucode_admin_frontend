import React from "react";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";

export default function GroupByButton({onClick}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "#A8A8A8",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
        lineHeight: "16px",
        letterSpacing: "0em",
        textAlign: "left",
        padding: "0 10px",
      }}
      onClick={(e) => onClick(e)}
    >
      <LayersOutlinedIcon color={"#A8A8A8"} />
      Group By
    </div>
  );
}
