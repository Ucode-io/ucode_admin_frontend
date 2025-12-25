
import React, {useEffect} from "react";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {Box} from "@mui/material";
import {Delete} from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

export function GridActionButtons(props) {
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
