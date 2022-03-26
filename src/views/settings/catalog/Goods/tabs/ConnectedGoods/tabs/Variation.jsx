import { useEffect, useMemo, useState, useCallback } from "react";
import Modal from "components/Modal";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "components/Pagination";
import { useTranslation } from "react-i18next";
import { getV2ProductVariants, changeV2ProductVariantStatus } from "services";
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
import LoopIcon from "@material-ui/icons/Loop";

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
  cell: {
    width: "100vw",
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
      var sortedIds = arrayMove(values?.variant_ids, oldIndex, newIndex);
      setFieldValue("variant_ids", sortedIds);
    },
    [setFieldValue, values?.variant_ids],
  );

  const DragHandle = SortableHandle(() => (
    <DragIndicatorIcon className={classes.dragIcon} />
  ));

  const SortableItem = SortableElement(({ value, index, key }) => (
    <TableRow key={key} onClick={() => {}}>
      {columns.map((col) => (
        <TableCell
          key={col.key}
          className={classes.cell}
          // padding="normal"
          // variant="body"
          // size="medium"
        >
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
      getV2ProductVariants({ limit, page: currentPage, search: input })
        .then((res) => {
          var variants = res.product_variants?.map((product) => ({
            label: product.title?.ru,
            value: product.id,
          }));
          cb(variants);
        })
        .catch((err) => console.log(err));
    },
    [currentPage, limit],
  );

  const getItems = useCallback(() => {
    setIsLoading(true);
    getV2ProductVariants()
      .then((res) => {
        setItems({
          count: res.count,
          data: res.product_variants,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteItem = useCallback(
    (e) => {
      setDeleteLoading(true);
      setFieldValue(
        "variant_ids",
        values.variant_ids.filter(
          (variant_id) => variant_id.id !== deleteModal.id,
        ),
      );
      setDeleteModal(false);
      setDeleteLoading(false);
    },
    [deleteModal, values, setFieldValue],
  );

  const handleAddItem = useCallback(
    (e) => {
      if (items.data?.length && selectedGoods.length) {
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
      }
      setAddModal(false);
      setLoading(false);
    },
    [items, selectedGoods, values, setFieldValue],
  );

  const closeModal = () => {
    setAddModal(false);
    setDeleteModal(false);
  };

  var products = useMemo(() => {
    var ids = [];
    for (let i = 0; i < values?.variant_ids.length; i++) {
      for (let j = 0; j < items?.data?.length; j++) {
        if (items?.data[j]?.id === values?.variant_ids[i].id) {
          ids.push(items?.data[j]);
        }
      }
    }
    return ids;
  }, [values?.variant_ids, items?.data]);

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
        render: (record) => (
          <Switch
            defaultChecked={record.active}
            onChange={(status) => {
              changeV2ProductVariantStatus(record.id, { status });
            }}
          />
        ),
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
      {!isLoading ? (
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
        disable={!selectedGoods.length}
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
          filterOption={(product, inputValue) => product.value !== params.id}
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
