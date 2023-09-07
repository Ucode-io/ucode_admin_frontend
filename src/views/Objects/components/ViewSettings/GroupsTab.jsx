import { Checkbox } from "@mui/material";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { CTable, CTableBody, CTableCell, CTableRow } from "../../../../components/CTable";

const GroupsTab = ({ columns, form, selectedView, updateView, isLoading, updateLoading }) => {
  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  });

  const computedColumns = useMemo(() => {
    return columns?.filter((column) => column.type === "LOOKUP" || column.type === "PICK_LIST" || column.type === "LOOKUPS" || column.type === "MULTISELECT");
  }, [columns]);

  const onCheckboxChange = async (val, id) => {
    const type = form.getValues("type");

    if (type !== "CALENDAR" && type !== "GANTT") {
      return form.setValue("group_fields", val ? [id] : []);
    }

    if (!val) {
      return form.setValue(
        "group_fields",
        selectedColumns.filter((el) => el !== id)
      );
    }

    if (selectedColumns?.length >= 2) return;

    return form.setValue("group_fields", [...selectedColumns, id]);
  };

  const changeHandler = async (val, id) => {
    await onCheckboxChange(val, id);
    updateView();
  };

  return (
    <div>
      <CTable removableHeight={false} disablePagination tableStyle={{ border: "none" }}>
        <CTableBody dataLength={1}>
          {computedColumns.map((column) => (
            <CTableRow key={column.id}>
              <CTableCell>{column.label}</CTableCell>
              <CTableCell style={{ width: 20 }}>
                <Checkbox
                  disabled={isLoading || updateLoading}
                  checked={selectedColumns?.includes(column?.id) || selectedView?.group_fields?.includes(column?.id)}
                  onChange={(e, val) => changeHandler(val, column.id)}
                />
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default GroupsTab;
