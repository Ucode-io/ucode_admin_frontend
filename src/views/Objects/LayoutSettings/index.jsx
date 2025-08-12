import React, {useState} from "react";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import TuneIcon from "@mui/icons-material/Tune";
import DoneIcon from "@mui/icons-material/Done";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ClearIcon from "@mui/icons-material/Clear";
import LayoutSections from "./LayoutSections";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import layoutService from "../../../services/layoutService";
import PageSettings from "../../../components/PageSettings";
import { useDispatch, useSelector } from "react-redux";
import {showAlert} from "../../../store/alert/alert.thunk";
import {Dialog} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useViewContext } from "../../../providers/ViewProvider";
import { FIELD_TYPES } from "../../../utils/constants/fieldTypes";

function LayoutSettings() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    menuId: menuIdParam,
    appId,
    tableSlug: tableSlugParams,
  } = useParams();
  const menuId = menuIdParam || appId;
  const [sectionIndex, setSectionIndex] = useState(null);
  const [selectedSection, setSelectedSection] = useState();
  const [sections, setSections] = useState();
  const selectedRow = state;
  const tableSlug = state?.tableSlug || tableSlugParams;
  const [loader, setLoader] = useState(false);

  const {
    data: { layout } = {
      layout: [],
    },
    refetch: refetchLayout,
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, menuId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
    onSuccess: (data) => {
      setSections(data?.layout?.tabs?.[0]?.sections);
    },
  });

  const updateSectionFields = (newFields) => {
    const updatedSection = sections.map((section, index) =>
      index === sectionIndex ? { ...section, fields: newFields } : section
    );

    setSections(updatedSection);
  };

  const applyAllChanges = () => {
    setLoader(true);
    const updatedTabs = layout.tabs.map((tab, index) =>
      index === 0
        ? {
            ...tab,
            sections: sections,
          }
        : tab
    );

    const currentUpdatedLayout = {
      ...layout,
      tabs: updatedTabs,
    };

    layoutService
      .update(currentUpdatedLayout, tableSlug)
      .then(() => {
        dispatch(showAlert("Layout successfully updated!", "success"));
        if (state?.backLink) {
          navigate(state?.backLink);
        } else {
          navigate(-1);
        }
      })
      .finally(() => setLoader(false));
  };

  return (
    <Box bg={"#F8F8F7"}>
      <Header loader={loader} applyAllChanges={applyAllChanges} state={state} />

      <Flex pl={24}>
        <Box
          boxShadow={"rgba(15, 15, 15, 0.1) 0px 9px 12px 0px"}
          h={"calc(100vh - 60px)"}
          w={"77%"}
          borderRadius={12}
          borderBottomRadius={0}
          bg={"#fff"}
        >
          <LayoutSections
            sections={sections}
            setSections={setSections}
            selectedTab={layout?.tabs?.[0]}
            selectedRow={selectedRow}
            sectionIndex={sectionIndex}
            layout={layout}
            refetchLayout={refetchLayout}
            selectedTabIndex={0}
            tableSlug={tableSlug}
            setSectionIndex={setSectionIndex}
            setSelectedSection={setSelectedSection}
          />
        </Box>

        <Box width={"290px"}>
          <PageSettings
            setSections={setSections}
            updateSectionFields={updateSectionFields}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </Box>
      </Flex>
    </Box>
  );
}

const Header = ({ loader = false, applyAllChanges = () => {}, state = {} }) => {
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  const handleClick = () => setOpenDialog(true);
  const onCloseDialog = () => setOpenDialog(false);

  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} h={60} px={20}>
      <Button
        border={"none"}
        bg={"none"}
        _hover={{
          background: "rgba(55, 53, 47, 0.09)",
        }}
        px={6}
        py={3}
        borderRadius={6}
        cursor={"pointer"}
      >
        <Flex gap={6} alignItems={"center"}>
          <TuneIcon
            style={{ color: "#54524D", height: "18px", width: "18px" }}
          />
          <Text fontSize={14}>Page settings</Text>
        </Flex>
      </Button>

      <Box>
        <Flex justifyContent={"center"} gap={6} alignItems={"center"}>
          <TextSnippetIcon style={{ color: "#787774" }} />
          <Text fontSize={16}>Ucode</Text>
        </Flex>
        <Button
          border={"none"}
          bg={"none"}
          _hover={{
            background: "rgba(55, 53, 47, 0.06)",
          }}
          px={6}
          py={3}
          borderRadius={6}
          cursor={"pointer"}
        >
          <Text fontSize={12} color={"#787774"}>
            Preview: (Layout) Input fields need to be disabled{" "}
          </Text>
        </Button>
      </Box>

      <Flex gap={8}>
        <Button
          onClick={handleClick}
          cursor={"pointer"}
          borderRadius={6}
          border={"none"}
          h={32}
          p={"0 12px 0 10px"}
          fontSize={14}
        >
          <Flex mr={6}>
            <ClearIcon />
          </Flex>
          Cancel
        </Button>
        <Button
          isLoading={loader}
          onClick={applyAllChanges}
          borderRadius={6}
          border={"none"}
          bg={"#2383e2"}
          h={32}
          px={"8px"}
          color={"#fff"}
          cursor={"pointer"}
          fontSize={14}
        >
          <Flex mr={6}>
            <DoneIcon style={{ width: "14px", height: "14px" }} />
          </Flex>
          Apply to all changes
        </Button>
      </Flex>
      <Dialog open={openDialog} onClose={onCloseDialog}>
        <Box w={"400px"} height={"150px"} p={15}>
          <Flex textAlign={"center"} flexDirection={"column"}>
            <Text fontSize={"16px"}>Discard all layout changes?</Text>
          </Flex>

          <Flex
            mt={20}
            w={"100%"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Button
              onClick={() => {
                if (state?.backLink) navigate(state?.backLink);
                else navigate(-1);
                onCloseDialog();
              }}
              fontSize={14}
              borderRadius={6}
              color={"#fff"}
              h={32}
              bg={"#EB5756"}
            >
              Discard
            </Button>
            <Button
              onClick={onCloseDialog}
              borderRadius={6}
              mt={8}
              fontSize={14}
              border="1px solid rgba(55, 53, 47, 0.16)"
              h={32}
            >
              Cancel
            </Button>
          </Flex>
        </Box>
      </Dialog>
    </Flex>
  );
};

export default LayoutSettings;
