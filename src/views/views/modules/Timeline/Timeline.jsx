import styles from "@/views/Objects/TableView/styles.module.scss";
import {endOfMonth, format, startOfMonth} from "date-fns";
import React, {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import { useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import PageFallback from "@/components/PageFallback";
import useFilters from "@/hooks/useFilters";
import constructorObjectService from "@/services/constructorObjectService";
import TimeLineBlock from "./TimeLineBlock";
import {useDateLineProps} from "./hooks/useDateLineProps";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import {mergeStringAndState} from "@/utils/jsonPath";
import useTabRouter from "@/hooks/useTabRouter";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldsContext } from "../../providers/FieldsProvider";

export const Timeline = () => {

  const {
    view,
    tableSlug,
    isRelationView,
    setSelectedView,
    menuId,
    visibleColumns,
    visibleRelationColumns,
    projectInfo,
    menuItem,
    layoutType,
    setLayoutType,
    selectedView,
    tabs,
    setNoDates,
    noDates,
    setCenterDate,
    isLoadingTable: isViewLoading,
  } = useViewContext();

  const {
    fieldsMap,
    fieldsForm,
  } = useFieldsContext();

  const {setValue: setFormValue} = fieldsForm;


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

  // const { tableSlug: tableSlugFromProps, appId, menuId } = useParams();

  // const tableSlug = relationView
  //   ? view?.relation_table_slug
  //   : (tableSlugFromProps ?? view?.table_slug);

  const { filters } = useFilters(tableSlug, view.id);
  const [dateFilters, setDateFilters] = useState([
    startOfMonth(new Date()),
    endOfMonth(new Date()),
  ]);

  // const [fieldsMap, setFieldsMap] = useState({});
  const [dataFromQuery, setDataFromQuery] = useState([]);

  // const selectedColumnSearch = columnsForSearch?.find(
  //   (column) => column?.is_search
  // );

  // const groupFieldIds = view.group_fields;
  // const groupFields = groupFieldIds
  //   ?.map((id) => fieldsMap?.[id])
  //   .filter((el) => el);

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
      navigateToForm(tableSlug, "EDIT", row, {}, menuId);
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
        // delete data.gte;
        // delete data.lte;
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
  // const {
  //   data: { visibleColumns, visibleRelationColumns } = { data: [] },
  //   isLoading: tableInfoLoading,
  //   refetch: refetchTableInfo,
  // } = useQuery(
  //   ["GET_TABLE_INFO", { tableSlug, filters, dateFilters }],
  //   () => {
  //     return constructorTableService.getTableInfo(tableSlug, {
  //       data: {},
  //     });
  //   },
  //   {
  //     cacheTime: 10,
  //     select: (res) => {
  //       const fields = res.data?.fields ?? [];
  //       const relationFields =
  //         res?.data?.relation_fields?.map((el) => ({
  //           ...el,
  //           label: `${el.label} (${el.table_label})`,
  //         })) ?? [];
  //       const fieldsMap = listToMap([...fields, ...relationFields]);
  //       const data = res.data?.response?.map((row) => ({
  //         ...row,
  //       }));

  //       return {
  //         fieldsMap,
  //         data,
  //         fields,
  //         visibleColumns: res?.data?.fields ?? [],
  //         visibleRelationColumns:
  //           res?.data?.relation_fields?.map((el) => ({
  //             ...el,
  //             label: `${el.label} (${el.table_label})`,
  //           })) ?? [],
  //       };
  //     },
  //     onSuccess: (res) => {
  //       if (Object.keys(fieldsMap)?.length) return;
  //       setFieldsMap(res.fieldsMap);
  //     },
  //   }
  // );

  const refetchInfo = () => {
    refetchData();
    // refetchTableInfo();
  };

  // const tabResponses = useQueries(queryGenerator(groupFields ?? [], filters));
  // const tabs = tabResponses?.map((response) => response?.data);

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
          { isViewLoading ? (
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
              relationView={isRelationView}
              setSelectedView={setSelectedView}
            />
          )}
        </div>
      </div>
    </MaterialUIProvider>
  );
}
