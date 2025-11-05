import { Box, Card, CardContent, Modal, Typography } from "@mui/material";
import { useBillingProps } from "./useBillingProps";
import { numberWithSpaces } from "@/utils/formatNumbers";
import { BillingTable } from "../../components/BillingTable";
import { TopUpBalance } from "../../components/TopUpBalance";
import { useSearchParams } from "react-router-dom";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [currency, setCurrency] = useState(null);

  const getCurrency = () => {
    axios.get(`https://cbu.uz/uz/arkhiv-kursov-valyut/json/`).then((res) => {
      setCurrency(res.data?.find((item) => item.Ccy === "USD"));
    });
  };
  console.log("currencycurrencycurrency", currency);
  useEffect(() => {
    getCurrency();
  }, []);

  return (
    <>
      <Box>
        <Card
          sx={{
            boxShadow: "none",
            border: "1px solid #EAECF0",
            borderRadius: "12px",
            mb: 3,
          }}
        >
          <CardContent sx={{ padding: "24px !important" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#000",
                    mb: 0.5,
                  }}
                >
                  Your invoice
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Details on your next invoice to be paid
                </Typography>
              </Box>
              <Box
                onClick={handClickBalance}
                sx={{
                  width: "186px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                  },
                }}
              >
                <AddIcon />
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  Top up
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  borderRight: "1px solid rgba(55, 53, 47, 0.09)",
                  pr: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0, 0, 0, 0.5)", mb: 1 }}
                >
                  Balance
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#101828",
                  }}
                >
                  {numberWithSpaces(project?.balance)}{" "}
                  {data?.currency?.toLowerCase() || "uzs"}
                </Typography>
              </Box>

              <Box
                sx={{
                  borderRight: "1px solid rgba(55, 53, 47, 0.09)",
                  pr: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0, 0, 0, 0.5)", mb: 1 }}
                >
                  Your plan
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#101828",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(settingsModalActions.setTab("fares"));
                  }}
                >
                  {data?.name || "Small"}
                </Typography>
              </Box>

              <Box
                sx={{
                  borderRight: "1px solid rgba(55, 53, 47, 0.09)",
                  pr: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0, 0, 0, 0.5)", mb: 1 }}
                >
                  Total amount
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#101828",
                  }}
                >
                  {numberWithSpaces(
                    Math.ceil(
                      data?.price * (Number(currency?.Rate ?? 12927.17) || 0) ||
                        0,
                    ),
                  )}
                  {data?.currency?.toLowerCase() || " uzs"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0, 0, 0, 0.5)", mb: 1 }}
                >
                  Expire date
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#101828",
                  }}
                >
                  {data?.subscription?.end_date || "17 Oct, 2025"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <BillingTable />

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
