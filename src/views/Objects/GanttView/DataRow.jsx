import { Add } from "@mui/icons-material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useTabRouter from "../../../hooks/useTabRouter";
import { calculateGantCalendarYears } from "../../../utils/calculateGantCalendar";
import { getRelationFieldTableCellLabel } from "../../../utils/getRelationFieldLabel";
import styles from "./style.module.scss";

const DataRow = ({ tab, datesList, view, fieldsMap, period, data }) => {
  const { tableSlug } = useParams();
  const { navigateToForm } = useTabRouter();

  const rowWidth = datesList?.length * 160 + 200;

  const daysDifference = (startDate, endDate) => {
    return Math.round(
      new Date(new Date(endDate) - new Date(startDate)).getTime() /
        (1000 * 3600 * 24)
    );
  };

  const viewFields = useMemo(() => {
    if (!data) return [];

    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [data, view, fieldsMap]);

  const navigateToEditPage = (data) => {
    navigateToForm(tableSlug, "EDIT", data);
  };

  const navigateToCreatePage = (date) => {
    const startTimeStampSlug = view?.calendar_from_slug;
    navigateToForm(tableSlug, "CREATE", null, {
      [startTimeStampSlug]: date,
      [tab?.slug]: tab?.value,
      ...tab,
    });
  };

  const computedDateList = useMemo(() => {
    if (datesList?.length) {
      if (period === "years") {
        return calculateGantCalendarYears(datesList).reduce(
          (acc, cur) => [...acc, ...cur[1]],
          []
        );
      }
      return datesList;
    }
    return [];
  }, [datesList, period]);

  const computedData = useMemo(() => {
    const result = {};

    data?.forEach((el) => {
      if (el[tab.slug] === tab.value) {
        result[el?.calendar?.date] = el;
      }
    });

    return result;
  }, [data, tab]);

  // console.log("viewFields", viewFields);

  return (
    <div className={styles.row} style={{ width: rowWidth }}>
      <div
        className={`${styles.tabBlock}`}
        style={{ paddingLeft: 20, zIndex: 1 }}
      >
        {tab.label}
      </div>
      {period !== "years" &&
        Object.entries(computedData)?.map((frame) => (
          <div
            className={styles.ganttFrame}
            onClick={() => navigateToEditPage(frame[1])}
            key={frame[0]}
            style={{
              left:
                200 +
                159 * daysDifference(computedDateList[0], frame[1]?.date_from),
              width: `${
                159 * daysDifference(frame[1]?.date_from, frame[1]?.date_to)
              }px`,
            }}
          >
            {viewFields?.map((field) => (
              <div>
                {field.type === "LOOKUP"
                  ? getRelationFieldTableCellLabel(
                      field,
                      frame[1],
                      field.slug + "_data"
                    )
                  : frame[1][field.slug]}
              </div>
            ))}
          </div>
        ))}

      {computedDateList?.map((date) => (
        <div
          className={`${styles.dataBlock}`}
          onClick={() => navigateToCreatePage(date)}
        >
          <Add />
        </div>
      ))}
    </div>
  );
};

export default DataRow;
