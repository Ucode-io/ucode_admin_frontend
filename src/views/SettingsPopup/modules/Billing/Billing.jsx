import {
  AccountBalance,
  AttachMoney,
  HourglassBottom,
} from "@mui/icons-material";
import {Box, Card, CardContent, Grid, Modal, Typography} from "@mui/material";
import {useBillingProps} from "./useBillingProps";
import {numberWithSpaces} from "@/utils/formatNumbers";
import {BillingTable} from "../../components/BillingTable";
import {TopUpBalance} from "../../components/TopUpBalance";
import {Fares} from "../Fares";
import {useSearchParams} from "react-router-dom";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";

export const Billing = () => {
  const {
    project,
    data,
    handClickBalance,
    addBalance,
    handCloseBalance,
    control,
    handleSubmit,
    watch,
    onSubmit,
    loading,
    reset,
    dispatch,
  } = useBillingProps();

  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Box>
        <Grid container spacing={4} alignItems="stretch" mt="0">
          <Grid item paddingTop="0 !important" xs={12} sm={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "none",
                border: "1px solid rgba(55, 53, 47, 0.06)",
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  paddingBottom: "16px !important",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* <AccountBalance color="primary" fontSize="large" /> */}
                  <img
                    src="img/bank.svg"
                    width={"26px"}
                    height={"26px"}
                    alt=""
                  />
                  <Box>
                    <Typography variant="h6">Balance</Typography>
                    <Typography variant="h6" color="primary">
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

          <Grid item paddingTop="0 !important" xs={12} sm={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "none",
                border: "1px solid rgba(55, 53, 47, 0.06)",
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  paddingBottom: "16px !important",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#18c19d",
                    }}>
                    UZS
                  </Typography> */}
                  <img
                    src="img/cash.svg"
                    width={"26px"}
                    height={"26px"}
                    alt=""
                  />
                  <Box>
                    <Typography variant="h6">Tariff</Typography>
                    <Typography
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(settingsModalActions.setTab("fares"));
                      }}
                      variant="h6"
                      color="success.main"
                    >
                      {data?.name}
                      <Typography variant="subtitle1" sx={{ color: "#000" }}>
                        {numberWithSpaces(data?.price * 12927.17)}
                        {data?.currency?.toUpperCase()}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item paddingTop="0 !important" xs={12} sm={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "none",
                border: "1px solid rgba(55, 53, 47, 0.06)",
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  paddingBottom: "16px !important",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* <HourglassBottom color="warning" fontSize="large" /> */}
                  <img
                    src="img/time.svg"
                    width={"26px"}
                    height={"26px"}
                    alt=""
                  />
                  <Box>
                    <Typography variant="h6">Expire Date</Typography>
                    <Typography variant="h6" color="text.secondary">
                      {data?.subscription?.end_date}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <BillingTable handClickBalance={handClickBalance} />

        <Modal
          onClose={handCloseBalance}
          open={addBalance}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-slide-description"
        >
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
