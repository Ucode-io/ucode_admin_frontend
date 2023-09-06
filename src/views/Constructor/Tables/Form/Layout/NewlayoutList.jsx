import {Delete, Edit} from "@mui/icons-material";
import {Box, FormControlLabel, Switch} from "@mui/material";
import React from "react";
import {useFieldArray} from "react-hook-form";
import {useParams} from "react-router-dom";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../../components/CTable";
import HFAutoWidthInput from "../../../../../components/FormElements/HFAutoWidthInput";
import TableCard from "../../../../../components/TableCard";
import TableRowButton from "../../../../../components/TableRowButton";
import {useSelector} from "react-redux";

function NewlayoutList({setSelectedLayout, mainForm}) {
  const {id} = useParams();
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

  const setModal = (index, e) => {
    const newLayout = layouts.map((element, i) => {
      if (i === index) {
        return {
          ...element,
          type: e.target.checked ? "PopupLayout" : "SimpleLayout",
        };
      }
      return element;
    });
    mainForm.setValue("layouts", newLayout);
  };

  const setSectionTab = (index, e) => {
    const newLayouts = layouts.map((element, i) => {
      if (i === index) {
        return {
          ...element,
          is_visible_section: !element.is_visible_section,
        };
      }
      return {
        ...element,
        is_visible_section: false,
      };
    });
    mainForm.setValue("layouts", newLayouts);
  };

  const languages = useSelector((state) => state.languages.list);

  return (
    <Box sx={{width: "100%", height: "100vh", background: "#fff"}}>
      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Layouts</CTableCell>
            <CTableCell width={60} />
          </CTableHead>

          {layouts?.map((element, index) => (
            <CTableRow key={element.id}>
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {languages?.map((lang) => (
                    <HFAutoWidthInput
                      onClick={(e) => e.stopPropagation()}
                      control={mainForm.control}
                      placeholder={`Название ${lang.slug}`}
                      name={`layouts.${index}.attributes.label_${lang.slug}`}
                      inputStyle={{
                        border: "none",
                        outline: "none",
                        fontWeight: 500,
                        background: "transparent",
                      }}
                    />
                  ))}

                  <Box style={{display: "flex", alignItems: "center"}}>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={() => setDefault(index)}
                          checked={element.is_default ?? false}
                        />
                      }
                      label={"Default"}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(e) => setModal(index, e)}
                          checked={
                            element.type === "SimpleLayout" ? false : true
                          }
                        />
                      }
                      label={"Modal"}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(e) => setSectionTab(index, e)}
                          checked={element?.is_visible_section ?? false}
                        />
                      }
                      label={"No Section Tabs"}
                    />
                  </Box>
                </Box>
              </CTableCell>

              <CTableCell>
                <Box style={{display: "flex", gap: "5px"}}>
                  <RectangleIconButton
                    color="success"
                    onClick={() => navigateToEditForm(element)}
                  >
                    <Edit color="success" />
                  </RectangleIconButton>

                  <RectangleIconButton
                    color="error"
                    onClick={() => remove(index)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </Box>
              </CTableCell>
            </CTableRow>
          ))}

          <TableRowButton
            colSpan={4}
            onClick={() =>
              append({
                table_id: id,
                type: "SimpleLayout",
                label: "New",
                attributes: {},
              })
            }
          />
        </CTable>
      </TableCard>
    </Box>
  );
}

export default NewlayoutList;
