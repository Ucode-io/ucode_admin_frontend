import { Delete } from "@mui/icons-material";
import { Box, FormControlLabel, Input, Switch } from "@mui/material";
import React, { useEffect } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import { CTable, CTableCell, CTableHead, CTableRow } from "../../../../../components/CTable";
import DeleteWrapperModal from "../../../../../components/DeleteWrapperModal";
import PermissionWrapperV2 from "../../../../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../../../../components/TableCard";
import TableRowButton from "../../../../../components/TableRowButton";
import layoutService from "../../../../../services/layoutService";
import HFAutoWidthInput from "../../../../../components/FormElements/HFAutoWidthInput";
import AutosizeInput from "react-input-autosize";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";

const defaultLayout = {
  icon: "",
  label: "NEW LAYOUT",
  tabs: [
    {
      icon: "",
      label: "",
      layout_id: "",
      relation_id: "",
      relations: [
        {
          action_relations: [
            {
              key: "",
              value: "",
            },
          ],
          auto_filters: [
            {
              field_from: "",
              field_to: "",
            },
          ],
          cascading_tree_field_slug: "",
          cascading_tree_table_slug: "",
          cascadings: [
            {
              field_slug: "",
              label: "",
              table_slug: "",
            },
          ],
          columns: [""],
          default_limit: "",
          default_values: [""],
          dynamic_tables: [
            {
              table_slug: "",
              view_fields: [""],
            },
          ],
          editable: true,
          field_from: "",
          field_to: "",
          group_fields: [""],
          is_editable: true,
          is_user_id_default: true,
          multiple_insert: true,
          multiple_insert_field: "",
          object_id_from_jwt: true,
          quick_filters: [
            {
              default_value: "",
              field_id: "",
            },
          ],
          relation_field_slug: "",
          relation_table_slug: "",
          summaries: [
            {
              field_name: "",
              formula_name: "",
            },
          ],
          table_from: {
            author_id: "",
            commit_info: {
              commit_type: "",
              created_at: "",
              name: "",
              version_ids: [""],
            },
            description: "",
            folder_id: "",
            icon: "",
            increment_id: {
              digit_number: 0,
              prefix: "",
              with_increment_id: true,
            },
            is_cached: true,
            is_own_table: true,
            is_visible: true,
            label: "",
            project_id: "",
            show_in_menu: true,
            slug: "",
            subtitle_field_slug: "",
          },
          table_to: {
            author_id: "",
            commit_info: {
              commit_type: "",
              created_at: "",

              name: "",
              version_ids: [""],
            },
            description: "",
            folder_id: "",
            icon: "",

            increment_id: {
              digit_number: 0,
              prefix: "",
              with_increment_id: true,
            },
            is_cached: true,
            is_own_table: true,
            is_visible: true,
            label: "",
            project_id: "",
            show_in_menu: true,
            slug: "",
            subtitle_field_slug: "",
          },
          title: "",
          type: "section",
          updated_fields: [""],
          view_fields: [
            {
              attributes: {
                fields: {
                  additionalProp1: {},
                  additionalProp2: {},
                  additionalProp3: {},
                },
              },
              autofill_field: "",
              autofill_table: "",
              automatic: true,
              commit_id: "",
              default: "",
              index: "",
              is_visible: true,
              label: "",
              project_id: "",
              relation_id: "",
              required: true,
              slug: "",
              table_id: "",
              type: "",
              unique: true,
              version_id: "",
            },
          ],
          view_type: "",
        },
      ],
      sections: [
        {
          column: "",
          fields: [
            {
              column: 0,
              field_name: "",
              order: 0,
              relation_type: "",
            },
          ],
          icon: "",
          is_summary_section: true,
          label: "",
          order: 0,
        },
      ],
      type: "section",
    },
  ],
  type: "SimpleLayout",
};

function NewlayoutList({ setSelectedLayout, selectedLayout, layoutForm, mainForm }) {
  const tableId = useWatch({
    control: mainForm.control,
    name: "id",
  });

  useEffect(() => {
    layoutService.getList({ data: { tableId: tableId ?? "" } }).then((res) => {
      mainForm.setValue("layouts", res?.layouts ?? []);
    });
  }, []);

  const {
    fields: layouts,
    append,
    remove,
  } = useFieldArray({
    control: mainForm.control,
    name: "layouts",
    keyName: "key",
  });

  const navigateToEditForm = (element) => {
    setSelectedLayout(element);
  };

  const setDefault = (index) => {
    const newLayouts = layouts.map((element, i) => {
      if (i === index) {
        return {
          ...element,
          is_default: !element.is_default,
        };
      }
      return {
        ...element,
        is_default: false,
      };
    });
    mainForm.setValue("layouts", newLayouts);
  };

  const computedLayouts = useWatch({
    control: mainForm.control,
    name: "layouts",
  });

  console.log("sssssssss", computedLayouts);

  return (
    <Box sx={{ width: "100%", height: "100vh", background: "#fff" }}>
      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Layouts</CTableCell>
            {/* <CTableCell width={60}></CTableCell> */}
            <PermissionWrapperV2 tabelSlug="app" type="delete">
              <CTableCell width={60} />
            </PermissionWrapperV2>
          </CTableHead>

          {/* <CTableBody  columnsCount={4} > */}
          {computedLayouts?.map((element, index) => (
            <CTableRow key={element.id} onClick={() => navigateToEditForm(element)}>
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>
                <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <HFAutoWidthInput
                    onClick={(e) => e.stopPropagation()}
                    control={mainForm.control}
                    name={`layouts.${index}.label`}
                    inputStyle={{ border: "none", outline: "none", fontWeight: 500, minWidth: 300, background: "transparent" }}
                  />

                  <Box style={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <Switch
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onChange={() => setDefault(index)}
                          checked={element.is_default ?? false}
                        />
                      }
                      label={"Default"}
                    />
                  </Box>
                </Box>
              </CTableCell>
              <PermissionWrapperV2 tabelSlug="app" type="delete">
                <CTableCell>
                  <DeleteWrapperModal onDelete={() => remove(index)}>
                    <RectangleIconButton color="error">
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal>
                </CTableCell>
              </PermissionWrapperV2>
            </CTableRow>
          ))}
          <PermissionWrapperV2 tabelSlug="app" type="write">
            <TableRowButton colSpan={4} onClick={() => append({ table_id: tableId, type: "SimpleLayout", label: "New" })} />
          </PermissionWrapperV2>
          {/* </CTableBody> */}
        </CTable>
      </TableCard>
    </Box>
  );
}

export default NewlayoutList;
