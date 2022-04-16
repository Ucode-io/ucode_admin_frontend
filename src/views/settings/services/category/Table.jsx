import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { useTranslation } from "react-i18next";
import {
  getFares,
} from "services/fares";
import { useHistory } from "react-router-dom";
// import LoaderComponent from "../../../components/Loader";
// import Card from "../../../components/Card";
// import ActionMenu from "../../../components/ActionMenu";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import SwitchColumns from "components/Filters/SwitchColumns";
import ActionMenu from "components/ActionMenu";
import Card from "components/Card"
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import { getCategoriesList } from "services/category";
import { KeyboardArrowRight } from "@material-ui/icons";


export default function CategoryTable({ createModal, setCreateModal }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(null);
  const [columns, setColumns] = useState([])


  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiPaper-root': {
        backgroundColor: '#F4F6FA'
      },
      '& .MuiPaper-elevation1': {
        boxShadow: 'none'
      }
    }
  }))
  const cls = useStyles()

  useEffect(() => {
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
          />
        ), 
        key: t("actions"),
        render: (record, _) => (
          <div className="flex gap-2">
            <ActionMenu
              id={record.id}
              actions={[
                {
                  title: t("edit"),
                  color: "blue",
                  icon: <EditIcon />,
                  action: () =>
                    history.push(`category/${record.id}`),
                },
                {
                  title: t("delete"),
                  color: "red",
                  icon: <DeleteIcon />,
                  action: () => setDeleteModal({ id: record.id }),
                },
              ]}
            />
          </div>
        ),
      }
    ]
    setColumns(_columns)
  }, []);

  const fakeData = {
    count: 1,
    data: [
      {
        id: 1,
        category: 'cateogry',
        date: '22-20-2020',
      },
      {
        id: 2,
        category: 'arsenal',
        date: '12-34-1919',
      },
    ]
  }

  console.log('data ', columns )

  const getCategories = () => {
    getCategoriesList()
    .then((res) => {
      console.log('GET Categories list => ', res)
      setItems({
        count: res.data.count,
        data: res.data.categories
      })
    })
  }


  useEffect(() => {
    getCategories()
  }, []);



 

  // const closeModal = () => {
  //   setCreateModal(null);
  //   formik.resetForm();
  // };

  const initialColumns = [
    {
      title: "",
      key: "order-number",
      render: (record, index) => <div className="rounded-full border text-blue-500"> <KeyboardArrowRight /> </div>,
    },
    {
      title: t("category"),
      key: "category",
      render: (record) =>  record.name.ru ,
    },
    {
      title: t("date.branch"),
      key: "date",
      render: (record) => <div> {record.date} </div>,
    },
  ];

 

  // const { values, handleChange, setFieldValue, handleSubmit } = formik;

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={
            1
            // items?.count
          }
          // onChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      }
    >
      <TableContainer className="rounded-md border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data && items.data.length ? (
              items.data.map((elm, index) => (
                <>
                {/* <Accordion>
                  <AccordionSummary> */}
                    <TableRow
                      key={elm.id}
                      // onClick={() => history.push(`category/${elm.id}`)}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    >
                      {columns.map((col, i) => (
                        <>
                          <TableCell className={cls.root} key={col.key}>
                            {col.render ? col.render(elm, index) : "----"}
                          </TableCell>
                        </>
                      ))}
                    </TableRow>
                  {/* </AccordionSummary>
                  <AccordionDetails>
                    {elm?.subcategories?.map((item) => (
                      <div> {item.name.ru} </div>
                    ))}
                  </AccordionDetails>
                </Accordion> */}
                </>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
      {/* <Pagination title={t("general.count")} count={items?.count} onChange={pageNumber => setCurrentPage(pageNumber)} /> */}

      {/* <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      /> */}
    </Card>
  );
}
