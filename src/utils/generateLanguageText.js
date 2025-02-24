export const generateLangaugeText = (lanObject, lan, key = "Add website") => {
  return (
    lanObject?.values?.find((el) => el?.key === key)?.translations?.[lan] ??
    null
  );
};
