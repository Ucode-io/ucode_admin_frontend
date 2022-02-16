import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Card from "components/Card";
import Modal from "components/Modal";
import EmptyData from "components/EmptyData";
import ActionMenu from "components/ActionMenu";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {} from "services";
import StatusTag from "components/Tag/StatusTag";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { getData } from "./mockData";

export default function BannersTable() {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {}, []);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage]);

  const getItems = (page) => {
    setLoader(true);
    getData({ limit: 10, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.data,
        });
      })
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    // setDeleteLoading(true)
    // deleteCourierType(deleteModal.id)
    //   .then((res) => {
    //     getItems(currentPage)
    //     setDeleteLoading(false)
    //     setDeleteModal(null)
    //   })
    //   .finally(() => setDeleteLoading(false))
  };

  const ImageContainer = ({ url, alt = "banner image" }) => (
    <div className="w-20 h-20 rounded-md overflow-hidden relative">
      <img
        className="absolute w-full h-full object-cover"
        src={url}
        alt={alt}
      />
    </div>
  );

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div className="text-info">{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("image"),
      key: "image",
      render: (record) => <ImageContainer url={record.image} />,
    },
    {
      title: t("restaurant.name"),
      key: "restaurant_name",
      dataIndex: "restaurant_name",
    },
    // {
    //   title: t("stock"),
    //   key: "stock",
    //   dataIndex: "stock",
    // },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <StatusTag
          status={record.status}
          color={!record.status ? "#F2271C" : "#0E73F6"}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <ActionMenu
          id={record.id}
          actions={[
            {
              title: t("edit"),
              icon: <EditIcon />,
              color: "blue",
              action: () =>
                history.push(`/home/marketing/newsletter/${record.id}`),
            },
            {
              title: t("delete"),
              icon: <DeleteIcon />,
              color: "red",
              action: () => {},
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      }
    >
      <TableContainer className="rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data && items.data.length
              ? items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render
                          ? col.render(item, index)
                          : item[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
    </Card>
  );
}
