import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SortIcon from "@mui/icons-material/Sort";
import AppsIcon from "@mui/icons-material/Apps";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
const MinioFilterBlock = ({
  selectAllCards,
  selectedCards,
  removeCards,
  setSort,
  sort,
  setSize,
  size,
}) => {
  const changeSize = () => {
    if (size?.includes("small")) {
      setSize(style.miniocontainermiddle);
    }
    if (size?.includes("middle")) {
      setSize(style.miniocontainerbig);
    }
    if (size?.includes("big")) {
      setSize(style.miniocontainerbiggest);
    }
    if (size?.includes("biggest")) {
      setSize(style.miniocontainersmall);
    }
  };
  return (
    <>
      <Box className={style.filterblock}>
        <Box className={style.block}>
          <Box className={style.select}>
            {selectedCards?.length ? (
              <Typography
                variant="h5"
                className={style.title}
                onClick={removeCards}
              >
                <HighlightOffIcon /> {selectedCards?.length} Items Selected
              </Typography>
            ) : (
              <Typography
                variant="h5"
                className={style.title}
                onClick={selectAllCards}
              >
                <CheckCircleOutlineIcon /> Select All
              </Typography>
            )}
          </Box>
          <Box className={style.filter}>
            <Tooltip title="Card size">
              <AppsIcon onClick={changeSize} />
            </Tooltip>
            <Tooltip title="Sort description">
              {sort === "asc" ? (
                <SortIcon onClick={() => setSort("desc")} />
              ) : (
                <SortIcon onClick={() => setSort("asc")} />
              )}
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MinioFilterBlock;
