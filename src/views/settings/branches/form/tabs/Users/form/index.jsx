import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import Filters from "components/Filters";
import { StyledTabs } from "components/StyledTabs";
import { StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import AddIcon from "@material-ui/icons/Add";
import UserCreate from "./UserCreate";


export default function BranchCreate() {
  

  // ====== variables ====== //
  const { t } = useTranslation();
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0)


 // =======  Tab ====== //
  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>;
  };

  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleChangeIndex = (index) => setValue(index);
  const handleChange = (event, newValue) => setValue(newValue);

  const routes = [
    {
      title: t(`users`),
      link: true,
      route: `/home/settings/branch/create/user/create`,
    },
  ];
 
  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
  ];

  const addButton = [
    <Button
    icon={AddIcon}
    size="medium"
    onClick={() => {
      history.push("/home/settings/branch/create/user/create");
      // setCreateModal(true)
    }}
  >
    {t("add")}
  </Button>,
  ]

  return (
    // <form onSubmit={handleSubmit}>
    <>
      <Header
        startAdornment={[
          <Breadcrumb routes={routes} />,
        ]}
        // endAdornment={value === 0 ? headerButtons : addButton}
      />

      <UserCreate />
    </>
    // </form>
  );
}