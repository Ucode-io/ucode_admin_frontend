import { Center, Icon, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import { CTableCell, CTableHeadRow } from "../../../../../components/CTable";
import PermissionCheckbox from "./Components/PermissionCheckbox";
import FormCheckbox from "./Components/Checkbox/FormCheckbox";

const TableRow = ({ table, tableIndex, control }) => {
  const [type, setType] = useState("");

  const basePath = `data.tables.${tableIndex}.record_permissions`;

  return (
    <>
      <CTableHeadRow>
        <CTableCell>{table.label}</CTableCell>
        <CTableCell>
          <Center>
            <PermissionCheckbox control={control} name={basePath + ".read"} />
            <RectangleIconButton
              size="small"
              onClick={() => {
                setType("read");
              }}
            >
              <Icon as={FiFilter} w={"18px"} h={"18px"} />
            </RectangleIconButton>
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <PermissionCheckbox control={control} name={basePath + ".write"} />
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <PermissionCheckbox control={control} name={basePath + ".update"} />
            <RectangleIconButton
              onClick={() => {
                setType("update");
              }}
            >
              <Icon as={FiFilter} w={"18px"} h={"18px"} />
            </RectangleIconButton>
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <PermissionCheckbox control={control} name={basePath + ".delete"} />
            <RectangleIconButton
              onClick={() => {
                setType("delete");
              }}
            >
              <Icon as={FiFilter} w={"18px"} h={"18px"} />
            </RectangleIconButton>
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <FormCheckbox control={control} name={basePath + ".is_public"} />
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <RectangleIconButton size="lg">
              {/* <FieldPermissionIcon w={"34px"} h={"34px"} /> */}
            </RectangleIconButton>
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <RectangleIconButton size="lg">
              {/* <ActionPermissionIcon w={"34px"} h={"34px"} /> */}
            </RectangleIconButton>
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <RectangleIconButton size="lg">
              {/* <RelationPermissionIcon w={"34px"} h={"34px"} /> */}
            </RectangleIconButton>
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <RectangleIconButton size="lg">
              {/* <BiTable width={"34px"} height={"34px"} /> */}
            </RectangleIconButton>
          </Center>
        </CTableCell>
        <CTableCell>
          <Center>
            <RectangleIconButton size="lg">
              {/* <MdDashboardCustomize width={"34px"} height={"34px"} /> */}
            </RectangleIconButton>
          </Center>
        </CTableCell>
      </CTableHeadRow>
    </>
  );
};

export default TableRow;
