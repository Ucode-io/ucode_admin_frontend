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

export default function Requites() {
  const { t } = useTranslation();
  const history = useHistory();
  const [createModal, setCreateModal] = useState();
  const [search, setSearch] = useState()

  return (
    <>
      <Header
        title={t("requisites")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/requisites/create");
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </Filters>
      <Table search={search} />
    </>
  );
}