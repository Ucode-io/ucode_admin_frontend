import {Delete} from "@mui/icons-material";
import {Box, Pagination} from "@mui/material";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";
import FiltersBlock from "../../../components/FiltersBlock";
import HeaderSettings from "../../../components/HeaderSettings";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../../components/SearchInput";
import TableCard from "../../../components/TableCard";
import TableRowButton from "../../../components/TableRowButton";
import useDebounce from "../../../hooks/useDebounce";
import microfrontendService from "../../../services/microfrontendService";
import StatusPipeline from "./StatusPipeline";
import {useTranslation} from "react-i18next";
import {getAllFromDB} from "../../../utils/languageDB";
import {generateLangaugeText} from "../../../utils/generateLanguageText";

const MicrofrontendPage = () => {
  const navigate = useNavigate();
  const {appId} = useParams();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [debounceValue, setDebouncedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const {i18n} = useTranslation();
  const [microLan, setMicroLan] = useState(null);

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const deleteTable = (id) => {
    microfrontendService.delete(id).then(() => {
      getMicrofrontendList();
    });
  };

  const getMicrofrontendList = () => {
    microfrontendService
      .getList({
        search: debounceValue,
        offset: currentPage * 10,
      })
      .then((res) => {
        setList(res);
      });
  };

  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  useEffect(() => {
    getMicrofrontendList();
  }, [debounceValue, currentPage]);

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setMicroLan(formattedData?.find((item) => item?.key === "Setting"));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <HeaderSettings
        title={
          generateLangaugeText(microLan, i18n?.language, "Microfrontend") ||
          "Microfrontend"
        }
        backButtonLink={-1}
      />

      <FiltersBlock>
        <div className="p-1">
          <SearchInput onChange={inputChangeHandler} />
        </div>
      </FiltersBlock>

      <TableCard type={"withoutPadding"}>
        <CTable
          tableStyle={{
            borderRadius: "0px",
            border: "none",
          }}
          disablePagination
          removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Name") || "Name"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Status") ||
                "Status"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Description") ||
                "Description"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(microLan, i18n?.language, "Link") || "Link"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(
                microLan,
                i18n?.language,
                "Framework type"
              ) || "Framework type"}
            </CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={loader}
            columnsCount={4}
            dataLength={list?.functions?.length}>
            {list?.functions?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}>
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>
                  <StatusPipeline element={element} />
                </CTableCell>
                <CTableCell>{element?.description}</CTableCell>
                <CTableCell>{element?.path}</CTableCell>
                <CTableCell>{element?.framework_type}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteTable(element.id)}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={7} onClick={navigateToCreateForm} />
              {/*<TableRowButton colSpan={5} onClick={navigateToGithub} title="Подключить из GitHub" />*/}
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>

      <Box
        sx={{
          height: "50px",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          borderTop: "1px solid #eee",
          paddingRight: "30px",
        }}
        color="primary">
        <Box>
          <Pagination
            count={Math.ceil(list?.count / 10)}
            onChange={(e, val) => setCurrentPage(val - 1)}
          />
        </Box>
      </Box>
    </div>
  );
};

export default MicrofrontendPage;
