import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useAddOptionProps } from "./useAddOptionProps";
import AddIcon from '@mui/icons-material/Add';

export const AddOption = ({ label = "Options", onClick = () => {} }) => {

  const {} = useAddOptionProps();

  return <Box paddingX="8px" display="flex" alignItems="center" justifyContent="space-between">
    <p className={cls.label}>{label}</p>
    <button type="button" onClick={onClick}>
      <span>
        <AddIcon htmlColor="#8F8E8B" />
      </span>
    </button>
  </Box>
}
