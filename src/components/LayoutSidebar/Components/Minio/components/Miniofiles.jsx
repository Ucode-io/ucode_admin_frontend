import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionIcon from "@mui/icons-material/Description";
const cdnURL = import.meta.env.VITE_CDN_BASE_URL;

const Card = ({ item, selected, onSelect }) => {
  const url = `${cdnURL}${item.object_name}`;

  const parts = item?.object_name?.split(".");
  const extension = parts[parts.length - 1];

  return (
    <Box className={style.card} key={item?.id}>
      <span
        className={`${selected ? style.checked : style.unchecked}`}
        onClick={() => onSelect(item)}
      >
        {selected && <CheckIcon />}
      </span>
      <Box className={`${style.file} ${selected && style.dop}`}>
        {extension === "png" ? (
          <img alt="sorry" src={url} className={style.img} />
        ) : (
          <DescriptionIcon />
        )}
      </Box>
      <Typography className={style.title} variant="h6">
        <Tooltip title={item?.object_name.slice(81, 110)}>
          {item?.object_name.slice(81, 88)}...
        </Tooltip>
      </Typography>
      <Typography variant="h6" className={style.text}>
        {extension === "png" ? extension?.toUpperCase() : "DOC"}
      </Typography>
    </Box>
  );
};

const MinioFiles = ({ minios, setSelectedCards, selectedCards }) => {
  const toggleSelectCard = (item) => {
    if (selectedCards?.includes(item)) {
      setSelectedCards(selectedCards?.filter((card) => card !== item));
    } else {
      setSelectedCards([...selectedCards, item]);
    }
  };

  return (
    <>
      <Box className={style.miniocontainer}>
        {minios?.objects?.map((item) => (
          <Card
            key={item}
            item={item}
            selected={selectedCards?.includes(item)}
            onSelect={toggleSelectCard}
          />
        ))}
      </Box>
    </>
  );
};

export default MinioFiles;
