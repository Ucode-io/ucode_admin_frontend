import {Box} from "@mui/material";
import OtpInput from "react-otp-input";
import PrimaryButton from "../../../../../components/Buttons/PrimaryButton";

function OtpComponent({
  otp,
  loading = false,
  verifyOtp = () => {},
  getOtpVal = () => {},
}) {
  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: "96px",
          textAlign: "center",
        }}>
        <h3
          style={{
            fontSize: "24px",
            color: "#101828",
            marginBottom: "8px",
          }}>
          Введите код
        </h3>
        <p
          style={{
            fontSize: "16px",
            color: "#101828",
            marginBottom: "8px",
          }}>
          Отправленный на почту
        </p>
        <p>ucodedllc@uc.com</p>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "24px",
        }}>
        <OtpInput
          value={otp}
          onChange={getOtpVal}
          numInputs={6}
          renderSeparator={<span style={{width: "14px"}}></span>}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            border: "1px solid #D0D5DD",
            borderRadius: "8px",
            width: "45px",
            height: "50px",
            fontSize: "22px",
            color: "#000",
            fontWeight: "400",
            caretColor: "blue",
          }}
        />
      </Box>
      <Box sx={{textAlign: "center", marginTop: "24px"}}>
        <p>Отправить код заново через 00:20</p>
        <PrimaryButton
          size="large"
          onClick={(e) => {
            e.preventDefault();
            verifyOtp();
          }}
          style={{
            width: "100%",
            marginTop: "24px",
            borderRadius: "8px",
          }}
          loader={loading}>
          Подтвердить
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default OtpComponent;
