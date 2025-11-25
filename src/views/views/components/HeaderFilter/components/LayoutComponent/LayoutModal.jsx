import {Card} from "@mui/material";
import {useEffect, useState} from "react";
import {useForm, useWatch} from "react-hook-form";
import {useParams} from "react-router-dom";
import constructorCustomEventService from "@/services/constructorCustomEventService";
import constructorFieldService from "@/services/constructorFieldService";
import constructorRelationService from "@/services/constructorRelationService";
import constructorViewRelationService from "@/services/constructorViewRelationService";
import styles from "./style.module.scss";
import layoutService from "@/services/layoutService";
import {useTranslation} from "react-i18next";
import {listToMap} from "@/utils/listToMap";
import {generateGUID} from "@/utils/generateID";
import Layout from "@/views/Constructor/Tables/Form/Layout";

const LayoutModal = ({
  closeModal = () => {},
  selectedView,
  tableInfo = {},
  tableLan = {},
}) => {
  const {i18n} = useTranslation();
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const {tableSlug: tableSlugFromParams, appId, menuId, id} = useParams();
  const tableSlug = tableSlugFromParams ?? selectedView?.table_slug;
  const [selectedLayout, setSelectedLayout] = useState({});

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
  const values = useWatch({
    control: mainForm?.control,
  });

  const getData = async () => {
    setLoader(true);

    try {
      const [tableData, {custom_events: actions = []}] = await Promise.all([
        await constructorViewRelationService.getList({table_slug: tableSlug}),
        await constructorCustomEventService.getList(
          {table_slug: tableSlug},
          tableSlug
        ),
        await layoutService
          .getList(
            {"table-slug": tableSlug, language_setting: i18n?.language},
            tableSlug
          )
          .then((res) => {
            setSelectedLayout(res?.layouts?.[0]);
            mainForm.setValue("layouts", res?.layouts ?? []);
          }),
      ]);

      const data = {
        ...tableData,
        ...mainForm.getValues(),
        fields: [],
        actions,
      };

      mainForm.reset({
        ...data,
        ...values,
        slug: data?.slug || values?.slug,
        label: data?.label || values?.label,
      });

      await getRelationFields();
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoader(false);
    }
  };

  const getRelationFields = async () => {

    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList(
        {
          table_id: tableInfo?.id,
        },
        tableSlug,
      );

      const getRelations = constructorRelationService.getList(
        {
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        },
        {},
        tableSlug,
      );
      const [{ relations = [] }, { fields = [] }] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);

      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === tableSlug) ||
          (relation.type === "One2Many" &&
            relation.table_to?.slug === tableSlug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === tableSlug)
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
        label:
          (relation?.label ?? relation[relation.relatedTableSlug]?.label)
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
    });
  };

  useEffect(() => {
    if (!tableInfo?.id) setLoader(false);
    else getData();
  }, [tableInfo?.id]);

  return (
    <Card className={styles.card}>
      <Layout
        tableLan={tableLan}
        mainForm={mainForm}
        getRelationFields={getRelationFields}
        getData={getData}
        selectedLayout={selectedLayout}
        setSelectedLayout={setSelectedLayout}
        setSelectedTabLayout={setSelectedTab}
      />
    </Card>
  );
};

export default LayoutModal;
