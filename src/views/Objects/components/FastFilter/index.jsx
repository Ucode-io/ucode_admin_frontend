import {} from "@mui/icons-material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Filter } from "../FilterGenerator";
import styles from "./style.module.scss";

const FastFilter = ({ filters, onChange }) => {
  const { tableSlug } = useParams();

  const columns = useSelector(
    (state) => state.tableColumn.list[tableSlug] ?? []
  );

  const computedFields = useMemo(() => {
    return columns.filter((column) => column.isFilterVisible);
  }, [columns]);

  return (
    <div className={styles.filtersBlock}>
      {computedFields.map((filter) => (
        <div
          className={styles.filter}
          key={filter.id}
          style={{ minWidth: "150px" }}
        >
          <Filter
            field={filter}
            name={filter.slug}
            tableSlug={tableSlug}
            filters={filters}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
};

export default FastFilter;
