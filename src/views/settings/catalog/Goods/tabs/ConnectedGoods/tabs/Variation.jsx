import { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "components/Modal";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import { getV2Goods } from "services";
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
  SortableHandle,
} from "react-sortable-hoc";
import numberToPrice from "helpers/numberToPrice";
import Async from "components/Select/Async";
import { useParams } from "react-router-dom";
import Switch from "components/Switch";

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
  },
  icon: {
    color: "#0e73f6",
  },
  dragIcon: {
    color: "#6e8bb7",
    cursor: "n-resize",
  },
}));

export default function Recommended({ formik }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const params = useParams();

  const { setFieldValue, values } = formik;

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

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      var sortedIds = arrayMove(values?.favorite_ids, oldIndex, newIndex);
      setFieldValue("favorite_ids", sortedIds);
    },
    [setFieldValue, values?.favorite_ids],
  );

  const DragHandle = SortableHandle(() => (
    <DragIndicatorIcon className={classes.dragIcon} />
  ));

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
                key={`item-${item.code}`}
                index={index}
                value={item}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  });

  const loadGoods = useCallback(
    (input, cb) => {
      getV2Goods({ limit, page: currentPage, search: input })
        .then((res) => {
          var products = res.products?.map((product) => ({
            label: product.title?.ru,
            value: product.id,
          }));
          products = products.filter((product) => product.value !== params.id);
          cb(products);
        })
        .catch((err) => console.log(err));
    },
    [currentPage, limit, params.id],
  );

  const getItems = useCallback(() => {
    setIsLoading(true);
    getV2Goods({ limit, page: currentPage })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.products,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [limit, currentPage]);

  const handleDeleteItem = useCallback(
    (e) => {
      setDeleteLoading(true);
      setFieldValue(
        "favorite_ids",
        values.favorite_ids.filter(
          (favorite_id) => favorite_id.id !== deleteModal.id,
        ),
      );
      setDeleteModal(null);
      setDeleteLoading(false);
    },
    [deleteModal, values, setFieldValue],
  );

  const handleAddItem = useCallback(
    (e) => {
      setLoading(true);
      var favorite_ids = selectedGoods.map((good) => good.value);
      var filteredItems = items.data.filter((item) =>
        favorite_ids.includes(item.id),
      );
      setFieldValue(
        "favorite_ids",
        values?.favorite_ids?.concat(filteredItems),
      );
      setSelectedGoods([]);
      setAddModal(null);
      setLoading(false);
    },
    [selectedGoods, values, setFieldValue, items],
  );

  const closeModal = () => {
    setAddModal(null);
    setDeleteModal(null);
  };

  const initialColumns = useMemo(() => {
    return [
      {
        title: "",
        key: "drag-area",
        render: () => <DragHandle />,
      },
      {
        title: t("product.image"),
        key: "product-image",
        render: (record) => (
          <>
            <img
              src={`${process.env.REACT_APP_MINIO_URL}/${record.image}`}
              alt="brand logo"
              width={"50"}
              height={"50"}
            />
          </>
        ),
      },
      {
        title: t("product.name"),
        key: "product_name",
        render: (record) => record.title.ru,
      },
      {
        title: t("vendor_code"),
        key: "vendor_code",
        render: (record) => record.code,
      },
      {
        title: t("price"),
        key: "price",
        render: (record) => numberToPrice(record.out_price),
      },
      {
        title: t("status"),
        key: "status",
        render: (record) => <Switch checked={record.is_active} />,
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
    getItems();
  }, [getItems]);

  var products = useMemo(() => {
    var ids = [];
    for (let i = 0; i < values?.favorite_ids.length; i++) {
      for (let j = 0; j < items?.data?.length; j++) {
        if (items?.data[j]?.id === values?.favorite_ids[i].id) {
          ids.push(items?.data[j]);
        }
      }
    }
    return ids;
  }, [values?.favorite_ids, items?.data]);

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
        <SortableList
          items={products}
          onSortEnd={onSortEnd}
          useDragHandle
          useWindowAsScrollContainer
        />
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
        width={500}
        title={t("add.products")}
        isWarning={false}
      >
        <Async
          isMulti
          isSearchable
          isClearable
          cacheOptions
          id="products-select"
          defaultOptions={true}
          value={selectedGoods}
          loadOptions={loadGoods}
          onChange={(val) => {
            setSelectedGoods(() => [...val]);
          }}
          placeholder={t("select")}
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
