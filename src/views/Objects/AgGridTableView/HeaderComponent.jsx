import React from "react";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import FieldButton from "../../../components/DataTable/FieldButton";
import {useParams} from "react-router-dom";
import {generateGUID} from "../../../utils/generateID";
import {useForm} from "react-hook-form";

function HeaderComponent(props) {
  const {value, column} = props;

  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: appId,
      summary_section: {
        id: generateGUID(),
        label: "Summary",
        fields: [],
        icon: "",
        order: 1,
        column: "SINGLE",
        is_summary_section: true,
      },
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });

  console.log("propspropspropsprops", column);
  const {tableSlug} = useParams();

  const openFieldSettings = () => {
    setDrawerState("CREATE");
  };
  return (
    <PermissionWrapperV2 tableSlug={tableSlug} type={"add_field"}>
      <FieldButton
        openFieldSettings={openFieldSettings}
        view={column?.colDef?.view}
        mainForm={mainForm}
        fields={fields}
        setFieldCreateAnchor={setFieldCreateAnchor}
        fieldCreateAnchor={fieldCreateAnchor}
        fieldData={fieldData}
        setFieldData={setFieldData}
        setDrawerState={setDrawerState}
        setDrawerStateField={setDrawerStateField}
        menuItem={menuItem}
      />
    </PermissionWrapperV2>
  );
}

export default HeaderComponent;
