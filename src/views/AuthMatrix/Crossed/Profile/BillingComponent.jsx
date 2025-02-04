import React, {useState} from "react";
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
} from "@mui/material";
import {
  AccountBalance,
  AttachMoney,
  Done,
  HourglassTop,
} from "@mui/icons-material";
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

const BillingComponent = ({
  handCloseBalance = () => {},
  addBalance = false,
}) => {
  const {control, handleSubmit} = useForm();
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
      sx={{p: 4, backgroundColor: "#f9f9f9", minHeight: "calc(100vh - 60px)"}}>
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
            height: "calc(100vh - 300px)",
          }}>
          <Table sx={{position: "relative"}} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    boxShadow: "none",
                    borderRadius: 0,
                    fontSize: "14px",
                  }}>
                  Date
                </TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                  Project
                </TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                  Payment Type
                </TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                  Status
                </TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                  Currency
                </TableCell>
                <TableCell sx={{fontWeight: "bold", fontSize: "14px"}}>
                  Amount
                </TableCell>
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
        <Box
          sx={{
            width: "200px",
            height: "320px",
            background: "#fff",
            position: "absolute",
            left: "50%",
            top: "20%",
            transform: "translate(-50%, 50%)",
            borderRadius: "8px",
          }}
          className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Top Up Balance</Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
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
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default BillingComponent;
