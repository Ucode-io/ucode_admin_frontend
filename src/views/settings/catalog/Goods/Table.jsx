import { useEffect, useState } from "react";
import Form from "components/Form/Index";
import Modal from "components/Modal";
import Button from "components/Button";
import AddIcon from "@material-ui/icons/Add";
import * as yup from "yup";
import EditIcon from "@material-ui/icons/Edit";
import { Input } from "alisa-ui";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "components/Pagination";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { getV2Goods, deleteV2Good, postV2Good, updateV2Good } from "services";
import { useHistory } from "react-router-dom";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import moment from "moment";

export default function MainTable({ createModal, setCreateModal }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(null);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage]);

  const getItems = (page) => {
    setLoader(true);
    getV2Goods({ limit: 10, page })
      .then((res) => {
        console.log(res);
        setItems({
          count: res.count,
          data: res.products,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deleteV2Good(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = createModal.id
      ? updateV2Good(createModal.id, data)
      : postV2Good(data);
    selectedAction
      .then((res) => {
        getItems(currentPage);
      })
      .finally(() => {
        setSaveLoading(false);
        closeModal();
      });
  };

  const formik = useFormik({
    initialValues: {
      name: null,
      created_at: null,
    },
    validationSchema: yup.object().shape({
      name: yup.mixed().required(t("required.field.error")),
      created_at: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const closeModal = () => {
    setCreateModal(null);
    formik.resetForm();
  };

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: t("good"),
      key: "title",
      render: (record) => record.title,
    },
    {
      title: t("vendor_code"),
      key: "vendor_code",
      render: (record) => <>{record.bar_code}</>,
    },
    {
      title: t("amount"),
      key: "amount",
      render: (record) => <>{record.quantity}</>,
    },
    {
      title: t("price"),
      key: "price",
      render: (record) => <>{record.price}</>,
    },
    {
      title: t("created.date"),
      key: "created.date",
      render: (record) => <>{moment(record.created_at).format("DD-MM-YYYY")}</>,
    },
    {
      title: "",
      key: "actions",
      render: (record, _) => (
        <div className="flex gap-2">
          <ActionMenu
            id={record.id}
            actions={[
              {
                title: t("edit"),
                color: "blue",
                icon: <EditIcon />,
                action: () => history.push(`/home/catalog/goods/${record.id}`),
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
    },
  ];

  const { values, handleChange, handleSubmit } = formik;

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
            {items?.data && items?.data?.length ? (
              items?.data?.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  onClick={() => history.push(`/home/catalog/goods/${elm.id}`)}
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

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />

      <Modal
        open={createModal}
        title={t(createModal?.id ? "update" : "create")}
        footer={null}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 py-8">
            <div>
              <Form.Item formik={formik} name="base_price" label={t("price")}>
                <Input
                  type="number"
                  id="base_price"
                  value={values.base_price}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-3 py-8`}>
            <div>
              <Form.Item
                formik={formik}
                name="base_distance"
                label={t("base.distance")}
              >
                <Input
                  type="number"
                  id="base_distance"
                  value={values.base_distance}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                formik={formik}
                name="price_per_km"
                label={t("price.per.km")}
              >
                <Input
                  type="number"
                  id="price_per_km"
                  value={values.price_per_km}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="large"
              loading={saveLoading}
              icon={createModal?.id ? EditIcon : AddIcon}
            >
              {t(createModal?.id ? "update" : "add")}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
