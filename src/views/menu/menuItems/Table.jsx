import { useEffect, useState, useMemo } from "react";
import axios from "../../../utils/axios";
import Modal from "../../../components/Modal";
import Pagination from "../../../components/Pagination";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import StatusTag from "../../../components/Tag/StatusTag";
import StopIcon from "@material-ui/icons/Stop";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
// import { productChange } from "../../../services";
import "./style.scss";
import ActionMenu from "../../../components/ActionMenu";
import LoaderComponent from "../../../components/Loader";
import Card from "../../../components/Card";
import TableChartIcon from "@material-ui/icons/TableChart";
import AddOptionModal from "../productCreate/modals/AddOption";
import {
  getIngredient,
  postIngredients,
  updateIngredients,
} from "../../../services/ingredients";
import numberToPrice from "../../../helpers/numberToPrice";

// const menu_id = "a3361f16-3076-4d50-83bd-38cc9dede994"

const CatalogTable = ({ tab, optionModal, setOptionModal }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { shipper_id, menu_id } = useParams();

  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [valuesIngredients, setValuesIngredients] = useState(null);
  const [anchorEl, setAnchorEl] = useState({
    element: null,
    id: null,
  });

  const onModalSubmit = (values) => {
    if (valuesIngredients) {
      updateIngredients(values.id, values).then(() => {
        getItems(currentPage);
      });
    } else {
      postIngredients({ ...values, shipper_id }).then(() => {
        getItems(currentPage);
      });
    }
  };

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, tab]);

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }));
  };

  const getItems = (page) => {
    setLoader(true);
    clearItems();
    axios
      .get(
        `/${tab}${tab === "ingredients" ? `?shipper_id=${shipper_id}` : ""}`,
        {
          params: { limit: 10, page, menu_id },
          headers: { shipper_id },
        }
      )
      .then((res) => {
        setItems({
          count: res.count,
          data: res[keyByTab[tab]],
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoader(false));
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    if (deleteModal.type === "product" || deleteModal.type === "ingredients") {
      axios
        .delete(`/${deleteModal.type}/${deleteModal.id}`)
        .then(() => {
          setDeleteLoading(false);
          setDeleteModal(null);
          getItems(currentPage);
        })
        .finally(() => setDeleteLoading(false));
    } else {
      axios
        .delete(`/category/${deleteModal.id}`)
        .then(() => {
          setDeleteLoading(false);
          setDeleteModal(null);
          getItems(currentPage);
        })
        .finally(() => setDeleteLoading(false));
    }
  };

  const getIngredientOne = (id) => {
    getIngredient(id).then((res) => {
      setValuesIngredients(res);
      setOptionModal(true);
    });
  };

  const columns = useMemo(() => {
    const defaultColumns = (type) => {
      const cols = [
        {
          title: (
            <div className="float-right">
              <TableChartIcon className="text-primary" />
            </div>
          ),
          key: "actions",
          render: (record, index) => (
            <div className="float-right">
              <ActionMenu
                id={record.id}
                actions={[
                  {
                    icon: <EditIcon />,
                    color: "blue",
                    title: t("change"),
                    action: () => {
                      if (type !== "ingredients") {
                        history.push(
                          `/home/company/shipper-company/${shipper_id}/menu/${menu_id}/${type}/${record.id}`
                        );
                      } else {
                        getIngredientOne(record.id);
                      }
                    },
                  },
                  {
                    icon: <DeleteIcon />,
                    color: "red",
                    title: t("delete"),
                    action: () => {
                      setDeleteModal({ type, id: record.id });
                    },
                  },
                ]}
              />
            </div>
          ),
        },
      ];
      if (type !== "ingredients") {
        cols.unshift({
          title: t("description"),
          key: "description",
          render: (record) => record?.description?.ru,
        });
      }
      return cols;
    };

    switch (tab) {
      case "category":
        return [
          {
            title: "№",
            key: "order-number",
            render: (record, index) => (currentPage - 1) * 10 + index + 1,
          },
          {
            title: t("category.name"),
            key: "name",
            render: (record) => record.name.ru,
          },
          ...defaultColumns("category"),
        ];
      case "ingredients":
        return [
          {
            title: "№",
            key: "number",
            render: (_, index) => (currentPage - 1) * 10 + index + 1,
          },
          {
            title: t("name"),
            key: "name",
            render: (record) => record?.name?.ru,
          },
          {
            title: t("price"),
            key: "price",
            render: (record) => numberToPrice(record?.price, "сум"),
          },
          ...defaultColumns("ingredients"),
        ];
      default:
        return [
          {
            title: "№",
            key: "order-number",
            render: (record, index) => (currentPage - 1) * 10 + index + 1,
          },
          {
            title: t("product.name"),
            key: "name",
            render: (record) => record?.name?.ru,
          },
          {
            title: t("description"),
            key: "description",
            render: (record) => record?.description?.ru,
          },
          {
            title: t("price"),
            key: "price",
            dataIndex: "price",
            render: (record) => numberToPrice(record?.price, "сум"),
          },
          {
            title: t("status"),
            key: "is_active",
            render: (record) => (
              <StatusTag
                status={record.is_active}
                className={`${
                  record.is_active ? "bg-blue-400" : "bg-red-400"
                } `}
              />
            ),
          },
          {
            title: (
              <div className="float-right">
                <TableChartIcon className="text-primary" />
              </div>
            ),
            key: "actions",
            render: (record, index) => (
              <div className="float-right">
                <ActionMenu
                  id={record.id}
                  actions={[
                    {
                      icon: <StopIcon />,
                      color: "yellow",
                      title: t("stop.product"),
                      action: () => {
                        const isActive = record.is_active
                          ? { is_active: false }
                          : { is_active: true };
                        // productChange(record.id, {}, isActive).then((res) => {
                        //   getItems(currentPage);
                        // });
                      },
                    },
                    {
                      icon: <EditIcon />,
                      color: "blue",
                      title: t("change"),
                      action: () => {
                        history.push(
                          `/home/company/shipper-company/${shipper_id}/menu/${menu_id}/product/${record.id}`
                        );
                      },
                    },
                    {
                      icon: <DeleteIcon />,
                      color: "red",
                      title: t("delete"),
                      action: () => {
                        setDeleteModal({ type: "product", id: record.id });
                      },
                    },
                  ]}
                />
              </div>
            ),
          },
        ];
    }
  }, [tab, anchorEl]);

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  return (
    <Card className="m-4" footer={pagination}>
      <TableContainer className="mt-4 rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data &&
              items.data.length &&
              items.data.map((elm, index) => (
                <TableRow
                  key={elm.id}
                  className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(elm, index) : elm[col.dataIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
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
      <AddOptionModal
        title={null}
        footer={null}
        open={optionModal}
        onClose={() => {
          setOptionModal((prev) => !prev);
          setValuesIngredients(null);
        }}
        onSubmit={onModalSubmit}
        initialValues={valuesIngredients}
      />
    </Card>
  );
};

const keyByTab = {
  product: "products",
  category: "categories",
  ingredients: "ingredients",
};

export default CatalogTable;
