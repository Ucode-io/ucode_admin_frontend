import {differenceInCalendarDays, parseISO} from "date-fns";
import React, { useMemo } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {Box, Typography} from "@mui/material";

const SubscriptionWarning = ({ projectInfo, handleOpenBilling }) => {
  const projectStatus = localStorage.getItem("project_status");
  const subscriptionType = projectInfo?.subscription_type;
  const expireDate = projectInfo?.expire_date;

  const daysLeft = useMemo(() => {
    if (!expireDate) return null;
    return differenceInCalendarDays(parseISO(expireDate), new Date()) + 1;
  }, [expireDate]);

  if (projectStatus === "inactive")
    return <SubscribeExpired onClick={handleOpenBilling} />;

  if (
    projectStatus === "insufficient_funds" &&
    subscriptionType === "free_trial" &&
    daysLeft <= 16
  ) {
    return (
      <WarningBanner
        onClick={handleOpenBilling}
        message="Your free trial is ending soon, "
        daysLeft={daysLeft}
        bgColor="lightblue"
      />
    );
  }

  if (
    projectStatus === "insufficient_funds" &&
    subscriptionType === "paid" &&
    daysLeft <= 5
  ) {
    return (
      <WarningBanner
        onClick={handleOpenBilling}
        message="Your subscription will expire soon, "
        daysLeft={daysLeft}
      />
    );
  }

  return null;
};

const WarningBanner = ({
  onClick = () => {},
  message,
  daysLeft,
  bgColor = "rgb(255, 244, 180)",
}) => (
  <Box
    onClick={onClick}
    sx={{
      position: "sticky",
      top: 0,
      height: "32px",
      width: "100%",
      background: bgColor,
      left: 0,
      padding: "10px 10px 10px 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      zIndex: 9,
      cursor: "pointer",
      justifyContent: "center",
    }}>
    <Box sx={{display: "flex", alignItems: "center"}}>
      <WarningAmberIcon
        sx={{color: "#000", fontSize: 20, marginRight: "10px"}}
      />
      <Typography sx={{fontSize: "12px", fontWeight: "bold", color: "#000"}}>
        {message} {daysLeft !== null && <strong>{daysLeft} days left.</strong>}
      </Typography>
    </Box>
    <Typography sx={{fontSize: "12px", color: "#000"}}>
      Please <strong>Click here</strong> to upgrade your plan.
    </Typography>
  </Box>
);

const SubscribeExpired = ({onClick = () => {}}) => (
  <Box
    onClick={onClick}
    sx={{
      position: "sticky",
      top: 0,
      height: "32px",
      width: "100%",
      background: "#FFBDB8",
      left: 0,
      padding: "10px 10px 10px 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      zIndex: 9,
      cursor: "pointer",
      justifyContent: "center",
    }}>
    <Box sx={{display: "flex", alignItems: "center"}}>
      <WarningAmberIcon
        sx={{color: "#000", fontSize: 20, marginRight: "10px"}}
      />
      <Typography sx={{fontSize: "12px", fontWeight: "bold", color: "#000"}}>
        Your subscription has expired.
      </Typography>
    </Box>
    <Typography sx={{fontSize: "12px", color: "#000"}}>
      Please renew to continue accessing our services.{" "}
      <strong style={{textDecoration: "underline"}}>
        Click here to upgrade your plan.
      </strong>
    </Typography>
  </Box>
);

export default SubscriptionWarning;
