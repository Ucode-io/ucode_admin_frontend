import React, { useMemo, useState } from "react";
import style from "./style.module.scss";
import { AccountTree, CalendarMonth, TableChart } from "@mui/icons-material";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Button } from "@mui/material";

export default function ViewTypeList({ computedViewTypes, handleClose, openModal, setSelectedView, setTypeNewView }) {
  const [selectedViewTab, setSelectedViewTab] = useState("TABLE");

  const detectImageView = useMemo(() => {
    switch (selectedViewTab) {
      case "TABLE":
        return '/img/tableView.svg';
      case "CALENDAR":
        return '/img/calendarView.svg';
      case "CALENDAR HOUR":
        return '/img/calendarHourView.svg';
      case "GANTT":
        return '/img/ganttView.svg';
      case "TREE":
        return '/img/treeView.svg';
      case "BOARD":
        return '/img/boardView.svg';
      case "FINANCE CALENDAR":
        return '/img/financeCalendarView.svg';
      default:
        return '/img/tableView.svg';
    }
  }, [selectedViewTab]);

  const detectDescriptionView = useMemo(() => {
    switch (selectedViewTab) {
      case "TABLE":
        return 'Easily manage, update, and organize your tasks with Table view. ';
      case "CALENDAR":
        return 'Calendar view is your place for planning, scheduling, and resource management.  ';
      case "CALENDAR HOUR":
        return 'Plan out your work over time. See overlaps, map your schedule out and see it all divided by groups. ';
      case "GANTT":
        return 'Plan time, manage resources, visualize dependencies and more with Gantt view';
      case "TREE":
        return 'Use List view to organize your tasks in anyway imaginable – sort, filter, group, and customize columns. ';
      case "BOARD":
        return 'Build your perfect Board and easily drag-and-drop tasks between columns. ';
      case "FINANCE CALENDAR":
        return 'See your teams capacity, who is over or under and reassign tasks accordingly.';
      default:
        return 'Easily manage, update, and organize your tasks with Table view.';
    }
  }, [selectedViewTab]);



  return (
    <div className={style.viewTypeList}>
      <div className={style.wrapper}>
        <div className={style.left}>
          {computedViewTypes.map((type, index) => (
            <Button
              key={index}
              // onClick={() => {
              //   handleClose();
              //   openModal();
              //   setSelectedView("NEW");
              //   setTypeNewView(type.value);
              // }}
              className={type.value === selectedViewTab ? style.active : ""}
              onClick={() => {
                setSelectedViewTab(type.value);
              }}
            >
              {type.value === "TABLE" && <TableChart className={style.icon} />}
              {type.value === "CALENDAR" && <CalendarMonth className={style.icon} />}
              {type.value === "CALENDAR HOUR" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
              {type.value === "GANTT" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
              {type.value === "TREE" && <AccountTree className={style.icon} />}
              {type.value === "BOARD" && <IconGenerator className={style.icon} icon="brand_trello.svg" />}
              {type.value === "FINANCE CALENDAR" && <MonetizationOnIcon className={style.icon} />}
              {type.label}
            </Button>
          ))}
        </div>

        <div className={style.right}>
          <div className={style.img}>
            <img src={detectImageView} alt="add view" />
          </div>

          <div className={style.text}>
            <h3>{selectedViewTab}</h3>
            <p>{detectDescriptionView}</p>
          </div>

          <div className={style.button}>
            <Button
              variant="contained"
              onClick={() => {
                handleClose();
                openModal();
                setSelectedView("NEW");
                setTypeNewView(selectedViewTab);
              }}
            >
              Create View {selectedViewTab}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
