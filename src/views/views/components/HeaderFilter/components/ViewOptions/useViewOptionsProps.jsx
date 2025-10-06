import useDebounce from "@/hooks/useDebounce";
import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import constructorTableService, {
  useGetTableInfo,
} from "@/services/tableService/table.service";
import constructorViewService from "@/services/viewsService/views.service";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { viewsActions } from "@/store/views/view.slice";
import { VIEW_TYPES_MAP } from "@/utils/constants/viewTypes";
import { listToMap } from "@/utils/listToMap";
import listToOptions from "@/utils/listToOptions";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const useViewOptionsProps = ({ settingsForm }) => {
  const navigate = useNavigate();
  const { menuId, appId, tableSlug: tableSlugFromProps } = useParams();

  const dispatch = useDispatch();

  const selectedTabIndex = useSelector((state) => state.drawer.mainTabIndex);
  const projectId = useSelector((state) => state.company.projectId);
  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const new_router = Boolean(localStorage.getItem("new_router") === "true");

  const {
    views,
    view,
    tableSlug: tableSlugFromContext,
    isRelationView,
    refetchViews,
  } = useViewContext();

  const { fieldsMap } = useFieldsContext();

  const { i18n, t } = useTranslation();
  const tableLan = useGetLang("Table");

  const viewName = isRelationView
    ? view?.attributes?.[`name_${i18n?.language}`] || view?.table_label
    : view?.attributes?.[`name_${i18n?.language}`] || view?.name || view?.type;

  const tableSlug = isRelationView
    ? view?.relation_table_slug
    : (tableSlugFromProps ?? tableSlugFromContext);

  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug]
  );

  const queryClient = useQueryClient();

  const { isOpen: isPopoverOpen, onToggle, onClose } = useDisclosure();

  const ref = useRef();

  const [openedMenu, setOpenedMenu] = useState(null);

  const isTimelineView = view?.type === VIEW_TYPES_MAP.TIMELINE;
  const isBoardView = view?.type === VIEW_TYPES_MAP.BOARD;
  const isCalendarView = view?.type === VIEW_TYPES_MAP.CALENDAR;

  const onDocsClick = () => {
    dispatch(detailDrawerActions.setDrawerTabIndex(views?.length));
    if (new_router) {
      navigate(`/${menuId}/templates?tableSlug=${tableSlug}`);
    } else {
      navigate(`/main/${appId}/object/${tableSlug}/templates`);
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [openedMenu]);

  useEffect(() => {
    settingsForm.setValue(
      "calendar_from_slug",
      view?.attributes?.calendar_from_slug
    );
    settingsForm.setValue(
      "calendar_to_slug",
      view?.attributes?.calendar_to_slug
    );
    settingsForm.setValue("group_fields", view?.group_fields);
  }, [view]);

  const updateView = useMutation({
    mutationFn: async (value) => {
      const viewData = {
        ...view,
        id: view.id,
        columns: view.columns,
        attributes: { ...view?.attributes, [`name_${i18n?.language}`]: value },
      };

      if (isRelationView) {
        viewData.table_label = value;
      }

      await constructorViewService.update(tableSlug, viewData);

      if (isRelationView && viewsList?.length > 1) {
        // return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
      } else {
        return refetchViews();
        // return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      }
    },
  });

  const onViewNameChange = useDebounce((ev) => {
    updateView.mutate(ev.target.value);
    if (!isRelationView) {
      const newView = {
        ...view,
        attributes: {
          ...view?.attributes,
          [`name_${i18n?.language}`]: ev.target.value,
        },
      };
      dispatch(viewsActions.updateView({ view: newView, id: view?.id }));
    }
  }, 500);

  const fixedColumnsCount = Object.values(
    view?.attributes?.fixedColumns || {}
  ).length;
  const groupByColumnsCount = view?.attributes?.group_by_columns?.length;
  const visibleColumnsCount = view?.columns?.length ?? 0;
  const tabGroupColumnsCount = view?.group_fields?.length;
  const visibleColumnsCountForTimeline =
    view?.attributes?.visible_field?.split("/")?.length ?? 0;

  const {
    data: { fields, visibleColumns } = {
      data: [],
    },
  } = useGetTableInfo(
    tableSlug,
    {},
    {
      enabled: false,
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];
        const fieldsMap = listToMap([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
        }));

        return {
          fieldsMap,
          data,
          fields,
          visibleColumns: res?.data?.fields ?? [],
          visibleRelationColumns:
            res?.data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const computedColumns = useMemo(() => {
    const filteredFields = fields?.filter(
      (el) => el?.type === "DATE" || el?.type === "DATE_TIME"
    );
    return listToOptions(filteredFields, "label", "slug");
  }, [fields]);

  const saveSettings = () => {
    const computedData = {
      ...view,
      attributes: {
        ...view.attributes,
        calendar_from_slug: settingsForm.getValues("calendar_from_slug"),
        calendar_to_slug: settingsForm.getValues("calendar_to_slug"),
        // visible_field: settingsForm.getValues("visible_field"),
      },
    };

    constructorViewService
      .update(tableSlug, {
        ...computedData,
      })
      .then(() => {
        if (isRelationView && viewsList?.length > 1) {
          return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
        } else {
          return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
        }
      });
  };

  const viewUpdateMutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
  });

  const navigateToOldTemplate = () => {
    if (localStorage.getItem("new_router") === "true") {
      navigate(`/${menuId}/object/${tableSlug}/docs`);
    } else {
      navigate(`/main/${appId}/object/${tableSlug}/docs`);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        setOpenedMenu(null);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClosePopover = () => {
    setTimeout(() => setOpenedMenu(null), 250);
    onClose();
  };

  return {
    isPopoverOpen,
    handleClosePopover,
    onToggle,
    ref,
    openedMenu,
    onViewNameChange,
    updateView,
    view,
    tableLan,
    i18n,
    t,
    refetchViews,
    isTimelineView,
    visibleColumnsCountForTimeline,
    visibleColumnsCount,
    roleInfo,
    permissions,
    setOpenedMenu,
    groupByColumnsCount,
    isBoardView,
    tabGroupColumnsCount,
    fieldsMap,
    fixedColumnsCount,
    isCalendarView,
    isRelationView,
    tableSlug,
    navigateToOldTemplate,
    viewUpdateMutation,
    computedColumns,
    saveSettings,
    visibleColumns,
    views,
    projectId,
    viewName,
    onDocsClick,
    selectedTabIndex,
  };
};
