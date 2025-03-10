import {Flex, Text} from "@chakra-ui/react";
import {useMemo} from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {useTranslation} from "react-i18next";
import {getColumnIcon} from "../../../table-redesign/icons";

const MultiSelectVal = ({field, value = [], style, resize, ...props}) => {
  const {i18n} = useTranslation();

  const getFieldLabel = (field) => {
    return field?.attributes?.[`label_${i18n?.language}`] ?? field?.label;
  };
  const tags = useMemo(() => {
    if (typeof value === "string" || typeof value === "number")
      return [
        {
          value,
        },
      ];
    if (Array.isArray(value)) {
      return value
        ?.map((tagValue) =>
          field.attributes?.options?.find((option) => option.value === tagValue)
        )
        ?.filter((el) => el);
    }
  }, [value, field?.attributes?.options]);

  const hasColor = field?.attributes?.has_color;
  const hasIcon = field?.attributes?.has_icon;

  if (!value?.length) return "";
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
      {tags?.map((el) => (
        <Flex
          mx={4}
          key={el?.value}
          borderRadius={4}
          px={5}
          py={1}
          color={hasColor ? el.color : "#000"}
          bg={hasColor ? el.color + 33 : "#F5D2D1"}>
          <Text fontSize={14} color="#9B2C2C">
            {el.label ?? el.value}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default MultiSelectVal;
