import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import {showAlert} from "@/store/alert/alert.thunk";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {CircularProgress} from "@mui/material";
import {Box, Flex, Image} from "@chakra-ui/react";
import NewTableDataForm from "@/components/ElementGenerators/NewTableDataForm";
import {CTableCell, CTableRow} from "@/components/CTable";

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
    calculateWidthFixedColumn,
    firstRowWidth = 45,
  }) => {
    const dispatch = useDispatch();
    const {tableSlug, id} = useParams();
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
      formState: {errors},
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

    return (
      <CTableRow>
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
          }}>
          <Box className="group" position="relative" h="25px" w="25px">
            <Image
              ml="3px"
              src="/table-icons/save-delete.svg"
              alt="More"
              w="25px"
              h="25px"
              _groupHover={{display: "none"}}
            />

            <Flex
              columnGap="3px"
              display="none"
              _groupHover={{display: "flex"}}
              position="absolute"
              top={0}
              right="-3px"
              bg="#fff"
              borderRadius={4}>
              <RectangleIconButton
                id="cancel-row"
                color="error"
                onClick={() => setAddNewRow(false)}
                style={{minHeight: 25, minWidth: 25, height: 25, width: 25}}>
                <ClearIcon color="error" />
              </RectangleIconButton>

              {isLoading ? (
                <CircularProgress
                  style={{width: "20px", height: "20px", marginLeft: "4px"}}
                />
              ) : (
                <RectangleIconButton
                  id="confirm-row"
                  color="success"
                  onClick={handleSubmit(onSubmit)}
                  style={{minHeight: 25, minWidth: 25, height: 25, width: 25}}>
                  <DoneIcon color="success" />
                </RectangleIconButton>
              )}
            </Flex>
          </Box>
        </CTableCell>
      </CTableRow>
    );
  }
);

export default AddDataColumn;
