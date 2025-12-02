import { EyeOffIcon, EyeIcon } from "@/utils/constants/icons";
import { memo, useState } from "react";
import cls from "./styles.module.scss";

export const PasswordDisplay = memo(({ value, onBlur = () => {}, }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [innerValue, setInnerValue] = useState(value);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return <div className={cls.passwordWrapper}>
    <input 
      className={cls.password} 
      type={showPassword ? "text" : "password"}
      defaultValue={innerValue}
      onBlur={(e) => {
        onBlur(e);
        setInnerValue(e.target.value);
      }}
    />
    <button
      className={cls.showPassword}
      aria-label="toggle password visibility"
      onClick={togglePasswordVisibility}
    >
      {showPassword ? <EyeIcon color="#475467" /> : <EyeOffIcon color="#475467" />}
    </button>
  </div>;
})

PasswordDisplay.displayName = "PasswordDisplay";