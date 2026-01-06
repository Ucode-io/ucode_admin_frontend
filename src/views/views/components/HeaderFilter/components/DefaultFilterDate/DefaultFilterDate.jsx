import InlineSVG from "react-inlinesvg";
import {format} from "date-fns";
import { useState } from "react";
import { getColumnIconPath } from "@/utils/constants/tableIcons";
import {Box, Popover} from "@mui/material";
import YDatePicker from "../FilterGenerator/YDatePicker";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "@/assets/icons/icon";

export const DefaultFilterDate = ({field, value, handleChange}) => {

  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };

  const showCloseIcon = isValidDate(value?.$gte) && isValidDate(value?.$lte);

  return <Box>
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        height: "30px",
        gap: "8px",
        border: "1px solid #eee",
        padding: "2px 8px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        position: "relative",
        borderColor: showCloseIcon ? "#2383e2" : "#EAECF0",
        backgroundColor: showCloseIcon
          ? "rgba(35, 131, 226, 0.07)"
          : "none",
      }}
    >
      <InlineSVG
        src={getColumnIconPath({ column: field })}
        width={14}
        height={14}
        color={showCloseIcon ? "#2383e2" : "#909EAB"}
      />
      <span style={{ color: showCloseIcon ? "#2383e2" : "#909EAB" }}>
        {isValidDate(value?.$gte) && isValidDate(value?.$lte) ? (
          `${format(new Date(value?.$gte), "dd.MM.yyyy")} - ${format(new Date(value?.$lte), "dd.MM.yyyy")}`
        ) : (
          <span style={{ color: "#909EAB", fontSize: "10px" }}>
            {field?.attributes?.[`label_${i18n?.language}`] ||
              field.label ||
              "DD.MM.YYYY - DD.MM.YYYY"}
          </span>
        )}
      </span>
      {
        showCloseIcon && (
          <Box
            sx={{
              position: "absolute",
              right: "4px",
              top: "50%",
              zIndex: "1",
              cursor: "pointer",
              transform: "translateY(-50%)"
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleChange(null, field.slug)
            }}
          >
            <CloseIcon />
          </Box>
        )
      }
    </Box>
   <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box
        sx={{
          width: "205px",
          height: "250px",
          border: "1px solid #eee",
          borderRadius: "8px",
        }}
      >
        <YDatePicker field={field} value={value} onChange={(value) => handleChange(value, field.slug)} />
      </Box>
    </Popover>
  </Box>

}