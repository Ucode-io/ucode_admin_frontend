import {useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useMemo, useRef, useState} from "react";
import useOnClickOutside from "use-onclickoutside";
import {tableSizeAction} from "@/store/tableSize/tableSizeSlice";
import {Box, Flex, IconButton, Image} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

import {getColumnIcon} from "./icons";
import {useQueryClient} from "react-query";
import constructorViewService from "@/services/constructorViewService";
import relationService, {useRelationFieldUpdateMutation, useRelationsCreateMutation} from "@/services/relationService";
import constructorFieldService, {
  useFieldCreateMutation,
  useFieldUpdateMutation
} from "@/services/constructorFieldService";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import SortByAlphaOutlinedIcon from "@mui/icons-material/SortByAlphaOutlined";
import {paginationActions} from "@/store/pagination/pagination.slice";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WrapTextOutlinedIcon from "@mui/icons-material/WrapTextOutlined";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FunctionsIcon from "@mui/icons-material/Functions";
import {Button, Menu} from "@mui/material";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import {useForm} from "react-hook-form";
import {transliterate} from "@/utils/textTranslater";
import {showAlert} from "@/store/alert/alert.thunk";
import {generateGUID} from "@/utils/generateID";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FieldOptionModal from "@/components/DataTable/FieldOptionModal";
import FieldCreateModal from "@/components/DataTable/FieldCreateModal";
import TableRow from "@/components/DataTable/TableRow";
import AddDataColumn from "@/components/DataTable/AddDataColumn";
import SummaryRow from "@/components/DataTable/SummaryRow";

export const DynamicTable = ({
                               custom_events,
                               dataCount,
                               selectedTab,
                               filterVisible,
                               tableView,
                               data = [],
                               loader = false,
                               setDrawerState,
                               currentView,
                               setDrawerStateField,
                               removableHeight,
                               getValues,
                               additionalRow,
                               mainForm,
                               selectedView,
                               isTableView = false,
                               remove,
                               multipleDelete,
                               openFieldSettings,
                               sortedDatas,
                               fields = [],
                               isRelationTable = false,
                               disablePagination,
                               count,
                               currentPage = 1,
                               onPaginationChange = () => {
                               },
                               pagesCount = 1,
                               setSortedDatas,
                               columns = [],
                               relatedTableSlug,
                               watch,
                               control,
                               setFormValue,
                               navigateToEditPage,
                               dataLength,
                               onDeleteClick,
                               onRowClick = () => {
                               },
                               filterChangeHandler = () => {
                               },
                               filters,
                               disableFilters,
                               tableStyle,
                               wrapperStyle,
                               tableSlug,
                               isResizeble,
                               paginationExtraButton,
                               selectedObjectsForDelete,
                               setSelectedObjectsForDelete,
                               onCheckboxChange,
                               limit,
                               setLimit,
                               isChecked,
                               formVisible,
                               summaries,
                               relationAction,
                               onChecked,
                               defaultLimit,
                               title,
                               view,
                               refetch,
                               menuItem,
                               getAllData = () => {
                               },
                             }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const selectedRow = useSelector((state) => state.selectedRow.selected);
  const [columnId, setColumnId] = useState("");
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const tableHeight = useSelector((state) => state.tableSize.tableHeight);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(0);
  const [fieldCreateAnchor, setFieldCreateAnchor] = useState(null);
  const [fieldData, setFieldData] = useState(null);
  const [addNewRow, setAddNewRow] = useState(false);

  const popupRef = useRef(null);
  useOnClickOutside(popupRef, () => setColumnId(""));
  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];
  useEffect(() => {
    if (!isResizeble) return;
    const createResizableTable = function (table) {
      if (!table) return;
      const cols = table.querySelectorAll(".th");
      [].forEach.call(cols, function (col, idx) {
        if (col.querySelector('.resizer')) {
          return
        }
        const resizer = document.createElement("span");
        resizer.classList.add("resizer");
        resizer.style.height = `${table.offsetHeight}px`;
        col.appendChild(resizer);
        createResizableColumn(col, resizer, idx);
      });
    };

    const createResizableColumn = function (col, resizer, idx) {
      let x = 0;
      let w = 0;

      const mouseDownHandler = function (e) {
        x = e.clientX;

        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);

        resizer.classList.add("resizing");
      };

      const mouseMoveHandler = function (e) {
        const dx = e.clientX - x;
        const colID = col.getAttribute("id");
        const colWidth = w + dx;
        dispatch(tableSizeAction.setTableSize({pageName, colID, colWidth}));
        dispatch(
          tableSizeAction.setTableSettings({
            pageName,
            colID,
            colWidth,
            isStiky: "ineffective",
            colIdx: idx - 1,
          })
        );
      };

      const mouseUpHandler = function () {
        resizer.classList.remove("resizing");
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      resizer.addEventListener("mousedown", mouseDownHandler);
    };

    createResizableTable(document.getElementById("resizeMe"));
  }, [data, isResizeble, pageName, dispatch]);

  const handleAutoSize = (colID, colIdx) => {
    dispatch(tableSizeAction.setTableSize({pageName, colID, colWidth: "auto"}));
    const element = document.getElementById(colID);
    element.style.width = "auto";
    element.style.minWidth = "auto";
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: element.offsetWidth,
        isStiky: "ineffective",
        colIdx,
      })
    );
    setColumnId("");
  };

  const handlePin = (colID, colIdx) => {
    dispatch(
      tableSizeAction.setTableSettings({
        pageName,
        colID,
        colWidth: currentColumnWidth,
        isStiky: true,
        colIdx,
      })
    );
    setColumnId("");
  };

  const calculateWidth = (colId, index) => {
    const colIdx = tableSettings?.[pageName]
      ?.filter((item) => item?.isStiky === true)
      ?.findIndex((item) => item?.id === colId);

    if (index === 0) {
      return 0;
    } else if (colIdx === 0) {
      return 0;
    } else if (
      tableSettings?.[pageName]?.filter((item) => item?.isStiky === true)
        .length === 1
    ) {
      return 0;
    } else {
      return tableSettings?.[pageName]
        ?.filter((item) => item?.isStiky === true)
        ?.slice(0, colIdx)
        ?.reduce((acc, item) => acc + item?.colWidth, 0);
    }
  };

  const calculateWidthFixedColumn = (colId) => {
    const prevElementIndex = columns?.findIndex((item) => item.id === colId);

    if (prevElementIndex === -1 || prevElementIndex === 0) {
      return 0;
    }

    let totalWidth = 0;

    for (let i = 0; i < prevElementIndex; i++) {
      const element = document.querySelector(`[id='${columns?.[i].id}']`);
      totalWidth += element?.offsetWidth || 0;
    }

    return totalWidth;
  };
  const parentRef = useRef(null);

  const renderColumns = (columns ?? []).filter((column) => Boolean(column?.attributes?.field_permission?.view_permission));

  return (
    <div className='CTableContainer'>
      <div className='table' style={{border: "none", borderRadius: 0}}>
        <table id="resizeMe">
          <thead style={{borderBottom: "1px solid #EAECF0"}}>
          <tr>
            <IndexTh formVisible={formVisible} data={data}/>
            {renderColumns.map((column) =>
              <Th key={column.id} tableSlug={tableSlug} columns={renderColumns} column={column} view={view}
                  tableSettings={tableSettings} tableSize={tableSize} pageName={pageName} sortedDatas={sortedDatas}
                  setSortedDatas={setSortedDatas} relationAction={relationAction} isRelationTable={isRelationTable}
                  setFieldCreateAnchor={setFieldCreateAnchor} setFieldData={setFieldData} getAllData={getAllData}
                  setCurrentColumnWidth={setCurrentColumnWidth}/>
            )}
            {!isRelationTable &&
              <PermissionWrapperV2 tableSlug={isRelationTable ? relatedTableSlug : tableSlug} type="add_field">
                <FieldButton
                  openFieldSettings={openFieldSettings}
                  view={view}
                  mainForm={mainForm}
                  fields={fields}
                  setFieldCreateAnchor={setFieldCreateAnchor}
                  fieldCreateAnchor={fieldCreateAnchor}
                  fieldData={fieldData}
                  setFieldData={setFieldData}
                  setDrawerState={setDrawerState}
                  setDrawerStateField={setDrawerStateField}
                  menuItem={menuItem}
                />
              </PermissionWrapperV2>
            }
          </tr>
          </thead>
          <tbody>
          {(isRelationTable ? fields : data).map((virtualRowObject, index) =>
            <TableRow
              key={isRelationTable ? virtualRowObject?.id : index}
              tableView={tableView}
              width={"80px"}
              remove={remove}
              watch={watch}
              getValues={getValues}
              control={control}
              row={virtualRowObject}
              mainForm={mainForm}
              formVisible={formVisible}
              rowIndex={index}
              isTableView={isTableView}
              selectedObjectsForDelete={selectedObjectsForDelete}
              setSelectedObjectsForDelete={setSelectedObjectsForDelete}
              isRelationTable={isRelationTable}
              relatedTableSlug={relatedTableSlug}
              onRowClick={onRowClick}
              isChecked={isChecked}
              calculateWidthFixedColumn={calculateWidthFixedColumn}
              onCheckboxChange={onCheckboxChange}
              currentPage={currentPage}
              limit={limit}
              setFormValue={setFormValue}
              columns={columns}
              tableHeight={tableHeight}
              tableSettings={tableSettings}
              pageName={pageName}
              calculateWidth={calculateWidth}
              tableSlug={tableSlug}
              onDeleteClick={onDeleteClick}
              relationAction={relationAction}
              onChecked={onChecked}
              relationFields={fields?.length}
              data={data}
              view={view}
              firstRowWidth={82}
            />
          )}

          {addNewRow && (
            <AddDataColumn
              rows={isRelationTable ? fields : data}
              columns={columns}
              isRelationTable={isRelationTable}
              setAddNewRow={setAddNewRow}
              isTableView={isTableView}
              tableView={tableView}
              tableSlug={relatedTableSlug ?? tableSlug}
              fields={columns}
              getValues={getValues}
              mainForm={mainForm}
              originControl={control}
              setFormValue={setFormValue}
              relationfields={fields}
              data={data}
              view={view}
              onRowClick={onRowClick}
              width={"80px"}
              refetch={refetch}
            />
          )}

          <PermissionWrapperV2 tableSlug={tableSlug} type={"write"}>
            <tr>
              <td style={{
                padding: "0",
                position: "sticky",
                left: "0",
                backgroundColor: "#FFF",
                zIndex: "1",
              }}>
                <Button
                  id="add-row"
                  variant="text"
                  style={{
                    borderColor: "#F0F0F0",
                    borderRadius: "0px",
                    width: "100%",
                  }}
                  onClick={() => {
                    setAddNewRow(true);
                  }}>
                  <AddRoundedIcon />
                </Button>
              </td>
            </tr>
          </PermissionWrapperV2>

          {!!summaries?.length && (
            <SummaryRow summaries={summaries} columns={columns} data={data} />
          )}
          {additionalRow}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const IndexTh = () => {
  return (
    <Box
      minWidth='82px'
      textAlign='center'
      as='th'
      bg="#f6f6f6"
      py="2px"
      px="12px"
      borderRight='1px solid #EAECF0'
      position='sticky'
      left={0}
      zIndex={1}
    >
      <Image src="/img/hash.svg" alt="index" mx='auto'/>
    </Box>
  )
}

const FieldButton = ({
                       view,
                       setFieldCreateAnchor,
                       fieldCreateAnchor,
                       fieldData,
                       setFieldData,
                       setDrawerState,
                       setDrawerStateField,
                       menuItem,
                     }) => {
  const queryClient = useQueryClient();
  const languages = useSelector((state) => state.languages.list);
  const {tableSlug} = useParams();
  const dispatch = useDispatch();
  const {control, watch, setValue, reset, handleSubmit} = useForm();
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

  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: view?.columns
          ? [...new Set([...view?.columns, column])]
          : [column],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      });
  };

  const {mutate: createField} =
    useFieldCreateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful created", "success"));
        updateView(res?.id);
      },
    });

  const {mutate: updateField} =
    useFieldUpdateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });

  const {mutate: createRelation} =
    useRelationsCreateMutation({
      onSuccess: (res) => {
        reset({});
        setFieldOptionAnchor(null);
        setFieldCreateAnchor(null);
        dispatch(showAlert("Successful updated", "success"));
        updateView(res?.id);
      },
    });

  const {mutate: updateRelation} =
    useRelationFieldUpdateMutation({
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
      table_id: menuItem?.table_id,
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
    };
    if (!fieldData) {
      if (values?.type !== "RELATION") {
        createField({data, tableSlug});
      }
      if (values?.type === "RELATION") {
        createRelation({data: relationData, tableSlug});
      }
    }
    if (fieldData) {
      if (values?.view_fields) {
        updateRelation({data: values, tableSlug});
      } else {
        updateField({data, tableSlug});
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
          math: {label: "plus", value: "+"},
        },
      });
    }
  }, [fieldData]);

  return (
    <>
      <Box
        as='th'
        bg="#f6f6f6"
        py="2px"
        px="12px"
        borderLeft='1px solid #EAECF0'
        position='sticky'
        right={0}
        zIndex={1}
        cursor='pointer'
        onClick={(e) => {
          setFieldOptionAnchor(e.currentTarget);
          setTarget(e.currentTarget);
          setFieldData(null);
        }}
      >
        <AddRoundedIcon style={{marginTop: "3px"}}/>
      </Box>
      <FieldOptionModal
        anchorEl={fieldOptionAnchor}
        setAnchorEl={setFieldOptionAnchor}
        setFieldCreateAnchor={setFieldCreateAnchor}
        setValue={setValue}
        target={target}
      />
      {fieldCreateAnchor && (
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
      )}
    </>
  )
}

const Th = ({
              tableSlug,
              columns,
              column,
              view,
              tableSettings,
              tableSize,
              pageName,
              sortedDatas,
              setSortedDatas,
              relationAction,
              relatedTable,
              isRelationTable,
              getAllData,
              setFieldCreateAnchor,
              setFieldData,
              setCurrentColumnWidth,
            }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(null);
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const summaryIsOpen = Boolean(summaryOpen);
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const permissions = useSelector(
    (state) => state.auth.permissions?.[tableSlug]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSummaryOpen = (event) => {
    setSummaryOpen(event.currentTarget);
  };
  const handleSummaryClose = () => {
    setSummaryOpen(null);
    handleClose();
  };

  const fixColumnChangeHandler = (column, e) => {
    const computedData = {
      ...view,
      attributes: {
        ...view?.attributes,
        fixedColumns: {
          ...view?.attributes?.fixedColumns,
          [column.id]: e,
        },
      },
    };

    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const textWrapChangeHandler = (column, e) => {
    const computedData = {
      ...view,
      attributes: {
        ...view?.attributes,
        textWrap: {
          ...view?.attributes?.textWrap,
          [column.id]: e,
        },
      },
    };

    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: view?.columns?.filter((item) => item !== column),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", {tableSlug});
      });
  };

  const updateRelationView = (data) => {
    relationService.update(data, view?.relatedTable).then((res) => {
      getAllData();
      handleSummaryClose();
    });
  };

  const deleteField = (column) => {
    constructorFieldService.delete(column, tableSlug).then((res) => {
      constructorViewService
        .update(tableSlug, {
          ...view,
          columns: view?.columns?.filter((item) => item !== column),
        })
        .then(() => {
          queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
          queryClient.refetchQueries("GET_OBJECTS_LIST", {tableSlug});
        });
    });
  };

  const computedViewSummaries = useMemo(() => {
    if (
      view?.attributes?.summaries?.find(
        (item) => item?.field_name === column?.id
      )
    )
      return true;
    else return false;
  }, [view?.attributes?.summaries, column]);

  const menu = [
    {
      id: 1,
      children: [
        {
          id: 2,
          title: "Edit field",
          icon: <CreateOutlinedIcon/>,
          onClickAction: (e) => {
            setFieldCreateAnchor(e.currentTarget);
            setFieldData(column);
            if (column?.attributes?.relation_data?.id) {
              queryClient.refetchQueries([
                "RELATION_GET_BY_ID",
                {tableSlug, id: column?.attributes?.relation_data?.id},
              ]);
            }
          },
        },
      ],
    },
    {
      id: 7,
      children: [
        {
          id: 8,
          title: `Sort ${
            sortedDatas?.find((item) => item.field === column.id)?.order ===
            "ASC"
              ? "Z -> A"
              : "A -> Z"
          }`,
          icon: <SortByAlphaOutlinedIcon/>,
          onClickAction: () => {
            const field = column.id;
            const order =
              sortedDatas?.find((item) => item.field === column.id)?.order ===
              "ASC"
                ? "DESC"
                : "ASC";
            dispatch(
              paginationActions.setSortValues({tableSlug, field, order})
            );
            setSortedDatas((prev) => {
              const newSortedDatas = [...prev];
              const index = newSortedDatas.findIndex(
                (item) => item.field === column.id
              );
              if (index !== -1) {
                newSortedDatas[index].order =
                  newSortedDatas[index].order === "ASC" ? "DESC" : "ASC";
              } else {
                newSortedDatas.push({
                  field: column.id,
                  order: "ASC",
                });
              }
              return newSortedDatas;
            });
          },
        },
        {
          id: 18,
          title: computedViewSummaries ? `Unset Summary` : "Add Summary",
          icon: <PlaylistAddCircleIcon/>,
          arrowIcon: <KeyboardArrowRightIcon/>,
          onClickAction: (e) => {
            if (computedViewSummaries) {
              handleAddSummary(column, "unset");
            } else {
              handleSummaryOpen(e);
            }
          },
        },
        {
          id: 19,
          title: `${
            view?.attributes?.textWrap?.[column?.id] ? "Unwrap" : "Wrap"
          } text`,
          icon: view?.attributes?.textWrap?.[column?.id] ? (
            <WrapTextOutlinedIcon/>
          ) : (
            <AlignHorizontalLeftIcon/>
          ),
          onClickAction: () => {
            textWrapChangeHandler(
              column,
              !view?.attributes?.textWrap?.[column?.id] ? true : false
            );
          },
        },
        {
          id: 10,
          title: `${
            view?.attributes?.fixedColumns?.[column?.id] ? "Unfix" : "Fix"
          } column`,
          icon: <ViewWeekOutlinedIcon/>,
          onClickAction: () => {
            fixColumnChangeHandler(
              column,
              !view?.attributes?.fixedColumns?.[column?.id] ? true : false
            );
          },
        },
      ],
    },
    {
      id: 12,
      children: [
        {
          id: 13,
          title: "Hide field",
          icon: <VisibilityOffOutlinedIcon/>,
          onClickAction: () => {
            updateView(column.id);
          },
        },

        {
          id: 14,
          title: "Delete field",
          icon: <DeleteOutlinedIcon/>,
          onClickAction: () => {
            deleteField(column.id);
          },
        },
      ],
    },
  ];

  const formulaTypes = [
    {
      icon: <FunctionsIcon/>,
      id: 1,
      label: "Sum ()",
      value: "sum",
    },
    {
      icon: <FunctionsIcon/>,
      id: 1,
      label: "Avg ()",
      value: "avg",
    },
  ];

  const handleAddSummary = (item, type) => {
    let result = [];

    if (type === "add") {
      const newSummary = {
        field_name: column?.id,
        formula_name: item?.value,
      };
      result = Array.from(
        new Map(
          [newSummary, ...(view?.attributes?.summaries ?? [])]?.map((item) => [
            item.field_name,
            item,
          ])
        ).values()
      );
    } else if (type === "unset") {
      result = view?.attributes?.summaries?.filter(
        (element) => element?.field_name !== item?.id
      );
    }

    const computedValues = {
      ...view,
      attributes: {
        ...view?.attributes,
        summaries: result ?? [],
      },
    };

    const relationData = {
      ...relationAction?.relation,
      table_from: relationAction?.relation?.table_from?.slug,
      table_to: relationAction?.relation?.table_to?.slug,
    };

    const computedValuesForRelationView = {
      ...relatedTable,
      ...relationData,
      table_from: view?.table_from?.slug,
      table_to: view?.table_to?.slug,
      view_fields: view?.view_fields?.map((el) => el.id),
      attributes: {
        ...relatedTable?.attributes,
        summaries: result ?? [],
      },
      relation_table_slug:
        relationAction?.relation_table_slug || column?.table_slug,
      id: relationAction?.relation_id,
    };

    if (isRelationTable) {
      updateRelationView(computedValuesForRelationView);
    } else {
      constructorViewService.update(tableSlug, computedValues).then(() => {
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", {tableSlug});
        handleSummaryClose();
      });
    }
  };

  const position = tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
    ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
    ? "sticky"
    : "relative";
  const left = view?.attributes?.fixedColumns?.[column?.id]
    ? `${calculateWidthFixedColumn({columns, column}) + 82}px`
    : "0";
  const bg = tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
    ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
    ? "#F6F6F6"
    : "#F9FAFB";
  const zIndex = tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
    ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
    ? "1"
    : "0";
  const label = column?.attributes?.[`label_${i18n?.language}`] ||
    column?.attributes?.[`title_${i18n?.language}`] ||
    column?.attributes?.[`name_${i18n?.language}`] ||
    column.label;
  const minWidth = tableSize?.[pageName]?.[column.id]
    ? tableSize?.[pageName]?.[column.id]
    : "auto";
  const width = tableSize?.[pageName]?.[column.id]
    ? tableSize?.[pageName]?.[column.id]
    : "auto";

  return (
    <Box
      as='th'
      id={column.id}
      className='th'
      py="2px"
      px="12px"
      borderRight='1px solid #EAECF0'
      color='#475467'
      fontWeight={500}
      fontSize={12}
      minW={minWidth}
      w={width}
      position={position}
      left={left}
      bg={bg}
      zIndex={zIndex}
      onMouseEnter={(e) => setCurrentColumnWidth(e.relatedTarget.offsetWidth)}
    >
      <Flex alignItems='center' columnGap='8px' whiteSpace='nowrap' minW='max-content'>
        {getColumnIcon({column})}
        {label}

        {permissions?.field_filter &&
          <IconButton aria-label='more' icon={<Image src='/img/chevron-down.svg' alt='more' style={{minWidth: 20}}/>}
                      variant='ghost'
                      colorScheme='gray' ml='auto' onClick={handleClick}/>
        }
      </Flex>

      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
          }}>
          {menu.map((item) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                borderBottom: "1px solid #E0E0E0",
              }}>
              {item.children.map((child) =>
                child.id === 19 && column?.type !== "MULTI_LINE" ? (
                  ""
                ) : (
                  <div
                    onClick={(e) => {
                      child.onClickAction(e);
                    }}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      cursor: "pointer",
                      color: child.id === 14 ? "red" : "",
                      padding: "2px 0",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      {child.icon}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}>
                      {child.title}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </Menu>

      <Menu
        anchorEl={summaryOpen}
        open={summaryIsOpen}
        onClose={handleSummaryClose}
        anchorOrigin={{horizontal: "right"}}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            marginLeft: "10px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
          {formulaTypes?.map((item) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleAddSummary(item, "add");
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
                className="subMenuItem">
                <span
                  style={{
                    marginRight: "5px",
                    width: "20px",
                    height: "20px",
                  }}>
                  {item.icon}
                </span>
                {item?.label}
              </div>
            </div>
          ))}
        </div>
      </Menu>
    </Box>
  )
}

const calculateWidthFixedColumn = ({columns, column}) => {
  const prevElementIndex = columns?.findIndex((item) => item.id === column.id);

  if (prevElementIndex === -1 || prevElementIndex === 0) {
    return 0;
  }

  let totalWidth = 0;

  for (let i = 0; i < prevElementIndex; i++) {
    const element = document.querySelector(`[id='${columns?.[i].id}']`);
    totalWidth += element?.offsetWidth || 0;
  }

  return totalWidth;
};