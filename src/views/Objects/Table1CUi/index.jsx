import {Box} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import TableUiHead from "./TableUiHead/TableUiHead";
import TableFilterBlock from "./TableFilterBlock";
import TableComponent from "./TableComponent/TableComponent";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import newTableService from "../../../services/newTableService";
import useFilters from "../../../hooks/useFilters";
import {customSortArray} from "../../../utils/customSortArray";
import TableCard from "../../../components/TableCard";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "./style.module.scss";

function Table1CUi({
  menuItem,
  view,
  fieldsMap,
  views,
  computedVisibleFields,
  selectedTabIndex,
  setSelectedTabIndex,
  settingsModalVisible,
  setSettingsModalVisible,
  isChanged,
  setIsChanged,
  selectedView,
  setSelectedView,
  control,
  tabs,
}) {
  const {tableSlug} = useParams();
  const [openFilter, setOpenFilter] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const {filters} = useFilters(tableSlug, view.id);
  const [searchText, setSearchText] = useState();
  const [selectedTab, setSelectedTab] = useState();
  const [selectedTabIn, setSelectedTabIn] = useState(0);

  function hasValidFilters(filters) {
    if (!filters || typeof filters !== "object") {
      return false;
    }

    return Object.keys(filters).some((key) => {
      const value = filters[key];
      if (typeof value === "string" && value.trim() !== "") return true;
      if (typeof value === "number") return true;
      if (Array.isArray(value) && value.length > 0) return true;
      if (
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length > 0
      )
        return true;
      return false;
    });
  }

  const {data: {filteredItems} = {data: []}} = useQuery({
    queryKey: [
      "GET_OBJECTS_LIST",
      {
        filters,
        selectedTab,
        searchText,
      },
    ],
    queryFn: () => {
      return constructorObjectService.getListV2(tableSlug, {
        data: {
          ...filters,
          search: searchText,
          limit,
          offset,
          [selectedTab?.slug]: [selectedTab?.value],
        },
      });
    },
    cacheTime: 10,
    enabled:
      hasValidFilters(filters) ||
      Boolean(searchText) ||
      Boolean(selectedTab?.slug),
    select: (res) => {
      const filteredItems = res?.data?.response;
      return {
        filteredItems,
      };
    },
  });

  const {data: {foldersList, count} = {data: []}, refetch} = useQuery(
    ["GET_FOLDER_LIST", {tableSlug, limit, offset}],
    () => {
      return newTableService.getFolderList({
        table_id: menuItem?.table_id,
        limit: limit,
        offset: offset,
      });
    },
    {
      enabled: Boolean(menuItem?.table_id) && !hasValidFilters(filters),
      cacheTime: 10,
      select: (res) => {
        const foldersList = res?.folder_groups ?? [];
        const count = res?.count;
        return {
          foldersList,
          count,
        };
      },
    }
  );

  const folders =
    hasValidFilters(filters) ||
    Boolean(searchText) ||
    Boolean(selectedTab?.value)
      ? filteredItems
      : foldersList;

  const columns = useMemo(() => {
    const result = [];
    for (const key in view.attributes.fixedColumns) {
      if (view.attributes.fixedColumns.hasOwnProperty(key)) {
        if (view.attributes.fixedColumns[key]) {
          result.push({id: key, value: view.attributes.fixedColumns[key]});
        }
      }
    }

    const uniqueIdsSet = new Set();
    const uniqueColumns = view?.columns?.filter((column) => {
      if (!uniqueIdsSet.has(column)) {
        uniqueIdsSet.add(column);
        return true;
      }
      return false;
    });

    return customSortArray(
      uniqueColumns,
      result.map((el) => el.id)
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap]);

  useEffect(() => {
    if (tabs?.length) {
      setSelectedTab(tabs?.[0]);
      setSelectedTabIn(0);
    } else if (!tabs?.length) {
      setSelectedTab(null);
    }
  }, [tabs?.length]);

  return (
    <Box>
      <TableUiHead
        menuItem={menuItem}
        views={views}
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
        settingsModalVisible={settingsModalVisible}
        setSettingsModalVisible={setSettingsModalVisible}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />
      <TableFilterBlock
        fields={columns}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        view={view}
        fieldsMap={fieldsMap}
        menuItem={menuItem}
        setSearchText={setSearchText}
        computedVisibleFields={computedVisibleFields}
      />

      <Tabs
        selectedIndex={selectedTabIn}
        onSelect={(index) => {
          setSelectedTabIn(index);
        }}>
        <TableCard type="withoutPadding">
          {tabs?.length > 0 && (
            <div className={styles.tableCardHeader}>
              <div style={{display: "flex", alignItems: "center"}}>
                <div className="title" style={{marginRight: "20px"}}>
                  <h3>{view.table_label}</h3>
                </div>
                <TabList style={{border: "none"}}>
                  {tabs?.map((tab) => (
                    <Tab
                      onClick={() => setSelectedTab(tab)}
                      key={tab.value}
                      selectedClassName={styles.activeTab}
                      className={`${styles.disableTab} react-tabs__tab`}>
                      {tab.label}
                    </Tab>
                  ))}
                </TabList>
              </div>
            </div>
          )}

          {tabs?.length
            ? tabs?.map((tab) => (
                <TabPanel>
                  <TableComponent
                    folders={folders}
                    fields={columns}
                    openFilter={openFilter}
                    count={count}
                    limit={limit}
                    tab={tab}
                    setLimit={setLimit}
                    offset={offset}
                    setOffset={setOffset}
                    view={view}
                    menuItem={menuItem}
                    searchText={searchText}
                    control={control}
                    refetch={refetch}
                  />
                </TabPanel>
              ))
            : null}

          {!tabs?.length ? (
            <TableComponent
              folders={folders}
              fields={columns}
              openFilter={openFilter}
              count={count}
              limit={limit}
              setLimit={setLimit}
              offset={offset}
              setOffset={setOffset}
              view={view}
              menuItem={menuItem}
              searchText={searchText}
              control={control}
              refetch={refetch}
            />
          ) : null}
        </TableCard>
      </Tabs>
    </Box>
  );
}

export default Table1CUi;
