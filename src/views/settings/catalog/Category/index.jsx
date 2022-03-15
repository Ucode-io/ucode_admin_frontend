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

export default function Category() {
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

  return (
    <>
      <Header
        title={t("Sales")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/catalog/category/create");
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
