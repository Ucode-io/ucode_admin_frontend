import { addDays } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
import TimeLineDatesRow from "./TimeLineDatesRow";
import TimeLineDayDataBlock from "./TimeLineDayDataBlocks";
import styles from "./styles.module.scss";
import constructorObjectService from "../../../services/constructorObjectService";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import constructorRelationService from "../../../services/constructorRelationService";
import PageFallback from "../../../components/PageFallback";

export default function TimeLineBlock({
  data,
  fieldsMap,
  datesList,
  view,
  tabs,
  handleScrollClick,
  zoomPosition,
  setDateFilters,
  dateFilters,
  selectedType,
  calendar_from_slug,
  calendar_to_slug,
  visible_field,
  computedColumnsFor,
  isLoading,
}) {
  const scrollContainerRef = useRef(null);
  const [allData, setAllData] = useState([]);
  const [focusedDays, setFocusedDays] = useState([]);
  const { tableSlug } = useParams();
  const [relaitonLoading, setRelationLoading] = useState(false);
  const handleScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;

    if (scrollLeft + clientWidth >= scrollWidth) {
      // console.log("ssssssss End of scrolling");
      const newDate = [dateFilters[0], addDays(dateFilters[1], 10)];
      setDateFilters(newDate);
    }

    // if (scrollLeft === 0) {
    //   // console.log("ssssssss Start of scrolling");
    //   const newDate = [addDays(dateFilters[0], -10), dateFilters[1]];
    //   setDateFilters(newDate);
    // }
  };

  const groupbyFields = useMemo(() => {
    return view?.group_fields?.map((field) => {
      return fieldsMap?.[field];
    });
  }, [view?.group_fields, fieldsMap]);

  const { data: relations } = useQuery(
    ["GET_RELATION_LIST", tableSlug],
    () => {
      return constructorRelationService.getList({
        table_slug: tableSlug,
        relation_table_slug: tableSlug,
      });
    },
    {
      select: (res) => {
        return res?.relations;
      },
    }
  );

  const getDataRelation = async (field) => {
    setRelationLoading(true);
    try {
      const res = await constructorObjectService.getList(field?.table_slug, {
        data: {},
      });
      return res?.data?.response;
    } catch (error) {
      console.error(error);
    } finally {
      setRelationLoading(false);
    }
  };

  const getDataText = async (viewID) => {
    setRelationLoading(true);
    try {
      const res = await constructorObjectService.getList(tableSlug, {
        data: {
          builder_service_view_id: viewID,
        },
      });
      return res?.data?.response;
    } catch (error) {
      console.error(error);
    } finally {
      setRelationLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (groupbyFields?.length === 1) {
        if (groupbyFields[0]?.type === "MULTISELECT") {
          setAllData(groupbyFields[0]?.attributes?.options);
        } else if (groupbyFields[0]?.type === "LOOKUP" || groupbyFields[0]?.type === "LOOKUPS") {
          const options = await getDataRelation(groupbyFields?.[0]);
          setAllData(options);
        } else if (groupbyFields[0]?.type === "SINGLE_LINE") {
          const options = await getDataText(view?.id);

          const result = options?.map((item) => {
            return {
              ...item,
              label: item?.[groupbyFields?.[0]?.slug],
            };
          });

          setAllData(
            result?.filter((item) => {
              return item?.[groupbyFields?.[0]?.slug] !== null;
            })
          );
        }
      } else if (groupbyFields?.length === 2) {
        // FOR 2 GROUP BY
        if (groupbyFields?.[0]?.type === "LOOKUP" && groupbyFields?.[1]?.type === "LOOKUP") {
          const options1 = await getDataRelation(groupbyFields?.[0]);
          const options2 = await getDataRelation(groupbyFields?.[1]);

          const result = options1?.map((item) => {
            const options = options2?.filter((option) => option?.[`${groupbyFields?.[0]?.table_slug}_id`] === item?.guid);
            return {
              ...item,
              options,
            };
          });
          setAllData(result);
        } else {
          setAllData([]);
        }
      }
    }

    fetchData();
  }, [groupbyFields, view?.id]);

  useEffect(() => {
    handleScrollClick();
  }, []);

  console.log('focusedDays', focusedDays)

  return (
    <div
      className={styles.main_container}
      style={{
        height: `${view?.group_fields?.length ? "100$" : "calc(100vh - 103px"}`,
      }}
    >
      {view?.group_fields?.length ? (
        <div className={styles.group_by}>
          <div className={`${styles.fakeDiv} ${selectedType === "month" ? styles.month : ""}`}>Columns</div>

          <div className={styles.group_by_columns}>
            {allData?.map((item) => (
              <div className={styles.group_by_column}>
                <div className={styles.group_by_column_header}>{item?.label ?? item?.[groupbyFields?.[0]?.view_fields?.[0]?.slug]}</div>
                {item?.options?.map((option) => (
                  <div className={styles.subs}>
                    <div className={styles.group_by_sub_column}>{option?.[groupbyFields?.[1]?.view_fields?.[0]?.slug]}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div
        className={styles.gantt}
        ref={scrollContainerRef}
        // onScroll={handleScroll}
      >
        <TimeLineDatesRow focusedDays={focusedDays} datesList={datesList} zoomPosition={zoomPosition} selectedType={selectedType} />

        {relaitonLoading || isLoading ? (
          <PageFallback />
        ) : (
          <TimeLineDayDataBlock
            computedColumnsFor={computedColumnsFor}
            groupbyFields={groupbyFields}
            groupByList={allData}
            setFocusedDays={setFocusedDays}
            selectedType={selectedType}
            zoomPosition={zoomPosition}
            data={data}
            fieldsMap={fieldsMap}
            view={view}
            tabs={tabs}
            datesList={datesList}
            calendar_from_slug={calendar_from_slug}
            calendar_to_slug={calendar_to_slug}
            visible_field={visible_field}
          />
        )}
      </div>
    </div>
  );
}
