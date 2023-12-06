import React, { useEffect, useState } from "react";
import style from "./field.module.scss";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CTableHeadCell } from "../CTable";
import FieldOptionModal from "./FieldOptionModal";
import FieldCreateModal from "./FieldCreateModal";
import { useForm } from "react-hook-form";
import {
  useFieldCreateMutation,
  useFieldUpdateMutation,
} from "../../services/constructorFieldService";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { showAlert } from "../../store/alert/alert.thunk";
import { useTranslation } from "react-i18next";
import constructorViewService from "../../services/constructorViewService";
import { useParams } from "react-router-dom";
import { generateGUID } from "../../utils/generateID";
import {
  useRelationUpdateMutation,
  useRelationsCreateMutation,
} from "../../services/relationService";

export default function FieldButton({
  openFieldSettings,
  view,
  mainForm,
  fields,
  setFieldCreateAnchor,
  fieldCreateAnchor,
  fieldData,
  setFieldData,
  setDrawerState,
  setDrawerStateField,
}) {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const { tableSlug } = useParams();
  const dispatch = useDispatch();
  const menuItem = useSelector((state) => state.menu.menuItem);
  const { control, watch, setValue, reset, handleSubmit } = useForm();

  const [fieldOptionAnchor, setFieldOptionAnchor] = useState(null);
  const [target, setTarget] = useState(null);
  const handleOpenFieldDrawer = (column) => {
    if (column?.attributes?.relation_data) {
      setDrawerStateField(column);
    } else {
      setDrawerState(column);
    }
  };

  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: view?.columns ? [...view?.columns, column] : [column],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      });
  };

  const { mutate: createField, isLoading: createLoading } =
    useFieldCreateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful created", "success"));
        updateView(res?.id);
      },
    });

  const { mutate: updateField, isLoading: updateLoading } =
    useFieldUpdateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });
  const { mutate: createRelation, isLoading: realationLoading } =
    useRelationsCreateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });
  const { mutate: updateRelation, isLoading: realationUpdateLoading } =
    useRelationUpdateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });

  const onSubmit = (values) => {
    const data = {
      ...values,
      slug: values?.label?.replace(/ /g, "_"),
      table_id: menuItem?.table_id,
      index: "string",
      required: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
      attributes: {
        ...values.attributes,
        [`label_${i18n?.language}`]: values.label,
        formula: values?.attributes?.advanced_type
          ? values?.attributes?.formula
          : values?.attributes?.from_formula +
            " " +
            values?.attributes?.math?.value +
            " " +
            values?.attributes?.to_formula,
      },
    };
    const relationData = {
      ...values,
      relation_table_slug: tableSlug,
      type: values.relation_type ? values.relation_type : values.type,
      required: false,
      multiple_insert: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
      attributes: {
        ...values.attributes,
        [`label_${i18n?.language}`]: values.label,
      },
    };
    if (fieldData && values?.type !== "RELATION") {
      updateField({ data, tableSlug });
    } else if (values?.type !== "RELATION") {
      createField({ data, tableSlug });
    }

    if (fieldData && values?.type === "RELATION") {
      updateRelation({ data: relationData, tableSlug });
    } else if (values?.type === "RELATION") {
      createRelation({ data: relationData, tableSlug });
    }
  };

  useEffect(() => {
    if (fieldData) {
      reset({
        ...fieldData,
      });
    } else {
      reset({
        attributes: {
          math: { label: "plus", value: "+" },
        },
      });
    }
  }, [fieldData]);

  return (
    <div>
      <CTableHeadCell
        width={10}
        style={{
          position: "fixed",
          right: "0",
          width: "100%",
          background: "#fff",
          maxWidth: "90px",
        }}
        onClick={(e) => {
          setFieldOptionAnchor(e.currentTarget);
          setTarget(e.currentTarget);
          setFieldData(null);
        }}
      >
        <span
          style={{
            whiteSpace: "nowrap",
            padding: "10px 4px",
            color: "#747474",
            fontSize: "13px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
            backgroundColor: "#fff",
          }}
        >
          <AddRoundedIcon />
        </span>
      </CTableHeadCell>
      <FieldOptionModal
        anchorEl={fieldOptionAnchor}
        setAnchorEl={setFieldOptionAnchor}
        setFieldCreateAnchor={setFieldCreateAnchor}
        setValue={setValue}
        target={target}
      />
      <FieldCreateModal
        anchorEl={fieldCreateAnchor}
        setAnchorEl={setFieldCreateAnchor}
        watch={watch}
        control={control}
        setValue={setValue}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        target={target}
        setFieldOptionAnchor={setFieldOptionAnchor}
        reset={reset}
        menuItem={menuItem}
        fieldData={fieldData}
        handleOpenFieldDrawer={handleOpenFieldDrawer}
      />
    </div>
  );
}
