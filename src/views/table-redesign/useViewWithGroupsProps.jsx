import { useQuery, useQueryClient } from "react-query"
import FRow from "../../components/FormElements/FRow"
import HFSelect from "../../components/FormElements/HFSelect"
import MaterialUIProvider from "../../providers/MaterialUIProvider"
import { VIEW_TYPES_MAP } from "../../utils/constants/viewTypes"
import constructorTableService from "../../services/constructorTableService"
import { useMemo, useState } from "react"
import listToOptions from "../../utils/listToOptions"
import { useDispatch, useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"
import { InputAdornment, TextField } from "@mui/material"
import LanguageIcon from "@mui/icons-material/Language";
import { groupFieldActions } from "../../store/groupField/groupField.slice"
import constructorViewService from "../../services/constructorViewService"
import { showAlert } from "../../store/alert/alert.thunk";

export const useViewWithGroupsProps = ({
  relationView,
  viewsList,
  tableSlug: tableSlugProp,
  fieldsMap,
  fieldsMapRel,
  i18n,
  menuId,
  views,
  handleClose,
  refetchViews,
  handleClosePop = () => {},
  tableRelations,
}) => {
  const viewsWithSettings = [
    VIEW_TYPES_MAP.CALENDAR,
    VIEW_TYPES_MAP.TIMELINE,
    VIEW_TYPES_MAP.BOARD,
    VIEW_TYPES_MAP.WEBSITE,
  ];

  const {
    control,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors: viewErrors },
  } = useForm({});

  const tableSlug = Boolean(relationView) ? watch("table_slug") : tableSlugProp;

  const [selectedViewAnchor, setSelectedViewAnchor] = useState(null);
  const openViewSettings = (event) => {
    setSelectedViewAnchor(event.currentTarget);
  };
  const closeViewSettings = () => {
    setSelectedViewAnchor(null);
  };

  const [selectedViewTab, setSelectedViewTab] = useState(VIEW_TYPES_MAP.TABLE);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isWithTimeView = (type) =>
    ["TIMELINE", "CALENDAR"].includes(type || selectedViewTab);
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
      table_slug: tableSlug,
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

  const [error] = useState(false);
  const [loading, setLoading] = useState(false);

  const createView = (type) => {
    if (
      Boolean(tableRelations) &&
      relationView &&
      type !== VIEW_TYPES_MAP.WEBSITE &&
      !watch("table_slug")
    ) {
      setError("table_slug", { message: "Please select table" });
      return;
    }

    if (
      (type || selectedViewTab) === VIEW_TYPES_MAP.BOARD &&
      watch("group_fields").length === 0
    ) {
      setError("group_fields", { message: "Please select group" });
      return;
    }
    if (
      isWithTimeView(type || selectedViewTab) &&
      (!watch("calendar_from_slug") || !watch("calendar_to_slug"))
    ) {
      setError("calendar_from_slug", { message: "Please select date range" });
      setError("calendar_to_slug", { message: "Please select date range" });
      return;
    } else {
      clearErrors(["calendar_from_slug", "calendar_to_slug"]);
    }

    if ((type || selectedViewTab) === VIEW_TYPES_MAP.WEBSITE) {
      if (watch("web_link")) {
        constructorViewService
          .create(tableSlug, {
            ...newViewJSON,
            type: type || selectedViewTab,
            table_slug: viewsList?.[0]?.table_slug || tableSlug,
            relation_table_slug: watch("table_slug"),
            attributes: {
              ...newViewJSON?.attributes,
              web_link: watch("web_link"),
            },
          })
          .then(() => {
            dispatch(groupFieldActions.clearGroupBySlug());
            dispatch(showAlert("Successful created", "success"));
            return queryClient.refetchQueries(["GET_VIEWS_LIST"]);
          })
          .finally(() => {
            if (!Boolean(tableRelations)) {
              handleClose();
            }
            handleClosePop();
            closeViewSettings();
          });
      }
    } else {
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
          type: type || selectedViewTab,
          table_slug: table_slug,
          relation_table_slug: watch("table_slug"),
        })
        .then((res) => {
          dispatch(groupFieldActions.clearGroupBySlug());
          dispatch(showAlert("Successful created", "success"));
          if (relationView && viewsList?.length > 1) {
            return queryClient.refetchQueries([
              "GET_TABLE_VIEWS_LIST_RELATION",
            ]);
          } else if (relationView && viewsList?.length <= 1) {
            return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
          } else return queryClient.refetchQueries(["GET_VIEWS_LIST"]);
        })
        .finally(() => {
          if (!Boolean(tableRelations)) {
            handleClose();
          }
          refetchViews();
          handleClosePop();
          closeViewSettings();
        });
    }
  };

  const handleSelectViewType = (e, type) => {
    setSelectedViewTab(type);
    if (viewsWithSettings.includes(type) || Boolean(relationView)) {
      openViewSettings(e);
    } else {
      setLoading(true);
      createView(type);
    }
  };

  const table_slug = relationView
    ? viewsList?.[viewsList?.length - 1]?.table_slug
    : tableSlug;

  const { data: tableInfoData } = useQuery(
    ["GET_TABLE_INFO", { viewsList }],
    () => {
      return constructorTableService.getTableInfo(table_slug, {
        data: {},
      });
    },
    {
      enabled: Boolean(table_slug && !relationView),
      cacheTime: 10,
      select: (res) => {
        const fields = res?.data?.fields ?? [];

        return { fields };
      },
    }
  );

  const { data: tableInfoDataRelation } = useQuery(
    ["GET_TABLE_INFO_RELATION", watch("table_slug"), { viewsList }],
    () => {
      return constructorTableService.getTableInfo(watch("table_slug"), {
        data: {},
      });
    },
    {
      enabled: Boolean(watch("table_slug")),
      cacheTime: 10,
      select: (res) => {
        const fields = res?.data?.fields ?? [];
        return { fields };
      },
    }
  );

  const groupByTableSlug = useSelector(
    (state) => state?.groupField?.groupByFieldSlug
  );

  const fieldsData = relationView
    ? tableInfoDataRelation?.fields
    : tableInfoData?.fields;

  const computedColumns = useMemo(() => {
    const filteredFields = fieldsData?.filter(
      (el) => el?.type === "DATE" || el?.type === "DATE_TIME"
    );
    return listToOptions(filteredFields, "label", "slug");
  }, [fieldsData]);

  const computedColumnsForTabGroup = (
    Object.values(groupByTableSlug ? fieldsMapRel : fieldsMap) ?? []
  ).filter((column) =>
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

  const computedRelFields = useMemo(() => {
    const filteredFields = tableRelations
      ?.filter((el) => el?.type === "Many2One" || el?.type === "Many2Many")
      .map((item) => ({
        label: item?.table_from?.label,
        value: item?.table_from?.slug,
      }));
    return filteredFields;
  }, [tableRelations]);

  const getViewSettings = (viewType) => {
    switch (viewType) {
      case VIEW_TYPES_MAP.CALENDAR:
      case VIEW_TYPES_MAP.TIMELINE: {
        return (
          <MaterialUIProvider>
            {Boolean(relationView) && (
              <FRow label="Relation Field" required>
                <HFSelect
                  options={computedRelFields}
                  control={control}
                  name="table_slug"
                  MenuProps={{ disablePortal: true }}
                  required={true}
                  onChange={(e) => {
                    dispatch(groupFieldActions.addGroupBySlug(e));
                    setValue("table_slug", e);
                  }}
                />
              </FRow>
            )}
            <FRow
              label={
                viewType === VIEW_TYPES_MAP.CALENDAR ? "Date from" : "Time from"
              }
              required
            >
              <HFSelect
                options={computedColumns}
                control={control}
                name="calendar_from_slug"
                MenuProps={{ disablePortal: true }}
                required={true}
                disabled={relationView && !watch("table_slug")}
              />
            </FRow>
            <FRow
              label={viewType === "CALENDAR" ? "Date to" : "Time to"}
              required
            >
              <HFSelect
                options={computedColumns}
                control={control}
                name="calendar_to_slug"
                MenuProps={{ disablePortal: true }}
                required={true}
                disabled={relationView && !watch("table_slug")}
              />
            </FRow>
          </MaterialUIProvider>
        );
      }
      case VIEW_TYPES_MAP.BOARD: {
        return (
          <MaterialUIProvider>
            <FRow label="Group by" required>
              <HFSelect
                options={computedColumnsForTabGroupOptions}
                control={control}
                name="group_fields"
                MenuProps={{ disablePortal: true }}
                required={true}
              />
            </FRow>
            {Boolean(relationView) && (
              <FRow label="Relation Field" required>
                <HFSelect
                  options={computedRelFields}
                  control={control}
                  name="table_slug"
                  MenuProps={{ disablePortal: true }}
                  required={true}
                  onChange={(e) => {
                    dispatch(groupFieldActions.addGroupBySlug(e));
                    setValue("table_slug", e);
                  }}
                />
              </FRow>
            )}
          </MaterialUIProvider>
        );
      }
      case VIEW_TYPES_MAP.WEBSITE: {
        return (
          <>
            <Controller
              control={control}
              name="web_link"
              render={({ field: { onChange, value } }) => {
                return (
                  <TextField
                    id="website_link"
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    value={value}
                    placeholder="website link..."
                    className="webLinkInput"
                    sx={{ padding: 0 }}
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
            {/* {Boolean(relationView) && (
              <FRow label="Relation Field" required>
                <HFSelect
                  options={computedRelFields}
                  control={control}
                  name="table_slug"
                  MenuProps={{ disablePortal: true }}
                  required={true}
                  onChange={(e) => {
                    dispatch(groupFieldActions.addGroupBySlug(e));
                    setValue("table_slug", e);
                  }}
                />
              </FRow>
            )} */}
          </>
        );
      }
      default: {
        return (
          <>
            {Boolean(relationView) && (
              <MaterialUIProvider>
                <FRow label="Relation Field" required>
                  <HFSelect
                    options={computedRelFields}
                    control={control}
                    name="table_slug"
                    MenuProps={{ disablePortal: true }}
                    required={true}
                    onChange={(e) => {
                      dispatch(groupFieldActions.addGroupBySlug(e));
                      setValue("table_slug", e);
                    }}
                  />
                </FRow>
              </MaterialUIProvider>
            )}
          </>
        );
      }
    }
  };

  return {
    getViewSettings,
    viewsWithSettings,
    createView,
    handleSelectViewType,
    selectedViewAnchor,
    selectedViewTab,
    closeViewSettings,
    loading,
    control,
    computedColumns,
    viewErrors,
  };
};