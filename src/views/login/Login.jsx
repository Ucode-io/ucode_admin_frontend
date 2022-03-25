import { useHistory } from "react-router-dom";
import Button from "components/Button";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import PhoneIcon from "@material-ui/icons/Phone";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import DeleverLogo from "assets/icons/Delever.png";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";
import axios from "utils/axios";
import { useDispatch } from "react-redux";
import { SET_AUTH_TOKENS } from "redux/constants";
import AlertComponent from "components/Alert";
import { showAlert } from "redux/actions/alertActions";
import defaultSettings from "config/defaultSettings";
import { staticPermissions } from "./permissions";

export default function App() {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [pwdType, setPwdType] = useState("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return setError(true);

    setLoader(true);

    axios
      .post("/shipper-users/login", { username, password }) //post_default
      .then((res) => {
        console.log("loginRes", res);
        dispatch({
          type: SET_AUTH_TOKENS,
          payload: {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            username: res.username,
            name: res.name,
            permissions: staticPermissions,
            is_blocked: res.is_blocked,
            region_id: res.region_id,
            shipper_id: res.user_role.shipper_id,
          },
        });
        history.push("/home/dashboard");
      })
      .catch(() => dispatch(showAlert("Login yoki parol noto'gri terilgan")))
      .finally(() => setLoader(false));
  };

  const validation = (value) => {
    if (!error || value) return "";
    return "error";
  };

  return (
    <div className="h-screen flex font-body login-form">
      <AlertComponent />
      <div className="w-6/12 h-screen flex flex-col gap-5 justify-center items-center bg-gradient-to-t from-blue-100">
        <img src={DeleverLogo} alt="logo" style={{ width: "60%" }} />
      </div>
      <div className="w-6/12 h-screen bg-background justify-around items-center flex flex-col shadow ">
        <div className="w-3/4 mt-24 rounded-2xl shadow-lg bg-white h-6/12 p-3">
          <div className="text-3xl font-semibold p-4">{t("signin")}</div>
          <hr></hr>
          <form onSubmit={onFormSubmit}>
            <div className="flex flex-col p-6 font-semibold space-y-6">
              <div
                className={`flex flex-col space-y-2 ${validation(username)}`}
              >
                <label>{t("username")}</label>
                <span className="flex items-center space-x-2 p-3 bg-background_2 rounded-lg form-item">
                  <span>
                    <AccountCircleIcon style={{ color: "#6E8BB7" }} />
                  </span>
                  <input
                    placeholder={t("enter.username")}
                    type="text"
                    spellCheck="false"
                    id="login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  ></input>
                </span>
              </div>
              <div
                className={`flex flex-col space-y-2 ${validation(password)}`}
              >
                <label>{t("password")}</label>
                <span className="items-center space-x-2 p-3 bg-background_2 rounded-lg flex form-item">
                  <span>
                    <LockIcon style={{ color: "#6E8BB7" }} />
                  </span>
                  <input
                    type={pwdType}
                    placeholder={t("enter.password")}
                    spellCheck="false"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="cursor-pointer"
                    onClick={(e) => {
                      setPwdType((prev) => {
                        return prev === "password" ? "text" : "password";
                      });
                    }}
                  >
                    {pwdType === "password" ? (
                      <VisibilityIcon style={{ color: "#6E8BB7" }} />
                    ) : (
                      <VisibilityOffIcon style={{ color: "#6E8BB7" }} />
                    )}
                  </span>
                </span>
              </div>
            </div>
            <hr></hr>
            <div className="px-6 py-3">
              <Button
                type="submit"
                className="w-full flex justify-center align-center"
                color="blue"
                shape="filled"
                size="large"
                loading={loader}
              >
                {t("enter")}
              </Button>
            </div>
          </form>
        </div>

        <div className="rounded-xl  h-21 w-3/4 p-5 bg-white flex justify-between items-center shadow-lg">
          <div className="flex space-x-2 items-center">
            <PhoneIcon />
            <span>{t("support.service")}</span>
          </div>
          <div>
            <span>{defaultSettings.supportPhonenumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
