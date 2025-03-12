import clsx from "clsx";
import cls from './styles.module.scss';
import { useEffect, useState } from "react";
import { store } from "@/store";
import billingService from "@/services/billingService";
import { Box, Typography } from "@mui/material";
import { Button } from "../../../../components/Button";
import { PaymentDialog } from "../PaymentDialog/PaymentDialog";

export const BillingFares = ({plan, tabIndex, discounts, element}) => {
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
    <Box className={clsx(cls.billingCard)}>
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
            marginBottom: "6px",
          }}>
          {plan?.name === "Enterprise"
            ? "Custom"
            : plan?.name === "Open Source"
              ? "Free"
              : `$${calculateDiscountPrice(plan, element)}`}
        </Typography>
      )}

      <Typography sx={{fontWeight: "bold", fontSize: "18px"}}>
        {plan?.name && plan?.name}
      </Typography>

      <Typography sx={{fontWeight: "bold", fontSize: "14px"}}>
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
        ) : plan?.name === "Open Source" ? (
          <span> Free</span>
        ) : (
          <>
            <span>
              $
              {Number(calculateDiscountPrice(plan, element)) /
                Number(element?.months)}{" "}
              / monthly
            </span>
          </>
        )}
        <span style={{fontSize: "18px"}}></span>
      </Typography>
      <Typography
        sx={{
          fontSize: "12px",
          mb: 1,
        }}>
        Billed Every: {element?.months} Month
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
        className={cls.btn}
        primary
        onClick={() => {
          calculatePrice(plan);
          handleClick();
        }}
      >
        Choose Plan
      </Button>
      <PaymentDialog
        selectedTab={selectedTab}
        calculatedPrice={calculatedPrice}
        selectedFare={selectedFare}
        setOpen={setOpen}
        open={open}
      />
      {element?.value &&
        plan?.name !== "Enterprise" &&
        plan?.name !== "Open Source" && <DiscountRate element={element} />}
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

function DiscountRate ({text = "10% OFF"}) {
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
