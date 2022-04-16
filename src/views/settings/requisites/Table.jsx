import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Pagination from "components/Pagination";
import Modal from "components/Modal";
import { deleteOperator, } from "services/operator";
import Card from "components/Card";
import ActionMenu from "components/ActionMenu";
import LoaderComponent from "components/Loader";
import SwitchColumns from "components/Filters/SwitchColumns";
import { Input } from "alisa-ui";
import SearchIcon from "@material-ui/icons/Search";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { DownloadIcon, ExportIcon } from "constants/icons";
import { deleteRequsite, getRequisites } from "services/requisites";

export default function TableRequisite({search}) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  // const [search, setSearch] = useState("");
  const [columns, setColumns] = useState([]);
  let debounce = setTimeout(() => {}, 0);

  
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
          <div className="flex gap-2">
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  history.push(`/home/patients/${record.id}`);
                },
              },
              {
                icon: <DeleteIcon />,
                color: "red",
                title: t("delete"),
                action: () => {
                  deleteRequsite( record.id )
                  .then((res) => getRequisitesList(currentPage))
                },
              },
            ]}
          />
          </div>
        ),
      },
    ];
    setColumns(_columns);
  }, []);

  // const handleDeleteItem = () => {
  //   setDeleteLoading(true);
  //   deleteOperator(deleteModal.id)
  //     .then((res) => {
  //       getItems(currentPage);
  //       setDeleteLoading(false);
  //       setDeleteModal(null);
  //     })
  //     .finally(() => setDeleteLoading(false));
  // };

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("naming"),
      key: "name",
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: t("code"),
      key: "code",
      render: (record) => <div>{record.code}</div>,
    },
    {
      title: t("inn"),
      key: "inn",
      render: (record) => <div>{record.inn}</div>,
    },
    {
      title: t("mfo"),
      key: "mfo",
      render: (record) => <div>{record.mfo}</div>,
    },
    {
      title: t("oked"),
      key: "oked",
      render: (record) => <div>{record.oked}</div>,
    },
  ];

  const getRequisitesList = (page) => {
    setLoader(true);
    getRequisites({ limit: 10, page, search })
      .then((res) => {
        console.log('res res ', res)
        setItems({
          count: res.data.count,
          data: res.data.requisites,
        });
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    getRequisitesList(search);
  }, [search]);

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
        icon={ExportIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked");
        }}
      >
        {t("import")}
      </Button>

      <Button
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
      {/* <Filters extra={extraFilter}>
        <Input
          onChange={onSearch}
          width={280}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon style={{ color: "var(--color-primary)" }} />}
        />
      </Filters> */}

      <Card className="m-4" footer={pagination}>
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
              {items.data &&
                items.data.length &&
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    onClick={() => history.push(`/home/settings/requisites/${item.id}`)}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(item, index) : "----"}
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
          onConfirm={getRequisitesList}
          loading={deleteLoading}
        />
      </Card>
    </>
  );
}