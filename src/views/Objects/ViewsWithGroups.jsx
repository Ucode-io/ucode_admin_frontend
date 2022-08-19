import { Download, Upload } from "@mui/icons-material";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CreateButton from "../../components/Buttons/CreateButton";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import FiltersBlock from "../../components/FiltersBlock";
import TableCard from "../../components/TableCard";
import useTabRouter from "../../hooks/useTabRouter";
import ViewTabSelector from "./components/ViewTypeSelector";
import TableView from "./TableView";
import style from "./style.module.scss";
import TreeView from "./TreeView";
import FastFilter from "./components/FastFilter";
import SettingsButton from "./components/ViewSettings/SettingsButton";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import { getRelationFieldTabsLabel } from "../../utils/getRelationFieldLabel";
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import useFilters from "../../hooks/useFilters";
import FastFilterButton from "./components/FastFilter/FastFilterButton";
import { useDispatch, useSelector } from "react-redux";
// import OutsideClickHandler from "react-outside-click-handler";
// import { CheckIcon, HeightControlIcon } from "../../assets/icons/icon";
import { tableSizeAction } from "../../store/tableSize/tableSizeSlice";
import ExcelButtons from "./components/ExcelButtons";

const ViewsWithGroups = ({
  views,
  selectedTabIndex,
  setSelectedTabIndex,
  view,
  fieldsMap,
}) => {
  const { tableSlug } = useParams();
  const dispatch = useDispatch();
  const { filters } = useFilters(tableSlug, view.id);
  const permissions = useSelector((state) => state.auth.permissions);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [heightControl, setHeightControl] = useState(false);
  const { navigateToForm } = useTabRouter();

  const tableHeightOptions = [
    {
      label: "Small",
      value: "small",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Large",
      value: "large",
    },
  ];

  const handleHeightControl = (val) => {
    dispatch(
      tableSizeAction.setTableHeight({
        tableHeight: val,
      })
    );
    setHeightControl(false);
  };

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug);
  };

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];

  const { data: tabs, isLoading: loader } = useQuery(
    queryGenerator(groupField, filters)
  );

  return (
    <>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton view={view} />
            <ExcelButtons />

            <SettingsButton />
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
        />
        <FastFilter view={view} fieldsMap={fieldsMap} />
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
              {/* <OutsideClickHandler
                onOutsideClick={() => setHeightControl(false)}
              >
                <div style={{ position: "relative" }}>
                  <span
                    onClick={() => setHeightControl(!heightControl)}
                    style={{ cursor: "pointer" }}
                  >
                    <HeightControlIcon />
                  </span>
                  {heightControl && (
                    <div className={style.heightControl}>
                      {tableHeightOptions.map((el) => (
                        <div
                        key={el.value}
                        className={style.heightControl_item}
                        onClick={() => handleHeightControl(el.value)}
                        >
                          {el.label}
                          {tableHeight === el.value ? <CheckIcon/> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </OutsideClickHandler> */}
              {permissions?.find(
                (permission) => permission?.table_slug === tableSlug
              )?.write === "Yes" ? (
                <CreateButton type="secondary" onClick={navigateToCreatePage} />
              ) : null}
            </div>
          </div>

          {/* <>
            {view.type === "TREE" ? (
              <TreeView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
                view={view}
              />
            ) : (
              <TableView
                filters={filters}
                filterChangeHandler={filterChangeHandler}
              />
            )}
          </> */}

          {loader ? (
            <div className={style.loader}>
              <CircularProgress />
            </div>
          ) : (
            <>
              {tabs?.map((tab) => (
                <TabPanel key={tab.value}>
                  {permissions?.find(
                    (permission) => permission?.table_slug === tableSlug
                  )?.read === "Yes" ? (
                    view.type === "TREE" ? (
                      <TreeView
                        filters={filters}
                        tableSlug={tableSlug}
                        group={tab}
                        view={view}
                      />
                    ) : (
                      <TableView
                        filters={filters}
                        tab={tab}
                        view={view}
                        fieldsMap={fieldsMap}
                      />
                    )
                  ) : null}
                </TabPanel>
              ))}

              {!tabs?.length && (
                <>
                  {permissions?.find(
                    (permission) => permission?.table_slug === tableSlug
                  )?.read === "Yes" ? (
                    view.type === "TREE" ? (
                      <TreeView
                        filters={filters}
                        tableSlug={tableSlug}
                        view={view}
                        fieldsMap={fieldsMap}
                      />
                    ) : (
                      <TableView
                        filters={filters}
                        view={view}
                        fieldsMap={fieldsMap}
                      />
                    )
                  ) : null}
                </>
              )}
            </>
          )}
        </TableCard>
      </Tabs>
    </>
  );
};

const queryGenerator = (groupField, filters = {}) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {};

  if (groupField?.type === "PICK_LIST") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el,
          value: el,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP") {
    const queryFn = () =>
      constructorObjectService.getList(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        { tableSlug: groupField.table_slug, filters: computedFilters },
      ],
      queryFn,
      select: (res) =>
        res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        })),
    };
  }
};

export default ViewsWithGroups;
