import { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "components/Modal";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
// import { getV2Goods } from "services";
import getV2Goods, { addProduct, deleteProduct } from "./mock";
import LoaderComponent from "components/Loader";
import Card from "components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import MuiButton from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import Select from "components/Select";
import numberToPrice from "helpers/numberToPrice";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "100%",
      border: "1px solid #ddd",
      color: "#0e73f6",
      marginTop: "1rem",
    },
    "& > *:hover": {
      border: "1px solid #0e73f6",
      background: "#fff",
    },
    icon: {
      color: "#0e73f6",
    },
  },
}));

// 6e8bb7

export default function Recommended({ formik, initialValues }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [selectedGoods, setSelectedGoods] = useState([]);
  const [columns, setColumns] = useState([]);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addLoading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const onSortEnd = useCallback(({ oldIndex, newIndex }) => {
    setItems(({ data, count }) => {
      return { count, data: arrayMove(data, oldIndex, newIndex) };
    });
  }, []);

  const SortableItem = SortableElement(({ value, index, key }) => (
    <TableRow
      key={key}
      onClick={() => {}}
      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
    >
      {columns.map((col) => (
        <TableCell key={col.key}>
          {col.render ? col.render(value, index, columns.length === 1) : "----"}
        </TableCell>
      ))}
    </TableRow>
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
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
            {items.map((item, index) => (
              <SortableItem
                key={`item-${item.vendor_code}`}
                index={index}
                value={item}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  });

  const getItems = useCallback(
    (page) => {
      setIsLoading(true);
      getV2Goods({ limit, page })
        .then((res) => {
          setItems({
            count: res.count,
            data: res.products,
          });
          formik.setFieldValue(
            "variant_ids",
            res.products.map((product) => product.id),
          );
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    },
    [limit],
  );

  const handleDeleteItem = (e, i) => {
    setDeleteLoading(true);
    deleteProduct(deleteModal.id);
    setItems((items) => ({
      count: items.count - 1,
      data: items.data.filter((item) => item.id !== deleteModal.id),
    }));
    formik.setFieldValue(
      "variant_ids",
      formik.values.variant_ids.filter((id) => id !== deleteModal.id),
    );
    setDeleteModal(null);
    setDeleteLoading(false);
  };

  const handleAddItem = (e, i) => {
    setLoading(true);
    addProduct(selectedGoods);
    setItems((items) => ({
      count: items.count + selectedGoods.length,
      data: [...items.data, ...selectedGoods],
    }));
    formik.setFieldValue(
      "variant_ids",
      formik.values.variant_ids.concat(selectedGoods),
    );
    setAddModal(null);
    setLoading(false);
  };

  const closeModal = () => {
    setAddModal(null);
    setDeleteModal(null);
    // formik.resetForm();
  };

  const initialColumns = useMemo(() => {
    return [
      {
        title: "",
        key: "drag-area",
        render: () => <DragIndicatorIcon />,
      },
      {
        title: t("product.image"),
        key: "product-image",
        render: (record) => record.image,
      },
      {
        title: t("product.name"),
        key: "product_name",
        render: (record) => record.name,
      },
      {
        title: t("vendor_code"),
        key: "vendor_code",
        render: (record) => record.vendor_code,
      },
      {
        title: t("price"),
        key: "price",
        render: (record) => numberToPrice(record.price),
      },
    ];
  }, [t]);

  useEffect(() => {
    var _columns = [
      ...initialColumns,
      {
        title: t("action"),
        key: t("actions"),
        render: (record, _, disable) => (
          <div className="flex gap-2 justify-center">
            <span
              className="cursor-pointer d-block border rounded-md p-2"
              onClick={() => setDeleteModal({ id: record.id })}
            >
              <DeleteIcon color="error" />
            </span>
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, [initialColumns, t]);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, limit, getItems]);

  useEffect(() => {
    var rest = selectedGoods.map((good) => good.id);
    formik.setFieldValue("variant_ids", [
      ...formik.values.variant_ids,
      ...rest,
    ]);
  }, [selectedGoods]);

  return (
    <Card
      className=""
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
          limit={limit}
        />
      }
      footerStyle={{ paddingRight: "0", paddingLeft: "0" }}
      bodyStyle={{ paddingRight: "0", paddingLeft: "0" }}
    >
      {!isLoading && items?.data?.length ? (
        <SortableList items={items?.data} onSortEnd={onSortEnd} distance={50} />
      ) : null}

      <LoaderComponent isLoader={isLoading} />

      <div className={classes.root}>
        <MuiButton
          variant="outlined"
          startIcon={<AddIcon className={classes.icon} />}
          onClick={() => {
            setAddModal(true);
          }}
        >
          {t("add")}
        </MuiButton>
      </div>

      <Modal
        open={deleteModal}
        onClose={closeModal}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />

      <Modal
        open={addModal}
        onConfirm={handleAddItem}
        onClose={closeModal}
        loading={addLoading}
        width={700}
        title={t("title")}
        isWarning={false}
      >
        <Select
          isMulti
          isSearchable
          isClearable
          height={40}
          id="categories"
          options={items?.data?.map((product) => ({
            label: product.name,
            value: product.id,
            ...product,
          }))}
          value={selectedGoods}
          onChange={(val) => {
            setSelectedGoods(val);
          }}
        />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Modal>
    </Card>
  );
}
