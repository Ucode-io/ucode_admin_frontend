import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import Filters from "components/Filters";
import { Input } from "alisa-ui";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import iiko from "assets/icons/iiko.png";
import keeper from "assets/icons/keeper.png";
import jowi from "assets/icons/jowi.png";
import payme from "assets/icons/payme.png";
import click from "assets/icons/click.png";
import delever from "assets/icons/delever_logo.png";
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
                    // onClick={() =>
                    //   history.push(`/home/settings/branch/${elm.id}`)
                    // }
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

        {/* <Typography className={classes.header}>Пос</Typography>
        <Card className={classes.root}>
          <img src={iiko} alt="" className="p-4 m-auto" />
          <CardActions
            className={classes.footer}
            onClick={() => history.push("/home/settings/integrations/iiko")}
          >
            <Typography>iiko</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card>

        <Card className={classes.root}>
          <img src={keeper} alt="" className="p-4 m-auto" />
          <CardActions className={classes.footer}>
            <Typography>RKeeper</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card>

        <Card className={classes.root}>
          <img src={jowi} alt="" className="p-4 m-auto" />
          <CardActions
            className={classes.footer}
            onClick={() => history.push("/home/settings/integrations/jowi")}
          >
            <Typography>Jowi</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card>
      </div>

      <div>
        <Typography className={classes.header}>Платежный шлюз</Typography>
        <Card className={classes.root}>
          <img src={payme} alt="" className="p-4 m-auto" />
          <CardActions
            className={classes.footer}
            onClick={() => history.push("/home/settings/integrations/payme")}
          >
            <Typography>Payme</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card>

        <Card className={classes.root}>
          <img src={click} alt="" className="p-4 m-auto" />
          <CardActions
            className={classes.footer}
            onClick={() => history.push("/home/settings/integrations/click")}
          >
            <Typography>Click</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card>
      </div>

      <div>
        <Typography className={classes.header}>Приложение</Typography>
        <Card className={classes.root}>
          <img src={delever} alt="" className="p-4 m-auto" />
          <CardActions className={classes.footer}>
            <Typography>RKeeper</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card>

        <Card className={classes.root}>
          <img src={delever} alt="" className="p-4 m-auto" />
          <CardActions className={classes.footer}>
            <Typography>Jowi</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card> */}
      </div>
    </>
  );
}
