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

const mockData = [
  {
    id: "15ce7bb2-0c3c-4c74-b6fd-2f62db771c4a",
    project_id: "f3752975-d396-4baa-a4fc-54c8cd5bd959",
    stage: "upload",
    stage_status: "success",
    input_url:
      "https://cdn-api.ucode.run/ucode/cdbc20f8-3daf-412c-8e4e-2a4452bd999d_hey.mp4",
    output_key: "a19b5742-b26c-4c2e-b460-e625e2d346c3",
    output_path: "movies",
    size_kb: 4755.658,
    max_resolution: "1080p",
    video_duration: 20,
    preparation_duration_seconds: 0.125,
    webhook_retry_count: 7,
    created_at: "Mon, 11 Aug 2025 03:19:53 +0000",
    updated_at: "Mon, 11 Aug 2025 03:22:53 +0000",
  },
  {
    id: "8f209ed8-1362-4014-acb5-39ac11adeaeb",
    project_id: "f3752975-d396-4baa-a4fc-54c8cd5bd959",
    stage: "upload",
    stage_status: "success",
    input_url:
      "https://cdn-api.ucode.run/ucode/cdbc20f8-3daf-412c-8e4e-2a4452bd999d_hey.mp4",
    output_key: "02ccafa1-f64e-4701-ab1e-a2744062e7f5",
    output_path: "movies",
    size_kb: 4755.658,
    max_resolution: "1080p",
    video_duration: 20,
    preparation_duration_seconds: 0.14,
    webhook_retry_count: 11,
    created_at: "Sat, 09 Aug 2025 12:30:24 +0000",
    updated_at: "Sat, 09 Aug 2025 12:39:41 +0000",
  },
  {
    id: "e678b359-ee53-4ce6-95e5-27634c802d9f",
    project_id: "f3752975-d396-4baa-a4fc-54c8cd5bd959",
    stage: "upload",
    stage_status: "success",
    input_url:
      "https://cdn-api.ucode.run/ucode/cdbc20f8-3daf-412c-8e4e-2a4452bd999d_hey.mp4",
    output_key: "a6dfe2c5-ecd6-4019-b6a8-cfe932c1473f",
    output_path: "movies",
    size_kb: 4755.658,
    max_resolution: "1080p",
    video_duration: 20,
    preparation_duration_seconds: 0.153,
    webhook_retry_count: 11,
    created_at: "Sat, 09 Aug 2025 12:24:41 +0000",
    updated_at: "Sat, 09 Aug 2025 12:29:35 +0000",
  },
];

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

  const getTransCode = () => {
    const params = {
      limit: 10,
      order_by_created_at: 1,
      page: page,
    };
    resourceService.getTranscode(params).then((res) => {
      setPipelines(res?.pipelines);
    });
  };

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
            </Box>
          </Box>
        </Stack>

        <Box marginTop="36px">
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
              count={Math.ceil(mockData.length / rowsPerPage)}
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
