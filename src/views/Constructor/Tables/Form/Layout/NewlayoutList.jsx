import { Box } from "@mui/material";
import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CTable, CTableCell, CTableHead } from "../../../../../components/CTable";
import TableCard from "../../../../../components/TableCard";
import TableRowButton from "../../../../../components/TableRowButton";
import { useMenuListQuery } from "../../../../../services/menuService";
import LayoutsItem from "./LayoutsItem";

function NewlayoutList({ setSelectedLayout, mainForm }) {
  const { id } = useParams();
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
  const [menus, setMenus] = useState([]);
  const menuItem = useSelector((state) => state.menu.menuItem);

  const { isLoading } = useMenuListQuery({
    params: {
      table_id: menuItem?.table_id,
    },
    queryParams: {
      enabled: Boolean(true),
      onSuccess: (res) => {
        setMenus(res?.menus?.map((menu) => ({ label: menu?.label, value: menu?.id })));
      },
    },
  });

  return (
    <Box sx={{ width: "100%", height: "100vh", background: "#fff" }}>
      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Layouts</CTableCell>
            <CTableCell width={60} />
          </CTableHead>

          {layouts?.map((element, index) => (
            <LayoutsItem
              element={element}
              index={index}
              mainForm={mainForm}
              menus={menus}
              remove={remove}
              setModal={setModal}
              setDefault={setDefault}
              setSectionTab={setSectionTab}
              navigateToEditForm={navigateToEditForm}
              languages={languages}
            />
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
