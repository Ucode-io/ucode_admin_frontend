import { Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Button as MuiButton } from "@mui/material";
import { useAddCardComponent } from "./useAddCardComponent"
import { Button } from "../Button";
import { AddIcon } from "@chakra-ui/icons";
import HFCardField from "../../../../components/FormElements/HFCardField";
import OTPInput from "react-otp-input";

export const AddCardComponent = ({
  control,
  watch,
  reset = () => {},
  verifyCard,
  setVerifyCard = () => {},
}) => {

  const {
    selectedCard,
    openDialog,
    setOpenDialog,
    card,
    isLoading,
    cards,
    handleCardSelect,
    verifyCardNumber,
    getOtpVal,
    otpVal,
    confirmOtpFunc,
  } = useAddCardComponent({ watch, setVerifyCard })

  return (
    <Box sx={{maxWidth: "100%", textAlign: "center"}}>
      <Grid container sx={{height: "240px", overflow: "auto"}}>
        {cards?.map((card, index) => (
          <Grid item key={index}>
            <Card
              sx={{
                margin: "10px",
                width: 160,
                height: 80,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1,
                boxShadow:
                  selectedCard === index
                    ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                    : "0px 2px 5px rgba(0,0,0,0.1)",
                backgroundColor: selectedCard === index ? "#1976d2" : "#f8f9fa",
                color: selectedCard === index ? "#fff" : "#000",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleCardSelect(index, card)}>
              <CardContent sx={{textAlign: "justify", position: "relative"}}>
                <Typography fontSize={"14px"} fontWeight="bold">
                  {card.pan}
                </Typography>
                <Typography sx={{fontSize: "12px"}} fontWeight="bold">
                  {card?.expire}
                </Typography>

                <Box sx={{position: "absolute", right: "10px", bottom: "10px"}}>
                  <img src="/img/uzc.svg" alt="uzcard" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid xs={3}>
          <MuiButton
            variant="outlined"
            fullWidth
            sx={{
              width: "120px",
              marginTop: "10px",
              marginLeft: "10px",
              height: "80px",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
            onClick={() => setOpenDialog(true)}>
            <AddIcon sx={{fontSize: 16}} />
            Add Card
          </MuiButton>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}>
        {card?.verify && (
          <Button
            onClick={() => {
              setVerifyCard(true);
              reset(card);
            }}
            primary
          >
            Topup balance
          </Button>
        )}
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth>
        <DialogTitle sx={{marginBottom: "20px"}}>Add a New Card</DialogTitle>
        <DialogContent sx={{padding: "10px 20px"}}>
          {!verifyCard ? (
            <Box>
              <Box sx={{marginTop: "10px"}}>
                <HFCardField
                  format="#### #### #### ####"
                  name="card_number"
                  placeholder="Card Number"
                  control={control}
                />
              </Box>
              <Box sx={{marginTop: "15px"}}>
                <HFCardField
                  control={control}
                  name="expire"
                  format="##/##"
                  placeholder="expiry date (MM/YY)"
                  margin="dense"
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "24px",
              }}>
              <OTPInput
                value={otpVal}
                onChange={getOtpVal}
                numInputs={6}
                renderSeparator={<span style={{width: "12px"}}></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  width: "45px",
                  height: "50px",
                  fontSize: "22px",
                  color: "#000",
                  fontWeight: "400",
                  caretColor: "blue",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions padding="0">
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              setVerifyCard(false);
              setOpenDialog(false);
            }}>
            Cancel
          </Button>
          {verifyCard ? (
            <Button variant="contained" onClick={confirmOtpFunc}>
              Confirm
            </Button>
          ) : (
            <Button
              disabled={
                Boolean(!watch("card_number")) || Boolean(!watch("expire"))
              }
              variant="contained"
              onClick={verifyCardNumber}>
              Add Card
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}