import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card";
import arrowRight from "assets/icons/keyboard_arrow_right.svg";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import file_icon from '../../../assets/icons/file.svg'
import DeleteIcon from "@material-ui/icons/Delete";
import { DoneTwoTone } from "@material-ui/icons";
import { DownloadIcon } from "constants/icons";

const useStyles = makeStyles({
  header: {
    fontSize: "1.2rem",
    fontWeight: "500",
    padding: ".6rem 1rem 0 1rem",
  },
  root: {
    width: "18rem",
    margin: "1rem",
    display: "inline-block",
  },
  footer: {
    borderTop: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ".5rem 1rem",
    cursor: "pointer",
  },
  arrow: {
    color: "#4094f7",
    cursor: "pointer",
    fontSize: "1.5rem",
  },
});



export default function Documents() {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();


  const data = [
    {
      id: 1,
      name: 'document'
    },
    {
      id: 2,
      name: 'document name'
    }
  ]

  const columns = [
  {
    key: "order-number",
    // render: (record, index) => (currentPage - 1) * 10 + index + 1,
  },
  
  
];

  return (
    <>
      <Header
        title={t("documents")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/documents/create");
              // setCreateModal(true)
            }}
          >
            {t("add")}
          </Button>,
        ]}
      />
      {/* <Filters>
        <Input
          // width={410}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon />}
          // onChange={onSearch}
        />
      </Filters> */}

      <div className="m-4">
        <Card title={t("document.lists")}>
          <TableContainer className="rounded-md border border-lightgray-1">
            <Table aria-label="simple table">
              {/* <TableHead>
            <TableRow>
              {columns.map((elm) => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              ))}
            </TableRow>
          </TableHead> */}
              <TableBody>
                {data.map((elm, index) => (
                  <TableRow
                    key={elm.id}
                    onClick={() =>
                      history.push(`/home/settings/branch/${elm.id}`)
                    }
                    style={{ borderBottom: "1px solid #E5E9EB" }}
                  >
                    {/* {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(elm, index) : "----"}
                    </TableCell>
                  ))} */}
                    <div className="flex items-center p-3">
                      <img src={file_icon} alt="file" />
                      <div style={{ flex: "1 1 90%", marginLeft: "12px" }}>
                        {elm.name}
                      </div>
                      <div
                        style={{
                          flex: "1 1 10%",
                          justifyContent: 'end',
                          width: "100%",
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                          <span
                            className="cursor-pointer d-block border rounded-md p-2"
                            // onClick={() => remove(index)}
                          >
                            <DownloadIcon color="secondary" />
                          </span>
                          <span
                            className="cursor-pointer d-block border rounded-md p-1.5 ml-3"
                            // onClick={() => remove(index)}
                          >
                            <DeleteIcon color="error" />
                          </span>
                      </div>
                    </div>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        
      </div>
    </>
  );
}
