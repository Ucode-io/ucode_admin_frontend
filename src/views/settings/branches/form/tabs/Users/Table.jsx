import React, { useEffect, useState } from "react";

import AddIcon from "@material-ui/icons/Add";
import * as yup from "yup";
import EditIcon from "@material-ui/icons/Edit";
import { Input } from "alisa-ui";
import DeleteIcon from "@material-ui/icons/Delete";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
// import {
//   deleteFare,
//   getFares,
//   postFare,
//   updateFare,
// } from "../../../services/fares";
import { useHistory } from "react-router-dom";
// import LoaderComponent from "../../../components/Loader";
import Card from 'components/Card'


import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import SwitchColumns from "components/Filters/SwitchColumns";
import ActionMenu from "components/ActionMenu";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import { getFares } from "services";


export default function UsersTable({ createModal, setCreateModal }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(null);
  const [columns, setColumns] = useState([])

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
                    history.push(`/home/settings/branch/${record.id}`),
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
        fullName: 'James',
        phone: '8909878',
      },
      {
        id: 2,
        fullName: 'Ozil',
        phone: '8909878',
      },
    ]
  }


  useEffect(() => {
    getItems(currentPage);
  }, [currentPage]);

  const getItems = (page) => {
    setLoader(true);
    getFares()
      .then((res) => {
        setItems({
          count: res.count,
          data: res.fares,
        });
      })
      .finally(() => setLoader(false));
  };
  
  // const findType = [
  //   {
  //     label: `${t("fixed")}`,
  //     value: "fixed",
  //   },
  //   {
  //     label: `${t("not.fixed")}`,
  //     value: "not-fixed",
  //   },
  // ];

  // const handleDeleteItem = () => {
  //   setDeleteLoading(true);
  //   deleteFare(deleteModal.id)
  //     .then((res) => {
  //       getItems(currentPage);
  //       setDeleteLoading(false);
  //       setDeleteModal(null);
  //     })
  //     .finally(() => setDeleteLoading(false));
  // };

  // const onSubmit = (values) => {
  //   const data = {
  //     ...values,
  //     type: values?.type?.value,
  //   };
  //   data?.type === "fixed" && delete data.base_distance;
  //   data?.type === "fixed" && delete data.price_per_km;

  //   setSaveLoading(true);
  //   const selectedAction = createModal.id
  //     ? updateFare(createModal.id, data)
  //     : postFare(data);
  //   selectedAction
  //     .then((res) => {
  //       getItems(currentPage);
  //     })
  //     .finally(() => {
  //       setSaveLoading(false);
  //       closeModal();
  //     });
  // };

  // const formik = useFormik({
  //   initialValues: {
  //     base_price: null,
  //     type: null,
  //     base_distance: null,
  //     price_per_km: null,
  //   },
  //   validationSchema: yup.object().shape({
  //     base_price: yup.mixed().required(t("required.field.error")),
  //     type: yup.mixed().required(t("required.field.error")),
  //   }),
  //   onSubmit,
  // });

  // const closeModal = () => {
  //   setCreateModal(null);
  //   formik.resetForm();
  // };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: t("fullName"),
      key: "fullName",
      render: (record) =>  record.fullName ,
    },
    {
      title: t("phone.number"),
      key: "phone.number",
      render: (record) => <div> {record.phone} </div>,
    },
  ];

 

  // const { values, handleChange, setFieldValue, handleSubmit } = formik;

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={1
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
            {fakeData.data && fakeData.data.length ? (
              fakeData.data.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  onClick={() => history.push(`/home/settings/branch/${elm.id}`)}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(elm, index) : "----"}
                    </TableCell>
                  ))}
                </TableRow>
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
