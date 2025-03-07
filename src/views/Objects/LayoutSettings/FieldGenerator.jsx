import {Flex, Text} from "@chakra-ui/react";
import {formatDate} from "../../../utils/dateFormatter";
import {numberWithSpaces} from "../../../utils/formatNumbers";
import {useTranslation} from "react-i18next";
import MultiSelectVal from "./ElementValueGenerate/MultiSelectVal";
import {Checkbox, Switch} from "@mui/material";
import IconGenerator from "../../../components/IconPicker/IconGenerator";
import LogoDisplay from "../../../components/LogoDisplay";
import {getColumnIcon} from "../../table-redesign/icons";

const FieldGenerator = ({field, selectedRow}) => {
  const {i18n} = useTranslation();

  const getFieldLabel = (field) => {
    return field?.attributes?.[`label_${i18n?.language}`] ?? field?.label;
  };

  switch (field.type) {
    case "DATE":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            {formatDate(selectedRow?.[field?.slug])}
          </Text>
        </Flex>
      );

    case "NUMBER":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            {numberWithSpaces(selectedRow?.[field?.slug])}
            {/* February 19, 2025 */}
          </Text>
        </Flex>
      );

    case "PASSWORD":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            **************
          </Text>
        </Flex>
      );

    case "DATE_TIME":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex
            w={170}
            borderRight="1px solid #E0E0E0"
            h={8}
            alignItems="center"
            gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            {formatDate(selectedRow?.[field?.slug], "DATE_TIME")}
          </Text>
        </Flex>
      );

    // case "FORMULA":
    //   return <span className="text-nowrap">{value ?? 0}</span>;

    case "MULTISELECT":
      return (
        <MultiSelectVal
          resize={true}
          field={field}
          value={selectedRow?.[field?.slug]}
        />
      );

    case "MULTI_LINE":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex
            w={170}
            borderRight="1px solid #E0E0E0"
            h={8}
            alignItems="center"
            gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            <span
              dangerouslySetInnerHTML={{
                __html: selectedRow?.[field?.slug],
              }}></span>
          </Text>
        </Flex>
      );

    case "CHECKBOX":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            <Checkbox
              sx={{width: "12px"}}
              disabled
              checked={selectedRow?.[field?.slug]}
            />
          </Text>
        </Flex>
      );

    case "SWITCH":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            <Switch disabled isChecked={selectedRow?.[field?.slug]} />
          </Text>
        </Flex>
      );

    case "DYNAMIC":
      return null;

    case "FORMULA":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            {selectedRow?.[field?.slug]
              ? numberWithSpaces(selectedRow?.[field?.slug])
              : ""}
          </Text>
        </Flex>
      );

    // case "FORMULA_FRONTEND":
    //   return <FormulaCell field={field} row={row} />;

    case "ICO":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            <IconGenerator icon={selectedRow?.[field?.slug]} />
          </Text>
        </Flex>
      );

    case "PHOTO":
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <LogoDisplay url={selectedRow?.[field?.slug]} />
            </span>
          </Text>
        </Flex>
      );

    default:
      if (typeof selectedRow?.[field?.slug] === "object")
        return (
          <Flex h={32} alignItems="center" mt={3}>
            <Flex w={170} h={8} alignItems="center" gap={2}>
              {getColumnIcon({
                column: {
                  type: field?.type,
                  table_slug: field?.table_slug,
                },
              })}
              <Text color="#787773" fontSize={14}>
                {getFieldLabel(field)}
              </Text>
            </Flex>
            <Text fontSize={14} color="#000000">
              {JSON.stringify(selectedRow?.[field?.slug])}
              {/* February 19, 2025 */}
            </Text>
          </Flex>
        );
      return (
        <Flex h={32} alignItems="center" mt={3}>
          <Flex w={170} h={8} alignItems="center" gap={2}>
            {getColumnIcon({
              column: {
                type: field?.type,
                table_slug: field?.table_slug,
              },
            })}
            <Text color="#787773" fontSize={14}>
              {getFieldLabel(field)}
            </Text>
          </Flex>
          <Text fontSize={14} color="#000000">
            {selectedRow?.[field?.slug] || selectedRow?.[field?.slug]}
            {/* February 19, 2025 */}
          </Text>
        </Flex>
      );
  }

  //   <Flex h={32} alignItems="center">
  //          <Flex
  //             w={170}
  //             borderRight="1px solid #E0E0E0"
  //             h={8}
  //             alignItems="center"
  //             gap={4}>
  //             <AutorenewIcon style={{color: "#787773"}} />
  //             <Text color="#787773" fontSize={14}>
  //               Status
  //             </Text>
  //           </Flex>
  //           <Flex
  //             px={10}
  //             borderRadius={12}
  //             alignItems="center"
  //             gap={5}
  //             bg="#F8E6BA">
  //             <Box w={8} h={8} borderRadius={"50%"} bg={"#C99032"}></Box>
  //             <Text fontSize={14} color="#402C1C">
  //               In sprint
  //             </Text>
  //           </Flex>
  //         </Flex>
};

export default FieldGenerator;
