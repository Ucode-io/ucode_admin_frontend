import React from "react";
import {Container, Draggable} from "react-smooth-dnd";
import {applyDrag} from "../../utils/applyDrag";
import {Box, Button} from "@mui/material";
import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {useParams} from "react-router-dom";
import layoutService from "../../services/layoutService";
import {store} from "../../store";

export default function SectionBlockForModal({
  editAcces,
  section,
  control,
  setFormValue,
  fieldsList,
  formTableSlug,
  relatedTable,
  activeLang,
  errors,
  isMultiLanguage,
  toggleFields,
  computedSections,
  index,
  data,
  setData,
  selectedTabIndex,
}) {
  const {tableSlug} = useParams();
  const projectId = store.getState().company.projectId;
  const selectedTable = store.getState().menu.menuItem;

  const updateLayout = (newData) => {
    const computedData = {
      layouts: newData,
      project_id: projectId,
      table_id: selectedTable?.table_id,
    };
    layoutService.update(computedData);
  };

  const onDropFields = (dropResult, colNumber) => {
    const result = applyDrag(computedSections[index]?.fields, dropResult);

    if (!result) return;

    const newData = data?.map((layout) => {
      return {
        ...layout,
        tabs: layout?.tabs?.map((tab, tabIndex) => {
          if (tabIndex === selectedTabIndex) {
            return {
              ...tab,
              sections: tab?.sections?.map((section, sectionIndex) => {
                return {
                  ...section,
                  fields: result,
                };
              }),
            };
          }
        }),
      };
    });

    updateLayout(newData);
    setData(newData);
  };

  return (
    // <Container
    //   groupName="1"
    //   onDrop={onDropFields}
    //   // orientation="horizontal"
    //   dropPlaceholder={{ className: "drag-row-drop-preview" }}
    //   getChildPayload={(i) => computedSections[index]?.fields?.[i] ?? {}}
    // >
    <Box sx={{display: "flex", flexDirection: "column"}}>
      {!editAcces
        ? section.fields?.map(
            (field, fieldIndex) =>
              (field?.is_visible_layout ||
                field?.is_visible_layout === undefined) && (
                <Draggable key={field.id}>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <FormElementGenerator
                      key={field.id}
                      isMultiLanguage={isMultiLanguage}
                      field={field}
                      control={control}
                      setFormValue={setFormValue}
                      fieldsList={fieldsList}
                      formTableSlug={tableSlug}
                      relatedTable={relatedTable}
                      activeLang={activeLang}
                      errors={errors}
                    />
                  </Box>
                </Draggable>
              )
          )
        : section.fields?.map((field, fieldIndex) => (
            <Box
              style={{
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <FormElementGenerator
                key={field.id}
                isMultiLanguage={isMultiLanguage}
                field={field}
                control={control}
                setFormValue={setFormValue}
                fieldsList={fieldsList}
                formTableSlug={tableSlug}
                relatedTable={relatedTable}
                activeLang={activeLang}
                errors={errors}
              />

              <Button
                onClick={() => toggleFields(field)}
                sx={{
                  height: "38px",
                  minWidth: "38px",
                  width: "38px",
                  borderRadius: "50%",
                }}
              >
                {!field?.is_visible_layout ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </Button>
            </Box>
          ))}
    </Box>
    // </Container>
  );
}
