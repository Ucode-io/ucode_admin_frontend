import {Box, Pagination, Stack} from "@mui/material";
import React, {useEffect, useState} from "react";
import {FieldLabel} from "./Form";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import HFTextField from "../../../../components/FormElements/HFTextField";
import {useTranslation} from "react-i18next";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import cls from "./style.module.scss";
import {
  EditOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ClockCircleTwoTone,
  RightCircleOutlined,
} from "@ant-design/icons";
import {Text} from "@chakra-ui/react";
import {Tag} from "antd";
import resourceService from "../../../../services/resourceService";
import HFSelect from "../../../../components/FormElements/HFSelect";
import {resourceTypes} from "../../../../utils/resourceConstants";
import {useWatch} from "react-hook-form";
import YDateFilter from "../../../table-redesign/FilterGenerator/YDateFilter";
import {ArrowUpOutlined, ArrowDownOutlined} from "@ant-design/icons";

function TransCoder({
  control,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
  settingLan,
  watch = () => {},
  setValue = () => {},
}) {
  const {i18n} = useTranslation();
  const [pipelines, setPipelines] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [orderBy, setOrderBy] = useState("");

  const getTransCode = (date) => {
    console.log("dateeeeee", date);
    const params = {
      limit: 10,
      order_by_created_at: 1,
      page: page,
      from_date: date?.$gte,
      to_date: date?.$lt,
      ...(orderBy && {order_by: orderBy}),
    };
    resourceService.getTranscode(params).then((res) => {
      setPipelines(res?.pipelines);
    });
  };

  const resurceType = useWatch({
    control,
    name: "resource_type",
  });

  useEffect(() => {
    getTransCode();
  }, []);

  return (
    <Box
      flex={1}
      sx={{borderRight: "1px solid #e5e9eb", height: `calc(100vh - 200px)`}}>
      <Box
        style={{
          overflow: "auto",
        }}>
        <Stack spacing={4}>
          <Box
            sx={{
              padding: "15px",
              fontWeight: "bold",
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "nowrap",
                justifyContent: "space-between",
              }}>
              <Box sx={{width: "48%"}}>
                <FieldLabel
                  children={
                    generateLangaugeText(settingLan, i18n?.language, "Name") ||
                    "Name"
                  }
                />
                <HFTextField
                  control={control}
                  required
                  name="name"
                  fullWidth
                  inputProps={{
                    placeholder: "Resource name",
                  }}
                />
              </Box>

              <Box sx={{width: "48%"}}>
                <FieldLabel
                  children={
                    generateLangaugeText(settingLan, i18n?.language, "Type") ||
                    "Type"
                  }
                />
                <HFSelect
                  options={resourceTypes}
                  control={control}
                  required
                  name="resource_type"
                  resurceType={resurceType}
                  disabled={isEditPage}
                />
              </Box>
            </Box>
          </Box>
        </Stack>

        <Box marginTop="36px">
          <Box
            ml={"auto"}
            mr={"10px"}
            mb={"10px"}
            display={"flex"}
            alignItems={"center"}
            gap={"10px"}
            width={"50%"}>
            <YDateFilter
              onChange={getTransCode}
              field={{
                label: "Date",
              }}
              placeholder={"Date"}
              value={new Date()}
              name={"from_date"}
            />

            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #e5e9eb",
                borderRadius: "8px",
                padding: "2px 6px",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => {
                setOrderBy(orderBy === 1 ? -1 : 1);
                getTransCode();
              }}>
              {orderBy === 1 ? (
                <>
                  <ArrowUpOutlined style={{marginRight: 6, color: "#1890ff"}} />
                  ASC
                </>
              ) : (
                <>
                  <ArrowDownOutlined
                    style={{marginRight: 6, color: "#1890ff"}}
                  />
                  DESC
                </>
              )}
            </Box>
          </Box>
          <CTable loader={false} disablePagination removableHeight={false}>
            <CTableHead>
              <CTableCell className={cls.tableHeadCell} width={15}>
                №
              </CTableCell>
              <CTableCell className={cls.tableHeadCell}>Status</CTableCell>
              <CTableCell className={cls.tableHeadCell}>Video Key</CTableCell>
              <CTableCell className={cls.tableHeadCell}>Stages</CTableCell>
              <CTableCell className={cls.tableHeadCell}>Size</CTableCell>
            </CTableHead>

            <CTableBody loader={false} columnsCount={4} dataLength={2}>
              {pipelines?.map((element, index) => (
                <CTableRow
                  //   onClick={() => navigateToForm(element?.id)}
                  key={element.id}>
                  <CTableCell>
                    {(page - 1) * rowsPerPage + index + 1}
                  </CTableCell>
                  <CTableCell width={20} className={cls.tBodyCell}>
                    {element?.stage_status === `fail` ? (
                      <Tag
                        style={{
                          fontSize: `12px`,
                          padding: `4px 5px`,
                          textAlign: `center`,
                          minWidth: `110px`,
                        }}
                        icon={<CloseCircleOutlined />}
                        color="error">
                        error
                      </Tag>
                    ) : element?.stage !== `upload` ? (
                      <Tag
                        style={{
                          fontSize: `12px`,
                          padding: `4px 5px`,
                          textAlign: `center`,
                          minWidth: `110px`,
                        }}
                        icon={<SyncOutlined spin />}
                        color="processing">
                        processing
                      </Tag>
                    ) : (
                      <Tag
                        style={{
                          fontSize: `14px`,
                          padding: `4px 5px`,
                          textAlign: `center`,
                          minWidth: `110px`,
                        }}
                        icon={<CheckCircleOutlined />}
                        color="success">
                        success
                      </Tag>
                    )}
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    <Text style={{fontSize: "12px", color: "#1a3353"}}>
                      {element?.output_key}
                    </Text>
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    <Text style={{fontSize: "16px", color: "#52c41a"}}>
                      {element?.stage === `initial` ? (
                        element?.stage_status === `pending` ? (
                          <>
                            <ClockCircleTwoTone />-
                          </>
                        ) : element?.stage_status === `succes` ? (
                          <>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />-
                          </>
                        ) : (
                          <>
                            <CloseCircleTwoTone twoToneColor="#ff4d4f" />-
                          </>
                        )
                      ) : (
                        <>
                          <CheckCircleTwoTone twoToneColor="#52c41a" />-
                        </>
                      )}

                      {element?.stage === `preparation` ? (
                        element?.stage_status === `pending` ? (
                          <>
                            <ClockCircleTwoTone />-
                          </>
                        ) : element?.stage_status === `succes` ? (
                          <>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />-
                          </>
                        ) : (
                          <>
                            <CloseCircleTwoTone twoToneColor="#ff4d4f" />-
                          </>
                        )
                      ) : element?.stage === `initial` ? (
                        <>
                          <RightCircleOutlined />-
                        </>
                      ) : (
                        <>
                          <CheckCircleTwoTone twoToneColor="#52c41a" />-
                        </>
                      )}

                      {element?.stage === `transcode` ? (
                        element?.stage_status === `pending` ? (
                          <>
                            <ClockCircleTwoTone />-
                          </>
                        ) : element?.stage_status === `succes` ? (
                          <>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />-
                          </>
                        ) : (
                          <>
                            <CloseCircleTwoTone twoToneColor="#ff4d4f" />-
                          </>
                        )
                      ) : element?.stage === `initial` ||
                        element?.stage === `preparation` ? (
                        <>
                          <RightCircleOutlined />-
                        </>
                      ) : (
                        <>
                          <CheckCircleTwoTone twoToneColor="#52c41a" />-
                        </>
                      )}

                      {element?.stage === `upload` ? (
                        element?.stage_status === `pending` ? (
                          <>
                            <ClockCircleTwoTone />
                          </>
                        ) : element?.stage_status === `success` ? (
                          <>
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                          </>
                        ) : (
                          <>
                            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                          </>
                        )
                      ) : element?.stage === `initial` ||
                        element?.stage === `transcode` ||
                        element?.stage === `preparation` ? (
                        <>
                          <RightCircleOutlined />
                        </>
                      ) : (
                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                      )}
                    </Text>
                  </CTableCell>
                  <CTableCell className={cls.tBodyCell}>
                    {Math.floor((element?.size_kb / 1000) * 100) / 100} mb
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            margin={"5px"}>
            <Pagination
              count={Math.ceil(pipelines?.length / rowsPerPage)}
              page={page}
              onChange={(event, value) => {
                getTransCode();
                setPage(value);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TransCoder;
