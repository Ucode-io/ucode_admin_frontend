import { Close, Download, Upload } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CreateButton from "../../components/Buttons/CreateButton";
// import FiltersBlockButton from "../../components/Buttons/FiltersBlockButton"
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import FiltersBlock from "../../components/FiltersBlock";
// import SearchInput from "../../components/SearchInput"
import TableCard from "../../components/TableCard";
import useTabRouter from "../../hooks/useTabRouter";
import ColumnsSelector from "./components/ColumnsSelector";
import GroupFieldSelector from "./components/GroupFieldSelector";
import ViewTabSelector from "./components/ViewTypeSelector";
import TableView from "./TableView";
import style from "./style.module.scss";
import { useEffect } from "react";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import { CircularProgress } from "@mui/material";
import TreeView from "./TreeView";
import FastFilter from "./components/FastFilter";
import SettingsButton from "./components/SettingsButton";
import FastFilterButton from "./components/FastFilter/FastFilterButton";
import { useDispatch } from "react-redux";
import { filterAction } from "../../store/filter/filter.slice";

const ViewsWithGroups = ({
  tableSlug,
  views,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  computedColumns,
  groupField,
  view,
}) => {
  const [filters, setFilters] = useState({});
  const { navigateToForm } = useTabRouter();
  const [tabsData, setTabsData] = useState(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const filterChangeHandler = (value, name) => {
    // dispatch(filterAction.setFilters({ name, value }));
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug);
  };

  const tabs = useMemo(() => {
    if (!groupField) return [];
    if (groupField.type === "PICK_LIST") {
      return (
        groupField.attributes?.options?.map((el) => ({
          label: el,
          value: el,
        })) ?? []
      );
    }

    if (tabsData?.length) {
      return tabsData.map((el) => {
        const label = getRelationFieldTabsLabel(groupField, el);

        return {
          label: label,
          value: el.guid,
        };
      });
    }
  }, [groupField, tabsData]);

  useEffect(() => {
    if (!groupField?.id?.includes("#")) return setTabsData(null);
    const tableSlug = groupField.id.split("#")?.[0];

    setLoader(true);

    constructorObjectService
      .getList(tableSlug, {
        data: {},
      })
      .then(({ data }) => setTabsData(data.response))
      .finally(() => setLoader(false));
  }, [groupField]);

  return (
    <>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton />

            <GroupFieldSelector tableSlug={tableSlug} />

            <ColumnsSelector tableSlug={tableSlug} />

            <RectangleIconButton color="white">
              <Upload />
            </RectangleIconButton>
            <RectangleIconButton color="white">
              <Download />
            </RectangleIconButton>

            <SettingsButton />
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          setViews={setViews}
        />
        <FastFilter filters={filters} onChange={filterChangeHandler} />
      </FiltersBlock>

      <Tabs direction={"ltr"} defaultIndex={0}>
        <TableCard type="withoutPadding">
          <div className={style.tableCardHeader}>
            <TabList>
              {tabs?.map((tab) => (
                <Tab key={tab.value}>{tab.label}</Tab>
              ))}
            </TabList>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* <button
                style={{
                  background: "transparent",
                  border: "1px solid #e0e0e0",
                  padding: "4px",
                  borderRadius: "6px",
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Close />
              </button> */}
              <CreateButton type="secondary" onClick={navigateToCreatePage} />
            </div>
          </div>

          {loader ? (
            <div className={style.loader}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {tabs?.map((tab) => (
                <TabPanel key={tab.value}>
                  {view.type === "TREE" ? (
                    <TreeView
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
                      groupField={groupField}
                      group={tab}
                      view={view}
                    />
                  ) : (
                    <TableView
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
                      groupField={groupField}
                      group={tab}
                    />
                  )}
                </TabPanel>
              ))}

              {!groupField && (
                <>
                  {view.type === "TREE" ? (
                    <TreeView
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
                      view={view}
                    />
                  ) : (
                    <TableView
                      computedColumns={computedColumns}
                      tableSlug={tableSlug}
                      setViews={setViews}
                      filters={filters}
                      filterChangeHandler={filterChangeHandler}
                    />
                  )}
                </>
              )}
            </>
          )}
        </TableCard>
      </Tabs>
    </>
  );
};

export default ViewsWithGroups;
