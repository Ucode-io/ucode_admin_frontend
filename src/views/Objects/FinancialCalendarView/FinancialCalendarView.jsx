import { Add, Delete } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import { get } from "@ngard/tiny-get";
import { useState } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import CollapseIcon from "../../../components/CollapseIcon";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../../../components/CTable";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import styles from "./style.module.scss";

const FinancialCalendarView = ({
  row,
  view,
  data = [],
  setData,
  level = 1,
  fieldsMap,
}) => {
  console.log("view", view);
  const { tableSlug } = useParams();
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const { navigateToForm } = useTabRouter();

  const children = useMemo(() => {
    return data.filter((el) => el[`${tableSlug}_id`] === row.guid);
  }, [data, row, tableSlug]);

  const switchChildBlock = (e) => {
    e.stopPropagation();
    setChildBlockVisible((prev) => !prev);
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug, "CREATE", null, {
      [`${tableSlug}_id`]: row.guid,
    });
  };

  const navigateToEditPage = () => {
    navigateToForm(tableSlug, "EDIT", row);
  };

  const deleteHandler = async (id) => {
    setDeleteLoader(true);
    try {
      await constructorObjectService.delete(tableSlug, row.guid);
      setData((prev) => prev.filter((el) => el.guid !== row.guid));
    } catch {
      setDeleteLoader(false);
    }
  };

  const months = [
    { id: 1, value: "June" },
    { id: 2, value: "July" },
    { id: 3, value: "August" },
    { id: 3, value: "August" },
    { id: 3, value: "August" },
    { id: 3, value: "August" },
  ];
  const datas = [
    { id: 1, value: "First" },
    { id: 2, value: "Second" },
    { id: 3, value: "Third" },
    { id: 3, value: "Third" },
    { id: 3, value: "Third" },
    { id: 3, value: "Third" },
  ];

  return (
    <div className={styles.financial_view}>
      <div className={styles.datesRow}>
        <div className={styles.mockBlock} />

        {months.map((dateItem) => (
          <div className={styles.dateBlock}>
            <div className={styles.monthBlock}>
              <span className={styles.monthText}>{dateItem?.value}</span>
            </div>
          </div>
        ))}
      </div>
      <Collapse in={childBlockVisible} unmountOnExit>
        {children?.map((childRow) => (
          <FinancialCalendarView
            key={childRow.guid}
            row={childRow}
            data={data}
            view={view}
            level={level + 1}
            setData={setData}
            fieldsMap={fieldsMap}
          />
        ))}
      </Collapse>
    </div>
  );
};

export default FinancialCalendarView;
