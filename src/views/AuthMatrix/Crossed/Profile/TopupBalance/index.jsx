import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import billingService from "../../../../../services/billingService";
import {AddIcon} from "@chakra-ui/icons";
import HFCardField from "../../../../../components/FormElements/HFCardField";
import OtpInput from "react-otp-input";
import HFNumberField from "../../../../../components/FormElements/HFNumberField";
import {useState} from "react";
import {showAlert} from "../../../../../store/alert/alert.thunk";
import {useDispatch} from "react-redux";
import {useQuery} from "react-query";

const TopUpBalance = ({
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

const AddCardComponent = ({
  control,
  watch,
  reset = () => {},
  verifyCard,
  setVerifyCard = () => {},
}) => {
  const dispatch = useDispatch();
  const [selectedCard, setSelectedCard] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [otpVal, setOtpVal] = useState("");
  const [newCard, setNewCard] = useState();
  const [card, setCard] = useState(null);

  const {
    isLoading,
    data: cards,
    refetch,
  } = useQuery(
    ["GET_CARDS_LIST"],
    () => {
      return billingService.getCardList({
        limit: 10,
      });
    },
    {
      select: (res) => res?.project_cards ?? [],
    }
  );

  const handleCardSelect = (index, card) => {
    setSelectedCard(index);
    setCard(card);
  };

  const verifyCardNumber = () => {
    if (Boolean(watch("card_number")) && Boolean(watch("expire"))) {
      billingService
        .cardVerify({
          pan: watch("card_number"),
          expire: watch("expire"),
        })
        .then((res) => {
          setNewCard(res);
          setVerifyCard(true);
        });
    } else dispatch(showAlert("Enter card number", "error"));
  };

  const getOtpVal = (val) => {
    setOtpVal(val);
  };

  const confirmOtpFunc = () => {
    billingService
      .cardOtpVerify({
        code: otpVal,
        project_card_id: newCard?.project_card_id,
      })
      .then(() => {
        dispatch(showAlert("The Card is successfully added!", "success"));
        refetch();
        setOpenDialog(false);
      });
  };

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
          <Button
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
          </Button>
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
            variant="contained"
            fullWidth
            sx={{
              width: "150px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => {
              setVerifyCard(true);
              reset(card);
            }}>
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
              <OtpInput
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

export default TopUpBalance;
