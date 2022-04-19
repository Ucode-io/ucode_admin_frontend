import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import SwitchColumns from "components/Filters/SwitchColumns";
import ActionMenu from "components/ActionMenu";
import Card from "components/Card";
import LoaderComponent from "components/Loader";
import Pagination from "components/Pagination";
import { deleteCategory, getCategoriesList } from "services/category";
import { KeyboardArrowRight } from "@material-ui/icons";
import moment from "moment";

export default function CategoryTable({ search }) {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(false);
  const [columns, setColumns] = useState([]);

  const initialColumns = [
    {
      title: "",
      key: "order-number",
      render: (record, index) => (
        <div className="rounded-full border text-blue-500">
          {" "}
          <KeyboardArrowRight />{" "}
        </div>
      ),
    },
    {
      title: t("category"),
      key: "category",
      render: (record) => record.name.ru,
    },
    {
      title: t("date"),
      key: "date",
      render: (record) => (
        <div>
          {" "}
          {moment(new Date(record.created_at).toISOString())
            .utc()
            .format("YYYY-MM-DD")}{" "}
        </div>
      ),
    },
  ];

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiPaper-root": {
        backgroundColor: "#F4F6FA",
      },
      "& .MuiPaper-elevation1": {
        boxShadow: "none",
      },
    },
    line: {
      background: "#E5E9EB",
      width: "1px",
      height: "48px",
      position: "absolute",
      top: "-10px",
      left: "40px",
    },
  }));
  const cls = useStyles();

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
                  action: () => history.push(`category/${record.id}`),
                },
                {
                  title: t("delete"),
                  color: "red",
                  icon: <DeleteIcon />,
                  action: () => {
                    deleteCategory(record.id).then((res) => getCategories());
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

  const getCategories = () => {
    setLoader(true);
    getCategoriesList({ search })
      .then((res) => {
        console.log("GET Categories list => ", res);
        setItems({
          count: res.data.count,
          data: res.data.categories.map((el) => {
            return {
              ...el,
              openSubCat: false,
            };
          }),
        });
      })
      .catch((err) => console.log(err, "error"))
      .finally(() => setLoader(false));
  };

  console.log("ITEMDs ", items);
  useEffect(() => {
    getCategories(search);
  }, [search]);

  function handleOpenSubCat(index) {
    setItems((prev) => {
      let clone = prev.data.map((el, i) => {
        if (index === i) {
          return {
            ...el,
            openSubCat: !el.openSubCat,
          };
        } else {
          return el;
        }
      });
      return {
        ...prev,
        data: clone,
      };
    });
  }
  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={
            1
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
                <TableCell key={elm.key}>{elm.title} </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data && items.data.length ? (
              items.data.map((elm, index) => (
                <>
                  <TableRow
                    key={elm.id}
                    onClick={() => {
                      // return false;
                      handleOpenSubCat(index);
                    }}
                    className={"bg-lightgray-5"}
                  >
                    {columns.map((col, ind) => (
                      <TableCell className={cls.root} key={col.key}>
                        {col.render ? col.render(elm, index) : "----"}
                      </TableCell>
                    ))}
                  </TableRow>
                  {elm.subcategories?.map((item, i) =>
                    elm.openSubCat ? (
                      <TableRow>
                        <TableCell className={cls.root}>{""}</TableCell>
                        <TableCell>
                          <div className="flex relative">
                            <div className="ml-7">{item.name.ru}</div>
                          </div>
                        </TableCell>

                        <TableCell className={cls.root}>
                          {moment(new Date(item.created_at).toISOString())
                            .utc()
                            .format("YYYY-MM-DD")}
                        </TableCell>

                        <TableCell className={cls.root}>
                          <div className="flex gap-2">
                            <div className={`inline-block`}>
                              <div
                                className={`
                                            icon-button
                                            transition
                                            focus:outline-none
                                            focus:ring 
                                            focus:z-40
                                            focus:border-blue-300
                                            bg-blue-100`}
                              >
                                <div
                                  className={`flex fill-current text-blue-600 `}
                                >
                                  <EditIcon />
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ""
                    ),
                  )}
                </>
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
