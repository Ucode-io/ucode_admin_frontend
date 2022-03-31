import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Table from "./Table";
import Header from "components/Header";
import Button from "components/Button";
import Filters from "components/Filters";
import { Input } from "alisa-ui";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import { DownloadIcon, FIlterIcon } from "constants/icons";

export default function Rates() {
  const { t } = useTranslation();
  const history = useHistory();

  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(null);

  let debounce = setTimeout(() => {}, 0);

  const onSearch = (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      setSearch(e.target.value);
    }, 300);
  };

  const extraFilter = (
    <div className="flex gap-4">
      {/* <Button
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
      </Button> */}
    </div>
  );

  return (
    <>
      <Header
        title={t("rates")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/catalog/rates/create");
              // setCreateModal(true)
            }}
          >
            {t("add")}
          </Button>,
        ]}
      />
      <Filters extra={extraFilter}>
        <Input
          // width={410}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon />}
          onChange={onSearch}
        />
      </Filters>
      <Table
        createModal={createModal}
        setCreateModal={setCreateModal}
        search={search}
      />
    </>
  );
}
