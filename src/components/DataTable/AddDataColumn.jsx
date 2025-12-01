import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import React, { useEffect, useRef, useState } from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import {showAlert} from "../../store/alert/alert.thunk";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import {CTableCell, CTableRow} from "../CTable";
import NewTableDataForm from "../ElementGenerators/NewTableDataForm";
import PermissionWrapperV2 from "../PermissionWrapper/PermissionWrapperV2";
import { CircularProgress, FormHelperText } from "@mui/material";

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
    fieldsMap,
  }) => {
    const rowRef = useRef();
    const dispatch = useDispatch();
    const { tableSlug, id } = useParams();
    const [isLoading, setIsLoading] = useState();

    const computedSlug = isRelationTable
      ? view?.type === "Many2One"
        ? `${tableSlug}_id`
        : `${tableSlug}_ids`
      : tableSlug;

    const computedTableSlug = isRelationTable ? view?.relatedTable : tableSlug;

    const {
      handleSubmit,
      control,
      setValue: setFormValue,
      formState: { errors },
    } = useForm({});

    const onSubmit = (values) => {
      setIsLoading(true);
      constructorObjectService
        .create(computedTableSlug, {
          data: {
            ...values,
            [isRelationTable && computedSlug]: id,
          },
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

    useEffect(() => {
      const handleKeyDown = (event) => {
        const activeEl = document.activeElement;
        console.log("activeElactiveElactiveEl", activeEl);
        const isTextInput =
          activeEl?.tagName === "INPUT" || activeEl?.tagName === "TEXTAREA";
        const isContentEditable = activeEl?.isContentEditable;

        const isInDatePicker =
          activeEl?.closest(
            ".mantine-DatePickerInput-root, .mantine-DateTimePicker-root, .mantine-TimeInput-root",
          ) != null;

        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          (isTextInput || isContentEditable) &&
          !isInDatePicker
        ) {
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
        const clickedInsideRow = rowRef.current?.contains(event.target);

        const isInDropdown = event.target.closest(
          ".MuiPopover-root, .MuiMenu-paper, .MuiAutocomplete-popper, .dropdown-menu, [role='listbox'], .mantine-Popper-root, [data-mantine-portal]",
        );

        if (!clickedInsideRow && !isInDropdown) {
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
          align="center"
          className="data_table__number_cell"
          style={{
            padding: "4px 4px",
            minWidth: "80px",
            position: "sticky",
            left: "0",
            backgroundColor: "#F6F6F6",
            zIndex: "2",
          }}
        >
          {rows?.length ? rows?.length + 1 : 1}
        </CTableCell>
        {columns?.map((column, index) => (
          <CTableCell
            key={column?.id}
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "4px 4px",
              minWidth: "80px",
              position: "sticky",
              left: "0",
              backgroundColor: "#fff",
              zIndex: "1",
            }}
          >
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
          align="center"
          className="data_table__number_cell"
          style={{
            position: "sticky",
            backgroundColor: "#fff",
            zIndex: "1",
            minWidth: "85px",
            color: "#262626",
            fontSize: "13px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            padding: "0 5px",
            right: "0",
            borderLeft: "1px solid #eee",
          }}
        >
          <td
            style={{
              border: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "3px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PermissionWrapperV2 tableSlug={tableSlug} type="delete">
                <RectangleIconButton
                  color="error"
                  onClick={() => setAddNewRow(false)}
                >
                  <ClearIcon color="error" />
                </RectangleIconButton>
              </PermissionWrapperV2>
              {isLoading ? (
                <CircularProgress
                  style={{ width: "20px", height: "20px", marginLeft: "4px" }}
                />
              ) : (
                <RectangleIconButton
                  color="success"
                  onClick={handleSubmit(onSubmit)}
                >
                  <DoneIcon color="success" />
                </RectangleIconButton>
              )}
            </div>
          </td>
        </CTableCell>
      </CTableRow>
    );
  },
);

AddDataColumn.displayName = "AddDataColumn";

export default AddDataColumn;
