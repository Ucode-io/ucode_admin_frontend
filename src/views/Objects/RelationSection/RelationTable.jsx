import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import ObjectDataTable from "../../../components/DataTable/ObjectDataTable";
import FRow from "../../../components/FormElements/FRow";
import PageFallback from "../../../components/PageFallback";
import useTabRouter from "../../../hooks/useTabRouter";
import useCustomActionsQuery from "../../../queries/hooks/useCustomActionsQuery";
import constructorObjectService from "../../../services/constructorObjectService";
import { listToMap } from "../../../utils/listToMap";
import { objectToArray } from "../../../utils/objectToArray";
import { pageToOffset } from "../../../utils/pageToOffset";
import { Filter } from "../components/FilterGenerator";
import styles from "./style.module.scss";
import { set } from "date-fns";
import { useWatch } from "react-hook-form";

const RelationTable = forwardRef(
  (
    {
      setDataLength,
      relation,
      shouldGet,
      createFormVisible,
      remove,
      setCreateFormVisible,
      watch,
      loader,
      selectedObjects,
      setSelectedObjects,
      tableSlug,
      setFieldSlug,
      id,
      reset,
      selectedTabIndex,
      control,
      setFormValue,
      fields,
      setFormVisible,
      formVisible,
      selectedTab,
    },
    ref
  ) => {
    const { appId } = useParams();
    const navigate = useNavigate();
    const { navigateToForm } = useTabRouter();
    const tableRef = useRef(null);
    const [filters, setFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState();
    const filterChangeHandler = (value, name) => {
      setFilters({
        ...filters,
        [name]: value ?? undefined,
      });
    };

    const getRelatedTabeSlug = useMemo(() => {
      return relation?.find((el) => el?.id === selectedTab?.relation_id);
    }, [relation, selectedTab?.relation_id]);

    useEffect(() => {
      if (getRelatedTabeSlug?.default_editable) {
        setFormVisible(true);
      }
    }, [getRelatedTabeSlug?.default_editable, setFormVisible]);

    const onCheckboxChange = (val, row) => {
      if (val) setSelectedObjects((prev) => [...prev, row.guid]);
      else setSelectedObjects((prev) => prev.filter((id) => id !== row.guid));
    };
    const onChecked = (id) => {
      setSelectedObjects((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        } else {
          return [...prev, id];
        }
      });
    };

    const computedFilters = useMemo(() => {
      const relationFilter = {};

      if (getRelatedTabeSlug?.type === "Many2Many") relationFilter[`${tableSlug}_ids`] = id;
      else if (getRelatedTabeSlug?.type === "Many2Dynamic") relationFilter[`${getRelatedTabeSlug?.relation_field_slug}.${tableSlug}_id`] = id;
      else relationFilter[`${tableSlug}_id`] = id;

      return {
        ...filters,
        ...relationFilter,
      };
    }, [filters, tableSlug, id, getRelatedTabeSlug?.type, getRelatedTabeSlug?.relation_field_slug]);

    //============VIEW PERMISSION=========
    const viewPermission = useMemo(() => {
      if (getRelatedTabeSlug?.permission?.view_permission) return true;
      else return false;
    }, [getRelatedTabeSlug?.permission?.view_permission]);

    const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

    console.log('relatedTableSlug', relatedTableSlug)

    const { data: { tableData = [], pageCount = 1, columns = [], quickFilters = [], fieldsMap = {} } = {}, isLoading: dataFetchingLoading } = useQuery(
      [
        "GET_OBJECT_LIST",
        relatedTableSlug,
        shouldGet,
        appId,
        {
          filters: computedFilters,
          offset: pageToOffset(currentPage, limit),
          limit,
        },
      ],
      () => {
        return constructorObjectService.getList(relatedTableSlug, {
          data: {
            offset: pageToOffset(currentPage, limit),
            limit: id ? limit : 0,
            ...computedFilters,
          },
        });
      },
      {
        enabled: !!relatedTableSlug && !!appId,
        select: ({ data }) => {
          const tableData = id ? objectToArray(data.response ?? {}) : [];
          const pageCount = isNaN(data?.count) || tableData.length === 0 ? 1 : Math.ceil(data.count / limit);
          setDataLength(tableData.length);

          const fieldsMap = listToMap(data.fields);

          setFieldSlug(Object.values(fieldsMap).find((i) => i.table_slug === tableSlug)?.slug);

          const columns = getRelatedTabeSlug.columns?.map((id, index) => fieldsMap[id])?.filter((el) => el);

          const quickFilters = getRelatedTabeSlug.quick_filters?.map(({ field_id }) => fieldsMap[field_id])?.filter((el) => el);

          setFormValue("multi", tableData);

          return {
            tableData,
            pageCount,
            columns,
            quickFilters,
            fieldsMap,
          };
        },
      }
    );

    useEffect(() => {
      if (isNaN(parseInt(getRelatedTabeSlug?.default_limit))) setLimit(10);
      else setLimit(parseInt(getRelatedTabeSlug?.default_limit));
    }, [getRelatedTabeSlug?.default_limit]);

    // useEffect(() => {
    //   setFormValue("multi", tableData);
    // }, [selectedTab, tableData]);

    const { isLoading: deleteLoading, mutate: deleteHandler } = useMutation(
      (row) => {
        if (getRelatedTabeSlug.type === "Many2Many") {
          const data = {
            id_from: id,
            id_to: [row.guid],
            table_from: tableSlug,
            table_to: relatedTableSlug,
          };

          return constructorObjectService.deleteManyToMany(data);
        } else {
          return constructorObjectService.delete(relatedTableSlug, row.guid);
        }
      },
      {
        onSuccess: (a, b) => {
          remove(tableData.findIndex((i) => i.guid === b.guid));
        },
      }
    );

    const { data: { custom_events: customEvents = [] } = {} } = useCustomActionsQuery({
      tableSlug: relatedTableSlug,
    });

    const navigateToEditPage = (row) => {
      // if (rowClickType.value === "detail_page") {
      navigateToForm(relatedTableSlug, "EDIT", row);
      // } else {
      // }
    };

    const navigateToTablePage = () => {
      navigate(`/main/${appId}/object/${relatedTableSlug}`, {
        state: {
          [`${tableSlug}_${getRelatedTabeSlug.type === "Many2Many" ? "ids" : "id"}`]: id,
        },
      });
    };

    // const { mutateAsync } = useMutation(
    //   (values) => {
    //     if (values.guid)
    //       return constructorObjectService.update(relatedTableSlug, {
    //         data: values,
    //       })
    //     else constructorObjectService.create(relatedTableSlug, { data: values })
    //   },
    //   {
    //     onSuccess: () => {
    //       setCreateFormVisible(false)
    //       queryClient.refetchQueries(["GET_OBJECT_LIST", relatedTableSlug])
    //     },
    //   }
    // )

    if (loader) return <PageFallback />;
    return (
      <div className={styles.relationTable} ref={tableRef}>
        {!!quickFilters?.length && (
          <div className={styles.filtersBlock}>
            {quickFilters.map((field) => (
              <FRow key={field.id}>
                {/* label={field.label} */}
                <Filter field={field} name={field.slug} tableSlug={relatedTableSlug} filters={filters} onChange={filterChangeHandler} />
              </FRow>
            ))}
          </div>
        )}

        <div className={styles.tableBlock}>
          {viewPermission && (
            <ObjectDataTable
              defaultLimit={getRelatedTabeSlug?.default_limit}
              relationAction={getRelatedTabeSlug}
              remove={remove}
              watch={watch}
              isRelationTable={true}
              setFormVisible={setFormVisible}
              formVisible={formVisible}
              loader={dataFetchingLoading || deleteLoading}
              data={tableData}
              isResizeble={true}
              fields={fields}
              columns={columns}
              setFormValue={setFormValue}
              control={control}
              relatedTableSlug={relatedTableSlug}
              tableSlug={tableSlug}
              removableHeight={230}
              disableFilters
              pagesCount={pageCount}
              currentPage={currentPage}
              onRowClick={navigateToEditPage}
              onDeleteClick={deleteHandler}
              onPaginationChange={setCurrentPage}
              filters={filters}
              filterChangeHandler={filterChangeHandler}
              paginationExtraButton={id && <SecondaryButton onClick={navigateToTablePage}>Все</SecondaryButton>}
              createFormVisible={createFormVisible[getRelatedTabeSlug.id]}
              setCreateFormVisible={(val) => setCreateFormVisible(relation.id, val)}
              limit={limit}
              setLimit={setLimit}
              summaries={getRelatedTabeSlug.summaries}
              isChecked={(row) => selectedObjects?.includes(row.guid)}
              onCheckboxChange={!!customEvents?.length && onCheckboxChange}
              onChecked={onChecked}
              title={"Сначала нужно создать объект"}
            />
          )}
        </div>
      </div>
    );
  }
);

export default RelationTable;
