import cls from "./styles.module.scss";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button as MuiButton,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useAddCardComponent } from "./useAddCardComponent";
import { Button } from "../Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
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

function SetupForm({ onSwitchToUzcard }) {
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
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            onClick={onSwitchToUzcard}
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": {
                textDecoration: "underline",
                opacity: 0.9,
              },
            }}
          >
            <CreditCardIcon sx={{ fontSize: 16 }} />
            Add uzcard or humo
          </Typography>
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
  loading = false,
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
  const [tabIndex, setTabIndex] = useState(1);
  const [amount, setAmount] = useState("");

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
  console.log("cardcard", card);
  return (
    <Box sx={{ maxWidth: "100%", p: 3 }}>
      <Typography
        sx={{
          fontWeight: 600,
          color: "#101828",
          fontSize: "20px",
          marginBottom: "20px",
        }}
      >
        Top up ballance
      </Typography>

      <TextField
        fullWidth
        placeholder="Write amount..."
        variant="outlined"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff",
            borderRadius: "8px",
            fontSize: "16px",
            "& fieldset": {
              borderColor: "#EAECF0",
            },
            "&:hover fieldset": {
              borderColor: "#D0D5DD",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2563eb",
            },
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "12px",
        }}
      >
        <Typography
          sx={{ fontSize: "16px", fontWeight: 400, color: "#667085" }}
        >
          Choose card for top up
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#2563eb",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          onClick={() => setOpenDialog(true)}
        >
          <img src="/img/addCard.svg" alt="" />
          <Typography
            sx={{ fontSize: "14px", fontWeight: 600, color: "#007AFF" }}
          >
            Add card
          </Typography>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "8px",
          mb: 3,
          maxHeight: "300px",
        }}
        className="scrollbarNone"
      >
        <Table
          sx={{
            position: "relative",
            borderTop: "0px",
            border: "1px solid #dbe0e4",
            borderRadius: "8px",
          }}
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  background: "#fff",
                  border: "none",
                  borderBottom: "1px solid #dbe0e4",
                  borderTopLeftRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  boxShadow: "none !important",
                  padding: "8px 15px",
                  width: "60px",
                  background: "#F9FAFB",
                  borderBottomLeftRadius: "0px !important",
                }}
              />
              <TableCell
                sx={{
                  background: "#fff",
                  border: "none",
                  borderBottom: "1px solid #dbe0e4",
                  fontWeight: "500",
                  fontSize: "14px",
                  boxShadow: "none !important",
                  padding: "8px",
                  background: "#F9FAFB",
                  color: "#475467",
                  width: "200px",
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  background: "#fff",
                  border: "none",
                  borderBottom: "1px solid #dbe0e4",
                  fontWeight: "500",
                  fontSize: "14px",
                  boxShadow: "none !important",
                  padding: "8px",
                  background: "#F9FAFB",
                  color: "#475467",
                  width: "250px",
                }}
              >
                Card number
              </TableCell>
              <TableCell
                sx={{
                  background: "#fff",
                  border: "none",
                  borderBottom: "1px solid #dbe0e4",
                  fontWeight: "500",
                  fontSize: "14px",
                  boxShadow: "none !important",
                  padding: "8px",
                  background: "#F9FAFB",
                  color: "#475467",
                  width: "165px",
                }}
              >
                Expiry date
              </TableCell>
              <TableCell
                sx={{
                  border: "none",
                  borderBottom: "1px solid #dbe0e4",
                  borderTopRightRadius: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                  boxShadow: "none !important",
                  padding: "8px 15px",
                  width: "140px",
                  borderBottomRightRadius: "0px !important",
                  background: "#F9FAFB",
                  color: "#475467",
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {cards?.map((card, index) => (
              <TableRow
                key={index}
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid #EAECF0",
                    ":first-of-type": {
                      paddingLeft: "15px",
                    },
                    ":last-of-type": {
                      paddingRight: "15px",
                    },
                  },
                }}
                onClick={() => handleCardSelect(index, card)}
              >
                <TableCell sx={{ fontSize: "14px", padding: "8px 8px" }}>
                  <Radio
                    checked={selectedCard === index}
                    onChange={() => handleCardSelect(index, card)}
                    sx={{
                      padding: 0,
                      "& .MuiSvgIcon-root": {
                        fontSize: 20,
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: "14px", padding: "8px 8px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    {card?.type === "VISA" ? (
                      <img
                        src="/img/visa.svg"
                        alt="VISA"
                        width={40}
                        height={24}
                      />
                    ) : card?.type === "HUMO" ? (
                      <img
                        src="/img/humo.svg"
                        alt="HUMO"
                        width={40}
                        height={24}
                      />
                    ) : card?.type === "UZCARD" ? (
                      <img
                        src="/img/uzc.svg"
                        alt="UZCARD"
                        width={40}
                        height={24}
                      />
                    ) : (
                      <img
                        src="/img/mastercard.svg"
                        alt="Mastercard"
                        width={40}
                        height={24}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#101828",
                      }}
                    >
                      {card?.type || "Card"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: "14px", padding: "6px 8px" }}>
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 400, color: "#475467" }}
                  >
                    {card.pan}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: "14px", padding: "6px 8px" }}>
                  <Typography
                    sx={{ fontSize: "14px", fontWeight: 400, color: "#475467" }}
                  >
                    {card?.expire}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: "14px", padding: "6px 8px" }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#000",
                      cursor: "pointer",
                      "&:hover": {
                        color: "#ef4444",
                      },
                    }}
                  >
                    Delete
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <MuiButton
          disabled={!amount || !card?.verify || loading}
          onClick={handleSubmit(() => {
            onSubmit({
              amount: Number(amount),
              card_id: card?.id,
            });
          })}
          sx={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1d4ed8",
            },
            "&:disabled": {
              backgroundColor: "#94a3b8",
              color: "white",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} style={{ color: "#fff" }} />
          ) : (
            "Add balance"
          )}
        </MuiButton>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setVerifyCard(false);
          setTabIndex(1);
          isFirstRequestStripe.current = true;
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "20px", paddingBottom: "16px" }}
        >
          Add card
        </DialogTitle>
        <DialogContent sx={{ padding: "10px 20px" }}>
          {!verifyCard ? (
            <Tabs selectedIndex={tabIndex} onSelect={handleTabChange}>
              <TabList className={cls.tabs} style={{ display: "none" }}>
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
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <SetupForm onSwitchToUzcard={() => setTabIndex(0)} />
                  </Elements>
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
                setTabIndex(1);
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
