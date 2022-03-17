import "./style.scss";
import Table from "./Table";
import Header from "../../../../components/Header";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import Button from "../../../../components/Button";

export default function Click() {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div>
      <Header
        title="Click"
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push("/home/settings/integrations/click/create")
            }
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Table />
    </div>
  );
}
