import { Delete } from "@mui/icons-material";
import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import React, { useEffect } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import { CTable, CTableCell, CTableHead, CTableRow } from "../../../../../components/CTable";
import HFAutoWidthInput from "../../../../../components/FormElements/HFAutoWidthInput";
import PermissionWrapperV2 from "../../../../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../../../../components/TableCard";
import TableRowButton from "../../../../../components/TableRowButton";
import layoutService from "../../../../../services/layoutService";

function NewlayoutList({ setSelectedLayout, mainForm }) {
  const { slug, id } = useParams();

  useEffect(() => {
    layoutService
      .getList({
        "table-slug": slug,
      })
      .then((res) => {
        mainForm.setValue("layouts", res?.layouts ?? []);
      });
  }, [slug]);

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

  return (
    <Box sx={{ width: "100%", height: "100vh", background: "#fff" }}>
      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Layouts</CTableCell>
            <PermissionWrapperV2 tabelSlug="app" type="delete">
              <CTableCell width={60} />
            </PermissionWrapperV2>
          </CTableHead>

          {layouts?.map((element, index) => (
            <CTableRow key={element.id}>
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>
                <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <HFAutoWidthInput
                    onClick={(e) => e.stopPropagation()}
                    control={mainForm.control}
                    name={`layouts.${index}.label`}
                    inputStyle={{ border: "none", outline: "none", fontWeight: 500, background: "transparent" }}
                  />

                  <Box style={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel control={<Switch onChange={() => setDefault(index)} checked={element.is_default ?? false} />} label={"Default"} />
                    <FormControlLabel control={<Switch onChange={(e) => setModal(index, e)} checked={element.type === "SimpleLayout" ? false : true} />} label={"Modal"} />
                  </Box>
                </Box>
              </CTableCell>
              <PermissionWrapperV2 tabelSlug="app" type="delete, edit">
                <CTableCell>
                  <Button
                    onClick={(e) => {
                      remove(index);
                    }}
                  >
                    delete
                  </Button>

                  <Button
                    onClick={(e) => {
                      navigateToEditForm(element);
                    }}
                  >
                    edit
                  </Button>
                </CTableCell>
              </PermissionWrapperV2>
            </CTableRow>
          ))}
          <PermissionWrapperV2 tabelSlug="app" type="write">
            <TableRowButton colSpan={4} onClick={() => append({ table_id: id, type: "SimpleLayout", label: "New" })} />
          </PermissionWrapperV2>
        </CTable>
      </TableCard>
    </Box>
  );
}

export default NewlayoutList;
