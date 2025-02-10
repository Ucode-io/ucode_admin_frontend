import React, {useState} from "react";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import {useDispatch, useSelector} from "react-redux";
import billingService from "../../../../services/billingService";
import {useQuery} from "react-query";
import {numberWithSpaces} from "../../../../utils/formatNumbers";
import {useForm} from "react-hook-form";
import "./style.scss";
import HFNumberField from "../../../../components/FormElements/HFNumberField";
import {store} from "../../../../store";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {format} from "date-fns";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import {useProjectListQuery} from "../../../../services/companyService";
import {companyActions} from "../../../../store/company/company.slice";
import BlockIcon from "@mui/icons-material/Block";
import HFBalanceFile from "../../../../components/FormElements/HFBalanceFile";
import OtpInput from "react-otp-input";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Modal,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  AccountBalance,
  AttachMoney,
  Done,
  HourglassTop,
} from "@mui/icons-material";
import {AddIcon} from "@chakra-ui/icons";
import HFCardNumberField from "../../../../components/FormElements/HFCardnumberField";

const tableHeads = [
  "Date",
  "Project",
  "Payment Type",
  "Status",
  "Currency",
  "Amount",
];

const BillingComponent = ({
  addBalance = false,
  handCloseBalance = () => {},
}) => {
  const {control, handleSubmit, watch} = useForm();
  const [loading, setLoading] = useState(false);
  const project = useSelector((state) => state?.company?.projectItem);
  const authStore = store.getState().auth;
  const company = store.getState().company;
  const dispatch = useDispatch();

  const {isLoading: projectLoading} = useProjectListQuery({
    params: {
      company_id: company.companyId,
    },
    queryParams: {
      enabled: Boolean(company.companyId),
      onSuccess: (res) => {
        dispatch(companyActions.setProjects(res.projects));
        dispatch(companyActions.setProjectItem(res.projects[0]));
        dispatch(companyActions.setProjectId(res.projects[0].project_id));
      },
    },
  });

  const {data} = useQuery(
    ["GET_BILLING_DATA", project],
    () => {
      return billingService.getList(project?.fare_id);
    },
    {
      enabled: Boolean(project?.fare_id),
      onSuccess: (res) => res?.data,
    }
  );

  const {data: transactions, refetch} = useQuery(
    ["GET_TRANSACTION_LIST", project],
    () => {
      return billingService.getTransactionList();
    },
    {
      select: (res) => res?.transactions ?? [],
    }
  );

  const onSubmit = (values) => {
    setLoading(true);
    const data = {
      project_id: project?.project_id,
      creator_id: authStore?.userId,
      payment_status: "pending",
      amount: values?.amount,
      transaction_type: "topup",
      creator_type: "transfer",
      fare_id: project?.fare_id,
      currency_id: "88c816a3-24e8-4994-ab70-9bc826bb9dc3",
      receipt_file: values?.receipt_file,
    };

    billingService
      .fillBalance(data)
      .then(() => {
        dispatch(showAlert("Transaction successfully created!", "success"));
        refetch();
        handCloseBalance();
      })
      .finally(() => setLoading(false));
  };

  return (
    <Box
      id={"billingTable"}
      sx={{p: 2, backgroundColor: "#f9f9f9", minHeight: "calc(100vh - 60px)"}}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Card sx={{height: "118px"}}>
            <CardContent>
              <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <AccountBalance color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h5">Balance</Typography>
                  <Typography variant="h5" color="primary">
                    {numberWithSpaces(project?.balance)}{" "}
                    {data?.currency?.toUpperCase()}
                  </Typography>
                  <Typography variant="subtitle1" color="error">
                    (-{numberWithSpaces(project?.credit_limit)})
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{height: "118px"}}>
            <CardContent
              sx={{height: "100%", display: "flex", alignItems: "center"}}>
              <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <AttachMoney color="success" fontSize="large" />
                <Box>
                  <Typography variant="h5">Tariff</Typography>
                  <Typography variant="h5" color="success.main">
                    {data?.name}
                    <Typography variant="h6" sx={{color: "#000"}}>
                      {data?.price} {data?.currency.toUpperCase()}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{height: "118px"}}>
            <CardContent
              sx={{height: "100%", display: "flex", alignItems: "center"}}>
              <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <HourglassBottomIcon color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h5">Expire Date</Typography>
                  <Typography variant="h4" color="text.secondary">
                    2025-12-31
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{mt: 4}}>
        <Typography variant="h6" sx={{mb: 2}}>
          Transactions
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 1,
            borderTop: "1px solid #eee",
            borderBottom: "1px solid #eee",
            height: "calc(100vh - 280px)",
          }}>
          <Table sx={{position: "relative"}} stickyHeader>
            <TableHead>
              <TableRow>
                {tableHeads?.map((item) => (
                  <TableHeadCell>{item}</TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Boolean(transactions?.length) ? (
                transactions?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": {backgroundColor: "#f9f9f9"},
                    }}>
                    <TableCell sx={{fontSize: "14px"}}>
                      {format(new Date(row.created_at), "dd.MM.yyyy HH:mm")}
                    </TableCell>
                    <TableCell sx={{fontSize: "14px"}}>
                      {project?.title}
                    </TableCell>
                    <TableCell sx={{fontSize: "14px"}}>
                      {row.creator_type === "transfer" && "Bank"}
                    </TableCell>
                    <TableCell sx={{fontSize: "14px"}}>
                      {row.payment_status === "accepted" ? (
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "success.main",
                            fontSize: "14px",
                          }}>
                          <Done /> Paid
                        </Typography>
                      ) : row?.payment_status === "cancelled" ? (
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "red",
                            fontSize: "16px",
                          }}>
                          <BlockIcon /> Cancelled
                        </Typography>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "warning.main",
                            fontSize: "14px",
                          }}>
                          <HourglassTop /> Pending
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{fontSize: "14px"}}>
                      {row?.currency?.code}
                    </TableCell>
                    <TableCell sx={{fontSize: "14px"}}>
                      {numberWithSpaces(row.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    fontSize: "16px",
                  }}>
                  No transactions are found.
                  <Box sx={{marginTop: "12px"}}>
                    <BackupTableIcon style={{width: "40px", height: "30px"}} />
                  </Box>
                </Box>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal
        onClose={handCloseBalance}
        open={addBalance}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-slide-description">
        <TopUpBalance
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          control={control}
          loading={loading}
          watch={watch}
        />
      </Modal>
    </Box>
  );
};

const TopUpBalance = ({
  watch,
  control,
  loading = false,
  onSubmit = () => {},
  handleSubmit = () => {},
}) => {
  return (
    <Box
      sx={{
        top: "10%",
        left: "50%",
        width: "580px",
        height: "360px",
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
          {watch("card") ? (
            <TopUpBalanceComponent control={control} loading={loading} />
          ) : (
            <AddCardComponent watch={watch} control={control} />
          )}
        </form>
      </Box>
    </Box>
  );
};

const AddCardComponent = ({control, watch}) => {
  const {setValue} = control;
  const [selectedCard, setSelectedCard] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [verifyCard, setVerifyCard] = useState(false);
  const [otpVal, setOtpVal] = useState("");
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiry: "",
  });
  const dispatch = useDispatch();

  const {isLoading, data: cards} = useQuery(
    ["GET_CARDS_LIST"],
    () => {
      return billingService.getCardList({
        limit: 10,
      });
    },
    {
      select: (res) => res?.cards ?? [],
    }
  );

  const handleCardSelect = (index, card) => {
    setSelectedCard(index);
    setValue("selectedCard", card);
  };

  // const handleAddCard = () => {
  //   if (newCard.cardNumber && newCard.expiry) {
  //     setCards([...cards, newCard]);
  //     setNewCard({cardNumber: "", expiry: ""});
  //     setOpenDialog(false);
  //   }
  // };

  const verifyCardNumber = () => {
    if (Boolean(watch("card_number")) && Boolean(watch("expiry_date"))) {
      billingService
        .cardVerify({
          pan: watch("card_number"),
          expire: watch("expiry_date"),
        })
        .then(() => setVerifyCard(true));
    } else dispatch(showAlert("Enter card number", "error"));
  };

  const getOtpVal = (val) => {
    setOtpVal(val);
  };

  return (
    <Box sx={{maxWidth: "100%", textAlign: "center"}}>
      <Grid container sx={{height: "240px", overflow: "auto"}}>
        {cards.map((card, index) => (
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
                  **** **** **** {card.cardNumber.slice(-4)}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {card?.expiry}
                </Typography>

                <Box sx={{position: "absolute", right: "10px", bottom: "10px"}}>
                  <img src="/public/img/uzc.svg" alt="uzcard" />
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
        {Boolean(selectedCard) && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              width: "150px",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => setOpenDialog(true)}>
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
                <HFCardNumberField
                  format="#### #### #### ####"
                  name="card_number"
                  placeholder="Card Number"
                  control={control}
                  value={newCard.cardNumber}
                  onChange={(e) =>
                    setNewCard({...newCard, cardNumber: e.target.value})
                  }
                />
              </Box>
              <Box sx={{marginTop: "15px"}}>
                <HFCardNumberField
                  control={control}
                  name="expiry_date"
                  format="##/##"
                  placeholder="expiry date (MM/YY)"
                  margin="dense"
                  value={newCard.expiry}
                  onChange={(e) =>
                    setNewCard({...newCard, expiry: e.target.value})
                  }
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
          <Button variant="contained" onClick={verifyCardNumber}>
            Add Card
          </Button>
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

      <HFBalanceFile
        autoFocus
        fullWidth={true}
        required
        control={control}
        placeholder={"write amount..."}
        name={`receipt_file`}
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

const TableHeadCell = ({children, props}) => {
  return (
    <TableCell sx={{fontWeight: "bold", fontSize: "14px"}} props>
      {children}
    </TableCell>
  );
};

export default BillingComponent;
