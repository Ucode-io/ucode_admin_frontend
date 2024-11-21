import React from "react";
import classes from "../style.module.scss";
import {useTranslation} from "react-i18next";
import ExternalAuth from "../ExternalAuth";
import HFPhoneLoginField from "../../../../../components/FormElements/HFPhoneLoginField";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";
import {Box} from "@mui/material";

function PhoneLogin({control, loading = false, setFormType = () => {}}) {
  const {t} = useTranslation();

  return (
    <>
      <Box>
        <div className={classes.formRow}>
          <p className={classes.label}>{"Phone number *"}</p>
          <HFPhoneLoginField
            required
            control={control}
            name="phone"
            size="large"
            fullWidth
            placeholder="Enter phone number"
            autoFocus
          />
        </div>

        <PrimaryButton
          size="large"
          style={{width: "100%", marginTop: "16px", borderRadius: "8px"}}
          loader={loading}>
          {t("enter")}
        </PrimaryButton>
        <ExternalAuth setFormType={setFormType} />
      </Box>
    </>
  );
}

export default PhoneLogin;
