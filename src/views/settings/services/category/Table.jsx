import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import Card from "components/Card"
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
  const [columns, setColumns] = useState([])

  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiPaper-root': {
        backgroundColor: '#F4F6FA'
      },
      '& .MuiPaper-elevation1': {
        boxShadow: 'none'
      }
    }
  }))
  const cls = useStyles()

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
                    deleteCategory(record.id)
                    .then((res) => getCategories())
                    
                  },
                },
              ]}
            />
          </div>
        ),
      },
    ];
    setColumns(_columns)
  }, []);


  const getCategories = () => {
    setLoader(true);
    getCategoriesList({search})
    .then((res) => {
      console.log('GET Categories list => ', res)
      setItems({
        count: res.data.count,
        data: res.data.categories
      })
    })
    .catch((err) => console.log(err, 'error'))
    .finally(() => setLoader(false));
  }


  useEffect(() => {
    getCategories(search)
  }, [search]);

  const initialColumns = [
    {
      title: "",
      key: "order-number",
      render: (record, index) => <div className="rounded-full border text-blue-500"> <KeyboardArrowRight /> </div>,
    },
    {
      title: t("category"),
      key: "category",
      render: (record) =>  record.name.ru ,
    },
    {
      title: t("date"),
      key: "date",
      render: (record) => <div>   { moment(new Date(record.created_at).toISOString()).utc().format('YYYY-MM-DD')} </div>,
    },
  ];


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
        <Paper>
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
                items.data.map((elm, index) => (
                  <>
                    {/* <Accordion> */}
                    {/* <AccordionSummary> */}
                    <TableRow
                      key={elm.id}
                      // onClick={() => history.push(`category/${elm.id}`)}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    >
                      {columns.map((col, i) => (
                        <>
                          <TableCell className={cls.root} key={col.key}>
                            {col.render ? col.render(elm, index) : "----"}
                          </TableCell>
                        </>
                      ))}
                    </TableRow>
                    {/* </AccordionSummary>
                  <AccordionDetails> */}
                    {/* {elm?.subcategories?.map((item) => (
                    <TableRow>
                      <TableCell>
                        <div> {item.name.ru} </div>
                      </TableCell>
                    </TableRow>
                  ))} */}

                    {/* </AccordionDetails> */}
                    {/* </Accordion> */}
                  </>
                ))
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </Paper>
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
