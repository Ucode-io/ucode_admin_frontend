import { CircularProgress } from "@mui/material";
import { forwardRef } from "react";
import "./style.scss";
import DeleteWrapperModal from "../../DeleteWrapperModal";

const RectangleIconButton = forwardRef(
  (
    {
      color,
      children,
      loader,
      className,
      size = "",
      type = "delete",
      onClick = () => {},
      disabled = false,
      ...props
    },
    ref
  ) => {
    return type === "delete" && color === "error" ? (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <DeleteWrapperModal
          onDelete={(e) => {
            onClick(e);
          }}
        >
          <div
            className={`RectangleIconButton ${color} ${className} ${size}`}
            ref={ref}
            {...props}
          >
            {loader ? <CircularProgress size={14} /> : children}
          </div>
        </DeleteWrapperModal>
      </div>
    ) : (
      <div
        className={`RectangleIconButton ${color} ${className} ${size} ${disabled ? "disabled" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        ref={ref}
        {...props}
      >
        {loader ? <CircularProgress size={14} /> : children}
      </div>
    );
  }
);

export default RectangleIconButton;
