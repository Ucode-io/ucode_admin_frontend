import Table from "./Table";
import Header from "../../../../components/Header";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import Button from "../../../../components/Button";
import Filters from "components/Filters";
import Input from "components/Input";
import { DownloadIcon, UploadIcon } from "constants/icons";
import SearchIcon from "@material-ui/icons/Search";
import DatePicker from "components/DatePicker";

export default function Catalog() {
  const { t } = useTranslation();
  const history = useHistory();

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={UploadIcon}
        iconClassName="text-blue-600"
        shape="outlined"
        size="medium"
        color="zinc"
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
        className="mr-4"
      >
        {t("download")}
      </Button>
    </div>
  );

  return (
    <div>
      <Header
        title={t("catalog.list")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() =>
              history.push("/home/settings/services/catalog/create")
            }
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Filters extra={extraFilter}>
        <div className="flex">
          <Input
            // width={410}
            placeholder={t("search")}
            size="middle"
            addonBefore={<SearchIcon />}
            // onChange={onSearch}
          />
          <DatePicker className="ml-2 rounded-lg"/>
        </div>
      </Filters>

      <Table />
    </div>
  );
}