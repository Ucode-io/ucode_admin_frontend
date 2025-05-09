import {Box} from "@mui/material";
import cls from "./styles.module.scss";
import {format} from "date-fns";
import {getRelationFieldTableCellLabel} from "@/utils/getRelationFieldLabel";
import {dateValidFormat} from "@/utils/dateValidFormat";
import MultiselectCellColoredElement from "@/components/ElementGenerators/MultiselectCellColoredElement";

const flex = {
  display: "flex",
  alignItems: "center",
  columnGap: "6px",
  justifyContent: "center",
};

export const InfoBlockMonth = ({viewFields, data, isSingleLine, textClassName}) => {
  if (isSingleLine)
    return (
      <div className={`${cls.infoBlock} ${cls.singleLine}`}>
        {data.calendar?.elementFromTime
          ? format(data.calendar?.elementFromTime, "HH:mm")
          : ""}
        -
        {data.calendar?.elementToTime
          ? format(data.calendar?.elementToTime, "HH:mm")
          : ""}
      </div>
    );

  return (
    <div className={`${cls.infoBlock}`}>
      {/* <div>
        <Typography variant="h6" fontSize={"18px"}>
          {dateValidFormat(data.calendar?.elementFromTime, "HH:mm")}-{" "}
          {dateValidFormat(data.calendar?.elementToTime, " HH:mm")}
        </Typography>
      </div> */}

      {/* {viewFields?.map((field) => ( */}
      <>
        {viewFields[0]?.type === "LOOKUP" ? (
          <Box style={flex}>
            <p className={textClassName || cls.infoText}>{viewFields[0]?.label}</p>{" "}
            {getRelationFieldTableCellLabel(
              viewFields[0],
              data,
              viewFields[0].slug + "_data"
            )}
          </Box>
        ) : viewFields[0]?.type === "DATE_TIME" ? (
          <Box style={flex}>
            <p className={textClassName || cls.infoText}>{viewFields[0]?.label}:</p>{" "}
            {dateValidFormat(data[viewFields[0]?.slug], "dd.MM.yyyy HH:mm")}
          </Box>
        ) : viewFields[0]?.type === "DATE_TIME_WITHOUT_TIME_ZONE" ? (
          <Box style={flex}>
            <p className={textClassName || cls.infoText}>{viewFields[0]?.label}:</p>{" "}
            {dateValidFormat(data[viewFields[0]?.slug], "dd.MM.yyyy HH:mm")}
          </Box>
        ) : viewFields[0]?.type === "MULTISELECT" ? (
          <MultiselectCellColoredElement
            style={{ padding: "2px 5px", marginBottom: 4 }}
            value={data[viewFields[0]?.slug]}
            field={viewFields[0]}
          />
        ) : (
          <Box style={flex}>
            <p className={textClassName || cls.infoText}>
              {/* {viewFields[0]?.label}: */}
              {data[viewFields[0]?.slug]}
            </p>{" "}
          </Box>
        )}
      </>
      {/* ))} */}
    </div>
  );
};
