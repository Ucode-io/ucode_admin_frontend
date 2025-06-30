import React, {useEffect, useMemo, useState} from "react";
import style from "./style.module.scss";
import {Box, Button, InputAdornment, TextField} from "@mui/material";
import constructorViewService from "../../../../services/constructorViewService";
import {useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import LoadingButton from "@mui/lab/LoadingButton";
import {useTranslation} from "react-i18next";
import {Controller, useForm} from "react-hook-form";
import LanguageIcon from "@mui/icons-material/Language";
import SVG from "react-inlinesvg";
import MaterialUIProvider from "../../../../providers/MaterialUIProvider";
import FRow from "../../../../components/FormElements/FRow";
import HFSelect from "../../../../components/FormElements/HFSelect";
import constructorTableService from "../../../../services/constructorTableService";
import listToOptions from "../../../../utils/listToOptions";
import LinkIcon from "@mui/icons-material/Link";
import {useSelector} from "react-redux";

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
  WEBSITE: "globe.svg",
  TREE: "treeView.svg",
};

export default function ViewTypeList({
  view,
  tableRelations = [],
  computedViewTypes,
  views,
  handleClose,
  fieldsMap = {},
  relationView = false,
}) {
  const [selectedViewTab, setSelectedViewTab] = useState("TABLE");
  const [btnLoader, setBtnLoader] = useState(false);
  const [relationField, setRelationField] = useState(null);
  const {i18n} = useTranslation();
  const {menuId} = useParams();
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const viewsPath = useSelector((state) => state?.groupField?.viewsPath);

  const queryClient = useQueryClient();
  const {control, watch, setError, clearErrors} = useForm({});
  const [error] = useState(false);

  const tableSlug = Boolean(relationView)
    ? watch("table_slug")
    : view?.table_slug;

  const isWithTimeView = ["TIMELINE", "CALENDAR"].includes(selectedViewTab);

  const detectImageView = useMemo(() => {
    switch (selectedViewTab) {
      case "TABLE":
        return "/img/tableView.svg";
      case "CALENDAR":
        return "/img/calendarView.svg";
      case "CALENDAR HOUR":
        return "/img/calendarHourView.svg";
      case "GANTT":
        return "/img/ganttView.svg";
      case "TREE":
        return "/img/treeView.svg";
      case "BOARD":
        return "/img/boardView.svg";
      case "FINANCE CALENDAR":
        return "/img/financeCalendarView.svg";
      case "TIMELINE":
        return "/img/calendarHourView.svg";
      case "WEBSITE":
        return "/img/calendarHourView.svg";
      case "GRID":
        return "/img/calendarHourView.svg";
      default:
        return "/img/tableView.svg";
    }
  }, [selectedViewTab]);

  const detectDescriptionView = useMemo(() => {
    switch (selectedViewTab) {
      case "TABLE":
        return "Easily manage, update, and organize your tasks with Table view. ";
      case "CALENDAR":
        return "Calendar view is your place for planning, scheduling, and resource management.  ";
      case "CALENDAR HOUR":
        return "Plan out your work over time. See overlaps, map your schedule out and see it all divided by groups. ";
      case "GANTT":
        return "Plan time, manage resources, visualize dependencies and more with Gantt view";
      case "TREE":
        return "Use List view to organize your tasks in anyway imaginable – sort, filter, group, and customize columns. ";
      case "BOARD":
        return "Build your perfect Board and easily drag-and-drop tasks between columns. ";
      case "FINANCE CALENDAR":
        return "See your teams capacity, who is over or under and reassign tasks accordingly.";
      case "TIMELINE":
        return "Plan out your work over time. See overlaps, map your schedule out and see it all divided by groups.";
      case "WEBSITE":
        return "Website view allows you to display any website by simply placing your own link to showcase external content.";
      case "TABLEV2":
        return "NEW MODIFIED TABLE, ONLY FOR TESTING NOW";
      default:
        return "Easily manage, update, and organize your tasks with Table view.";
    }
  }, [selectedViewTab]);

  const newViewJSON = useMemo(() => {
    const menuID = viewsList?.length > 1 ? undefined : menuId;
    return {
      type: selectedViewTab,
      users: [],
      name: "",
      default_limit: "",
      main_field: "",
      time_interval: 60,
      status_field_slug: "",
      disable_dates: {
        day_slug: "",
        table_slug: "",
        time_from_slug: "",
        time_to_slug: "",
      },
      columns: [],
      group_fields: [],
      navigate: {
        params: [],
        url: "",
        headers: [],
        cookies: [],
      },
      table_slug: "",
      updated_fields: [],
      multiple_insert: false,
      multiple_insert_field: "",
      chartOfAccounts: [{}],
      is_relation_view: relationView,
      attributes: {
        chart_of_accounts: [
          {
            chart_of_account: [],
          },
        ],
        percent: {
          field_id: null,
        },
        group_by_columns: [],
        summaries: [],
        name_ru: "",
        treeData: selectedViewTab === "TREE",
      },
      filters: [],
      number_field: "",
      menu_id: menuID,
      order: views.length + 1,
    };
  }, [menuId, selectedViewTab, tableSlug, views]);

  const createView = () => {
    if (selectedViewTab === "BOARD" && watch("group_fields").length === 0) {
      setError("group_fields", {message: "Please select group"});
      return;
    }
    if (
      isWithTimeView &&
      (!watch("calendar_from_slug") || !watch("calendar_to_slug"))
    ) {
      setError("calendar_from_slug", {message: "Please select date range"});
      setError("calendar_to_slug", {message: "Please select date range"});
      return;
    } else {
      clearErrors(["calendar_from_slug", "calendar_to_slug"]);
    }

    if (selectedViewTab === "WEBSITE") {
      if (watch("web_link")) {
        setBtnLoader(true);
        constructorViewService
          .create(tableSlug, {
            ...newViewJSON,
            table_slug: viewsList?.[0]?.table_slug,
            relation_table_slug: watch("table_slug"),
            attributes: {
              ...newViewJSON?.attributes,
              web_link: watch("web_link"),
            },
          })
          .then(() => {
            queryClient.refetchQueries(["GET_VIEWS_LIST"]);
          })
          .finally(() => {
            setBtnLoader(false);
            handleClose();
          });
      } else {
        setError(true);
      }
    } else {
      setBtnLoader(true);
      newViewJSON.attributes = {
        ...newViewJSON?.attributes,
        calendar_from_slug: watch("calendar_from_slug") || null,
        calendar_to_slug: watch("calendar_to_slug") || null,
      };
      newViewJSON.group_fields = Boolean(watch("group_fields"))
        ? [watch("group_fields")]
        : [];
      constructorViewService
        .create(tableSlug, {
          ...newViewJSON,
          table_slug:
            viewsPath?.[viewsPath?.length - 1]?.relation_table_slug ||
            viewsPath?.[viewsPath?.length - 1]?.table_slug,
          relation_table_slug: watch("table_slug"),
        })
        .then((res) => {
          if (relationView && viewsList?.length > 1) {
            return queryClient.refetchQueries([
              "GET_TABLE_VIEWS_LIST_RELATION",
            ]);
          } else if (relationView && viewsList?.length <= 1) {
            return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
          } else return queryClient.refetchQueries(["GET_VIEWS_LIST"]);
        })
        .finally(() => {
          setBtnLoader(false);
          handleClose();
        });
    }
  };
  const table_slug = relationView
    ? viewsList?.[viewsList?.length - 1]?.table_slug
    : tableSlug;

  const {data} = useQuery(
    ["GET_TABLE_INFO", {viewsList}],
    () => {
      return constructorTableService.getTableInfo(table_slug, {
        data: {},
      });
    },
    {
      enabled: Boolean(table_slug),
      cacheTime: 10,
      select: (res) => {
        const fields = res?.data?.fields ?? [];

        return {fields};
      },
    }
  );

  const fields = data?.fields ?? [];

  const computedColumns = useMemo(() => {
    const filteredFields = fields?.filter(
      (el) => el?.type === "DATE" || el?.type === "DATE_TIME"
    );
    return listToOptions(filteredFields, "label", "slug");
  }, [fields]);

  const computedRelFields = useMemo(() => {
    const filteredFields = tableRelations
      ?.filter((el) => el?.type === "Many2One" || el?.type === "Many2Many")
      .map((item) => ({
        label: item?.table_from?.label,
        value: item?.table_from?.slug,
      }));
    return filteredFields;
  }, [tableRelations]);

  const computedColumnsForTabGroup = (Object.values(fieldsMap) ?? []).filter(
    (column) =>
      ["LOOKUP", "PICK_LIST", "LOOKUPS", "MULTISELECT", "STATUS"].includes(
        column.type
      )
  );

  const computedColumnsForTabGroupOptions = computedColumnsForTabGroup.map(
    (el) => ({
      label:
        el?.type === "LOOKUP" || el?.type === "LOOKUPS"
          ? el?.attributes?.[`label_${i18n.language}`] ||
            el?.attributes?.label ||
            el?.label
          : el.label,
      value:
        el?.type === "LOOKUP" || el?.type === "LOOKUPS"
          ? el?.relation_id
          : el?.id,
    })
  );

  return (
    <>
      <div className={style.viewTypeList}>
        <div className={style.wrapper}>
          <div className={style.left}>
            {computedViewTypes.map((type, index) => (
              <Button
                key={index}
                className={type.value === selectedViewTab ? style.active : ""}
                onClick={() => {
                  setSelectedViewTab(type.value);
                }}
                startIcon={
                  <SVG
                    src={`/img/${viewIcons[type?.value]}`}
                    width={18}
                    height={18}
                  />
                }
                style={{
                  columnGap: "8px",
                  "MuiButton-startIcon": {
                    marginLeft: 0,
                  },
                }}>
                {type.label}
              </Button>
            ))}
          </div>

          <div className={style.right}>
            <div className={style.img}>
              <img src={detectImageView} alt="add view" />
            </div>
            <div className={style.text}>
              <h3>{selectedViewTab}</h3>
              <p>{detectDescriptionView}</p>
              {selectedViewTab === "WEBSITE" && (
                <Controller
                  control={control}
                  name="web_link"
                  render={({field: {onChange, value}}) => {
                    return (
                      <TextField
                        id="website_link"
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                        value={value}
                        placeholder="website link..."
                        className="webLinkInput"
                        sx={{padding: 0}}
                        fullWidth
                        name="web_link"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LanguageIcon />
                            </InputAdornment>
                          ),
                        }}
                        error={error}
                      />
                    );
                  }}
                />
              )}
              {isWithTimeView && (
                <MaterialUIProvider>
                  <FRow
                    label={
                      selectedViewTab === "CALENDAR" ? "Date from" : "Time from"
                    }
                    required>
                    <HFSelect
                      options={computedColumns}
                      control={control}
                      name="calendar_from_slug"
                      MenuProps={{disablePortal: true}}
                      required={true}
                    />
                  </FRow>
                  <FRow
                    label={
                      selectedViewTab === "CALENDAR" ? "Date to" : "Time to"
                    }
                    required>
                    <HFSelect
                      options={computedColumns}
                      control={control}
                      name="calendar_to_slug"
                      MenuProps={{disablePortal: true}}
                      required={true}
                    />
                  </FRow>
                </MaterialUIProvider>
              )}
              {selectedViewTab === "BOARD" && (
                <MaterialUIProvider>
                  <FRow label="Group by" required>
                    <HFSelect
                      options={computedColumnsForTabGroupOptions}
                      control={control}
                      name="group_fields"
                      MenuProps={{disablePortal: true}}
                      required={true}
                    />
                  </FRow>
                </MaterialUIProvider>
              )}
              {Boolean(relationView) && (
                <MaterialUIProvider>
                  <FRow label="Relation Field" required>
                    <HFSelect
                      options={computedRelFields}
                      control={control}
                      name="table_slug"
                      MenuProps={{disablePortal: true}}
                      required={true}
                    />
                  </FRow>
                </MaterialUIProvider>
              )}
            </div>
            <div className={style.button}>
              <LoadingButton
                variant="contained"
                loading={btnLoader}
                onClick={() => {
                  // handleClose();
                  // openModal();
                  // setSelectedView("NEW");
                  // setTypeNewView(selectedViewTab);
                  createView();
                }}>
                Create View {selectedViewTab}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
