import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  CTable,
  CTableHead,
  CTableHeadRow,
  CTableCell,
} from "../../../../components/CTable";
import HFSelect from "../../../../components/FormElements/HFSelect";
import GroupCascading from "../../../../components/ElementGenerators/GroupCascading";
import { Controller, useWatch } from "react-hook-form";
const options = [
  {
    label: "Total",
    value: "total",
  },
  {
    label: "Parent",
    value: "parent",
  },
  {
    label: "Last Parent",
    value: "last_parent",
  },
  {
    label: "By field",
    value: "field",
  },
];

const ChartPercentages = ({ form, chart }) => {
  const { tableSlug } = useParams();
  const [value, setValue] = useState();
  return (
    <>
      <CTable
        count={""}
        page={""}
        setCurrentPage={""}
        columnsCount={4}
        loader={false}
        removableHeight={false}
        disablePagination={true}
      >
        <CTableHead>
          <CTableHeadRow>
            <CTableCell>Percent</CTableCell>
            <CTableCell>
              <div>
                <HFSelect
                  fullWidth
                  required
                  value={value}
                  onChange={setValue}
                  control={form.control}
                  options={options}
                  name="options"
                />
              </div>
            </CTableCell>
            {value === "field" && (
              <CTableCell>
                <Controller
                  control={form.control}
                  name="filed_id"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <GroupCascading
                        tableSlug={tableSlug}
                        setValue={onChange}
                        value={value ?? ""}
                      />
                    );
                  }}
                />
              </CTableCell>
            )}
          </CTableHeadRow>
        </CTableHead>
      </CTable>
    </>
  );
};

export default ChartPercentages;
