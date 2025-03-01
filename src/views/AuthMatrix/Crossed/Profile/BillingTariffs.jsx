import React, {useEffect, useState} from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  Divider,
} from "@mui/material";
import {useQuery, useQueryClient} from "react-query";
import billingService from "../../../../services/billingService";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {store} from "../../../../store";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";

const BillingTariffs = ({project}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const {data: fares} = useQuery(
    ["GET_BILLING_DATA_FARES", project],
    () => billingService.getFareList(),
    {onSuccess: (res) => res?.fares}
  );

  const {data: discounts} = useQuery(
    ["GET_DISCOUNTS", project],
    () => billingService.getDiscounts(),
    {onSuccess: (res) => res?.discounts}
  );

  return (
    <Box
      id="billingTariff"
      sx={{
        margin: "auto",
        padding: "30px 20px",
        backgroundColor: "#F8FAFC",
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
      }}>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList style={{display: "flex", borderBottom: "none"}}>
          {discounts?.discounts?.map((el, index) => (
            <Tab
              key={el?.id}
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                padding: "4px 10px",
                cursor: "pointer",
                border: "none",
                borderRadius: "8px",
                marginRight: "10px",
                transition: "0.3s ease",
                color: tabIndex === index ? "#000" : "#787774",
              }}>
              {el?.months} Month
            </Tab>
          ))}
        </TabList>

        <TabPanel style={{marginTop: "40px"}}>
          <Grid container spacing={3} justifyContent={"center"}>
            {fares?.fares?.map((plan, index) => (
              <BillingFares
                discounts={discounts?.discounts}
                project={project}
                key={index}
                plan={plan}
                tabIndex={tabIndex}
              />
            ))}
          </Grid>
        </TabPanel>

        <TabPanel style={{marginTop: "20px"}}>
          <Grid container spacing={3}>
            {fares?.fares?.map((plan, index) => (
              <BillingFares
                project={project}
                key={index}
                plan={plan}
                tabIndex={tabIndex}
              />
            ))}
          </Grid>
        </TabPanel>
      </Tabs>
    </Box>
  );
};

const BillingFares = ({plan, tabIndex, discounts}) => {
  const isBestPlan = plan?.bestValue;
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(discounts?.[tabIndex] ?? null);
  const [selectedFare, setSelectedFare] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const projectId = store.getState().company.projectId;

  const handleClick = () => {
    setOpen(true);
  };

  const calculatePrice = (element) => {
    setSelectedFare(element);
    billingService
      .calculateFarePrice({
        project_id: projectId,
        fare_id: element?.id,
        discount_id: selectedTab?.id,
      })
      .then((res) => {
        setCalculatedPrice(res);
        handleClick();
      });
  };

  useEffect(() => {
    setSelectedTab(discounts?.[tabIndex]);
  }, [tabIndex, discounts]);

  return (
    <Grid item xs={10} sm={6} md={4}>
      <Card
        sx={{
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center",
          border: isBestPlan ? "2px solid #4F46E5" : "1px solid #E2E8F0",
          boxShadow: isBestPlan
            ? "0px 4px 15px rgba(79, 70, 229, 0.3)"
            : "0px 4px 10px rgba(0,0,0,0.05)",
          backgroundColor: "#ffffff",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
          },
        }}>
        <CardContent>
          {isBestPlan && (
            <Typography
              sx={{
                backgroundColor: "#4F46E5",
                color: "white",
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "inline-block",
                marginBottom: "8px",
              }}>
              Best Value
            </Typography>
          )}

          <Typography sx={{fontWeight: "bold", fontSize: "14px"}}>
            {plan?.name && plan?.name}
          </Typography>

          <Typography sx={{fontWeight: "bold", fontSize: "22px"}}>
            USD {plan?.price} / {tabIndex === 0 ? "monthly" : "Yearly"}
          </Typography>

          <Typography sx={{fontSize: "14px", color: "#64748B", mb: 2}}>
            Billed {tabIndex === 0 ? "monthly" : "Yearly"}
          </Typography>

          <Typography sx={{color: "#64748B", fontSize: "14px", mb: 2}}>
            {plan?.description}
          </Typography>

          <Button
            onClick={() => {
              calculatePrice(plan);
              handleClick();
            }}
            variant="outlined"
            sx={{
              color: isBestPlan ? "white" : "black",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#007aff",
                color: "#fff",
              },
            }}>
            Choose Plan
          </Button>
          <PaymentDialog
            selectedTab={selectedTab}
            calculatedPrice={calculatedPrice}
            selectedFare={selectedFare}
            setOpen={setOpen}
            open={open}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};

const PaymentDialog = ({
  open,
  setOpen = () => {},
  selectedFare,
  calculatedPrice,
  selectedTab,
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const projectId = store.getState().company.projectId;

  const makePayment = () => {
    setLoading(true);
    billingService
      .makePayment({
        project_id: projectId,
        fare_id: selectedFare?.id,
        discount_id: selectedTab?.id,
      })
      .then((res) => {
        dispatch(showAlert("Successfully paid!", "success"));
        handleClose();
        queryClient.refetchQueries(["PROJECT"]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <Box
          sx={{
            width: "400px",
            padding: "24px",
            backgroundColor: "#F8FAFC",
            borderRadius: "12px",
          }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            gutterBottom>
            Upgrade your plan to{" "}
            <span style={{color: "#007aff"}}>{selectedFare?.name}</span>
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={2}>
            You’re just a step away from enjoying exclusive features!
          </Typography>

          <Box
            sx={{
              backgroundColor: "#fff",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}>
            <Typography variant="body2" fontWeight="bold">
              Your Balance: <span>{calculatedPrice?.project_balance} UZS</span>
            </Typography>

            <Divider sx={{my: 1}} />

            <Typography variant="body2" fontWeight="bold">
              Plan:
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {selectedFare?.name} x {selectedFare?.seats || "1 Seat"} (Monthly)
            </Typography>

            <Divider sx={{my: 1}} />

            <Typography variant="body2" fontWeight="bold">
              Date:
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {calculatedPrice?.start_date} / {calculatedPrice?.end_date}
            </Typography>

            <Typography variant="body2" fontWeight="bold">
              Price:
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {calculatedPrice?.calculated_price} UZS
            </Typography>
            <Divider sx={{my: 1}} />
          </Box>
          <Typography variant="h6" fontWeight="bold" textAlign="center" mt={1}>
            Total:{" "}
            <span style={{color: "#000"}}>
              {calculatedPrice?.calculated_price} UZS
            </span>
          </Typography>

          <Box sx={{display: "flex", justifyContent: "space-between", mt: 3}}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleClose}
              sx={{mr: 1}}>
              Cancel Payment
            </Button>
            <Button
              loading={loading}
              onClick={makePayment}
              variant="outlined"
              sx={{color: "#007aff"}}
              fullWidth>
              Confirm and Pay
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default BillingTariffs;
