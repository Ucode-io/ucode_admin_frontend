import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import {
  deletePayme,
  deletePromo,
  getPayme,
} from "../../../../services/promotion";
import { Input } from "alisa-ui";
import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
//components
import Pagination from "components/Pagination";
import Modal from "components/Modal";
import Filters from "components/Filters";
import Button from "components/Button";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import LoaderComponent from "components/Loader";
import SwitchColumns from "components/Filters/SwitchColumns";
import StatusTag from "../../../../components/Tag/StatusTag";

import { DownloadIcon } from "constants/icons";

export default function PaymeTable() {
  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const [columns, setColumns] = useState([]);

  const { t } = useTranslation();
  const lang = useSelector((state) => state.lang.current);
  const history = useHistory();
  let debounce = setTimeout(() => {}, 0);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, search]);

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
          <ActionMenu
            id={record.branch_id}
            actions={[
              {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  history.push(`payme/create/${record.branch_id}`);
                },
              },
              {
                icon: <DeleteIcon />,
                color: "red",
                title: t("delete"),
                action: () => {
                  setDeleteModal({ id: record.branch_id });
                },
              },
            ]}
          />
        ),
      },
    ];
    setColumns(_columns);
  }, []);

  const onSearch = (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      setSearch(e.target.value);
    }, 300);
  };

  const handleDeleteItem = () => {
    setDeleteLoading(true);
    deletePayme(deleteModal.id)
      .then((res) => {
        getItems(currentPage);
        setDeleteLoading(false);
        setDeleteModal(null);
      })
      .finally(() => setDeleteLoading(false));
  };

  const initialColumns = [
    {
      title: "№",
      key: "promo-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("name.branch"),
      key: "branch_name",
      render: (record) => <div>{record.branch_name}</div>,
    },
    {
      title: t("id.merchant"),
      key: "merchant_id",
      render: (record) => <div>{record.merchant_id}</div>,
    },
    {
      title: t("date.branch"),
      key: "created_at",
      render: (record) => <div>{record.created_at}</div>,
    },
  ];

  const getItems = (page) => {
    setLoader(true);
    getPayme({ limit: 10, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.payme_infos,
        });
      })
      .finally(() => setLoader(false));
  };

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
            icon={DownloadIcon}
            iconClassName="text-blue-600"
            color="zinc"
            shape="outlined"
            size="medium"
            onClick={() => console.log("clicked")}
        >
          {t("download")}
        </Button> */}
    </div>
  );

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  return (
    <>
      <Filters extra={extraFilter}>
        <Input
          onChange={onSearch}
          width={280}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon style={{ color: "var(--color-primary)" }} />}
        />
      </Filters>

      <Card className="m-4" footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          {items.data ? (
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
                  items.data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => {
                        history.push(`payme/create/${item.branch_id}`);
                      }}
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
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          ) : (
            <LoaderComponent isLoader={loader} />
          )}
        </TableContainer>
        <Modal
          open={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDeleteItem}
          loading={deleteLoading}
        />
      </Card>
    </>
  );
}
