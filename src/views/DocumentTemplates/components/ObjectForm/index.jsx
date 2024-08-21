import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import styles from "./index.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTabRouter from "../../../../hooks/useTabRouter";
import { useQuery, useQueryClient } from "react-query";
import { store } from "../../../../store";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { sortSections } from "../../../../utils/sectionsOrderNumber";
import layoutService from "../../../../services/layoutService";
import constructorObjectService from "../../../../services/constructorObjectService";
import RelationSectionForModal from "../../../Objects/RelationSection/RelationSectionForModal";
import Sections from "./Sections";
import constructorTableService from "../../../../services/constructorTableService";
import { listToMap } from "../../../../utils/listToMap";

const ObjectForm = ({ dateInfo, fullScreen, menuItem, form }) => {
  const { tableSlug, appId } = useParams();  

  const [editAcces, setEditAccess] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { state = {} } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { navigateToForm } = useTabRouter();
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const menu = store.getState().menu;
  const isInvite = menu.invite;
  const { i18n } = useTranslation();
  const [layout, setLayout] = useState({});
  const [data, setData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");
  const id = searchParams.get('id')

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
    formState: { errors },
  } = form;

  const getAllData = async () => {
    setLoader(true);
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });
    
    const getFormData = constructorObjectService.getById(tableSlug, id);

    try {
      const [{ data = {} }, layout] = await Promise.all([
        getFormData,
        getLayout,
      ]);

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
      setSummary(layout?.summary_fields ?? []);

      setLayout(layout);

      const relations =
        layout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
      if (!selectedTab?.relation_id) {
        reset(data?.response ?? {});
      }
      setSelectTab(relations[selectedTabIndex]);

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
      setLayout(layout);
      setSections(sortSections(sections));

      const relations =
        layout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
      if (!id) {
        setLoader(false);
      }
      setSelectTab(relations[selectedTabIndex]);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    // if (id) {
    //   update(data);
    // } else {
    //   create(data);
    // }
  };

  useEffect(() => {
    if (id) getAllData();
    else getFields();
  }, [id]);


  const {
    data: {views, fieldsMap, visibleColumns, visibleRelationColumns} = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isLoading,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", tableSlug, i18n?.language],
    () => {
      return constructorTableService.getTableInfo(
        tableSlug,
        {
          data: {},
        },
        // params
      );
    },
    {
      select: ({data}) => {
        return {
          views:
            data?.views?.filter(
              (view) => view?.attributes?.view_permission?.view === true
            ) ?? [],
          fieldsMap: listToMap(data?.fields),
          visibleColumns: data?.fields ?? [],
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
      onSuccess: ({views}) => {
        if (state?.toDocsTab) setSelectedTabIndex(views?.length);
      },
    }
  );

  const computedSections = useMemo(() => {
    const sections = [];
    data?.tabs?.[selectedTabIndex]?.sections?.map((el) => {
      return !sections?.[el] && sections.push(el);
    });
    return sections;
  }, [data, selectedTabIndex]);

  return (
    <div className={styles.wrapper}>
      <Sections
        relation={tableRelations}
        editAcces={false}
        isMultiLanguage={false}
        fieldsMapFromProps={fieldsMap}
        loader={loader || isLoading}
        computedSections={computedSections}
        control={control}
        setFormValue={setFormValue}
        errors={errors}
        relatedTable={tableRelations[selectedTabIndex]?.relatedTable}
      />
    </div>
  );
};

export default ObjectForm;
