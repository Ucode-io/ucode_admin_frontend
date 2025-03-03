import {
  AccountBalance,
  AttachMoney,
  Done,
  HourglassTop,
} from "@mui/icons-material";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import BlockIcon from "@mui/icons-material/Block";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {format} from "date-fns";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import billingService from "../../../../services/billingService";
import {useProjectListQuery} from "../../../../services/companyService";
import {store} from "../../../../store";
import {showAlert} from "../../../../store/alert/alert.thunk";
import {companyActions} from "../../../../store/company/company.slice";
import {numberWithSpaces} from "../../../../utils/formatNumbers";
import TopUpBalance from "./TopupBalance";
import "./style.scss";

const tableHeads = [
  "Date",
  "Project",
  "Fare",
  "Payment Type",
  "Type",
  "Status",
  "Currency",
  "Amount",
];

const BillingComponent = ({addBalance = false, setAddBalance = () => {}}) => {
  const {control, handleSubmit, watch, reset} = useForm();
  const [loading, setLoading] = useState(false);
  const project = useSelector((state) => state?.company?.projectItem);
  const company = store.getState().company;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handCloseBalance = () => {
    reset({});
    setAddBalance(false);
  };

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
      enabled: Boolean(project?.fare_id),
      select: (res) => res?.transactions ?? [],
    }
  );

  const onSubmit = (values) => {
    setLoading(true);
    const data = {
      project_card_id: watch("id"),
      amount: values?.amount,
    };

    billingService
      .receiptPay(data, {limit: 10})
      .then(() => {
        dispatch(showAlert("Transaction successfully created!", "success"));
        refetch();
        queryClient.refetchQueries(["PROJECT"]);
        handCloseBalance();
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Box
        id={"billingTable"}
        sx={{
          p: 2,
          backgroundColor: "#f9f9f9",
          minHeight: "calc(100vh - 60px)",
        }}>
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
                      {data?.currency && data?.currency?.toUpperCase()}
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
                        {data?.price} {data?.currency?.toUpperCase()}
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
                      {data?.subscription?.end_date}
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
                        {row.fare?.name ?? ""}
                      </TableCell>
                      <TableCell sx={{fontSize: "14px"}}>
                        {row.payment_type ?? ""}
                      </TableCell>
                      <TableCell sx={{fontSize: "14px"}}>
                        {row.transaction_type ?? ""}
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
                      <BackupTableIcon
                        style={{width: "40px", height: "30px"}}
                      />
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
            reset={reset}
          />
        </Modal>
      </Box>
    </>
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
