// import { Delete, Edit } from "@mui/icons-material"
import {Add} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { CTableCell, CTableRow } from "../../../../../components/CTable";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import constructorFieldService from "../../../../../services/constructorFieldService";
import { generateGUID } from "../../../../../utils/generateID";
import FieldSettings from "./FieldSettings";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";
import { generateLangaugeText } from "../../../../../utils/generateLanguageText";
import { FieldPopover } from "./components/FieldPopover/FieldPopover.jsx";
import { Drawer } from "@mui/material";

const Fields = ({ mainForm, getRelationFields, tableLan }) => {
  const { tableSlug } = useParams();
  const { state = {} } = useLocation();

  const [formLoader, setFormLoader] = useState(false);
  const [drawerState, setDrawerState] = useState(null);

  const [formType, setFormType] = useState("CREATE");

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerState(null);
  };

  const { i18n } = useTranslation();
  const [selectedField, setSelectedField] = useState({});
  const id = state?.tableInfo?.id;

  const { fields, prepend, update, remove } = useFieldArray({
    control: mainForm.control,
    name: "fields",
    keyName: "key",
  });

  const createField = (field) => {
    const data = {
      ...field,
      id: generateGUID(),
    };

    if (!id) {
      prepend(data);
      setDrawerState(null);
    } else {
      setFormLoader(true);
      constructorFieldService
        .create(data)
        .then((res) => {
          prepend(res);
          setDrawerState(null);
        })
        .finally(() => setFormLoader(false));
    }
  };

  const updateField = (field, index) => {
    // const index = fields.findIndex((el) => el.id === field.id);

    if (!id) {
      update(index, field);
      setDrawerState(null);
    } else {
      setFormLoader(true);
      constructorFieldService
        .update({ data: field, tableSlug })
        .then((res) => {
          update(index, field);
          setDrawerState(null);
        })
        .finally(() => setFormLoader(false));
    }
  };

  const openEditForm = (field, index, e) => {
    if (field.type !== "LOOKUP" && field.type !== "LOOKUPS") {
      setAnchorEl(e.target);
      setFormType("UPDATE");
      setDrawerState(field);
    }
  };

  const openAddForm = () => {
    setFormType("CREATE");
  };

  const deleteField = (field, index) => {
    if (!id) remove(index);
    else {
      constructorFieldService
        .delete(field.id, tableSlug)
        .then((res) => remove(index));
    }
  };

  const onFormSubmit = (values) => {
    if (drawerState === "CREATE") {
      createField(values);
    } else {
      updateField(values);
    }
  };

  const defaultLanguage = i18n.language;

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Field Label",
        slug: `label`,
      },
      {
        id: 2,
        label: "Field SLUG",
        slug: "slug",
      },
      {
        id: 3,
        label: "Field type",
        slug: "type",
      },
    ],
    [defaultLanguage]
  );

  const isDisabledEdit = (field) => {
    return field.type === "LOOKUP" || field.type === "LOOKUPS";
  };

  return (
    <TableCard>
      <DataTable
        data={fields}
        removableHeight={false}
        columns={columns}
        checkPermission={false}
        disablePagination
        dataLength={1}
        setSelectedField={setSelectedField}
        tableSlug={"app"}
        onDeleteClick={deleteField}
        onEditClick={openEditForm}
        isDisabledEdit={isDisabledEdit}
        additionalRow={
          <CTableRow>
            <CTableCell colSpan={columns.length + 1}>
              <div className={styles.createButton} onClick={openAddForm}>
                <Add color="primary" />
                <p>
                  {generateLangaugeText(tableLan, i18n?.language, "Add") ||
                    "Add"}
                </p>
              </div>
            </CTableCell>
          </CTableRow>
        }
      />

      <FieldPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        formType={drawerState}
        getRelationFields={getRelationFields}
        mainForm={mainForm}
        tableLan={tableLan}
        onSubmit={(index, field) => updateField(field, index)}
        slug={tableSlug}
        field={drawerState}
        selectedField={selectedField}
        // menuItem={menuItem}
      />

      {/* <Drawer
        open={drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal"
      >
        <FieldSettings
          tableLan={tableLan}
          closeSettingsBlock={() => setDrawerState(null)}
          onSubmit={(index, field) => updateField(field, index)}
          field={drawerState}
          formType={drawerState}
          mainForm={mainForm}
          height={`calc(100vh - 48px)`}
          getRelationFields={getRelationFields}
          selectedField={selectedField}
          slug={tableSlug}
        />
      </Drawer> */}
    </TableCard>
  );
};

export default Fields;
