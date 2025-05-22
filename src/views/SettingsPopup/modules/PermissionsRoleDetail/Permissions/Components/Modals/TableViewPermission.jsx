import ClearIcon from "@mui/icons-material/Clear";
import {Box, Card, Modal, Typography} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";
import TableCard from "../../../../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
} from "../../../../../../../components/CTable";
import FormCheckbox from "../Checkbox/FormCheckbox";
import { useTranslation } from "react-i18next";
import { generateLangaugeText } from "../../../../../../../utils/generateLanguageText";
import cls from "./styles.module.scss";
import { CustomCheckbox } from "../../../../../components/CustomCheckbox";

const TableViewPermission = ({
  closeModal,
  control,
  tableIndex,
  permissionLan,
}) => {
  const basePath = `data.tables.${tableIndex}.table_view_permissions`;
  const { i18n } = useTranslation();
  const { fields } = useFieldArray({
    control,
    name: basePath,
    keyName: "key",
  });

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {generateLangaugeText(
                permissionLan,
                i18n?.language,
                "Tableview permissions"
              )}
            </Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <Box>
            <TableCard withBorder borderRadius="md">
              <CTable
                tableStyle={{
                  height: "auto",
                }}
              >
                <CTableHead>
                  <CTableHeadRow>
                    <CTableCell w={2}>
                      <Box className={cls.headCellBox}>No</Box>
                    </CTableCell>
                    <CTableCell w={250}>
                      <Box className={cls.headCellBox}>
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Label"
                        ) ?? "Label"}
                      </Box>
                    </CTableCell>
                    <CTableCell w={150}>
                      <Box className={cls.headCellBox}>
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "View"
                        ) ?? "View"}
                      </Box>
                    </CTableCell>
                    <CTableCell w={150}>
                      <Box className={cls.headCellBox}>
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Edit"
                        ) ?? "Edit"}
                      </Box>
                    </CTableCell>
                    <CTableCell w={150}>
                      <Box className={cls.headCellBox}>
                        {generateLangaugeText(
                          permissionLan,
                          i18n?.language,
                          "Delete"
                        ) ?? "Delete"}
                      </Box>
                    </CTableCell>
                  </CTableHeadRow>
                </CTableHead>
                <CTableBody columnsCount={3} dataLength={fields?.length}>
                  {fields?.map((field, fieldIndex) => (
                    <CTableHeadRow key={field.guid}>
                      <CTableCell>
                        {console.log(field)}
                        <Box className={cls.bodyCellBox}>{fieldIndex + 1}</Box>
                      </CTableCell>
                      <CTableCell>
                        <Box className={cls.bodyCellBox}>{field.name}</Box>
                      </CTableCell>
                      <CTableCell>
                        <Controller
                          name={`${basePath}.${fieldIndex}.view`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <CustomCheckbox
                              onChange={onChange}
                              checked={value}
                            />
                          )}
                        />
                        {/* <FormCheckbox
                          name={`${basePath}.${fieldIndex}.view`}
                          control={control}
                        /> */}
                      </CTableCell>

                      <CTableCell>
                        <Controller
                          name={`${basePath}.${fieldIndex}.edit`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <CustomCheckbox
                              onChange={onChange}
                              checked={value}
                            />
                          )}
                        />
                        {/* <FormCheckbox
                          name={`${basePath}.${fieldIndex}.edit`}
                          control={control}
                        /> */}
                      </CTableCell>

                      <CTableCell>
                        <Controller
                          name={`${basePath}.${fieldIndex}.delete`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <CustomCheckbox
                              onChange={onChange}
                              checked={value}
                            />
                          )}
                        />
                        {/* <FormCheckbox
                          name={`${basePath}.${fieldIndex}.delete`}
                          control={control}
                        /> */}
                      </CTableCell>
                    </CTableHeadRow>
                  ))}
                </CTableBody>
              </CTable>
            </TableCard>
          </Box>
        </Card>
      </Modal>
    </div>
  );
};

export default TableViewPermission;
