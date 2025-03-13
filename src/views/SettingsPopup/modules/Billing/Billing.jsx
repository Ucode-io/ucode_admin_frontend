import { AccountBalance, AttachMoney, HourglassBottom } from "@mui/icons-material"
import { Box, Card, CardContent, Grid, Modal, Typography } from "@mui/material";
import { useBillingProps } from "./useBillingProps"
import { numberWithSpaces } from "@/utils/formatNumbers";
import { BillingTable } from "../../components/BillingTable"
import { TopUpBalance } from "../../components/TopUpBalance"

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
  } = useBillingProps()

  return (
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
                <AccountBalance color="primary" fontSize="large" />
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
                <AttachMoney color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6">Tariff</Typography>
                  <Typography variant="h6" color="success.main">
                    {data?.name}
                    <Typography variant="subtitle1" sx={{ color: "#000" }}>
                      {data?.price} {data?.currency?.toUpperCase()}
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
                <HourglassBottom color="warning" fontSize="large" />
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
  );
}
