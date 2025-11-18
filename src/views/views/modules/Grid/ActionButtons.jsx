
import React, {useEffect} from "react";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {Box} from "@mui/material";
import {Delete} from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

function ActionButtons(props) {
  const { colDef, data } = props;

  useEffect(() => {
    if (Boolean(data?.new_field)) {
      const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          colDef?.addRow(data);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  return (
    <>
      {data?.new_field ? (
        <>
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              "&:hover .imageBox": {
                opacity: 0,
                transition: "opacity 0.3s ease",
              },
              "&:hover .buttonBox": {
                opacity: 1,
                transition: "opacity 0.3s ease",
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <RectangleIconButton
                id="cancel-row"
                color="error"
                style={{ minHeight: 25, minWidth: 25, height: 25, width: 25 }}
                // onClick={() => colDef.removeRow(props, data?.guid)}
                onClick={() => {
                  props?.api?.applyTransaction({
                    remove: [data],
                  });
                }}
              >
                <ClearIcon color="error" />
              </RectangleIconButton>
            </Box>
            {/* <Box
              className="imageBox"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 1,
                transition: "opacity 0.3s ease",
              }}>
              <img
                src="/table-icons/save-delete.svg"
                alt="More"
                width="25px"
                height="25px"
              />
            </Box> */}

            {/* <Box
              className="buttonBox"
              sx={{
                position: "absolute",
                top: "3px",
                right: "10px",
                width: "53px",
                height: "26px",
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
                gap: "3px",
                background: "#fff",
                overflow: "hidden",
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}>
              <RectangleIconButton
                id="cancel-row"
                color="error"
                style={{minHeight: 25, minWidth: 25, height: 25, width: 25}}
                onClick={() => colDef.removeRow(props, data?.guid)}>
                <ClearIcon color="error" />
              </RectangleIconButton>
              <RectangleIconButton
                id="confirm-row"
                color="success"
                style={{minHeight: 25, minWidth: 25, height: 25, width: 25}}
                onClick={(e) => {
                  e.stopPropagation();
                  colDef?.addRow(data);
                }}>
                <DoneIcon color="success" />
              </RectangleIconButton>
            </Box> */}
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 0 0 0",
            width: "100%",
            height: "100%",
          }}
        >
          <RectangleIconButton
            color="error"
            style={{ minWidth: 25, minHeight: 25, height: 25 }}
            onClick={() => colDef.deleteFunction(data, props)}
          >
            <Delete color="error" />
          </RectangleIconButton>
        </Box>
      )}
    </>
  );
}

export default ActionButtons;
