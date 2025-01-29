import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import {showAlert} from "../../store/alert/alert.thunk";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import {CTableCell, CTableRow} from "../CTable";
import NewTableDataForm from "../ElementGenerators/NewTableDataForm";
import {CircularProgress} from "@mui/material";
import {Box, Flex, Image} from "@chakra-ui/react";

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
        .finally(() => {
        });
    };

    return (
      <CTableRow>
        <CTableCell
          align="center"
          className="data_table__number_cell"
          style={{
            padding: "4px 4px",
            position: "sticky",
            left: "0",
            backgroundColor: "#F6F6F6",
            zIndex: "2",
          }}>
          {rows?.length ? rows?.length + 1 : 1}
        </CTableCell>
        {columns?.map((column, index) => (
          <CTableCell
            align="center"
            className="data_table__number_cell"
            style={{
              padding: "4px 4px",
              minWidth: "80px",
              backgroundColor: "#fff",
              zIndex: "1",
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
            />
          </CTableCell>
        ))}
        <CTableCell
          align="center"
          className="data_table__number_cell"
          style={{
            position: "sticky",
            backgroundColor: "#fff",
            zIndex: "1",
            color: "#262626",
            fontSize: "13px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
            padding: "0 5px",
            right: "0",
            borderLeft: "1px solid #eee",
          }}>
          <Box className='group' position="relative" h='32px'>
            <Image src="/table-icons/save-delete.svg" alt="More" w='32px' h='32px' _groupHover={{display: "none"}} />

            <Flex columnGap='3px' display="none" _groupHover={{ display: "flex" }} position='absolute' top={0} right='3px' bg='#fff' borderRadius={4}>
              <RectangleIconButton
                id="cancel-row"
                color="error"
                onClick={() => setAddNewRow(false)}>
                <ClearIcon color="error"/>
              </RectangleIconButton>

              {isLoading ? (
                <CircularProgress
                  style={{width: "20px", height: "20px", marginLeft: "4px"}}
                />
              ) : (
                <RectangleIconButton
                  id="confirm-row"
                  color="success"
                  onClick={handleSubmit(onSubmit)}>
                  <DoneIcon color="success"/>
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
