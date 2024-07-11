import React from "react";
import styles from "./style.module.scss";
import CSelect from "../../../../components/CSelect";
import {Pagination, PaginationItem, Stack} from "@mui/material";

function CPagination({paginiation = 0, limit = 10, setLimit = () => {}}) {
  const options = [
    {value: "all", label: "All"},
    {value: 10, label: 10},
    {value: 15, label: 15},
    {value: 20, label: 20},
    {value: 25, label: 25},
    {value: 30, label: 30},
    {value: 35, label: 35},
    {value: 40, label: 40},
  ];

  const getLimitValue = (item) => {
    setLimit(item);
    // dispatch(
    //   paginationActions.setTablePages({
    //     tableSlug: tableSlug,
    //     pageLimit: item,
    //   })
    // );
  };
  return (
    <div className={styles.tableFooter}>
      <div className={styles.selectLimit}>
        <p> Показать по</p>
        <div className={styles.limitSide}>
          <CSelect
            options={options}
            disabledHelperText
            size="small"
            value={limit}
            onChange={(e) => getLimitValue(e.target.value)}
            inputProps={{style: {borderRadius: 50}}}
            endAdornment={null}
            sx={null}
          />
        </div>
      </div>

      <div className={styles.cpagination}>
        <Stack spacing={2}>
          <Pagination
            count={10}
            shape="rounded"
            renderItem={(item) => {
              if (item?.type === "previous") {
                return (
                  <button className={styles.paginationBtn} {...item}>
                    Previous
                  </button>
                );
              } else if (item?.type === "next") {
                return (
                  <button className={styles.paginationBtn} {...item}>
                    Next
                  </button>
                );
              } else {
                return <PaginationItem {...item} />;
              }
            }}
          />
        </Stack>
      </div>
    </div>
  );
}

export default CPagination;
