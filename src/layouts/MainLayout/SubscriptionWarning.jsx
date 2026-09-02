import React, {useMemo} from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import {Box, IconButton, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {
  getSubscriptionDaysLeft,
  isSubscriptionExpired,
  isSubscriptionWarningActive,
  useSubscriptionBannerDismissed,
  dismissSubscriptionBanner,
} from "@/utils/subscriptionWarning";

const SubscriptionWarning = ({projectInfo, handleOpenBilling}) => {
  const {t} = useTranslation();
  const dismissed = useSubscriptionBannerDismissed();
  const projectStatus =
    projectInfo?.status || localStorage.getItem("project_status");
  const subscriptionType = projectInfo?.subscription_type;
  const expireDate = projectInfo?.expire_date;

  const daysLeft = useMemo(() => {
    if (!expireDate) return null;
    return getSubscriptionDaysLeft(expireDate);
  }, [expireDate]);

  if (dismissed) return null;

  if (isSubscriptionExpired(projectInfo, projectStatus))
    return <SubscribeExpired onClick={handleOpenBilling} />;

  if (!isSubscriptionWarningActive(projectInfo, projectStatus)) {
    return null;
  }

  if (subscriptionType === "free_trial") {
    return (
      <WarningBanner
        onClick={handleOpenBilling}
        message={t("free_trial_ending")}
        daysLeft={daysLeft}
        bgColor="lightblue"
      />
    );
  }

  return (
    <WarningBanner
      onClick={handleOpenBilling}
      message={t("subscribtion_expire_soon")}
      daysLeft={daysLeft}
    />
  );
};

const CloseBannerButton = () => {
  const {t} = useTranslation();
  return (
    <IconButton
      aria-label={t("close")}
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        dismissSubscriptionBanner();
      }}
      sx={{position: "absolute", right: "8px", padding: "2px", color: "#000"}}>
      <CloseIcon sx={{fontSize: 16}} />
    </IconButton>
  );
};

const WarningBanner = ({
  onClick = () => {},
  message,
  daysLeft,
  bgColor = "rgb(255, 244, 180)",
}) => {
  const {t} = useTranslation();
  return (
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
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <WarningAmberIcon
          sx={{ color: "#000", fontSize: 20, marginRight: "10px" }}
        />
        <Typography
          sx={{ fontSize: "12px", fontWeight: "bold", color: "#000" }}
        >
          {message}{" "}
          {daysLeft !== null && (
            <strong>
              {daysLeft} {Number(daysLeft) === 1 ? t("day") : t("days")}{" "}
              {t("left")}
            </strong>
          )}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "12px", color: "#000" }}>
        <strong style={{ textDecoration: "underline" }}>
          {t("click_here_upgrade")}
        </strong>
      </Typography>
      <CloseBannerButton />
    </Box>
  );
};

const SubscribeExpired = ({onClick = () => {}}) => {
  const {t} = useTranslation();
  return (
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
          {t("subscription_expired")}
        </Typography>
      </Box>
      <Typography sx={{fontSize: "12px", color: "#000"}}>
        {t("expired_content")}
        <strong style={{textDecoration: "underline"}}>
          {t("click_here_upgrade")}
        </strong>
      </Typography>
      <CloseBannerButton />
    </Box>
  );
};

export default SubscriptionWarning;
