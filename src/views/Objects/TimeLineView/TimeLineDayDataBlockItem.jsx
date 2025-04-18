import {addDays, format} from "date-fns";
import React, {useEffect, useMemo, useRef, useState} from "react";
import Moveable from "react-moveable";
import { useDispatch, useSelector } from "react-redux";
import {useParams} from "react-router-dom";
import CellElementGenerator from "@/components/ElementGenerators/CellElementGenerator";
import constructorObjectService from "@/services/constructorObjectService";
import { showAlert } from "@/store/alert/alert.thunk";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";
import styles from "./styles.module.scss";
import { useQuery, useQueryClient } from "react-query";
import useFilters from "@/hooks/useFilters";
import { LayoutPopup } from "../../table-redesign/LayoutPopup";
import { useTableByIdQuery } from "../../../services/constructorTableService";
import { useForm } from "react-hook-form";
import { generateGUID } from "../../../utils/generateID";
import { useGetLang } from "../../../hooks/useGetLang";
import DrawerDetailPage from "../DrawerDetailPage";
import { useProjectGetByIdQuery } from "../../../services/projectService";
import layoutService from "../../../services/layoutService";

export default function TimeLineDayDataBlockItem({
  data,
  levelIndex,
  setFocusedDays,
  datesList,
  groupbyFields,
  view,
  zoomPosition,
  calendar_from_slug,
  calendar_to_slug,
  computedColumnsFor,
  visible_field,
  groupByList,
  selectedType,
  dateFilters,
  menuItem,
  fieldsMapPopup: fieldsMap,
  refetch = () => {},
  setLayoutType,
  navigateToDetailPage,
}) {
  const ref = useRef();
  const { tableSlug, appId } = useParams();
  const { filters } = useFilters(tableSlug, view.id);
  const [target, setTarget] = useState();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleOpen = () => {
    setOpen(true);
    setSelectedRow(data);
  };

  const level = useMemo(() => {
    return levelIndex;
  }, [levelIndex]);

  const [frame] = useState({
    translate: [0, 0],
  });

  const startDate = useMemo(() => {
    return datesList && calendar_from_slug
      ? datesList?.findIndex((date) => {
          const currentDate = date ? new Date(date) : null;
          const selectedDate = data?.[calendar_from_slug]
            ? new Date(data?.[calendar_from_slug])
            : null;
          const isValidCurrentDate =
            currentDate instanceof Date && !isNaN(currentDate);
          const isValidSelectedDate =
            selectedDate instanceof Date && !isNaN(selectedDate);

          if (isValidCurrentDate && isValidSelectedDate) {
            return (
              format(currentDate, "dd.MM.yyyy") ===
              format(selectedDate, "dd.MM.yyyy")
            );
          }

          return false;
        })
      : null;
  }, [datesList, calendar_from_slug, data]);

  const differenceInDays = useMemo(() => {
    const days = Math.ceil(
      (new Date(data?.[calendar_to_slug]) -
        new Date(data?.[calendar_from_slug])) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  }, [data, calendar_from_slug, calendar_to_slug]);

  useEffect(() => {
    if (!ref.current) return null;
    setTarget(ref.current);
  }, [
    ref,
    view,
    data,
    calendar_from_slug,
    calendar_to_slug,
    groupbyFields,
    visible_field,
    groupByList,
    levelIndex,
    datesList,
    zoomPosition,
  ]);

  const onDragEndToUpdate = (position, width) => {
    if (!position) return null;

    let newDatePosition = [];

    if (position.translate[0] < 0) {
      newDatePosition = [
        addDays(
          new Date(data[calendar_from_slug]),
          (-position.translate[0] * -1) /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
        addDays(
          new Date(data[calendar_to_slug]),
          (-position.translate[0] * -1) /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
      ];
    } else if (position.translate[0] > 0) {
      newDatePosition = [
        addDays(
          new Date(data[calendar_from_slug]),
          position.translate[0] /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
        addDays(
          new Date(data[calendar_to_slug]),
          position.translate[0] /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ),
      ];
    }

    const computedData = {
      ...data,
      [calendar_from_slug]: newDatePosition[0],
      [calendar_to_slug]: newDatePosition[1],
    };

    constructorObjectService
      .update(tableSlug, {
        data: computedData,
      })
      .then((res) => {
        dispatch(showAlert("Успешно обновлено", "success"));
        // queryClient.refetchQueries(["GET_OBJECTS_LIST_WITH_RELATIONS"]);
        queryClient.setQueryData(
          [
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            { tableSlug, filters, dateFilters, view },
          ],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item.guid === computedData.guid ? computedData : item
              ),
            };
          }
        );
      });
  };

  const onResizeEndToUpdate = (position, width) => {
    if (!position) return null;
    let newDatePosition = [
      datesList[
        position.drag.left /
          (zoomPosition * (selectedType === "month" ? 20 : 30))
      ],
      addDays(
        datesList[
          position.drag.left /
            (zoomPosition * (selectedType === "month" ? 20 : 30))
        ],
        width / (zoomPosition * (selectedType === "month" ? 20 : 30))
      ),
    ];
    const computedData = {
      ...data,
      [calendar_from_slug]: newDatePosition[0],
      [calendar_to_slug]: newDatePosition[1],
    };

    constructorObjectService
      .update(tableSlug, {
        data: computedData,
      })
      .then((res) => {
        dispatch(showAlert("Успешно обновлено", "success"));
      });
  };

  const onDrag = ({ target, width, beforeTranslate }) => {
    if (beforeTranslate[1] < 0) return null;
    const [x, y] = beforeTranslate;
    target.style.transform = `translate(${x}px, 0)`;
    setFocusedDays([
      datesList[
        startDate +
          Math.round(
            beforeTranslate[0] /
              (zoomPosition * (selectedType === "month" ? 20 : 30))
          )
      ],
      addDays(
        datesList[
          startDate +
            Math.round(
              beforeTranslate[0] /
                (zoomPosition * (selectedType === "month" ? 20 : 30))
            )
        ],
        width / (zoomPosition * 30) - 1
      ),
    ]);
  };

  const onDragEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.beforeTranslate;
      onDragEndToUpdate(lastEvent, lastEvent.width);
      setFocusedDays([]);
    }
  };

  // ----------RESIZE ACTIONS----------------------

  const onResize = ({ target, width, drag }) => {
    const beforeTranslate = drag.beforeTranslate;

    if (beforeTranslate[1] < 0) return null;

    target.style.width = `${width}px`;
    target.style.transform = `translateX(${beforeTranslate[0]}px)`;

    setFocusedDays([
      datesList[
        startDate +
          Math.round(
            beforeTranslate[0] /
              (zoomPosition * (selectedType === "month" ? 20 : 30))
          )
      ],
      addDays(
        datesList[
          startDate +
            Math.round(
              beforeTranslate[0] /
                (zoomPosition * (selectedType === "month" ? 20 : 30))
            )
        ],
        width / (zoomPosition * 30) - 1
      ),
    ]);
  };

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      frame.translate = lastEvent.drag.beforeTranslate;
      onResizeEndToUpdate(lastEvent, lastEvent.width);
      setFocusedDays([]);
    }
  };

  const handleMouseEnter = () => {
    if (selectedType === "month") {
      setFocusedDays([
        datesList[startDate],
        datesList[startDate + differenceInDays],
      ]);
    } else {
      setFocusedDays([
        datesList[startDate],
        addDays(
          datesList[
            startDate +
              Math.round(
                frame.translate[0] /
                  (zoomPosition * (selectedType === "month" ? 20 : 30))
              )
          ],
          ref.current.offsetWidth / (zoomPosition * 30) - 1
        ),
      ]);
    }
  };

  const projectId = useSelector((state) => state.company?.projectId);

  const [authInfo, setAuthInfo] = useState(null);
  const tableLan = useGetLang("Table");

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

  const {
    control,
    reset,
    setValue: setFormValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      multi: [],
    },
  });

  const [selectedViewType, setSelectedViewType] = useState(
    localStorage?.getItem("detailPage") === "FullPage"
      ? "SidePeek"
      : localStorage?.getItem("detailPage")
  );

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  return (
    <>
      <div
        className={styles.dataBlock}
        style={{
          top:
            view?.attributes?.group_by_columns?.length === 0 &&
            `${level * 32}px`,
          left: `${startDate * (zoomPosition * (selectedType === "month" ? 20 : 30))}px`,
          width: `${zoomPosition * (selectedType === "month" ? 20 : 30) * differenceInDays}px`,
          cursor: "pointer",
          display: startDate === -1 || level === -1 ? "none" : "block",
        }}
        onClick={handleOpen}
        ref={ref}
        key={data?.id_order}
        onMouseEnter={handleMouseEnter}
      >
        <div
          className={styles.dataBlockInner}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CellElementGenerator
            row={data}
            field={computedColumnsFor?.find(
              (field) => field?.slug === visible_field
            )}
          />
        </div>
      </div>
      {/* <ModalDetailPage
        open={open}
        setOpen={setOpen}
        selectedRow={selectedRow}
      /> */}

      <DrawerDetailPage
        projectInfo={projectInfo}
        open={open}
        setFormValue={setFormValue}
        setOpen={setOpen}
        selectedRow={selectedRow}
        menuItem={menuItem}
        layout={layout}
        fieldsMap={fieldsMap}
        refetch={refetch}
        setLayoutType={setLayoutType}
        selectedViewType={selectedViewType}
        setSelectedViewType={setSelectedViewType}
        navigateToEditPage={navigateToDetailPage}
      />

      {startDate === -1 || level === -1 ? (
        ""
      ) : (
        <Moveable
          target={target}
          className="moveable3"
          key={`${zoomPosition}${data?.guid}`}
          draggable
          resizable
          throttleDrag={zoomPosition * (selectedType === "month" ? 20 : 30)}
          throttleResize={zoomPosition * (selectedType === "month" ? 20 : 30)}
          keepRatio={false}
          origin={false}
          renderDirections={["w", "e"]}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      )}
    </>
  );
}
