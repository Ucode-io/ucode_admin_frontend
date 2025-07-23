import React, {useMemo, useState} from "react";
import styles from "./month.module.scss";
import {Box} from "@mui/material";
import ModalDetailPage from "../../ModalDetailPage/ModalDetailPage";
import DataMonthCard from "./DataMonthCard";
import {dateValidFormat} from "../../../../utils/dateValidFormat";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {format, setHours, setMinutes} from "date-fns";
import DrawerDetailPage from "../../DrawerDetailPage";
import {useProjectGetByIdQuery} from "../../../../services/projectService";
import {useSelector} from "react-redux";
import {useQuery} from "react-query";
import layoutService from "../../../../services/layoutService";
import {useParams} from "react-router-dom";
import MaterialUIProvider from "../../../../providers/MaterialUIProvider";
import AddIcon from "@mui/icons-material/Add";
import clsx from "clsx";
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CalendarTemplate = ({
  month = [],
  data,
  view,
  fieldsMap,
  menuItem,
  setLayoutType,
  relationView,
}) => {
  const [open, setOpen] = useState();
  const [dateInfo, setDateInfo] = useState({});

  const [selectedRow, setSelectedRow] = useState({});
  const [defaultValue, setDefaultValue] = useState(null);
  const { tableSlug: tableSlugFromParams, appId } = useParams();

  const urlSearchParams = new URLSearchParams(window.location.search);
  const fieldSlug = urlSearchParams.get("field_slug");

  const tableSlug =
    fieldSlug ||
    view?.relation_table_slug ||
    tableSlugFromParams ||
    view?.table_slug;

  const projectId = useSelector((state) => state.company?.projectId);

  const navigateToCreatePage = async (time) => {
    const hour = Number(format(time, "H"));
    const minute = Number(format(time, "m"));
    const computedDate = await setHours(setMinutes(time, minute), hour);
    const startTimeStampSlug = view?.calendar_from_slug;

    setDateInfo({
      [startTimeStampSlug]: computedDate,
    });
    setOpen(true);
  };

  const navigateToEditPage = (el) => {
    setOpen(true);
    setSelectedRow(el);
    setDateInfo({});
  };

  const viewFields = useMemo(() => {
    return view?.columns?.map((id) => fieldsMap[id])?.filter((el) => el);
  }, [fieldsMap, view]);

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

  const {
    data: { layout } = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, appId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  return (
    <>
      <Box className={styles.calendarTemplate}>
        {daysOfWeek?.map((date, index) => (
          <Box
            key={index}
            className={styles.days}
            style={
              {
                // borderColor: new Date().getDay() === index ? "#007AFF" : "",
              }
            }
          >
            {date}
          </Box>
        ))}
      </Box>
      <Box
        className={clsx(styles.calendarTemplate, styles.calendarTemplateData)}
      >
        {Array.isArray(month) &&
          month?.map((date, index) => (
            <>
              <Box
                key={index}
                className={clsx(styles.calendar, {
                  [styles.today]:
                    dateValidFormat(new Date(), "dd.MM.yyyy") ===
                    dateValidFormat(date, "dd.MM.yyyy"),
                })}
                style={{
                  // borderColor:
                  //   dateValidFormat(new Date(), "dd.MM.yyyy") ===
                  //   dateValidFormat(date, "dd.MM.yyyy")
                  //     ? "#007AFF"
                  //     : "",
                  background:
                    date.getDay() === 0 || date.getDay() === 6 ? "#f5f4f4" : "",
                }}
              >
                {!data?.includes(date) && (
                  <Box
                    className={styles.desc}
                    onClick={() => navigateToCreatePage(date)}
                  >
                    <Box className={`${styles.addButton}`}>
                      <AddIcon color="inherit" />
                    </Box>
                  </Box>
                )}
                <div className={styles.dateNumber}>
                  {new Date(date).toLocaleDateString(
                    "en-US",
                    dateValidFormat(date, "dd") === "01"
                      ? {
                          day: "numeric",
                          //   month: "short",
                        }
                      : {
                          day: "numeric",
                        }
                  )}
                </div>

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

      <MaterialUIProvider>
        {!relationView && (
          <DrawerDetailPage
            view={view}
            projectInfo={projectInfo}
            open={open}
            setOpen={setOpen}
            selectedRow={selectedRow}
            menuItem={menuItem}
            layout={layout}
            fieldsMap={fieldsMap}
            // refetch={refetch}
            setLayoutType={setLayoutType}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
            navigateToEditPage={navigateToEditPage}
            dateInfo={dateInfo}
            defaultValue={defaultValue}
          />
        )}
      </MaterialUIProvider>

      {/* <ModalDetailPage
        open={open}
        setOpen={setOpen}
        dateInfo={dateInfo}
        selectedRow={selectedRow}
      /> */}
    </>
  );
};

export default CalendarTemplate;
