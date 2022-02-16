import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Card from "components/Card";
import Modal from "components/Modal";
import EmptyData from "components/EmptyData";
import ActionMenu from "components/ActionMenu";
import Pagination from "components/Pagination";
import LoaderComponent from "components/Loader";
import {} from "services";
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
import FiveStar from "components/FiveStar";

export default function RestaurantTable() {
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

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div className="text-info">{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("id.client"),
      key: "client_id",
      dataIndex: "client_id",
    },
    {
      title: t("name"),
      key: "name",
      dataIndex: "name",
    },
    {
      title: t("restaurant"),
      key: "restaurant",
      dataIndex: "restaurant",
    },
    {
      title: t("comments"),
      key: "comment",
      dataIndex: "comment",
    },
    {
      title: t("raiting"),
      key: "raiting",
      render: (record, index) => <FiveStar value={record.raiting} />,
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
              action: () => {},
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
