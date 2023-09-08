import { Switch } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../../utils/applyDrag";
import styles from "./style.module.scss";

const ColumnsTab = ({ form, updateView, isMenu }) => {
  const { fields: columns, move } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  const watchedColumns = useWatch({
    control: form.control,
    name: "columns",
  });

  const onDrop = async (dropResult) => {
    const result = applyDrag(columns, dropResult);
    if (result) {
      await move(dropResult.removedIndex, dropResult.addedIndex);
    }
  };

  const isAllChecked = useMemo(() => {
    return watchedColumns?.every((column) => column.is_checked);
  }, [watchedColumns]);

  const onAllChecked = (_, val) => {
    const columns = form.getValues("columns");

    columns?.forEach((column, index) => {
      form.setValue(`columns[${index}].is_checked`, val);
    });

    if (isMenu) {
      updateView();
    }
  };

  useEffect(() => {
    if (isMenu) {
      updateView();
    }
  }, [watchedColumns]);

  return (
    <div>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.cell} style={{ flex: 1 }}>
            <b>All</b>
          </div>
          <div className={styles.cell} style={{ width: 70 }}>
            {/* <Button variant="outlined" disabled={false} onClick={onAllChecked} color="success">Show All</Button>
            <Button variant="outlined" color="error">Hide All</Button> */}
            <Switch size="small" checked={isAllChecked} onChange={onAllChecked} />
          </div>
        </div>
        <Container onDrop={onDrop} dropPlaceholder={{ className: "drag-row-drop-preview" }}>
          {columns.map((column, index) => (
            <Draggable key={column.id}>
              <div key={column.id} className={styles.row}>
                <div className={styles.cell} style={{ flex: 1 }}>
                  {column.label}
                </div>
                <div className={styles.cell} style={{ width: 70 }}>
                  <Switch
                    size="small"
                    checked={form.watch(`columns.${index}.is_checked`)}
                    onChange={(e) => {
                      form.setValue(`columns.${index}.is_checked`, e.target.checked);
                      // updateView();
                    }}
                  />
                </div>
              </div>
            </Draggable>
          ))}
        </Container>
      </div>
    </div>
  );
};

export default ColumnsTab;
