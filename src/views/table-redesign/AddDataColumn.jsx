import {CTableCell, CTableRow} from "@/components/CTable";
import NewTableDataForm from "@/components/ElementGenerators/NewTableDataForm";
import {showAlert} from "@/store/alert/alert.thunk";
import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";

const AddDataColumn = React.memo(
  ({
    columns,
    getValues,
    mainForm,
    relationfields,
    data,
    onRowClick,
    width,
    rows,
    setAddNewRow,
    refetch,
    view,
    isRelationTable,
    pageName,
    tableSettings,
    relatedTableSlug,
    calculateWidthFixedColumn,
    firstRowWidth = 45,
    isTableView = false,
    tableSlug,
  }) => {
    const rowRef = useRef();
    const dispatch = useDispatch();
    const {id} = useParams();
    const computedSlug = isRelationTable ? `${relatedTableSlug}_id` : tableSlug;
    const [isLoading, setIsLoading] = useState();
    const computedTableSlug = isRelationTable ? relatedTableSlug : tableSlug;

    const {
      handleSubmit,
      control,
      setValue: setFormValue,
      formState: {errors},
    } = useForm({});
    const onSubmit = (values) => {
      const data = {
        [isRelationTable && computedSlug]: Boolean(
          values?.[computedSlug]?.length
        )
          ? values?.[computedSlug]
          : (id ?? view?.id),
        ...values,
      };

      setIsLoading(true);
      constructorObjectService
        .create(computedTableSlug, {
          data: data,
        })
        .then((res) => {
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

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleSubmit(onSubmit)();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (rowRef.current && !rowRef.current.contains(event.target)) {
          handleSubmit(onSubmit)();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <CTableRow parentRef={rowRef}>
        <CTableCell
          className="data_table__number_cell"
          style={{
            padding: "4px 4px",
            position: "sticky",
            left: "0",
            backgroundColor: "#F6F6F6",
            zIndex: "2",
            textAlign: "center",
          }}>
          {rows?.length ? rows?.length + 1 : 1}
        </CTableCell>
        {columns?.map((column, index) => (
          <CTableCell
            className="data_table__number_cell"
            style={{
              padding: "0 5px",
              minWidth: "80px",
              position: `${
                tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                  ? "sticky"
                  : "relative"
              }`,
              left: view?.attributes?.fixedColumns?.[column?.id]
                ? `${calculateWidthFixedColumn(column.id) + firstRowWidth}px`
                : "0",
              backgroundColor: `${
                tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                  ? "#F6F6F6"
                  : column.attributes?.disabled ||
                      !column.attributes?.field_permission?.edit_permission
                    ? "#f8f8f8"
                    : "#fff"
              }`,
              zIndex: `${
                tableSettings?.[pageName]?.find(
                  (item) => item?.id === column?.id
                )?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
                  ? "1"
                  : "0"
              }`,
            }}>
            <NewTableDataForm
              tableSlug={tableSlug}
              fields={columns}
              field={column}
              getValues={getValues}
              mainForm={mainForm}
              control={control}
              setFormValue={setFormValue}
              relationfields={relationfields}
              data={data}
              onRowClick={onRowClick}
              width={width}
              index={index}
              watch={mainForm.watch}
              newUi={true}
              isTableView={isTableView}
            />

            {(column.attributes?.disabled ||
              !column.attributes?.field_permission?.edit_permission) && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: 4,
                  backgroundColor: "inherit",
                  padding: 4,
                  borderRadius: 6,
                  zIndex: 1,
                }}>
                <img src="/table-icons/lock.svg" alt="lock" />
              </div>
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
          }}></CTableCell>
      </CTableRow>
    );
  }
);

export default AddDataColumn;
