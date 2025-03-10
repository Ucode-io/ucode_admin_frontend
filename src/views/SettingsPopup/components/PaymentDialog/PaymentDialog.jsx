import { useState } from "react";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { store } from "../../../../store";
import billingService from "../../../../services/billingService";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { Box, Button, Dialog, Divider, Typography } from "@mui/material";
import { numberWithSpaces } from "../../../../utils/formatNumbers";


export const PaymentDialog = ({
  open,
  setOpen = () => {},
  selectedFare,
  calculatedPrice,
  selectedTab,
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const projectId = store.getState().company.projectId;

  const makePayment = () => {
    setLoading(true);
    billingService
      .makePayment({
        project_id: projectId,
        fare_id: selectedFare?.id,
        discount_id: selectedTab?.id,
      })
      .then((res) => {
        dispatch(showAlert("Successfully paid!", "success"));
        handleClose();
        queryClient.refetchQueries(["PROJECT"]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Box
          sx={{
            width: "400px",
            padding: "24px",
            backgroundColor: "#F8FAFC",
            borderRadius: "12px",
          }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            gutterBottom>
            Upgrade your plan to{" "}
            <span
              style={{
                color: "#007aff",
                background: "#e1ecf5",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#175CD3",
              }}>
              {selectedFare?.name}
            </span>
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={2}>
            You’re just a step away from enjoying exclusive features!
          </Typography>

          <Box
            sx={{
              backgroundColor: "#fff",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography sx={{fontSize: "12px", color: "#787774"}}>
                Your Balance:
              </Typography>{" "}
              <Typography fontSize={"12px"} variant="h6">
                {numberWithSpaces(
                  Number(calculatedPrice?.project_balance ?? 0)
                )}{" "}
                UZS
              </Typography>
            </Box>

            <Divider sx={{my: 1}} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Plan:
              </Typography>
              <Typography variant="body2" sx={{color: "#212b36"}}>
                {selectedFare?.name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                my: "10px",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Date:
              </Typography>
              <Typography variant="body2" sx={{color: "#212b36"}}>
                {calculatedPrice?.start_date} / {calculatedPrice?.end_date}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Price:
              </Typography>
              <Typography variant="body2" sx={{color: "#212b36"}}>
                {numberWithSpaces(
                  Number(calculatedPrice?.calculated_price ?? 0)
                )}{" "}
                UZS
              </Typography>
            </Box>
            <Divider sx={{my: 1}} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Total:{" "}
              </Typography>

              <Typography fontWeight="bold" textAlign="center" mt={1}>
                {numberWithSpaces(
                  Number(calculatedPrice?.calculated_price ?? 0)
                )}{" "}
                UZS
              </Typography>
            </Box>
          </Box>

          <Box sx={{display: "flex", justifyContent: "space-between", mt: 3}}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleClose}
              sx={{mr: 1}}>
              Cancel Payment
            </Button>
            <Button
              loading={loading}
              onClick={makePayment}
              variant="outlined"
              sx={{color: "#007aff"}}
              fullWidth>
              Confirm and Pay
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
