import {differenceInCalendarDays, isValid, parseISO} from "date-fns";
import {useSyncExternalStore} from "react";

const getProjectStatus = (projectInfo, fallbackStatus) =>
  projectInfo?.status || fallbackStatus;

const parseExpireDate = (expireDate) => {
  if (!expireDate) return null;

  const date = expireDate instanceof Date ? expireDate : parseISO(expireDate);

  return isValid(date) ? date : null;
};

export const getSubscriptionDaysLeft = (expireDate) => {
  const expireAt = parseExpireDate(expireDate);

  if (!expireAt) return null;

  return differenceInCalendarDays(expireAt, new Date()) + 1;
};

export const isSubscriptionExpired = (projectInfo, fallbackStatus) => {
  const daysLeft = getSubscriptionDaysLeft(projectInfo?.expire_date);

  return (
    getProjectStatus(projectInfo, fallbackStatus) === "inactive" ||
    (daysLeft !== null && daysLeft <= 0)
  );
};

export const isSubscriptionWarningActive = (projectInfo, fallbackStatus) => {
  const daysLeft = getSubscriptionDaysLeft(projectInfo?.expire_date);
  const projectStatus = getProjectStatus(projectInfo, fallbackStatus);

  if (daysLeft === null || daysLeft <= 0) return false;

  if (projectInfo?.subscription_type === "free_trial") {
    return daysLeft <= 16;
  }

  if (
    projectStatus === "insufficient_funds" &&
    projectInfo?.subscription_type === "paid"
  ) {
    return daysLeft <= 5;
  }

  return daysLeft <= 7;
};

export const isSubscriptionBannerVisible = (projectInfo, fallbackStatus) =>
  isSubscriptionExpired(projectInfo, fallbackStatus) ||
  isSubscriptionWarningActive(projectInfo, fallbackStatus);

// ponytail: sessionStorage + a listener set instead of a redux slice — the flag
// dies with the tab, which is exactly the "show again after re-login" requirement.
const DISMISS_KEY = "subscription_banner_dismissed";
const dismissListeners = new Set();

const subscribeDismiss = (onChange) => {
  dismissListeners.add(onChange);
  return () => dismissListeners.delete(onChange);
};

const isBannerDismissed = () =>
  sessionStorage.getItem(DISMISS_KEY) === "true";

export const dismissSubscriptionBanner = () => {
  sessionStorage.setItem(DISMISS_KEY, "true");
  dismissListeners.forEach((onChange) => onChange());
};

export const useSubscriptionBannerDismissed = () =>
  useSyncExternalStore(subscribeDismiss, isBannerDismissed);

export const useSubscriptionBannerVisible = (projectInfo, fallbackStatus) =>
  !useSubscriptionBannerDismissed() &&
  isSubscriptionBannerVisible(projectInfo, fallbackStatus);
