import {Box, Flex, Text} from "@chakra-ui/react";
import {formatDate} from "../../../utils/dateFormatter";
import {numberWithSpaces} from "../../../utils/formatNumbers";
import {useTranslation} from "react-i18next";
import MultiSelectVal from "./ElementValueGenerate/MultiSelectVal";
import {Checkbox, Switch} from "@mui/material";
import IconGenerator from "../../../components/IconPicker/IconGenerator";
import LogoDisplay from "../../../components/LogoDisplay";
import {getColumnIcon} from "../../table-redesign/icons";
import IconGeneratorIconjs from "../../../components/IconPicker/IconGeneratorIconjs";

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
            {formatDate(selectedRow?.[field?.slug]) ?? ""}
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
            {numberWithSpaces(selectedRow?.[field?.slug]) ?? ""}
          </Text>
        </Flex>
      );

    case "MULTI_LINE":
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
            {`${(selectedRow?.[field?.slug] ? selectedRow?.[field?.slug] : "")?.slice(0, 30)} ${selectedRow?.[field?.slug]?.length > 30 ? "..." : ""}`}
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

    case "MULTISELECT":
      return (
        <MultiSelectVal
          resize={true}
          field={field}
          value={selectedRow?.[field?.slug]}
        />
      );

    case "LINK":
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
            {`${selectedRow?.[field?.slug]?.slice(0, 30)} ${selectedRow?.[field?.slug]?.length > 30 ? "..." : ""}`}
          </Text>
        </Flex>
      );

    case "FILE":
    case "VIDEO":
    case "MAP":
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
            {`${(selectedRow?.[field?.slug] ? selectedRow?.[field?.slug] : "")?.slice(0, 30)} ${selectedRow?.[field?.slug]?.length > 30 ? "..." : ""}`}
          </Text>
        </Flex>
      );

    case "POLYGON":
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
            {`${selectedRow?.[field?.slug] ? selectedRow?.[field?.slug]?.slice(0, 30) : ""} ${selectedRow?.[field?.slug]?.length > 30 ? "..." : ""}`}
          </Text>
        </Flex>
      );

    case "MULTI_IMAGE":
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
            {`${selectedRow?.[field?.slug]?.length ?? 0} Images`}
          </Text>
        </Flex>
      );

    case "MONEY":
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
            {`${selectedRow?.[field?.slug] ?? ""}`}
          </Text>
        </Flex>
      );

    case "COLOR":
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
              {getFieldLabel(field) ?? ""}
            </Text>
          </Flex>
          <Box
            w={20}
            h={20}
            borderRadius={"50%"}
            background={selectedRow?.[field?.slug] ?? "#eee"}
            color="#000000"></Box>
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
          <Text ml={"-10px"} fontSize={14} color="#000000">
            <Switch disabled checked={selectedRow?.[field?.slug]} />
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

    case "ICON":
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
            {selectedRow?.[field?.slug]?.includes(":") ? (
              <IconGeneratorIconjs icon={selectedRow?.[field?.slug]} />
            ) : (
              <IconGenerator icon={selectedRow?.[field?.slug]} />
            )}
            {/* <IconGenerator icon={selectedRow?.[field?.slug]} /> */}
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
              {selectedRow?.[field?.slug] ? (
                <LogoDisplay url={selectedRow?.[field?.slug]} />
              ) : (
                ""
              )}
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
              {selectedRow?.[field?.slug]
                ? JSON.stringify(selectedRow?.[field?.slug])
                : ""}
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
            {selectedRow?.[field?.slug] || selectedRow?.[field?.slug] || ""}
          </Text>
        </Flex>
      );
  }
};

export default FieldGenerator;
