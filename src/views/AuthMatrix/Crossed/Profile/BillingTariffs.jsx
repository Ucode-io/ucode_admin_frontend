import React, {useEffect, useMemo, useState} from "react";
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
import {numberWithSpaces} from "../../../../utils/formatNumbers";

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

  const tabWidth = 120;
  const tabListWidth = useMemo(() => {
    return discounts?.discounts?.length * tabWidth;
  }, [discounts?.discounts]);

  return (
    <Box
      id="billingTariff"
      sx={{
        margin: "auto",
        padding: "30px 20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
      }}>
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList
          style={{
            display: "flex",
            borderBottom: "none",
            background: "#eeee",
            borderRadius: "12px",
            padding: "3px 3px 4px",
            width: `${tabListWidth ?? 0}px`,
            borderBottom: "none",
          }}>
          {discounts?.discounts?.map((el, index) => (
            <Tab
              key={el?.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                fontSize: "14px",
                cursor: "pointer",
                border: "none",
                borderRadius: "10px",
                transition: "0.3s ease",
                color: "#000",
                width: "120px",
                backgroundColor: tabIndex === index ? "#fff" : "transparent",
                boxShadow:
                  tabIndex === index
                    ? "0px 4px 12px rgba(0, 0, 0, 0.1)"
                    : "none",
                position: "relative",
              }}>
              {el?.months} {el?.months === 1 ? "Month" : "Months"}
            </Tab>
          ))}
        </TabList>

        {discounts?.discounts?.map((element, index) => (
          <TabPanel key={index} style={{marginTop: "40px"}}>
            <Grid container spacing={3} justifyContent={"center"}>
              {fares?.fares?.map((plan, index) => (
                <BillingFares
                  element={element}
                  discounts={discounts?.discounts}
                  project={project}
                  key={index}
                  plan={plan}
                  tabIndex={tabIndex}
                />
              ))}
            </Grid>
          </TabPanel>
        ))}
      </Tabs>
    </Box>
  );
};

const BillingFares = ({plan, tabIndex, discounts, element}) => {
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
          textAlign: "center",
          padding: "20px",
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
          position: "relative",
        }}>
        <CardContent>
          {Boolean(!isBestPlan && element?.value) && (
            <Typography
              sx={{
                backgroundColor: "#004eea",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "inline-block",
                marginBottom: "8px",
              }}>
              {plan?.name === "Enterprise"
                ? "Custom"
                : `$${calculateDiscountPrice(plan, element)}`}
            </Typography>
          )}

          <Typography sx={{fontWeight: "bold", fontSize: "28px"}}>
            {plan?.name && plan?.name}
          </Typography>

          <Typography sx={{fontWeight: "bold", fontSize: "22px"}}>
            {plan?.name === "Enterprise" ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}>
                <span>Custom</span>
                <span style={{fontSize: "14px"}}> (Contact us)</span>
              </Box>
            ) : (
              <>
                <span>
                  $
                  {Number(calculateDiscountPrice(plan, element)) /
                    Number(element?.months)}{" "}
                  / monthly
                </span>
                <Typography
                  sx={{
                    fontSize: "12px",
                    mb: 2,
                  }}>
                  Billed Every: {element?.months} Month
                </Typography>
              </>
            )}
            <span style={{fontSize: "26px"}}></span>
          </Typography>

          <Typography
            sx={{
              color: "#64748B",
              fontSize: "14px",
              mb: 2,
              maxWidth: "250px",
              mx: "auto",
            }}>
            {plan?.description}
          </Typography>

          <Button
            onClick={() => {
              calculatePrice(plan);
              handleClick();
            }}
            variant="outlined"
            sx={{
              width: "100%",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
              bgcolor: "#004eea",
              fontSize: "16px",
              color: "#fff",
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
        {element?.value && <DiscountRate element={element} />}
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
            <span
              style={{
                color: "#007aff",
                background: "#e1ecf5",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#175CD3",
              }}>
              {selectedFare?.name}
            </span>
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography sx={{fontSize: "12px", color: "#787774"}}>
                Your Balance:
              </Typography>{" "}
              <Typography fontSize={"12px"} variant="h6">
                {numberWithSpaces(
                  Number(calculatedPrice?.project_balance ?? 0)
                )}{" "}
                UZS
              </Typography>
            </Box>

            <Divider sx={{my: 1}} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Plan:
              </Typography>
              <Typography variant="body2" sx={{color: "#212b36"}}>
                {selectedFare?.name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                my: "10px",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Date:
              </Typography>
              <Typography variant="body2" sx={{color: "#212b36"}}>
                {calculatedPrice?.start_date} / {calculatedPrice?.end_date}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Price:
              </Typography>
              <Typography variant="body2" sx={{color: "#212b36"}}>
                {numberWithSpaces(
                  Number(calculatedPrice?.calculated_price ?? 0)
                )}{" "}
                UZS
              </Typography>
            </Box>
            <Divider sx={{my: 1}} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body2" sx={{color: "#787774"}}>
                Total:{" "}
              </Typography>

              <Typography fontWeight="bold" textAlign="center" mt={1}>
                {numberWithSpaces(
                  Number(calculatedPrice?.calculated_price ?? 0)
                )}{" "}
                UZS
              </Typography>
            </Box>
          </Box>

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

const DiscountRate = ({text = "10% OFF"}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "15px",
        left: "-30px",
        background: "red",
        color: "white",
        fontSize: "12px",
        fontWeight: "bold",
        textTransform: "uppercase",
        padding: "5px 15px",
        transform: "rotate(-45deg)",
        width: "120px",
        textAlign: "center",
        zIndex: 10,
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          borderStyle: "solid",
          borderWidth: "5px",
          display: "block",
        },
        "&::before": {
          top: "100%",
          left: 0,
          borderColor: "red transparent transparent transparent",
        },
        "&::after": {
          top: "100%",
          right: 0,
          borderColor: "red transparent transparent transparent",
        },
      }}>
      {text}
    </Box>
  );
};

const calculateDiscountPrice = (plan, element) => {
  if (!plan?.price || !element?.months) return 0;

  const monthlyPrice = Number(plan.price);
  const duration = Number(element.months);
  const discount = element.value ? Number(element.value) : 0;

  const totalPrice = monthlyPrice * duration;
  const discountedPrice = totalPrice - (totalPrice * discount) / 100;
  return discountedPrice;
};

export default BillingTariffs;
