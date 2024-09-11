import {useMemo} from "react";
import {useSelector} from "react-redux";

const PermissionWrapperV2 = ({children, tableSlug, type}) => {
  const permissions = useSelector((state) => state.auth.permissions);
  const permissions2 = localStorage.getItem("permissions");
  const computedPermissions = useMemo(() => {
    const parsedPermission = JSON.parse(permissions2);

    return parsedPermission?.reduce((acc, curr) => {
      acc[curr.table_slug] = {
        read: curr.read === "Yes" ? true : false,
        write: curr.write === "Yes" ? true : false,
        update: curr.update === "Yes" ? true : false,
        delete: curr.delete === "Yes" ? true : false,
        pdf_action: curr.pdf_action === "Yes" ? true : false,
        add_field: curr.add_field === "Yes" ? true : false,

        automation: curr.automation === "Yes" ? true : false,
        language_btn: curr.language_btn === "Yes" ? true : false,
        settings: curr.settings === "Yes" ? true : false,
        share_modal: curr.share_modal === "Yes" ? true : false,
        view_create: curr.view_create === "Yes" ? true : false,
        fix_column: curr.fix_column === "Yes" ? true : false,
        columns: curr.columns === "Yes" ? true : false,
        group: curr.group === "Yes" ? true : false,
        excel_menu: curr.excel_menu === "Yes" ? true : false,
        tab_group: curr.tab_group === "Yes" ? true : false,
        add_filter: curr.add_filter === "Yes" ? true : false,
        field_filter: curr.field_filter === "Yes" ? true : false,
        search_button: curr.search_button === "Yes" ? true : false,
      };
      return acc;
    }, {});
  }, [permissions2]);

  const role = useSelector((state) => state.auth.roleInfo);
  if (!tableSlug || role?.name === "DEFAULT ADMIN") return children;

  if (typeof type === "object") {
    if (
      (permissions?.length ? permissions : computedPermissions)?.[tableSlug]?.[
        type[0]
      ] &&
      (permissions?.length ? permissions : computedPermissions)?.[tableSlug]?.[
        type[1]
      ]
    )
      return children;

    return null;
  } else {
    if (
      (permissions?.length ? permissions : computedPermissions)?.[tableSlug]?.[
        type
      ]
    )
      return children;
    return null;
  }
};

export default PermissionWrapperV2;
