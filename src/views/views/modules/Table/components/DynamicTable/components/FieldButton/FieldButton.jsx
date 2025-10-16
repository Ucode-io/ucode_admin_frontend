import FieldCreateModal from "@/components/DataTable/FieldCreateModal";
import FieldOptionModal from "@/components/DataTable/FieldOptionModal";
import { useFieldUpdateMutation, useFieldCreateMutation } from "@/services/constructorFieldService";
import { useRelationFieldUpdateMutation, useRelationsCreateMutation } from "@/services/relationService";
import constructorViewService from "@/services/viewsService/views.service";
import { showAlert } from "@/store/alert/alert.thunk";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { generateGUID } from "@/utils/generateID";
import { transliterate } from "@/utils/textTranslater";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export const FieldButton = ({
  tableLan,
  view,
  setFieldCreateAnchor,
  fieldCreateAnchor,
  fieldData,
  setFieldData,
  setDrawerState,
  setDrawerStateField,
  menuItem,
  mainForm,
  sortedDatas,
  setSortedDatas,
  tableSlug,
  formType,
  setFormType,
  renderColumns,
}) => {
  const queryClient = useQueryClient();
  const languages = useSelector((state) => state.languages.list);
  const dispatch = useDispatch();
  const { control, watch, setValue, reset, handleSubmit, register } = useForm();
  const slug = transliterate(watch(`attributes.label_${languages[0]?.slug}`));
  const [fieldOptionAnchor, setFieldOptionAnchor] = useState(null);
  const [target, setTarget] = useState(null);
  const handleOpenFieldDrawer = (column) => {
    if (column?.attributes?.relation_data) {
      setDrawerStateField(column);
    } else {
      setDrawerState(column);
    }
  };

  const [isUpdatedField, setIsUpdatedField] = useState(false);

  const handleCloseFieldDrawer = () => {
    setFieldCreateAnchor(null);
    if (isUpdatedField) {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      queryClient.refetchQueries(["FIELDS"]);
      queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      setIsUpdatedField(false);
    }
  };

  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: view?.columns
          ? [...new Set([...view.columns, column])]
          : [column],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      });
  };

  const { mutate: createField } = useFieldCreateMutation({
    onSuccess: (res) => {
      reset({});
      queryClient.refetchQueries(["GET_VIEWS_LIST"]);
      setFieldOptionAnchor(null);
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful created", "success"));
      if (res?.type === "LOOKUP") {
        updateView(res?.relation_id);
      } else updateView(res?.id);
    },
  });

  const { mutate: updateField } = useFieldUpdateMutation({
    onSuccess: (res) => {
      reset({});
      setFieldOptionAnchor(null);
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful updated", "success"));
      updateView(res?.id);
    },
  });

  const { mutate: createRelation } = useRelationsCreateMutation({
    onSuccess: (res) => {
      reset({});
      setFieldOptionAnchor(null);
      setFieldCreateAnchor(null);
      dispatch(showAlert("Successful updated", "success"));
      updateView(res?.id);
    },
  });

  const { mutate: updateRelation } = useRelationFieldUpdateMutation({
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
      slug: slug,
      table_id: tableSlug,
      label: slug,
      index: "string",
      required: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
      attributes: {
        ...values.attributes,
        formula: values?.attributes?.advanced_type
          ? values?.attributes?.formula
          : values?.attributes?.from_formula +
            " " +
            values?.attributes?.math?.value +
            " " +
            values?.attributes?.to_formula,
        has_color: [FIELD_TYPES.MULTISELECT, FIELD_TYPES.STATUS].includes(
          values?.type
        ),
        enable_multilanguage: values?.enable_multilanguage || false,
      },
    };

    const relationData = {
      ...values,
      attributes: {
        ...values.attributes,
        label: values?.table_to?.split("/")?.[0],
        ...Object.fromEntries(
          languages.map((lang) => [
            `label_${lang.slug}`,
            values?.table_to?.split("/")?.[0],
          ])
        ),
        ...Object.fromEntries(
          languages.map((lang) => [`label_to_${lang.slug}`, values?.table_from])
        ),
      },
      table_to: values?.table_to?.split("/")?.[1],
      relation_table_slug: tableSlug,
      label: values?.table_from,
      type: values?.relation_type || "Many2One",
      required: false,
      multiple_insert: false,
      show_label: true,
      id: fieldData ? fieldData?.id : generateGUID(),
    };

    if (!fieldData) {
      if (values?.type !== "RELATION") {
        createField({ data, tableSlug });
      }
      if (values?.type === "RELATION") {
        createRelation({ data: relationData, tableSlug });
      }
    }
    if (fieldData) {
      if (values?.view_fields) {
        updateRelation({ data: values, tableSlug });
      } else {
        updateField({ data, tableSlug });
      }
    }
  };

  useEffect(() => {
    if (fieldData) {
      reset({
        ...fieldData,
        attributes: {
          ...fieldData.attributes,
          format: fieldData?.type,
        },
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
    <>
      <Box
        as="th"
        bg="#f6f6f6"
        py="2px"
        px="12px"
        borderLeft="1px solid #EAECF0"
        position="sticky"
        right={0}
        zIndex={1}
        id="addFieldBtn"
        cursor="pointer"
        onClick={(e) => {
          setFieldOptionAnchor(e.currentTarget);
          setTarget(e.currentTarget);
          setFieldData(null);
        }}
      >
        <AddRoundedIcon style={{ marginTop: "3px" }} />
      </Box>
      <FieldOptionModal
        tableLan={tableLan}
        anchorEl={fieldOptionAnchor}
        setAnchorEl={setFieldOptionAnchor}
        setFieldCreateAnchor={setFieldCreateAnchor}
        setValue={setValue}
        target={target}
        setFormType={setFormType}
      />
      {fieldCreateAnchor && (
        <FieldCreateModal
          tableSlug={tableSlug}
          tableLan={tableLan}
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
          view={view}
          setSortedDatas={setSortedDatas}
          sortedDatas={sortedDatas}
          mainForm={mainForm}
          formType={formType}
          register={register}
          handleCloseFieldDrawer={handleCloseFieldDrawer}
          setIsUpdatedField={setIsUpdatedField}
          renderColumns={renderColumns}
        />
      )}
    </>
  );
};