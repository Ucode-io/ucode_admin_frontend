import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useSearchInputProps } from "./useSearchInputProps";
import SearchIcon from "@mui/icons-material/Search";

export const SearchInput = ({ onChange, ...props }) => {

  const {
    text,
    handleChange,
  } = useSearchInputProps();

  return <Box className={cls.fieldSearchContainer}>
    <input
      className={cls.fieldSearch}
      type="text"
      value={text}
      onChange={(e) => {
        handleChange(e);
        onChange(e)
      }}
      placeholder="Search field"
      {...props}
    />
    <span>
      <SearchIcon htmlColor="#6E8BB7" />
    </span>
  </Box>
}
