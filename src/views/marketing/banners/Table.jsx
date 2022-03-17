import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { deletePromo } from "../../../services/promotion";
import { getPromos } from "../../../services/promotion";
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
import StatusTag from "../../../components/Tag/StatusTag";

import { DownloadIcon } from "constants/icons";
import {deleteBanner, getBanners} from "../../../services/banner";

export default function TableOperator() {
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
                id={record.id}
                actions={[
                  {
                    icon: <EditIcon />,
                    color: "blue",
                    title: t("change"),
                    action: () => {
                      history.push(`/home/marketing/stocks/${record.id}`);
                    },
                  },
                  {
                    icon: <DeleteIcon />,
                    color: "red",
                    title: t("delete"),
                    action: () => {
                      setDeleteModal({ id: record.id });
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
    setDeleteLoading(true)
    deleteBanner(deleteModal.id)
        .then(res => {
          getItems(currentPage)
          setDeleteLoading(false)
          setDeleteModal(null)
        })
        .finally(() => setDeleteLoading(false))
  }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <div className="text-info">{(currentPage - 1) * 10 + index + 1}</div>
    },
    {
      title: t("title"),
      key: "title",
      render: (record) => (
          <div>
            {record.title[lang]}
          </div>
      )
    },
    {
      title: t("img"),
      key: "image",
      render: (record) => (
          <div>
            <img className="w-10" src={record?.image ? record.image : ""} alt={record?.image} />
          </div>
      )
    },
      {
          title: t("status"),
          key: "status",
          render: (record) => (
              <div className="text-center ">
                  <StatusTag
                      className="w-36"
                      status={record.active}
                      color={!record.active ? "#F2271C" : "#0E73F6"}
                  />
              </div>
          ),
      },
  ];

  const getItems = (page) => {
    setLoader(true)
    getBanners({ limit: 10, page })
        .then(res => {
          setItems({
            count: res.count,
            data: res.banners
          })
        })
        .finally(() => setLoader(false))
  }

  const extraFilter = (
      <div className="flex gap-4">
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
                                  history.push(`/home/marketing/stocks/${item.id}`);
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
