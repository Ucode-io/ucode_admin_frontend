import {Box, Menu, MenuItem, Typography} from "@mui/material";
import React, {useEffect, useMemo, useRef, useState} from "react";
import TableFilterBlock from "../../../Table1CUi/TableFilterBlock";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "react-query";
import useTabRouter from "../../../../../hooks/useTabRouter";
import {useSelector} from "react-redux";
import {generateGUID} from "../../../../../utils/generateID";
import {useMenuGetByIdQuery} from "../../../../../services/menuService";
import constructorFieldService from "../../../../../services/constructorFieldService";
import constructorRelationService from "../../../../../services/constructorRelationService";
import {listToMap} from "../../../../../utils/listToMap";
import constructorObjectService from "../../../../../services/constructorObjectService";
import {pageToOffset} from "../../../../../utils/pageToOffset";
import {objectToArray} from "../../../../../utils/objectToArray";
import useCustomActionsQuery from "../../../../../queries/hooks/useCustomActionsQuery";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import RelationTableFilter from "./RelationTableFilter";
import styles from "./style.module.scss";
import {IOSSwitch} from "../../../../../theme/overrides/IosSwitch";
import RelationTableHead from "./RelationTableHead";
import RelationTableBody from "./RelationTableBody";

const mockData = [
  {
    id: 1,
    title: "Title 1",
  },
  {
    id: 2,
    title: "Title 2",
  },
  {
    id: 3,
    title: "Title 3",
  },
  {
    id: 4,
    title: "Title 4",
  },
  {
    id: 5,
    title: "Title 5",
  },
  {
    id: 6,
    title: "Title 6",
  },
  {
    id: 7,
    title: "Title 7",
  },
];

function RelationTable({
  getValues,
  relation,
  shouldGet,
  createFormVisible,
  remove,
  setCreateFormVisible,
  watch,
  loader,
  selectedObjects,
  setSelectedObjects,
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
  type,
  relatedTable = {},
  getAllData = () => {},
  layoutData,
  computedVisibleFields,
  view,
}) {
  const {appId, tableSlug} = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {navigateToForm} = useTabRouter();
  const tableRef = useRef(null);
  const [filters, setFilters] = useState({});
  const [drawerState, setDrawerState] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {i18n} = useTranslation();
  const [relOptions, setRelOptions] = useState([]);
  const [searchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const [menuItem, setMenuItem] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const paginationInfo = useSelector(
    (state) => state?.pagination?.paginationInfo
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const filterChangeHandler = (value, name) => {
    setFilters({
      ...filters,
      [name]: value ?? undefined,
    });
  };

  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: appId,
      summary_section: {
        id: generateGUID(),
        label: "Summary",
        fields: [],
        icon: "",
        order: 1,
        column: "SINGLE",
        is_summary_section: true,
      },
      // view_relations: [],
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });

  const paginiation = useMemo(() => {
    const getObject = paginationInfo.find((el) => el?.tableSlug === tableSlug);

    return getObject?.pageLimit ?? limit;
  }, [paginationInfo, tableSlug]);

  const limitPage = useMemo(() => {
    if (typeof paginiation === "number") {
      return paginiation;
    } else if (paginiation === "all" && limit === "all") {
      return undefined;
    } else {
      return pageToOffset(currentPage, limit);
    }
  }, [paginiation, limit, currentPage]);

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });
  console.log("selectedTabselectedTab", selectedTab);
  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({table_id: id});

      const getRelations = constructorRelationService.getList({
        table_slug: tableSlug,
        relation_table_slug: tableSlug,
      });
      const [{relations = []}, {fields = []}] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === tableSlug) ||
          (relation.type === "One2Many" &&
            relation.table_to?.slug === tableSlug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === tableSlug)
        ) {
          layoutRelations.push(relation);
        } else {
          tableRelations.push(relation);
        }
      });

      const layoutRelationsFields = layoutRelations.map((relation) => ({
        ...relation,
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label:
          relation?.label ?? relation[relation.relatedTableSlug]?.label
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
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

    if (getRelatedTabeSlug?.type === "Many2Many")
      relationFilter[`${tableSlug}_ids`] = id;
    else if (getRelatedTabeSlug?.type === "Many2Dynamic")
      relationFilter[
        `${getRelatedTabeSlug?.relation_field_slug}.${tableSlug}_id`
      ] = id;
    else if (
      getRelatedTabeSlug?.relation_index &&
      getRelatedTabeSlug?.relation_index > 1
    )
      relationFilter[`${tableSlug}_id_${getRelatedTabeSlug?.relation_index}`] =
        id;
    else relationFilter[`${tableSlug}_id`] = id;
    return {
      ...filters,
      ...relationFilter,
    };
  }, [
    filters,
    tableSlug,
    id,
    getRelatedTabeSlug?.type,
    getRelatedTabeSlug?.relation_field_slug,
  ]);

  //============VIEW PERMISSION=========
  const viewPermission = useMemo(() => {
    if (getRelatedTabeSlug?.permission?.view_permission) return true;
    else return false;
  }, [getRelatedTabeSlug?.permission?.view_permission]);

  const relatedTableSlug = getRelatedTabeSlug?.relatedTable;

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  const {
    data: {
      tableData = [],
      pageCount = 1,
      columns = [],
      quickFilters = [],
      fieldsMap = {},
    } = {},
    refetch,
    isLoading: dataFetchingLoading,
  } = useQuery(
    [
      "GET_OBJECT_LIST",
      relatedTableSlug,
      shouldGet,
      {
        filters: computedFilters,
        offset: pageToOffset(currentPage, limit),
        limit,
      },
    ],
    () => {
      return constructorObjectService.getList(
        relatedTableSlug,
        {
          data: {
            offset: pageToOffset(currentPage, limit),
            limit: limitPage !== 0 ? limitPage : limit,
            from_tab: type === "relation" ? true : false,
            ...computedFilters,
          },
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: !!relatedTableSlug,
      select: ({data}) => {
        const tableData = id ? objectToArray(data.response ?? {}) : [];
        const pageCount =
          isNaN(data?.count) || tableData.length === 0
            ? 1
            : Math.ceil(data.count / paginiation);

        const fieldsMap = listToMap(data.fields);

        const array = [];
        for (const key in getRelatedTabeSlug?.attributes?.fixedColumns) {
          if (
            getRelatedTabeSlug?.attributes?.fixedColumns.hasOwnProperty(key)
          ) {
            if (getRelatedTabeSlug?.attributes?.fixedColumns[key])
              array.push({
                id: key,
                value: getRelatedTabeSlug?.attributes?.fixedColumns?.[key],
              });
          }
        }

        const columns = customSortArray(
          (Array.isArray(
            layoutData?.tabs?.[selectedTabIndex]?.attributes?.columns
          )
            ? layoutData?.tabs?.[selectedTabIndex]?.attributes?.columns
            : []) ?? getRelatedTabeSlug?.columns,
          array.map((el) => el.id)
        )
          ?.map((el) => fieldsMap[el])
          ?.filter((el) => el);

        const quickFilters = getRelatedTabeSlug.quick_filters
          ?.map(({field_id}) => fieldsMap[field_id])
          ?.filter((el) => el);

        return {
          tableData,
          pageCount,
          columns,
          quickFilters,
          fieldsMap,
        };
      },
      onSuccess: () => {
        setFormValue("multi", tableData);
      },
    }
  );

  const computedRelationFields = useMemo(() => {
    return Object.values(fieldsMap)?.filter((element) => {
      return element?.type === "LOOKUP" || element?.type === "LOOKUPS";
    });
  }, [fieldsMap]);

  const getOptionsList = () => {
    const computedIds = computedRelationFields?.map((item) => ({
      table_slug: item?.slug,
      ids:
        item?.type === "LOOKUP"
          ? Array.from(new Set(tableData?.map((obj) => obj?.[item?.slug])))
          : Array.from(
              new Set([].concat(...tableData?.map((obj) => obj?.[item?.slug])))
            ),
    }));
    tableData?.length &&
      computedRelationFields?.forEach((item, index) => {
        constructorObjectService
          .getListV2(item?.table_slug, {
            data: {
              limit: 10,
              offset: 0,
              additional_request: {
                additional_field: "guid",
                additional_values: computedIds?.find(
                  (computedItem) => computedItem?.table_slug === item?.slug
                )?.ids,
              },
            },
          })
          .then((res) => {
            if (relOptions?.length > 0) {
              setRelOptions((prev) => {
                const updatedOptions = prev.map((option) => {
                  if (option.table_slug === item?.table_slug) {
                    return {
                      table_slug: item?.table_slug,
                      response: res?.data?.response,
                      relationId: item?.relation_id,
                    };
                  }
                  return option;
                });
                return updatedOptions;
              });
            } else {
              setRelOptions((prev) => [
                ...prev,
                {
                  table_slug: item?.table_slug,
                  response: res?.data?.response,
                  relationId: item?.relation_id,
                },
              ]);
            }
          });
      });
  };

  useEffect(() => {
    getOptionsList();
  }, [tableData, computedRelationFields]);

  useEffect(() => {
    if (isNaN(parseInt(getRelatedTabeSlug?.default_limit))) setLimit(10);
    else setLimit(parseInt(getRelatedTabeSlug?.default_limit));
  }, [getRelatedTabeSlug?.default_limit]);

  //   useEffect(() => {
  //     setFormValue("multi", tableData);
  //   }, [selectedTab, tableData]);

  const {isLoading: deleteLoading, mutate: deleteHandler} = useMutation(
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
        // queryClient.refetchQueries(["GET_OBJECT_LIST"]);
        refetch();
      },
    }
  );

  const {data: {custom_events: customEvents = []} = {}} = useCustomActionsQuery(
    {
      tableSlug: relatedTableSlug,
    }
  );

  const navigateToEditPage = (row) => {
    navigateToForm(relatedTableSlug, "EDIT", row, {}, menuId);
  };

  const navigateToTablePage = () => {
    navigate(`/main/${appId}/object/${relatedTableSlug}`, {
      state: {
        [`${tableSlug}_${
          getRelatedTabeSlug.type === "Many2Many" ? "ids" : "id"
        }`]: id,
      },
    });
  };
  const [selectedObjectsForDelete, setSelectedObjectsForDelete] = useState([]);

  const multipleDelete = async () => {
    try {
      await constructorObjectService.deleteMultiple(tableSlug, {
        ids: selectedObjectsForDelete.map((i) => i.guid),
      });
      queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
    } finally {
    }
  };

  return (
    <>
      <RelationTableFilter
        fieldsMap={fieldsMap}
        view={getRelatedTabeSlug}
        getAllData={getAllData}
        selectedTabIndex={selectedTabIndex}
        data={layoutData}
        fields={fields}
      />
      <div className={styles.tableComponent}>
        {/* <div
          className={
            openFilter ? styles.tableWrapperActive : styles.tableWrapper
          }> */}
        <table className={styles.expandable_table}>
          <thead>
            <tr>
              {columns?.map((column) => (
                <RelationTableHead
                  view={getRelatedTabeSlug}
                  column={column}
                  handleClick={handleClick}
                  fieldsMap={fieldsMap}
                  data={layoutData}
                  selectedTabIndex={selectedTabIndex}
                  getAllData={getAllData}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item) => (
              <RelationTableBody
                view={getRelatedTabeSlug}
                columns={columns}
                item={item}
              />
            ))}
          </tbody>
        </table>
        {/* </div> */}
      </div>
    </>
  );
}

export default RelationTable;
