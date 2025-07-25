import {Box, Button, CircularProgress} from "@mui/material";
import React, {useState} from "react";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";
import HFResourceField from "../../../../components/FormElements/HFResourceField";
import {FieldLabel} from "./Form";
import {useQuery} from "react-query";
import resourceService from "../../../../services/resourceService";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TableCard from "../../../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import cls from "./style.module.scss";
import {useDispatch} from "react-redux";
import {showAlert} from "../../../../store/alert/alert.thunk";

function MetabaseContent({settingLan, control, watch = () => {}}) {
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const [loader, setLoader] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
  };
  const {data: dashboards} = useQuery(
    ["GET_OBJECT_LIST"],
    () => {
      return resourceService.metabaseResource({
        username: watch("settings.metabase.username"),
        password: watch("settings.metabase.password"),
      });
    },
    {
      select: (res) => {
        return res?.dashboards ?? [];
      },
    }
  );

  const getPublicUrl = (id) => {
    setLoader(id);
    resourceService
      .metabaseGetUrl({
        dashboard_id: id,
      })
      .then((res) => {
        handleCopy(res?.url);
        dispatch(showAlert("Saved to cliboard!", "success"));
      })
      .finally(() => {
        setLoader(null);
      });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "10px",
        }}>
        <Box sx={{width: "48%"}}>
          <FieldLabel
            children={
              generateLangaugeText(settingLan, i18n?.language, "Link") || "Link"
            }
          />
          <HFResourceField
            isLink={true}
            control={control}
            required
            disabled
            name="settings.metabase.url"
            fullWidth
            inputProps={{
              placeholder: "URL",
            }}
          />
        </Box>
        <Box sx={{width: "48%"}}>
          <FieldLabel
            children={
              generateLangaugeText(settingLan, i18n?.language, "Username") ||
              "Username"
            }
          />
          <HFResourceField
            control={control}
            required
            disabled
            name="settings.metabase.username"
            fullWidth
            inputProps={{
              placeholder: "Username",
            }}
          />
        </Box>
        <Box sx={{width: "48%"}}>
          <FieldLabel
            children={
              generateLangaugeText(settingLan, i18n?.language, "Password") ||
              "Password"
            }
          />
          <HFResourceField
            control={control}
            required
            disabled
            name="settings.metabase.password"
            fullWidth
            inputProps={{
              placeholder: "Password",
            }}
          />
        </Box>
      </Box>

      <Box sx={{padding: "0px", marginTop: "20px"}}>
        <TableCard cardStyles={{padding: "1px"}}>
          <CTable
            disablePagination={true}
            loader={false}
            removableHeight={false}
            count={dashboards?.length}
            page={1}
            dataCount={dashboards?.length}>
            <CTableHead>
              <CTableCell className={cls.tableHeadCell} width={1}>
                №
              </CTableCell>
              <CTableCell className={cls.tableHeadCell} width={0}>
                Name
              </CTableCell>
              <CTableCell className={cls.tableHeadCell} width={1}>
                Copy public URL
              </CTableCell>
            </CTableHead>

            <CTableBody
              loader={false}
              columnsCount={3}
              dataLength={dashboards?.length}>
              {loader ? (
                <CTableRow>
                  <CTableCell
                    colSpan={3}
                    style={{textAlign: "center", padding: "20px 0"}}>
                    <CircularProgress />
                  </CTableCell>
                </CTableRow>
              ) : dashboards?.length === 0 ? (
                <CTableRow>
                  <CTableCell
                    colSpan={3}
                    style={{textAlign: "center", padding: "10px"}}>
                    <CircularProgress />
                  </CTableCell>
                </CTableRow>
              ) : (
                dashboards.map((item, index) => (
                  <CTableRow key={item.id} className={cls.row}>
                    <CTableCell
                      className={cls.tBodyCell}
                      style={{textAlign: "center"}}>
                      {index + 1}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {item?.name}
                    </CTableCell>
                    <CTableCell
                      className={cls.tBodyCell}
                      style={{textAlign: "center"}}>
                      <Button
                        disabled={loader === item?.id}
                        onClick={() => getPublicUrl(item?.id)}>
                        {loader !== item?.id ? (
                          <ContentCopyIcon />
                        ) : (
                          <CircularProgress size={19} />
                        )}
                      </Button>
                    </CTableCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </TableCard>
      </Box>
    </>
  );
}

export default MetabaseContent;
