import { useTranslation } from "react-i18next";
import Header from "components/Header";
import Filters from "components/Filters";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import { FIlterIcon } from "constants/icons";
import Table from "./Table";
import { Input } from "alisa-ui";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";

export default function Attributes() {
  const { t } = useTranslation();
  const history = useHistory();

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={FIlterIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked");
        }}
      >
        {t("filter")}
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
      </Button>
    </div>
  );

  return (
    <>
      <Header
        title={t("attributes")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/catalog/attributes/create");
              // setCreateModal(true)
            }}
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Filters extra={extraFilter}>
        <Input
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon />}
        />
      </Filters>
      <Table />
    </>
  );
}
