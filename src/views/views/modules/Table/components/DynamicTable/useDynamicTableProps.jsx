import { useViewContext } from "@/providers/ViewProvider";
import { paginationActions } from "@/store/pagination/pagination.slice";
import { tableSizeAction } from "@/store/tableSize/tableSizeSlice";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const useDynamicTableProps = ({ isResizable, columns, setLimit, data }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  // const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [addNewRow, setAddNewRow] = useState(false);
  const [formType, setFormType] = useState("CREATE");

  const { isRelationView, tableSlug, projectInfo, view, menuItem } =
    useViewContext();

  const { fieldsMap } = useFieldsContext();

  const isModal =
    isRelationView && localStorage.getItem("detailPage") === "CenterPeek";

  const tableViewFiltersOpen = useSelector(
    (state) => state.main.tableViewFiltersOpen
  );

  const tabHeight = document.querySelector("#tabsHeight")?.offsetHeight ?? 0;
  const filterHeight = localStorage.getItem("filtersHeight");

  const [limitOptions, setLimitOptions] = useState([
    {
      value: 10,
      label: `10`,
    },
    {
      value: 20,
      label: `20`,
    },
    {
      value: 30,
      label: `30`,
    },
    {
      value: 40,
      label: `40`,
    },
  ]);

  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];

  useEffect(() => {
    if (!isResizable) return;
    const createResizableTable = function (table) {
      if (!table) return;
      const cols = table.querySelectorAll(".th");
      [].forEach.call(cols, function (col, idx) {
        if (col.querySelector(".resizer")) {
          return;
        }
        const resizer = document.createElement("span");
        resizer.classList.add("resizer");
        resizer.style.height = `${table.offsetHeight}px`;
        col.appendChild(resizer);
        createResizableColumn(col, resizer, idx);
      });
    };

    const createResizableColumn = function (col, resizer, idx) {
      let x = 0;
      let w = 0;

      const mouseDownHandler = function (e) {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        resizer.classList.add("resizing");
      };

      const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const colID = col.getAttribute("id");
        const colWidth = w + dx;
        dispatch(tableSizeAction.setTableSize({ pageName, colID, colWidth }));
        dispatch(
          tableSizeAction.setTableSettings({
            pageName,
            colID,
            colWidth,
            isStiky: "ineffective",
            colIdx: idx - 1,
          })
        );
      };

      const mouseUpHandler = function () {
        resizer.classList.remove("resizing");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      resizer.addEventListener("mousedown", mouseDownHandler);
    };

    createResizableTable(document.getElementById("resizeMe"));
  }, [data, isResizable, pageName, dispatch]);

  const calculateWidth = (colId, index) => {
    const colIdx = tableSettings?.[pageName]
      ?.filter((item) => item?.isStiky === true)
      ?.findIndex((item) => item?.id === colId);

    if (index === 0) {
      return 0;
    } else if (colIdx === 0) {
      return 0;
    } else if (
      tableSettings?.[pageName]?.filter((item) => item?.isStiky === true)
        .length === 1
    ) {
      return 0;
    } else {
      return tableSettings?.[pageName]
        ?.filter((item) => item?.isStiky === true)
        ?.slice(0, colIdx)
        ?.reduce((acc, item) => acc + item?.colWidth, 0);
    }
  };

  const calculateWidthFixedColumn = (colId) => {
    const prevElementIndex = columns?.findIndex((item) => item.id === colId);

    if (prevElementIndex === -1 || prevElementIndex === 0) {
      return 0;
    }

    let totalWidth = 0;

    for (let i = 0; i < prevElementIndex; i++) {
      const element = document.querySelector(`[id='${columns?.[i].id}']`);
      totalWidth += element?.offsetWidth || 0;
    }

    return totalWidth;
  };

  const renderColumns = (columns ?? []).filter((column) =>
    Boolean(column?.attributes?.field_permission?.view_permission)
  );

  const onCreateLimitOption = (value) => {
    value = value.trim();
    if (value.match(/\D/g) !== null) {
      return;
    }
    setLimitOptions([
      ...limitOptions,
      {
        value: Number(value),
        label: `${value}`,
      },
    ]);
    setLimit(Number(value));
  };

  const getLimitValue = (item) => {
    setLimit(item);
    dispatch(
      paginationActions.setTablePages({
        tableSlug: tableSlug,
        pageLimit: item,
      })
    );
  };

  const isWarning =
    differenceInCalendarDays(parseISO(projectInfo?.expire_date), new Date()) +
    1;

  const isWarningActive =
    projectInfo?.subscription_type === "free_trial"
      ? isWarning <= 16
      : projectInfo?.status === "insufficient_funds" &&
          projectInfo?.subscription_type === "paid"
        ? isWarning <= 5
        : isWarning <= 7;

  const calculatedHeight = useMemo(() => {
    let warningHeight = 0;

    if (isWarningActive || projectInfo?.status === "inactive") {
      warningHeight = 32;
    }
    const filterHeightValue = Boolean(view?.attributes?.quick_filters?.length)
      ? Number(filterHeight) || 0
      : 0;

    const tabHeightValue = Number(tabHeight) || 0;

    return tableViewFiltersOpen
      ? filterHeightValue + tabHeightValue + warningHeight
      : tabHeightValue + warningHeight;
  }, [
    tableViewFiltersOpen,
    filterHeight,
    tabHeight,
    projectInfo,
    isWarningActive,
  ]);

  return {
    i18n,
    tableSize,
    tableSettings,
    fieldCreateAnchor,
    setFieldCreateAnchor,
    fieldData,
    setFieldData,
    addNewRow,
    setAddNewRow,
    formType,
    setFormType,
    isModal,
    limitOptions,
    pageName,
    calculateWidthFixedColumn,
    renderColumns,
    onCreateLimitOption,
    getLimitValue,
    calculatedHeight,
    tableSlug,
    view,
    menuItem,
    isRelationView,
    fieldsMap,
  };
};
