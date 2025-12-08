import {CTableCell, CTableRow} from "@/components/CTable";
import NewTableDataForm from "@/components/ElementGenerators/NewTableDataForm";
import {showAlert} from "@/store/alert/alert.thunk";
import {memo, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import { Box, Button, FormHelperText } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { constructorObjectService } from "@/services/objectService/object.service";
import useDebounce from "@/hooks/useDebounce";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

export const AddNewData = memo(
  ({
    columns,
    getValues,
    relationfields,
    data,
    onRowClick,
    width,
    rows,
    setAddNewRow,
    refetch,
    pageName,
    tableSettings,
    calculateWidthFixedColumn,
    firstRowWidth = 45,
  }) => {
    const { viewForm, view, isRelationView, tableSlug } = useViewContext();
    const { fieldsMap } = useFieldsContext();

    const rowRef = useRef();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState();

    const {
      handleSubmit,
      control,
      setValue: setFormValue,
      formState: { errors },
      setError,
      clearErrors,
    } = useForm({});

    const onSubmit = (data) => {
      columns.forEach((item) => {
        if (
          item.type === FIELD_TYPES.MULTI_LINE &&
          item.required &&
          !data[item.slug]?.trim()
        ) {
          setError(item.slug, { message: "Field is required" });
          return;
        } else {
          clearErrors(item.slug);
        }
      });

      setIsLoading(true);
      constructorObjectService
        .create(tableSlug, {
          data: data,
        })
        .then(() => {
          setIsLoading(false);
          refetch();
          setAddNewRow(false);
          dispatch(showAlert("Successfully created!", "success"));
        })
        .catch((e) => {
          setIsLoading(false);
          console.log("ERROR: ", e);
        })
        .finally(() => {});
    };

    const handleKeyDown = useDebounce((event) => {
      if (event.key === "Enter" && !isLoading) {
        event.preventDefault();
        handleSubmit(onSubmit)();
      }
    }, 500);

    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    return (
      <CTableRow
        parentRef={rowRef}
        style={{ height: "32px", overflow: "auto" }}
      >
        <CTableCell
          className="data_table__number_cell"
          style={{
            padding: "4px 4px",
            position: "sticky",
            left: "0",
            backgroundColor: "#F6F6F6",
            zIndex: "2",
            textAlign: "center",
          }}
        >
          {rows?.length ? rows?.length + 1 : 1}
        </CTableCell>
        {columns?.map((column, index) => (
          <CTableCell
            key={column?.id}
            className="data_table__number_cell"
            style={{
              padding: "0 5px",
              minWidth: "80px",
              position: `${
                tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id,
                )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                  ? "sticky"
                  : "relative"
              }`,
              left: view?.attributes?.fixedColumns?.[column?.id]
                ? `${calculateWidthFixedColumn(column.id) + firstRowWidth}px`
                : "0",
              backgroundColor: errors[column?.slug]
                ? `rgb(255 72 66 / 20%)`
                : `${
                    tableSettings?.[pageName]?.find(
                      (item) => item?.id === column?.id,
                    )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                      ? "#F6F6F6"
                      : column.attributes?.disabled ||
                          !column.attributes?.field_permission?.edit_permission
                        ? "#f8f8f8"
                        : "#fff"
                  }`,
              zIndex: `${
                tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id,
                )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                  ? "1"
                  : "0"
              }`,
              // borderColor: `${errors[column?.slug] ? "#f44336" : "inherit"}`,
            }}
          >
            <NewTableDataForm
              tableSlug={tableSlug}
              fields={columns}
              field={column}
              getValues={getValues}
              mainForm={viewForm}
              control={control}
              setFormValue={setFormValue}
              relationfields={relationfields}
              data={data}
              onRowClick={onRowClick}
              width={width}
              index={index}
              watch={viewForm.watch}
              newUi={true}
              isTableView={true}
              relationView={isRelationView}
              fieldsMap={fieldsMap}
            />
            {errors[column?.slug]?.message && (
              <FormHelperText
                sx={{ position: "absolute", bottom: "0", left: "10px" }}
                error
              >
                {errors[column?.slug]?.message}
              </FormHelperText>
            )}
          </CTableCell>
        ))}
        <CTableCell
          className="data_table__number_cell"
          style={{
            position: "sticky",
            zIndex: "1",
            color: "#262626",
            fontSize: "13px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            padding: "0 5px",
            right: "0",
            borderLeft: "1px solid #eee",
            backgroundColor: "#fff",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Button
              sx={{
                minWidth: "32px",
                maxWidth: "32px",
                height: "24px",
                padding: "0",
                borderColor: "#E5E9EB",
              }}
              variant="outlined"
              color="error"
              onClick={() => {
                setAddNewRow(false);
              }}
            >
              <ClearIcon color="error" />
            </Button>
          </Box>
        </CTableCell>
      </CTableRow>
    );
  },
);

AddNewData.displayName = "AddNewData";
