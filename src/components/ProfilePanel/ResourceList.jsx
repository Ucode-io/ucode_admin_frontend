import { Box, Tooltip } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const flexStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
};
const ResourceList = ({ item, className, colorItem, ...props }) => {
  return (
    <div style={{ ...flexStyle, width: "100%" }}>
      <Box style={{ ...flexStyle, columnGap: "8px" }}>
        <p
          className={className}
          style={{
            background: colorItem.display_color,
          }}
        >
          {item?.charAt(0).toUpperCase()}
        </p>
        <Tooltip title={item}>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "90px",
            }}
          >
            {item}
          </p>
        </Tooltip>
      </Box>
      <Box>
        <KeyboardArrowRightIcon
          style={{
            color: "#747474",
          }}
        />
      </Box>
    </div>
  );
};

export default ResourceList;
