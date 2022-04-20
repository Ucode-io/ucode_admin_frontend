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
import { DownloadIcon } from "constants/icons";


export default function Rates() {
  const { t } = useTranslation();
  const history = useHistory();
  const [createModal, setCreateModal] = useState(null);
  const [search, setSearch] = useState()

  const extraFilter = (
    <div className="flex gap-4">
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
    <>
      <Header
        title={t("branches")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/branch/create");
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
          onChange={(e) => setSearch(e.target.value)}
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
