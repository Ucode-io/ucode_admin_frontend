import { Box } from "@mui/material";
import { AddCardComponent } from "../AddCardComponent";
import { useState } from "react";

export const TopUpBalance = ({
  watch,
  control,
  loading = false,
  reset = () => {},
  onSubmit = () => {},
  handleSubmit = () => {},
}) => {
  const [verifyCard, setVerifyCard] = useState(false);

  return (
    <Box
      sx={{
        top: "50%",
        left: "50%",
        width: "800px",
        maxHeight: "90vh",
        background: "#fff",
        borderRadius: "12px",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        overflow: "auto",
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="PlatformModal"
    >
      <AddCardComponent
        watch={watch}
        control={control}
        reset={reset}
        verifyCard={verifyCard}
        setVerifyCard={setVerifyCard}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        loading={loading}
      />
    </Box>
  );
};
