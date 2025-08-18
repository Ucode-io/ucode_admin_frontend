import { Box } from "@mui/material";
import cls from "./styles.module.scss";

export const ExampleHeader = ({ item, name }) => (
  <p className={cls.fieldTitle}>
    {typeof item?.icon === "string" ? <img src={item?.icon} width={13} height={13} alt="" /> : item?.icon}
    {name}
  </p>
);

export const ExampleBlock = ({ children }) => (
  <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
    {children}
  </Box>
);


