import { useViewContext } from "@/providers/ViewProvider";
import { useGetObjectList } from "@/services/objectService/object.service";
import constructorTableService from "@/services/tableService/table.service";
import { constructorTableActions } from "@/store/constructorTable/constructorTable.slice";
import { useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const useLayoutPopupProps = ({ onClose, control, mainForm, open }) => {

  const { i18n, t } = useTranslation();

  const dispatch = useDispatch();

  const languages = useSelector((state) => state.languages.list);

  const { tableSlug, authInfo } = useViewContext();

  const [btnLoader, setBtnLoader] = useState(false);
  const projectId = useSelector((state) => state.auth.projectId);

  
  const params = {
    language_setting: i18n?.language,
  };

  const handleClose = () => {
    onClose();
  };

  const updateConstructorTable = (data) => {
    setBtnLoader(true);
    const updateTableData = constructorTableService.update(data, projectId);

    Promise.all([updateTableData])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data));
        handleClose();
        setBtnLoader(false);
      })
      .catch(() => setBtnLoader(false));
  };

  const onSubmit = async (data) => {
    const computedData = {
      ...data,
      id: data?.id,
      show_in_menu: true,
    };

    if (data?.id) {
      updateConstructorTable(computedData);
    }
  };

  const tableName =
    mainForm?.watch(`attributes.label_${i18n.language}`) ||
    mainForm?.watch(`label`);

  const loginTable = useWatch({
    control,
    name: "is_login_table",
  });

  const login = useWatch({
    control,
    name: "attributes.auth_info.login",
  });

  const { data: computedTableFields } = useGetObjectList(
    {
      tableSlug,
      data: {
        data: {}
      },
      params
    },
    {
      enabled: Boolean(tableSlug && open),
      select: (res) => {
        return res?.data?.fields ?? [];
      },
    }
  );

  const loginRequired = useMemo(() => {
    if (login) {
      return true;
    } else {
      return false;
    }
  }, [login]);

  const computedLoginFields = useMemo(() => {
    return computedTableFields?.map((item) => ({
      label:
        item?.type === "LOOKUP" || item?.type === "LOOKUPS"
          ? item?.attributes?.[`label_${i18n?.language}`] ||
            item?.attributes?.[`label_to_${i18n?.language}`] ||
            item?.label
          : item?.attributes?.[`label_${i18n?.language}`] || item?.label,
      value: item?.slug ?? "",
    }));
  }, [computedTableFields]);

  return {
    languages,
    btnLoader,
    onSubmit,
    tableName,
    loginTable,
    loginRequired,
    computedLoginFields,
    t,
    i18n,
    handleClose,
    authInfo,
  }
}
