import cls from "./styles.module.scss";
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import { useAddCardComponent } from "./useAddCardComponent";
import { Button } from "../Button";
import { AddIcon } from "@chakra-ui/icons";
import HFCardField from "../../../../components/FormElements/HFCardField";
import OTPInput from "react-otp-input";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import {
  PaymentElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import request from "@/utils/request";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISH_KEY;

function SetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.origin + "?stripeRedirect=true",
      },
    });

    if (error) {
      console.error(error.message);
    } else {
      console.log("SetupIntent success:", setupIntent);
    }

    setLoading(false);
  };

  return (
    <Box mt={2}>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button disabled={!stripe || loading} primary>
            {loading ? "Saving..." : "Save card"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const AddCardComponent = ({
  control,
  watch,
  reset = () => {},
  verifyCard,
  setVerifyCard = () => {},
  handleSubmit = () => {},
  onSubmit = () => {},
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
  } = useAddCardComponent({ watch, setVerifyCard });

  const [clientSecret, setClientSecret] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  const isFirstRequestStripe = useRef(true);

  useEffect(() => {
    if (tabIndex === 1 && isFirstRequestStripe.current) {
      isFirstRequestStripe.current = false;

      request
        .post("/payment/intent", {
          amount: 1200,
          currency: "usd",
        })
        .then((data) => {
          setClientSecret(data.client_secret);
        });
    }
  }, [tabIndex]);

  return (
    <Box sx={{ maxWidth: "100%", textAlign: "center" }}>
      <Grid container sx={{ height: "240px", overflow: "auto" }}>
        {cards?.map((card, index) => (
          <Grid item key={index}>
            {console.log({ card })}
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
              onClick={() => handleCardSelect(index, card)}
            >
              <CardContent sx={{ textAlign: "justify", position: "relative" }}>
                <Typography fontSize={"14px"} fontWeight="bold">
                  {card.pan}
                </Typography>
                <Typography sx={{ fontSize: "12px" }} fontWeight="bold">
                  {card?.expire}
                </Typography>

                <Box
                  sx={{ position: "absolute", right: "0px", bottom: "10px" }}
                >
                  {card?.type === "VISA" ? (
                    <img
                      className={cls.cardIcon}
                      src="/img/visa.svg"
                      alt="VISA"
                      width={40}
                    />
                  ) : (
                    <img
                      className={cls.cardIcon}
                      src="/img/uzc.svg"
                      alt="uzcard"
                      width={40}
                    />
                  )}
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
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon sx={{ fontSize: 16 }} />
            Add Card
          </MuiButton>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
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
        fullWidth
      >
        <DialogTitle sx={{ marginBottom: "20px" }}>Add a New Card</DialogTitle>
        <DialogContent sx={{ padding: "10px 20px" }}>
          {!verifyCard ? (
            <Tabs tabIndex={tabIndex} onSelect={handleTabChange}>
              <TabList className={cls.tabs}>
                <Tab className={cls.tab} selectedClassName={cls.active}>
                  Card
                </Tab>
                <Tab className={cls.tab} selectedClassName={cls.active}>
                  VISA
                </Tab>
              </TabList>
              <TabPanel>
                <Box>
                  <Box sx={{ marginTop: "10px" }}>
                    <HFCardField
                      format="#### #### #### ####"
                      name="card_number"
                      placeholder="Card Number"
                      control={control}
                    />
                  </Box>
                  <Box sx={{ marginTop: "15px" }}>
                    <HFCardField
                      control={control}
                      name="expire"
                      format="##/##"
                      placeholder="expiry date (MM/YY)"
                      margin="dense"
                    />
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel>
                {!clientSecret ? (
                  "Loading..."
                ) : (
                  <Box>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <SetupForm />
                    </Elements>
                  </Box>
                )}
              </TabPanel>
            </Tabs>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <OTPInput
                value={otpVal}
                onChange={getOtpVal}
                numInputs={6}
                renderSeparator={<span style={{ width: "12px" }}></span>}
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
        {tabIndex === 0 && (
          <DialogActions padding="0">
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                setVerifyCard(false);
                setOpenDialog(false);
              }}
            >
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
                onClick={verifyCardNumber}
              >
                Add Card
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};
