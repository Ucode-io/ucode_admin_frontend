import {Drawer} from "@mui/material";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import {generateGUID} from "../../../utils/generateID";
import FieldSettings from "../../Constructor/Tables/Form/Fields/FieldSettings";
import RelationSettings from "../../Constructor/Tables/Form/Relations/RelationSettings";
import AggridFieldButton from "./AggridFieldButton";

function FieldCreateHeaderComponent(props) {
  const {tableSlug, appId} = useParams();
  const {value, column} = props;
  const [fieldData, setFieldData] = useState(null);
  const [drawerState, setDrawerState] = useState(null);
  const menuItem = useSelector((state) => state.menu.menuItem);
  const [drawerStateField, setDrawerStateField] = useState(null);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const queryClient = useQueryClient();

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

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList({
        table_id: id ?? menuItem?.table_id,
      });

      const getRelations = constructorRelationService.getList(
        {
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        },
        {},
        tableSlug
      );
      const [{relations = []}, {fields = []}] = await Promise.all([
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
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  return (
    <>
      <PermissionWrapperV2 tableSlug={tableSlug} type={"add_field"}>
        <AggridFieldButton
          view={column?.colDef?.view}
          setFieldCreateAnchor={setFieldCreateAnchor}
          fieldCreateAnchor={fieldCreateAnchor}
          fieldData={fieldData}
          setFieldData={setFieldData}
          setDrawerState={setDrawerState}
          setDrawerStateField={setDrawerStateField}
          menuItem={menuItem}
        />
      </PermissionWrapperV2>
      <Drawer
        open={drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal">
        <FieldSettings
          closeSettingsBlock={() => setDrawerState(null)}
          isTableView={true}
          field={drawerState}
          formType={drawerState}
          mainForm={mainForm}
          selectedTabIndex={column?.colDef?.selectedTabIndex}
          height={`calc(100vh - 48px)`}
          getRelationFields={getRelationFields}
          menuItem={menuItem}
        />
      </Drawer>
      <Drawer
        open={drawerStateField}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal">
        <RelationSettings
          relation={drawerStateField}
          closeSettingsBlock={() => setDrawerStateField(null)}
          getRelationFields={getRelationFields}
          formType={drawerStateField}
          height={`calc(100vh - 48px)`}
        />
      </Drawer>
    </>
  );
}

export default FieldCreateHeaderComponent;
