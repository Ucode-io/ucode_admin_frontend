import React, { useMemo, useState } from "react";
import style from "./field.module.scss";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { CTableHeadCell } from "../CTable";
import FieldOptionModal from "./FieldOptionModal";
import FieldCreateModal from "./FieldCreateModal";
import { useFieldArray, useForm } from "react-hook-form";
import { useFieldCreateMutation } from "../../services/constructorFieldService";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import { showAlert } from "../../store/alert/alert.thunk";
import { useTranslation } from "react-i18next";
import { generateGUID } from "../../utils/generateID";
import constructorViewService from "../../services/constructorViewService";

export default function FieldButton({
  openFieldSettings,
  view,
  mainForm,
  fields,
}) {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const menuItem = useSelector((state) => state.menu.menuItem);
  const languages = useSelector((state) => state.languages.list);
  const { control, watch, setValue, reset, handleSubmit } = useForm({
    defaultValues: {
      table_id: menuItem?.table_id,
      index: "string",
      required: false,
      show_label: true,
      id: generateGUID(),
    },
  });

  //   const fields = mainForm.watch();
  console.log("fields", fields);

  const [fieldOptionAnchor, setFieldOptionAnchor] = useState(null);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [target, setTarget] = useState(null);

  const { mutate: createEmail, isLoading: createLoading } =
    useFieldCreateMutation({
      onSuccess: (res) => {
        updateView(res?.id);
        dispatch(showAlert("Successful created", "success"));
        // queryClient.refetchQueries(["EMAILS"]);
      },
    });

  console.log("view", view);

  const updateView = (column) => {
    constructorViewService
      .update({
        ...view,
        columns: [...view?.columns, column],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      slug: values?.label?.replace(/ /g, "_"),
      attributes: {
        ...values.attributes,
        [`label_${i18n?.language}`]: values.label,
        formula: values.formula + values.plus + values.fff,
      },
    };
    console.log("data", data);
    createEmail(data);
  };

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
          onClick={(e) => {
            setFieldOptionAnchor(e.currentTarget);
            setTarget(e.currentTarget);
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
      />
    </div>
  );
}
