import { getColumnIcon } from "@/utils/constants/tableIcons";
import { Box, Flex, IconButton, Image } from "@chakra-ui/react";
import { Menu } from "@mui/material";
import { useThProps } from "./useThProps";

export const Th = ({
  tableSlug,
  columns,
  column,
  tableSettings,
  tableSize,
  pageName,
  relationAction,
  isRelationTable,
  getAllData,
  setFieldCreateAnchor,
  setFieldData,
}) => {
  const {
    queryClient,
    position,
    left,
    bg,
    zIndex,
    label,
    minWidth,
    width,
    formulaTypes,
    handleAddSummary,
    handleSummaryClose,
    summaryIsOpen,
    permissions,
    summaryOpen,
  } = useThProps({
    getAllData,
    column,
    relationAction,
    isRelationTable,
    tableSettings,
    pageName,
    columns,
    tableSize,
  });

  return (
    <Box
      as="th"
      id={column.id}
      className="th"
      py="2px"
      px="12px"
      borderRight="1px solid #EAECF0"
      color="#475467"
      fontWeight={500}
      fontSize={12}
      minW={minWidth}
      w={width}
      position={position}
      left={left}
      bg={bg}
      zIndex={zIndex}
    >
      <Flex
        alignItems="center"
        columnGap="8px"
        whiteSpace="nowrap"
        minW="max-content"
      >
        {getColumnIcon({ column })}
        {label}
        {permissions?.field_filter && (
          <IconButton
            aria-label="more"
            icon={
              <Image
                src="/img/chevron-down.svg"
                alt="more"
                style={{ minWidth: 20 }}
              />
            }
            variant="ghost"
            colorScheme="gray"
            ml="auto"
            onClick={(e) => {
              setFieldCreateAnchor(e.currentTarget);
              setFieldData(column);
              if (column?.attributes?.relation_data?.id) {
                queryClient.refetchQueries([
                  "RELATION_GET_BY_ID",
                  { tableSlug, id: column?.attributes?.relation_data?.id },
                ]);
              }
            }}
            size="xs"
          />
        )}
      </Flex>

      <Menu
        anchorEl={summaryOpen}
        open={summaryIsOpen}
        onClose={handleSummaryClose}
        anchorOrigin={{ horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            marginLeft: "10px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {formulaTypes?.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleAddSummary(item, "add");
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
                className="subMenuItem"
              >
                <span
                  style={{
                    marginRight: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  {item.icon}
                </span>
                {item?.label}
              </div>
            </div>
          ))}
        </div>
      </Menu>
    </Box>
  );
};
