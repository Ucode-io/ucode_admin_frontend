import { Autocomplete, Popover, TextField } from "@mui/material";
import cls from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import { useState } from "react";
import { paginationActions } from "@/store/pagination/pagination.slice";
import { useDispatch, useSelector } from "react-redux";
import { NButton } from "@/components/NButton";

export const SortPopover = ({
  open,
  anchorEl,
  handleClose,
  fieldsMap,
  setSortedDatas,
  sortedDatas,
  tableSlug,
  handleChangeOrder = () => {},
  orderBy,
  setOrderBy = () => {},
}) => {
  const fieldsIds = Object.keys(fieldsMap);

  const { i18n } = useTranslation();

  const [selectedField, setSelectedField] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const dispatch = useDispatch();

  const { sortValues } = useSelector((state) => state.pagination);

  const firstSortValue = sortValues?.find(
    (item) => item?.tableSlug === tableSlug
  );

  const fieldDefaultValue = {
    label:
      fieldsMap?.[firstSortValue?.field]?.attributes?.[
        `label_${i18n.language}`
      ],
    value: firstSortValue?.field,
  };

  const sortDefaultValue = {
    label: firstSortValue?.order || "Ascending",
    value: firstSortValue?.order || "ASC",
  };

  const handleApply = () => {
    const field = selectedField || firstSortValue?.field;
    const order = selectedSort || firstSortValue?.order || "ASC";

    if (!field) {
      handleClose();
      return;
    }

    handleChangeOrder(!field);
    dispatch(paginationActions.setSortValues({ tableSlug, field, order }));

    setSortedDatas((prev) => {
      let newSortedDatas = [...prev];
      const index = newSortedDatas.findIndex((item) => item.field === field);
      if (index !== -1) {
        newSortedDatas[index].order = order;
      } else {
        newSortedDatas = [
          {
            field: field,
            order,
          },
        ];
      }
      return newSortedDatas;
    });

    handleClose();
  };

  const handleClearSort = () => {
    dispatch(paginationActions.clearSortValues({ tableSlug }));
    setSelectedField(null);
    setSortedDatas([]);
    handleChangeOrder();
    handleClose();
  };

  return (
    <MaterialUIProvider>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        id="sort-popover"
        open={open}
        onClose={(e) => {
          if (!selectedField) {
            handleChangeOrder(!orderBy);
          } else {
            handleChangeOrder(false);
          }
          handleClose(e);
        }}
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
          <div className={cls.sortPopoverBody}>
            <Autocomplete
              className={cls.fieldSelect}
              disablePortal
              disableClearable
              options={fieldsIds?.map((id) => ({
                label: fieldsMap?.[id]?.attributes?.[`label_${i18n.language}`],
                value: id,
              }))}
              defaultValue={fieldDefaultValue?.value ? fieldDefaultValue : null}
              onChange={(e, val) => {
                setSelectedField(val?.value);
              }}
              sx={{
                "& .MuiInputBase-root": {
                  paddingLeft: "0 !important",
                  paddingRight: "0 !important",
                },
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
                { label: "Ascending", value: "ASC" },
                { label: "Descending", value: "DESC" },
              ]}
              disableClearable
              disablePortal
              onChange={(e, val) => {
                setSelectedSort(val?.value);
              }}
              sx={{
                "& .MuiInputBase-root": {
                  paddingLeft: "0 !important",
                  paddingRight: "0 !important",
                },
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
          <div className={cls.sortPopoverFooter}>
            <NButton onClick={handleClearSort}>Clear sort</NButton>
            <NButton primary onClick={handleApply}>
              Apply
            </NButton>
          </div>
        </div>
      </Popover>
    </MaterialUIProvider>
  );
};
