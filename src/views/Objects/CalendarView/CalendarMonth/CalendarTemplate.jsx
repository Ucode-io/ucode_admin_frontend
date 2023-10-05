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
  const [open, setOpen] = useState();
  const [dateInfo, setDateInfo] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const navigateToCreatePage = (time) => {
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

  const dayNames = month?.map((dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    return daysOfWeek[dayOfWeek];
  });
  const dayOfWeek = dayNames?.slice(0, 7);

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
        {/* <Box className={styles.calendar}></Box> */}
        {month?.map((date, index) => (
          <>
            <Box key={index} className={styles.calendar}>
              {!data?.includes(date) && (
                <Box
                  className={styles.desc}
                  onClick={() => navigateToCreatePage()}
                >
                  <Box className={`${styles.addButton}`}>
                    <Add color="" />
                    Создать
                  </Box>
                </Box>
              )}
              {new Date(date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}

              <Box className={styles.card}>
                {data?.map((el, idx) =>
                  dateValidFormat(date, "dd.MM.yyyy") === el?.calendar.date ||
                  dateValidFormat(date, "dd.MM.yyyy") ===
                    dateValidFormat(el?.date_to, "dd.MM.yyyy") ? (
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
          </>
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
