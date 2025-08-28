import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {TabPanel, Tabs} from "react-tabs";
import constructorViewService from "../../services/constructorViewService";
import {updateQueryWithoutRerender} from "../../utils/useSafeQueryUpdater";
import menuService from "../../services/menuService";
import {listToMap, listToMapWithoutRel} from "../../utils/listToMap";
import {NewUiViewsWithGroups} from "../table-redesign/views-with-groups";
import {useForm} from "react-hook-form";
import layoutService from "../../services/layoutService";
import {sortSections} from "../../utils/sectionsOrderNumber";
import constructorObjectService from "../../services/constructorObjectService";
import {showAlert} from "../../store/alert/alert.thunk";
import {useDispatch, useSelector} from "react-redux";
import {detailDrawerActions} from "../../store/detailDrawer/detailDrawer.slice";
import constructorRelationService from "../../services/constructorRelationService";
import useTabRouter from "../../hooks/useTabRouter";

const sortViews = (views = []) => {
  const firstSection = views.find((v) => v.type === "SECTION");
  const others = views.filter((v) => v.type !== "SECTION");
  return firstSection ? [firstSection, ...others] : others;
};

function NewObjectsFormPage() {
  const {state, pathname} = useLocation();
  const {menuId} = useParams();
  const navigate = useNavigate();
  const {i18n} = useTranslation();
  const [data, setData] = useState();
  const queryClient = useQueryClient();
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const selectedTabIndex = useSelector(
    (state) => state?.drawer?.drawerTabIndex
  );
  const [selectedViewType, setSelectedViewType] = useState(null);

  const {navigateToForm} = useTabRouter();

  const projectInfo = state?.projectInfo;
  const selectedRow = state?.selectedRow;
  const tableSlug = state?.table_slug;
  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v");
  const itemId = query.get("p");

  const viewsPath = useSelector((state) => state.groupField.viewsPath);
  const viewsList = useSelector((state) => state.groupField.viewsList);

  const selectedV = viewsList?.[viewsList.length - 1];
  const lastPath = viewsPath?.[viewsPath.length - 1];
  const isRelationView = Boolean(selectedV?.relation_table_slug);

  const dispatch = useDispatch();

  const rootForm = useForm({
    ...state,
  });

  const {data: menuViews, refetch: refetchMenuViews} = useQuery(
    ["GET_TABLE_VIEWS_LIST", menuId],
    () => constructorViewService.getViewListMenuId(menuId),
    {
      enabled: !isRelationView && Boolean(menuId),
      select: (res) =>
        sortViews(
          res?.views?.filter(
            (item) => item?.type === "SECTION" || item?.is_relation_view
          ) ?? []
        ),
      onSuccess: (data) => {
        if (selectedTabIndex >= data?.length) {
          dispatch(detailDrawerActions.setDrawerTabIndex(0));
        }
        setSelectedView(data?.[0]);
        updateQueryWithoutRerender("v", data?.[0]?.id);
        if (state?.toDocsTab) {
          dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      },
    }
  );

  const { data: relationViews, refetch: refetchRelationViews } = useQuery(
    ["GET_TABLE_VIEWS_LIST_RELATION", selectedV?.relation_table_slug],
    () =>
      constructorViewService.getViewListMenuId(selectedV?.relation_table_slug),
    {
      enabled: Boolean(viewsList?.[viewsList?.length - 1]?.relation_table_slug),

      select: (res) =>
        sortViews(
          res?.views?.filter(
            (item) => item?.type === "SECTION" || item?.is_relation_view
          ) ?? []
        ),

      onSuccess: (data) => {
        setSelectedView(data?.[0]);
        updateQueryWithoutRerender("v", data?.[0]?.id);

        if (state?.toDocsTab) {
          dispatch(detailDrawerActions.setDrawerTabIndex(data?.length));
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      },
    }
  );

  const views = useMemo(() => {
    return !isRelationView ? menuViews : relationViews;
  }, [menuViews, relationViews, isRelationView, viewsList?.length]);

  const {
    data: {
      fieldsMap,
      fieldsMapRel,
      visibleColumns,
      visibleRelationColumns,
      tableInfo,
    } = {
      fieldsMap: {},
      fieldsMapRel: {},
      tableInfo: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isLoading,
  } = useQuery(
    [
      "GET_VIEWS_AND_FIELDS",
      selectedView?.table_slug,
      i18n?.language,
      selectedTabIndex,
    ],
    () => {
      if (Boolean(!selectedView?.table_slug)) return [];
      return menuService.getFieldsListMenu(
        menuId,
        selectedView?.id,
        lastPath?.relation_table_slug,
        {}
      );
    },
    {
      enabled: Boolean(lastPath?.relation_table_slug),
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
          fieldsMapRel: listToMapWithoutRel(data?.fields ?? []),
          visibleColumns: data?.fields ?? [],
          tableInfo: data?.table_info || {},
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const {data: {relations} = {relations: []}} = useQuery(
    ["GET_VIEWS_AND_FIELDS", viewsList?.length],
    () =>
      constructorRelationService.getList(
        {
          table_slug: viewsList?.[viewsList?.length - 1]?.table_slug,
          relation_table_slug:
            viewsList?.[viewsList?.length - 1]?.relation_table_slug,
          disable_table_to: true,
        },
        {},
        viewsList?.[viewsList?.length - 1]?.relation_table_slug ||
          viewsList?.[viewsList?.length - 1]?.table_slug
      ),
    {
      enabled: Boolean(viewsList?.[0]?.table_slug),
    }
  );

  const {
    data: {layout} = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, menuId);
    },
    enabled: Boolean(tableSlug),
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
  });

  const getAllData = async () => {
    setLoader(true);
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    const getFormData = menuService.getFieldsTableDataById(
      menuId,
      viewId,
      tableSlug,
      itemId
    );

    try {
      const [{data = {}}, layout] = await Promise.all([getFormData, getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((field) => {
                  if (field?.is_visible_layout === undefined) {
                    return {
                      ...field,
                      is_visible_layout: true,
                    };
                  } else {
                    return field;
                  }
                }),
              };
            }),
          };
        }),
      };
      setData(layout2);
      setSections(sortSections(sections));

      rootForm.reset(data?.response ?? {});

      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [layout] = await Promise.all([getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((field) => {
                  if (field?.is_visible_layout === undefined) {
                    return {
                      ...field,
                      is_visible_layout: true,
                    };
                  } else {
                    return field;
                  }
                }),
              };
            }),
          };
        }),
      };
      setData(layout2);
      setSections(sortSections(sections));

      if (!menuId) {
        setLoader(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const update = (data) => {
    delete data.invite;
    setLoading(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        updateLayout();
        dispatch(showAlert("Successfully updated", "success"));
        queryClient.refetchQueries("GET_OBJECTS_LIST", tableSlug, {
          table_slug: tableSlug,
        });
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        setLoading(false);
      });
  };
  const create = (data) => {
    setLoading(true);

    constructorObjectService
      .create(tableSlug, {data})
      .then((res) => {
        updateLayout();
        setOpen(false);
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          }
        );
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        if (modal) {
          handleClose();
          queryClient.refetchQueries(
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            tableSlug,
            {
              table_slug: tableSlug,
            }
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }
        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        setLoading(false);
        rootForm.refetch();
      });
  };

  const onSubmit = (data) => {
    if (itemId) {
      update(data);
    } else {
      create(data);
    }
  };

  useEffect(() => {
    if (itemId && selectedView?.type === "SECTION") getAllData();
    else getFields();
  }, [itemId, selectedView]);

  useEffect(() => {
    if (pathname.includes("/login")) {
      navigate("/", {replace: false});
    }
  }, []);

  const setViews = () => {};

  return (
    <>
      <Tabs direction={"ltr"} selectedIndex={selectedTabIndex}>
        <div>
          {views?.map((view) => {
            return (
              <TabPanel key={view.id}>
                <NewUiViewsWithGroups
                  relationFields={relations}
                  selectedViewType={selectedViewType}
                  setSelectedViewType={setSelectedViewType}
                  tableInfo={tableInfo}
                  onSubmit={onSubmit}
                  rootForm={rootForm}
                  relationView={true}
                  views={views}
                  view={view}
                  selectedTabIndex={selectedTabIndex}
                  fieldsMap={fieldsMap}
                  visibleRelationColumns={visibleRelationColumns}
                  visibleColumns={visibleColumns}
                  fieldsMapRel={fieldsMapRel}
                  setViews={setViews}
                  setSelectedView={setSelectedView}
                  selectedView={selectedView}
                  projectInfo={projectInfo}
                  layout={layout}
                  selectedTab={layout?.tabs?.[0]}
                  data={data}
                  selectedRow={selectedRow}
                  refetchViews={refetchMenuViews}
                  refetchRelationViews={refetchRelationViews}
                />
              </TabPanel>
            );
          })}
        </div>
      </Tabs>
    </>
  );
}

export default NewObjectsFormPage;
