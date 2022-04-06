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

export default function Aggregator() {
  const { t } = useTranslation();
  const history = useHistory();
  const [createModal, setCreateModal] = useState(null);

  return (
    <>
      <Header
        title={t("templates")}
        endAdornment={[
          <Button
            icon={AddIcon}
            size="medium"
            onClick={() => {
              history.push("/home/settings/template/create");
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
      <Table createModal={createModal} setCreateModal={setCreateModal} />
    </>
  );
}
