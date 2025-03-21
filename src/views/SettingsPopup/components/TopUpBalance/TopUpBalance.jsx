import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import HFNumberField from "../../../../components/FormElements/HFNumberField";
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
        top: "10%",
        left: "50%",
        width: "580px",
        height: watch("verify") ? "180px" : "360px",
        background: "#fff",
        borderRadius: "8px",
        position: "absolute",
        transform: "translate(-50%, 50%)",
      }}
      className="PlatformModal">
      <Box>
        <div className="modal-header silver-bottom-border">
          <Typography variant="h4">Top Up Balance</Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {Boolean(watch("verify")) ? (
            <TopUpBalanceComponent control={control} loading={loading} />
          ) : (
            <AddCardComponent
              watch={watch}
              control={control}
              reset={reset}
              verifyCard={verifyCard}
              setVerifyCard={setVerifyCard}
            />
          )}
        </form>
      </Box>
    </Box>
  );
};

const TopUpBalanceComponent = ({control, loading = false}) => {
  return (
    <Box>
      <HFNumberField
        autoFocus
        fullWidth={true}
        required
        control={control}
        placeholder={"write amount..."}
        name={`amount`}
      />

      <Button
        loading={loading}
        disabled={loading}
        type="submit"
        sx={{marginTop: "24px", fontSize: "12px"}}
        variant="contained"
        fullWidth>
        {loading ? (
          <CircularProgress size={25} style={{color: "#fff"}} />
        ) : (
          "Add balance"
        )}
      </Button>
    </Box>
  );
};
