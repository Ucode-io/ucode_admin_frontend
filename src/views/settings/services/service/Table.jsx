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
import Checkbox from "components/Checkbox1";
import DatePicker from "components/DatePicker";

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
    // getItems(currentPage);
  }, [currentPage, search]);


  const fakeData = {
    count: 1,
    data: [
      {
        id: 1,
        service_name: 'type',
        price: '200 000',
        date: "20-00-2000"
      },
      {
        id: 2,
        service_name: 'type seinor',
        price: '400 000',
        date: "11-00-1990"
      },
      {
        id: 3,
        service_name: 'backend seinor',
        price: '1 000 000',
        date: "11-00-3990"
      }
    ]

  }

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
                  history.push(`service/create/${record.id}`);
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
      title: <Checkbox />,
      key: "checkbox",
      render: (record, index) => (
        <div> <Checkbox /> </div>
      ),
    },
    {
      title: "№",
      key: "promo-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("services"),
      key: "service_name",
      render: (record) => <div>{record.branch_name}</div>,
    },
    {
      title: t("service.price"),
      key: "price",
      render: (record) => <div>{record.price}</div>,
    },
    {
      title: t("date.branch"),
      key: "date",
      render: (record) => <div>{record.date}</div>,
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
    <div className="flex gap-4 mr-4">
      <Button
            icon={DownloadIcon}
            iconClassName="text-blue-600"
            color="zinc"
            shape="outlined"
            size="medium"
            onClick={() => console.log("clicked")}
        >
          {t("download")}
        </Button>
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
        <div className="flex">
          <Input
            onChange={onSearch}
            width={280}
            placeholder={t("search")}
            size="middle"
            addonBefore={
              <SearchIcon style={{ color: "var(--color-primary)" }} />
            }
          />
          <DatePicker className="ml-2 rounded-lg" />
        </div>
      </Filters>

      <Card className="m-4" footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          {fakeData.data ? (
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
                  fakeData.data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      onClick={() => {
                        history.push(`service/create/${item.branch_id}`);
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
