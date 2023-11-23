import { Save } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import Footer from "../../../../components/Footer";
import HeaderSettings from "../../../../components/HeaderSettings";
import PageFallback from "../../../../components/PageFallback";
import constructorCustomEventService from "../../../../services/constructorCustomEventService";
import constructorFieldService from "../../../../services/constructorFieldService";
import constructorRelationService from "../../../../services/constructorRelationService";
import constructorTableService, {
  useTableByIdQuery,
} from "../../../../services/constructorTableService";
import constructorViewRelationService from "../../../../services/constructorViewRelationService";
import layoutService from "../../../../services/layoutService";
import { constructorTableActions } from "../../../../store/constructorTable/constructorTable.slice";
import { createConstructorTableAction } from "../../../../store/constructorTable/constructorTable.thunk";
import { generateGUID } from "../../../../utils/generateID";
import { listToMap } from "../../../../utils/listToMap";

import Actions from "./Actions";
import CustomErrors from "./CustomErrors";
import Fields from "./Fields";
import Layout from "./Layout";
import MainInfo from "./MainInfo";
import Relations from "./Relations";
import { useTranslation } from "react-i18next";
import menuSettingsService from "../../../../services/menuSettingsService";
import { useQueryClient } from "react-query";
import { ta } from "date-fns/locale";

const ConstructorTablesFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, slug, appId } = useParams();
  const queryClient = useQueryClient();
  const projectId = useSelector((state) => state.auth.projectId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const { i18n } = useTranslation();

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
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });
  const menuItem = useSelector((state) => state.menu.menuItem);
  const list = useSelector((state) => state.constructorTable.list);
  console.log("list", list);

  const getData = async () => {
    setLoader(true);
    const params = {};

    const getTableData = constructorTableService.getById(id);

    const getViewRelations = constructorViewRelationService.getList({
      table_slug: slug,
    });

    const getActions = constructorCustomEventService.getList({
      table_slug: slug,
    }, slug);

    const getLayouts = layoutService
      .getList({
        "table-slug": slug,
        language_setting: i18n?.language,
      })
      .then((res) => {
        mainForm.setValue("layouts", res?.layouts ?? []);
      });

    try {
      const [tableData, { custom_events: actions = [] }] = await Promise.all([getTableData, getActions, getViewRelations, getLayouts]);
      const data = {
        ...mainForm.getValues(),
        ...tableData,
        fields: [],
        actions,
      };

      mainForm.reset(data);

      await getRelationFields();
    } finally {
      setLoader(false);
    }
  };

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({ table_id: id });

      const getRelations = constructorRelationService.getList(
        {
          table_slug: slug,
          relation_table_slug: slug,
        },
        slug
      );
      const [{ relations = [] }, { fields = [] }] = await Promise.all([getRelations, getFieldsData]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug: relation.table_to?.slug === slug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" && relation.table_from?.slug === slug) ||
          (relation.type === "One2Many" && relation.table_to?.slug === slug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" && relation.table_from?.slug === slug)
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
        label: relation?.label ?? relation[relation.relatedTableSlug]?.label ? relation[relation.relatedTableSlug]?.label : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
    });
  };

  const createType = (data) => {
    console.log("data", data);
    menuSettingsService
      .create({
        parent_id: menuItem?.id || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "TABLE",
        table_id: data?.id,
        label: data?.label,
        attributes: data?.attributes,
        icon: data?.icon,
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], menuItem?.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createConstructorTable = (data) => {
    setBtnLoader(true);

    dispatch(
      createConstructorTableAction({
        ...data,
        label: Object.values(data?.attributes).find((item) => item),
      })
    )
      .unwrap()
      .then((res) => {
        navigate(-1);
        createType(res);
      })
      .catch(() => setBtnLoader(false));
  };

  const updateConstructorTable = (data) => {
    setBtnLoader(true);
    const updateTableData = constructorTableService.update(data, projectId);

    const computedLayouts = data.layouts.map((layout) => ({
      ...layout,
      summary_fields: layout?.summary_fields?.map((item) => {
        return {
          ...item,
          field_name: item?.field_name ?? item?.title ?? item?.label,
        };
      }),
      tabs: layout?.tabs?.map((tab) => {
        if (
          tab.type === "Many2Many" ||
          tab.type === "Many2Dynamic" ||
          tab.type === "Recursive" ||
          tab.type === "Many2One" ||
          tab.relation_type === "Many2Many" ||
          tab.relation_type === "Many2Dynamic" ||
          tab.relation_type === "Recursive" ||
          tab.relation_type === "Many2One"
        ) {
          return {
            order: tab?.order ?? 0,
            label: tab.title ?? tab.label,
            field_name: tab?.title ?? tab.label ?? tab?.field_name,
            type: "relation",
            layout_id: layout.id,
            relation_id: tab.id,
            relation: {
              ...tab,
            },
          };
        } else {
          return {
            ...tab,
            sections: tab?.sections?.map((section, index) => ({
              ...section,
              order: index,
              fields: section?.fields?.map((field, index) => ({
                ...field,
                order: index,
                field_name: field?.title ?? field.label,
              })),
            })),
          };
        }
      }),
    }));

    const updateLayoutData = layoutService.update({
      layouts: computedLayouts,
      table_id: id,
      project_id: projectId,
    });

    Promise.all([
      updateTableData,
      // updateSectionData,
      // updateViewRelationsData,
      updateLayoutData,
    ])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data));
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    const computedData = {
      ...data,
      // sections: computeSectionsOnSubmit(data.sections, data.summary_section),
      // view_relations: computeViewRelationsOnSubmit(data.view_relations),
    };
    // return;
    if (id) updateConstructorTable(computedData);
    else createConstructorTable(computedData);
  };
  useEffect(() => {
    if (!id) setLoader(false);
    else getData();
  }, [id]);

  if (loader) return <PageFallback />;

  return (
    <>
      <div className="pageWithStickyFooter">
        <Tabs direction={"ltr"}>
          <HeaderSettings title="Objects" subtitle={id ? mainForm.getValues("label") : "Добавить"} icon={mainForm.getValues("icon")} backButtonLink={-1} sticky>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Layouts</Tab>
              <Tab>Fields</Tab>
              {id && <Tab>Relations</Tab>}
              {id && <Tab>Actions</Tab>}
              {id && <Tab>Custom errors</Tab>}
            </TabList>
          </HeaderSettings>

          <TabPanel>
            <MainInfo control={mainForm.control} watch={mainForm.watch} />
          </TabPanel>

          <TabPanel>
            <Layout mainForm={mainForm} getRelationFields={getRelationFields} />
          </TabPanel>

          <TabPanel>
            <Fields getRelationFields={getRelationFields} mainForm={mainForm} slug={slug} />
          </TabPanel>

          {id && (
            <TabPanel>
              <Relations mainForm={mainForm} getRelationFields={getRelationFields} />
            </TabPanel>
          )}
          {id && (
            <TabPanel>
              <Actions mainForm={mainForm} />
            </TabPanel>
          )}
          {id && (
            <TabPanel>
              <CustomErrors mainForm={mainForm} />
            </TabPanel>
          )}
          {/* <Actions eventLabel={mainForm.getValues("label")} /> */}
        </Tabs>
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Close
            </SecondaryButton>
            <PrimaryButton loader={btnLoader} onClick={mainForm.handleSubmit(onSubmit)} loading={btnLoader}>
              <Save /> Save
            </PrimaryButton>
          </>
        }
      />
    </>
  );
};

export default ConstructorTablesFormPage;
