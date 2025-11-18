import {Box} from "@mui/material";
import cls from "./styles.module.scss";
import {format} from "date-fns";
import {getRelationFieldTableCellLabel} from "@/utils/getRelationFieldLabel";
import {dateValidFormat} from "@/utils/dateValidFormat";
import MultiselectCellColoredElement from "@/components/ElementGenerators/MultiselectCellColoredElement";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

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

  const getFieldComponent = (field) => {
    switch(field.type) {
      case FIELD_TYPES.LOOKUP:
        return <Box style={flex}>
          <p className={textClassName || cls.infoText}>{field?.label}</p>{" "}
          {getRelationFieldTableCellLabel(
            field,
            data,
            field.slug + "_data"
          )}
        </Box>
      case FIELD_TYPES.DATE_TIME:
        return  <Box style={flex}>
          <p className={textClassName || cls.infoText}>{field?.label}:</p>{" "}
          {dateValidFormat(data[field?.slug], "dd.MM.yyyy HH:mm")}
        </Box>
      case FIELD_TYPES.DATE:
        return  <Box style={flex}>
          <p className={textClassName || cls.infoText}>{field?.label}:</p>{" "}
          {dateValidFormat(data[field?.slug], "dd.MM.yyyy")}
        </Box>
      case FIELD_TYPES.DATE_TIME_WITHOUT_TIME_ZONE:
        return <Box style={flex}>
          <p className={textClassName || cls.infoText}>{field?.label}:</p>{" "}
          {dateValidFormat(data[field?.slug], "dd.MM.yyyy HH:mm")}
        </Box>
      case FIELD_TYPES.MULTISELECT:
        return <MultiselectCellColoredElement
            style={{ padding: "2px 5px", marginBottom: 4 }}
            value={data[field?.slug]}
            field={field}
          />
      default: 
        return <Box style={flex}>
          <p className={textClassName || cls.infoText}>
            {data[field?.slug]}
          </p>{" "}
        </Box>
    }
  }

  return (
    <div className={`${cls.infoBlock}`}>

      {
        viewFields?.map((field) => getFieldComponent(field))
      }
    </div>
  );
};
