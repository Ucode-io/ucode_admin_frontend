import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "../../../components/Pagination";
import numberToPrice from "../../../helpers/numberToPrice";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import LoaderComponent from "../../../components/Loader";
import Card from "../../../components/Card";
import ActionMenu from "../../../components/ActionMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import SwitchColumns from "components/Filters/SwitchColumns";
import { deleteBranch, getBranchList } from "services/branch";


export default function BranchesTable({ createModal, setCreateModal, search }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [id, setId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(null);
  const [columns, setColumns] = useState([])


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
                  title: t("edit"),
                  color: "blue",
                  icon: <EditIcon />,
                  action: () =>
                    history.push(`/home/settings/branch/${record.id}`),
                },
                {
                  title: t("delete"),
                  color: "red",
                  icon: <DeleteIcon />,
                  action: () => {
                    deleteBranch( record.id )
                    .then((res) => getAllBranches({limit: 10, currentPage}))
                  }
                  ,
                },
              ]}
            />
            
          </div>
        ),
      }
    ]
    setColumns(_columns)
  }, []);

  const getAllBranches = (page) => {
    setLoader(true);
    getBranchList({search})
      .then((res) => {
        setItems({
          count: res.data.count,
          data: res.data,
        });
      })
      .catch((err) => console.log(err, 'error'))
      .finally(() => setLoader(false));
  }

  useEffect(() => {
    getAllBranches(search);
  }, [search]);
  

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: t("branches"),
      key: "branches",
      render: (record) =>  record.name ,
    },
    {
      title: t("address"),
      key: "address",
      render: (record) =>  record.address,
    },
    {
      title: t("phone.number"),
      key: "phone_numbers",
      render: (record) => <div> {record?.phone_numbers[0]} </div>,
    },
  ];


  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={1
            // items?.count
          }
          // onChange={(pageNumber) => setCurrentPage(pageNumber)}
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
            {items?.data?.branches && items?.data?.branches.length ? (
              items?.data.branches.map((elm, index) => (
      
                 <TableRow
                  key={elm.id}
                  onClick={() => history.push(`/home/settings/branch/${elm.id}`)}
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

      {/* <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      /> */}

      
    </Card>
  );
}
