import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import Filters from "components/Filters";
import { Input } from "alisa-ui";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import iiko from "assets/icons/iiko.png";
import keeper from "assets/icons/keeper.png";
import jowi from "assets/icons/jowi.png";
import payme from "assets/icons/payme.png";
import click from "assets/icons/click.png";
import delever from "assets/icons/delever_logo.png";
import arrowRight from "assets/icons/keyboard_arrow_right.svg";

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
  },
  arrow: {
    color: "#4094f7",
    cursor: "pointer",
    fontSize: "1.5rem",
  },
});

export default function Integrations() {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <Header
        title={t("integrations")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/integrations/create");
              // setCreateModal(true)
            }}
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Filters>
        <Input
          // width={410}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon />}
          // onChange={onSearch}
        />
      </Filters>

      <div>
        <Typography className={classes.header}>Пос</Typography>
        <Card className={classes.root}>
          <img src={iiko} alt="" className="p-4 m-auto" />
          <CardActions className={classes.footer}>
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
          <CardActions className={classes.footer}>
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
          <CardActions className={classes.footer}>
            <Typography>RKeeper</Typography>
            <Typography className={classes.arrow}>
              <img src={arrowRight} alt="arrow right" />
            </Typography>
          </CardActions>
        </Card>

        <Card className={classes.root}>
          <img src={click} alt="" className="p-4 m-auto" />
          <CardActions className={classes.footer}>
            <Typography>Jowi</Typography>
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
        </Card>
      </div>
    </>
  );
}
