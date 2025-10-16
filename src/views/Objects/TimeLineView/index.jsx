import styles from "@/views/Objects/TableView/styles.module.scss";
import {endOfMonth, format, startOfMonth} from "date-fns";
import React, {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {useQueries, useQuery} from "react-query";
import {useNavigate, useParams} from "react-router-dom";
import PageFallback from "../../../components/PageFallback";
import useFilters from "../../../hooks/useFilters";
import constructorObjectService from "../../../services/constructorObjectService";
import {getRelationFieldTabsLabel} from "../../../utils/getRelationFieldLabel";
import {listToMap} from "../../../utils/listToMap";
import {selectElementFromEndOfString} from "../../../utils/selectElementFromEnd";
import TimeLineBlock from "./TimeLineBlock";
import constructorTableService from "../../../services/constructorTableService";
import {useDateLineProps} from "./hooks/useDateLineProps";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import {mergeStringAndState} from "../../../utils/jsonPath";
import useTabRouter from "../../../hooks/useTabRouter";

export default function TimeLineView({
  view,
  relationView = false,
  isViewLoading,
  menuItem,
  fieldsMap: fieldsMapPopup,
  setLayoutType,
  setNoDates = () => {},
  setCenterDate = () => {},
  noDates,
  columnsForSearch = [],
  searchText = "",
  layoutType,
  selectedView,
  projectInfo,
  setFormValue = () => {},
  setSelectedView = () => {},
}) {
  const {
    handleScroll,
    calendarRef,
    months,
    firstDate,
    lastDate,
    datesList,
    selectedType,
    setSelectedType,
  } = useDateLineProps({ setCenterDate });

  const { tableSlug: tableSlugFromProps, appId, menuId } = useParams();

  const tableSlug = relationView
    ? view?.relation_table_slug
    : (tableSlugFromProps ?? view?.table_slug);

  const { filters } = useFilters(tableSlug, view.id);
  const [dateFilters, setDateFilters] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  const [fieldsMap, setFieldsMap] = useState({});
  const [dataFromQuery, setDataFromQuery] = useState([]);

  // const selectedColumnSearch = columnsForSearch?.find(
  //   (column) => column?.is_search
  // );

  const groupFieldIds = view.group_fields;
  const groupFields = groupFieldIds
    ?.map((id) => fieldsMap?.[id])
    .filter((el) => el);

  const recursionFunctionForAddIsOpen = (data) => {
    return data?.map((el) => {
      if (el?.data?.length) {
        return {
          ...el,
          isOpen: false,
          data: recursionFunctionForAddIsOpen(el?.data),
        };
      } else {
        return {
          ...el,
          isOpen: false,
        };
      }
    });
  };

  const { navigateToForm } = useTabRouter();
  const navigate = useNavigate();

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDetailPage = (row) => {
    if (
      view?.attributes?.navigate?.params?.length ||
      view?.attributes?.navigate?.url
    ) {
      const params = view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;

      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      navigateToForm(tableSlug, "EDIT", row, {}, appId ?? menuId);
    }
  };

  // FOR DATA
  const {
    data: { data } = { data: [] },
    isLoading,
    refetch: refetchData,
  } = useQuery(
    [
      "GET_OBJECTS_LIST_WITH_RELATIONS",
      { tableSlug, filters, dateFilters, view, months, selectedType },
    ],
    () => {
      let data = {
        ...filters,
        view_type: "TIMELINE",
        gte: firstDate,
        lte: lastDate,
        with_relations: true,
        builder_service_view_id:
          view?.attributes?.group_by_columns?.length !== 0 ? view?.id : null,
      };
      if (Object.keys(filters)?.some((key) => Boolean(filters[key]))) {
        delete data.gte;
        delete data.lte;
        // delete data.builder_service_view_id;
        data.row_view_id = view?.id;
      }
      return constructorObjectService.getListV2(tableSlug, {
        data,
      });
    },
    {
      select: (res) => {
        const data = res.data?.response?.map((row) => ({
          ...row,
        }));
        return {
          data,
        };
      },
    }
  );

  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(dataFromQuery)) {
      setDataFromQuery((prevDataFromQuery) => {
        const newData = recursionFunctionForAddIsOpen(data);
        if (JSON.stringify(newData) !== JSON.stringify(prevDataFromQuery)) {
          return newData;
        }
        return prevDataFromQuery;
      });
    }
  }, [data, dataFromQuery]);

  // FOR TABLE INFO
  const {
    data: { visibleColumns, visibleRelationColumns } = { data: [] },
    isLoading: tableInfoLoading,
    refetch: refetchTableInfo,
  } = useQuery(
    ["GET_TABLE_INFO", { tableSlug, filters, dateFilters }],
    () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    {
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];
        const fieldsMap = listToMap([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
        }));

        return {
          fieldsMap,
          data,
          fields,
          visibleColumns: res?.data?.fields ?? [],
          visibleRelationColumns:
            res?.data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
      onSuccess: (res) => {
        if (Object.keys(fieldsMap)?.length) return;
        setFieldsMap(res.fieldsMap);
      },
    }
  );

  const refetchInfo = () => {
    refetchData();
    refetchTableInfo();
  };

  const tabResponses = useQueries(queryGenerator(groupFields ?? [], filters));
  const tabs = tabResponses?.map((response) => response?.data);

  const form = useForm({
    defaultValues: {
      calendar_from_slug: "",
      calendar_to_slug: "",
    },
  });

  useEffect(() => {
    form.setValue("calendar_from_slug", view?.attributes?.calendar_from_slug);
    form.setValue("calendar_to_slug", view?.attributes?.calendar_to_slug);
    form.setValue("visible_field", view?.attributes?.visible_field);
  }, [view]);

  const computedColumnsFor = useMemo(() => {
    if (view.type !== "CALENDAR" && view.type !== "GANTT") {
      return visibleColumns;
    } else {
      return [...visibleColumns, ...visibleRelationColumns];
    }
  }, [visibleColumns, visibleRelationColumns, view.type]);

  useEffect(() => {
    form.setValue("group_fields", view?.group_fields);
  }, [view, form]);

  const scrollToToday = (todayElement) => {
    const container = calendarRef.current;
    if (!container) return;

    const today = format(new Date(), "dd.MM.yyyy");
    const todayElementInner = container.querySelector(`[data-date='${today}']`);

    requestAnimationFrame(() => {
      if (todayElement) {
        const offset = todayElement.offsetLeft - container.offsetLeft;

        container.scrollTo({
          left: offset - container.clientWidth / 2,
          behavior: "smooth",
        });
      } else {
        const offset = todayElementInner.offsetLeft - container.offsetLeft;

        container.scrollTo({
          left: offset - container.clientWidth / 2,
          behavior: "smooth",
        });
      }
    });
  };

  return (
    <MaterialUIProvider>
      <div>
        <div
          className={styles.wrapper}
          style={{
            height: "calc(100vh - 135px)",
            overflow: "auto",
            // height: "100vh",
          }}
          ref={calendarRef}
          onScroll={handleScroll}
        >
          {tableInfoLoading || isViewLoading ? (
            <PageFallback />
          ) : (
            <TimeLineBlock
              setFormValue={setFormValue}
              projectInfo={projectInfo}
              selectedView={selectedView}
              layoutType={layoutType}
              tableSlug={tableSlug}
              setDataFromQuery={setDataFromQuery}
              dataFromQuery={dataFromQuery}
              scrollToToday={scrollToToday}
              isLoading={isLoading}
              computedColumnsFor={computedColumnsFor}
              view={view}
              menuItem={menuItem}
              fieldsMapPopup={fieldsMapPopup}
              dateFilters={dateFilters}
              setDateFilters={setDateFilters}
              calendarRef={calendarRef}
              data={data}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              fieldsMap={fieldsMap}
              datesList={datesList}
              tabs={tabs}
              calendar_from_slug={view?.attributes?.calendar_from_slug}
              calendar_to_slug={view?.attributes?.calendar_to_slug}
              visible_field={view?.attributes?.visible_field}
              months={months}
              setLayoutType={setLayoutType}
              refetch={refetchInfo}
              navigateToDetailPage={navigateToDetailPage}
              setNoDates={setNoDates}
              noDates={noDates}
              relationView={relationView}
              setSelectedView={setSelectedView}
            />
          )}
        </div>
      </div>
    </MaterialUIProvider>
  );
}

const queryGenerator = (groupFields, filters = {}) => {
  return groupFields?.map((field) => promiseGenerator(field, filters));
};

const promiseGenerator = (groupField, filters = {}) => {
  const filterValue = filters[groupField.slug];
  const defaultFilters = filterValue ? {[groupField.slug]: filterValue} : {};

  const relationFilters = {};

  Object.entries(filters)?.forEach(([key, value]) => {
    if (!key?.includes(".")) return;

    if (key.split(".")?.pop() === groupField.slug) {
      relationFilters[key.split(".")?.pop()] = value;
      return;
    }

    const filterTableSlug = selectElementFromEndOfString({
      string: key,
      separator: ".",
      index: 2,
    });

    if (filterTableSlug === groupField.table_slug) {
      const slug = key.split(".")?.pop();

      relationFilters[slug] = value;
    }
  });
  const computedFilters = {...defaultFilters, ...relationFilters};

  if (groupField?.type === "PICK_LIST") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () => ({
        id: groupField.id,
        list: groupField.attributes?.options?.map((el) => ({
          ...el,
          label: el,
          value: el,
          slug: groupField?.slug,
        })),
      }),
    };
  }

  if (groupField?.type === "LOOKUP" || groupField?.type === "LOOKUPS") {
    const queryFn = () =>
      constructorObjectService.getListV2(
        groupField?.type === "LOOKUP"
          ? groupField.slug?.slice(0, -3)
          : groupField.slug?.slice(0, -4),
        {
          data: computedFilters ?? {},
        }
      );

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        {
          tableSlug:
            groupField?.type === "LOOKUP"
              ? groupField.slug?.slice(0, -3)
              : groupField.slug?.slice(0, -4),
          filters: computedFilters,
        },
      ],
      queryFn,
      select: (res) => {
        return {
          id: groupField.id,
          list: res.data?.response?.map((el) => ({
            ...el,
            label: getRelationFieldTabsLabel(groupField, el),
            value: el.guid,
            slug: groupField?.slug,
          })),
        };
      },
    };
  }
};
