import { Autocomplete, Popover, TextField } from "@mui/material";
import cls from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import MaterialUIProvider from "../../../../providers/MaterialUIProvider";
import { useState } from "react";
import { paginationActions } from "../../../../store/pagination/pagination.slice";
import { useDispatch, useSelector } from "react-redux";
import { NButton } from "../../../../components/NButton";

export const SortPopover = ({ open, anchorEl, handleClose, fieldsMap, setSortedDatas, sortedDatas, tableSlug }) => {

  const fieldsIds = Object.keys(fieldsMap);

  const { i18n } = useTranslation();

  const [selectedField, setSelectedField] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const dispatch = useDispatch();

  const {sortValues} = useSelector((state) => state.pagination);

  const firstSortvalue = sortValues?.find(item => item?.tableSlug === tableSlug)
  
  const fieldDefaultValue = {
    label: fieldsMap?.[firstSortvalue?.field]?.attributes?.[`label_${i18n.language}`],
    value: firstSortvalue?.field
  }

  const sortDefaultValue =  {
    label: firstSortvalue?.order || "ASC",
    value: firstSortvalue?.order || "ASC"
  }

  const handleApply = () => {
    const field = selectedField || firstSortvalue?.field;
    const order = selectedSort || firstSortvalue?.order || "ASC";

    if(!field) {
      handleClose()
      return
    }

    dispatch(
      paginationActions.setSortValues({tableSlug, field, order})
    );

    setSortedDatas((prev) => {
      let newSortedDatas = [...prev];
      const index = newSortedDatas.findIndex(
        (item) => item.field === field
      );
      if (index !== -1) {
        newSortedDatas[index].order = order
      } else {
        newSortedDatas = [{
          field: field,
          order,
        }]
      }
      return newSortedDatas;
    });

    handleClose()
  }

  return <MaterialUIProvider>
    <Popover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id="sort-popover"
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}
      background="red"
      PaperProps={{
        style: {
          overflowY: "visible",
          overflowX: "visible",
        },
      }}
    >
      <div className={cls.sortPopover}>
        <div className={cls.sortPopoverHeader}>
          <NButton primary onClick={handleApply}>
            Apply
          </NButton>
        </div>
        <div className={cls.sortPopoverBody}>
          <Autocomplete
            className={cls.fieldSelect}
            disablePortal
            disableClearable
            options={fieldsIds?.map(id => ({
              label: fieldsMap?.[id]?.attributes?.[`label_${i18n.language}`],
              value: id
            }))}
            defaultValue={fieldDefaultValue?.value ? fieldDefaultValue : null}
            onChange={(e, val) => {
              setSelectedField(val?.value);
              // const field = val?.value;
              // dispatch(
              //   paginationActions.setSortValues({tableSlug, field, order: selectedSort})
              // );
              // setSortedDatas((prev) => {
              //   let newSortedDatas = [...prev];
              //   const index = newSortedDatas.findIndex(
              //     (item) => item.field === val?.value
              //   );
              //   if (index !== -1) {
              //     newSortedDatas[index].order = selectedSort
              //   } else {
              //     newSortedDatas = [{
              //       field: val?.value,
              //       order: "ASC",
              //     }]
              //   }
              //   return newSortedDatas;
              // });
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                className={cls.fieldSelectTextField}
                {...params}
                placeholder="Select field"
                variant="outlined"
                size="small"
              />
            )}
          />

          <Autocomplete
            className={cls.fieldSelect}
            options={[
              { label: "ASC", value: "ASC" },
              { label: "DESC", value: "DESC" },
            ]}
            onChange={(e, val) => {
              setSelectedSort(val?.value);
              // const field = selectedField;

              // dispatch(
              //   paginationActions.setSortValues({tableSlug, field, order: val?.value})
              // );
              // setSortedDatas((prev) => {
              //   let newSortedDatas = [...prev];
              //   const index = newSortedDatas.findIndex(
              //     (item) => item.field === field
              //   );
              //   if (index !== -1) {
              //     newSortedDatas[index].order = val?.value
              //   } else {
              //     newSortedDatas = [{
              //       field: field,
              //       order: "ASC",
              //     }];
              //   }
              //   return newSortedDatas;
              // })
            }}
            getOptionLabel={(option) => option.label}
            defaultValue={sortDefaultValue}
            renderInput={(params) => (
              <TextField
                className={cls.fieldSelectTextField}
                {...params}
                variant="outlined"
                size="small"
              />
            )}
          />
        </div>
      </div>
    </Popover>
  </MaterialUIProvider>
}
