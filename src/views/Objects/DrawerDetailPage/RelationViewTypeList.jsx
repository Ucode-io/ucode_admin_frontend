import React, {useMemo, useState} from "react";
import style from "./style.module.scss";
import {AccountTree, CalendarMonth, TableChart} from "@mui/icons-material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {Button, InputAdornment, TextField} from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import {useParams} from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import {useTranslation} from "react-i18next";
import {Controller, useForm} from "react-hook-form";
import LanguageIcon from "@mui/icons-material/Language";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import IconGenerator from "../../../components/IconPicker/IconGenerator";
import {computedViewTypes} from "../../../utils/constants/viewTypes";
import layoutService from "../../../services/layoutService";
import HFSelect from "../../../components/FormElements/HFSelect";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import FRow from "../../../components/FormElements/FRow";
import constructorTableService from "../../../services/constructorTableService";
import {useQuery} from "react-query";
import {listToMap} from "../../../utils/listToMap";

export default function RelationViewTypeList({
  tableSlug,
  selectedTab,
  layoutTabs,
  relationField,
  layout,
  // fieldsMap,
  handleClose = () => {},
  setLayoutTabs = () => {},
}) {
  const [selectedViewTab, setSelectedViewTab] = useState("TABLE");
  const [btnLoader, setBtnLoader] = useState(false);
  const {i18n} = useTranslation();
  const {menuId} = useParams();
  const relatedTableSlug = relationField?.table_slug;
  const {control, watch} = useForm();
  const [error, setError] = useState(false);

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

  const {
    data: {fieldsMap} = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
    () => {
      return constructorTableService.getTableInfo(
        relatedTableSlug,
        {
          data: {},
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: Boolean(relatedTableSlug),
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
        };
      },
      enabled: !!relatedTableSlug,
    }
  );
  console.log("fieldsMapfieldsMap", fieldsMap);
  const newViewJSON = useMemo(() => {
    return {
      attributes: {
        group_fields: [],
      },
      type: "relation",
      view_type: selectedViewTab,
      label: relationField?.attributes?.[`label_${i18n?.language}`],
      layout_id: layout?.id,
      relation_id: relationField?.relation_id,
      relation: {
        ...relationField,
      },
    };
  }, [menuId, selectedViewTab, tableSlug]);

  const createView = () => {
    const data = {
      ...newViewJSON,
      attributes: {
        ...newViewJSON?.attributes,
        group_fields: Boolean(watch("group_fields"))
          ? [watch("group_fields")]
          : [],
      },
    };

    if (selectedViewTab === "BOARD" && watch("group_fields").length === 0) {
      setError("group_fields", {message: "Please select group"});
      return;
    } else {
      setBtnLoader(true);
      updateLayout(data);
    }
  };

  function updateLayout(newTab) {
    const updatedTabs = [...layoutTabs, newTab];

    const currentUpdatedLayout = {
      ...layout,
      tabs: updatedTabs,
    };

    layoutService.update(currentUpdatedLayout, tableSlug).then((res) => {
      setLayoutTabs(res?.tabs);
      setBtnLoader(false);
      handleClose();
    });
  }

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
    <div className={style.viewTypeList}>
      <div className={style.wrapper}>
        <div className={style.left}>
          {computedViewTypes.map((type, index) => (
            <Button
              key={index}
              className={type.value === selectedViewTab ? style.active : ""}
              onClick={() => {
                setSelectedViewTab(type.value);
              }}>
              {type.value === "TABLE" && <TableChart className={style.icon} />}
              {type.value === "CALENDAR" && (
                <CalendarMonth className={style.icon} />
              )}
              {type.value === "CALENDAR HOUR" && (
                <IconGenerator className={style.icon} icon="chart-gantt.svg" />
              )}
              {type.value === "GANTT" && (
                <IconGenerator className={style.icon} icon="chart-gantt.svg" />
              )}
              {type.value === "TREE" && <AccountTree className={style.icon} />}
              {type.value === "BOARD" && (
                <IconGenerator className={style.icon} icon="brand_trello.svg" />
              )}
              {type.value === "FINANCE CALENDAR" && (
                <MonetizationOnIcon className={style.icon} />
              )}
              {type.value === "TIMELINE" && (
                <ClearAllIcon className={style.icon} />
              )}
              {type.value === "WEBSITE" && (
                <LanguageIcon className={style.icon} />
              )}
              {type.value === "GRID" && <FiberNewIcon className={style.icon} />}
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
          </div>

          <div className={style.button}>
            <LoadingButton
              variant="contained"
              loading={btnLoader}
              onClick={() => {
                createView();
              }}>
              Create View {selectedViewTab}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
