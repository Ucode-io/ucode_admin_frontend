import React, { useMemo, useState } from "react";
import styles from "./month.module.scss";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import ModalDetailPage from "../../ModalDetailPage/ModalDetailPage";
import DataMonthCard from "./DataMonthCard";
import { dateValidFormat } from "../../../../utils/dateValidFormat";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CalendarTemplate = ({ month, data, view, fieldsMap }) => {
  console.log("data", data);
  const [open, setOpen] = useState();
  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const navigateToCreatePage = (time) => {
    // navigateToForm(tableSlug, "CREATE", null, {
    //   [startTimeStampSlug]: computedDate,
    //   [parentTab?.slug]: parentTab?.value,
    //   specialities_id: categoriesTab?.value,
    // });
    setOpen(true);
    setDateInfo({});
  };

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDateInfo({});
  };

  const viewFields = useMemo(() => {
    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [fieldsMap, view]);

  return (
    <>
      <Box className={styles.calendarTemplate}>
        {daysOfWeek?.map((date, index) => (
          <Box key={index} className={styles.days}>
            {date}
          </Box>
        ))}
      </Box>
      <Box className={styles.calendarTemplate}>
        {month?.map((date, index) => (
          <Box key={index} className={styles.calendar}>
            <Box className={styles.desc} onClick={() => navigateToCreatePage()}>
              <Box className={`${styles.addButton}`}>
                <Add color="" />
                Создать
              </Box>
            </Box>
            {new Date(date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}

            <Box className={styles.card}>
              {data?.map((el) =>
                // console.log(
                //   "ddfdfdfdf",
                //   dateValidFormat(date, "dd.MM.yyyy") === el?.calendar.date
                // )
                dateValidFormat(date, "dd.MM.yyyy") === el?.calendar.date ? (
                  <DataMonthCard
                    key={el.id}
                    date={date}
                    view={view}
                    fieldsMap={fieldsMap}
                    data={el}
                    viewFields={viewFields}
                    navigateToEditPage={navigateToEditPage}
                  />
                ) : null
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <ModalDetailPage
        open={open}
        setOpen={setOpen}
        dateInfo={dateInfo}
        selectedRow={selectedRow}
      />
    </>
  );
};

export default CalendarTemplate;
