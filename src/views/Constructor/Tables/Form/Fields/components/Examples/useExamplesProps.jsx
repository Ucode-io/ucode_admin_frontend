import { Box } from "@mui/material"
import { ExampleBlock, ExampleHeader } from "./ExampleParts"
import { menuIcons } from "../FormulaField/formulaFieldIcons"
import { getColumnIconPath } from "../../../../../../table-redesign/icons"
import { FIELD_TYPES } from "@/utils/constants/fieldTypes"
import cls from "./styles.module.scss"
import { useTranslation } from "react-i18next"

export const useExamplesProps = ({ item }) => {

  const {i18n} = useTranslation()

  const examples = {
    SINGLE_LINE: {
      name: "Single line",
      icon: getColumnIconPath({column: FIELD_TYPES.SINGLE_LINE}),
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <ExampleBlock>
            <Box className={cls.function}>substring</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;0, 5<Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>trim</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>upper</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>lower</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
        </Box>
      </Box>
    },
    MULTI_LINE: {
      name: "Multi line",
      icon: getColumnIconPath({column: FIELD_TYPES.MULTI_LINE}),
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <ExampleBlock>
            <Box className={cls.function}>substring</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;0, 5<Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>trim</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>upper</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>lower</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
        </Box>
      </Box>
    },
    EMAIL: {
      content: <Box>

      </Box>
    },
    INTERNATION_PHONE: {
      content: <Box>

      </Box>
    },
    LOOKUP: {
      name: "Lookup",
      icon: getColumnIconPath({column: FIELD_TYPES.LOOKUP}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>substring</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;0, 5<Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>upper</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>lower</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    TEXT: {
      name: "Text",
      icon: getColumnIconPath({column: FIELD_TYPES.TEXT}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <ExampleBlock>
            <Box className={cls.function}>substring</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;0, 5<Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>trim</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>upper</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
          <ExampleBlock>
            <Box className={cls.function}>lower</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </ExampleBlock>
        </Box>
      </Box>
    },
    LOOKUPS: {
      name: "Lookups",
      icon: getColumnIconPath({column: FIELD_TYPES.LOOKUPS}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.operator}>==</Box>
            <Box className={cls.string}>"Done"</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.punctuation}>[</Box>
            <Box className={cls.string}>"Not started"</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.string}>"In progress"</Box>
            <Box className={cls.punctuation}>]</Box>
            <Box className={cls.punctuation}>.</Box>
            <Box className={cls.function}>includes</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon}{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    MULTISELECT: {
      name: "Multi select",
      icon: getColumnIconPath({column: FIELD_TYPES.MULTISELECT}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <spa className={cls.typeBadge}>
              {
                typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon
              }
              {item?.attributes?.[`label_${i18n.language}`] || item?.label}
            </spa>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.typeBadge}>
              {
                typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon
              }
              {item?.attributes?.[`label_${i18n.language}`] || item?.label}
            </Box>
            <Box className={cls.operator}>
              ==
            </Box>
            <Box className={cls.string}>
              "Done"
            </Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.punctuation}>
              [
            </Box>
            <Box className={cls.string}>
              "Not started"
            </Box>
            <Box className={cls.punctuation}>
              ,
            </Box>
            <Box className={cls.string}>
              "In progress"
            </Box>
            <Box className={cls.punctuation}>
              ]
            </Box>
            <Box className={cls.punctuation}>
              .
            </Box>
            <Box className={cls.function}>
              includes
            </Box>
            <Box className={cls.punctuation}>
              (
            </Box>
            <Box className={cls.punctuation}>
            <Box className={cls.typeBadge}>
              {
                typeof item?.icon === "string" ? <img src={item?.icon} width={11} height={11} alt="" /> : item?.icon
              }
              {item?.attributes?.[`label_${i18n.language}`] || item?.label}
            </Box>
            </Box>
            <Box className={cls.punctuation}>
              )
            </Box>
          </Box>
        </Box>
      </Box>
    },
    STATUS: {
      name: "Status",
      icon: getColumnIconPath({column: FIELD_TYPES.STATUS}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <spa className={cls.typeBadge}>Status</spa>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.typeBadge}>Status</Box>
            <Box className={cls.operator}>
              ==
            </Box>
            <Box className={cls.string}>
              "Done"
            </Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.punctuation}>[</Box>
            <Box className={cls.string}>"Not started"</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.string}>"In progress"</Box>
            <Box className={cls.punctuation}>]</Box>
            <Box className={cls.punctuation}>.</Box>
            <Box className={cls.function}>includes</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>Status</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    NUMBER: {
      name: "Number",
      icon: getColumnIconPath({column: FIELD_TYPES.NUMBER}),
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.typeBadge}>Number</Box>
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.typeBadge}>Number</Box>
          <Box className={cls.punctuation}>.</Box>
          <Box className={cls.function}>length</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    DATE: {
      name: "Date",
      icon: getColumnIconPath({column: FIELD_TYPES.DATE}),
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.operator}>&gt;</Box>
          <Box className={cls.function}>now</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.operator}>&lt;</Box>
          <Box className={cls.function}>now</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>dateBetween</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.function}>now</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"days"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    TIME: {
      name: "Time",
      icon: getColumnIconPath({column: FIELD_TYPES.TIME}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
            <Box className={cls.typeBadge}>Time</Box>
            <Box className={cls.operator}>&gt;</Box>
            <Box className={cls.function}>now</Box>
            <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
            <Box className={cls.function}>dateBetween</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>Time</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.function}>now</Box>
            <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.string}>"minutes"</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    DATE_TIME: {
      name: "Date time",
      icon: getColumnIconPath({column: FIELD_TYPES.DATE_TIME}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
            <Box className={cls.typeBadge}>DateTime</Box>
            <Box className={cls.operator}>&gt;</Box>
            <Box className={cls.function}>now</Box>
            <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
            <Box className={cls.function}>dateBetween</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>DateTime</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.function}>now</Box>
            <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.string}>"hours"</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    DATE_TIME_WITHOUT_TIME_ZONE: {
      name: "Date time (TZ-)",
      icon: getColumnIconPath({column: FIELD_TYPES.DATE_TIME_WITHOUT_TIME_ZONE}),
      suppressHeader: true,
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
            <Box className={cls.typeBadge}>DateTime</Box>
            <Box className={cls.operator}>&gt;</Box>
            <Box className={cls.function}>now</Box>
            <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
            <Box className={cls.function}>dateBetween</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>DateTime</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.function}>now</Box>
            <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
            <Box className={cls.punctuation}>,</Box>
            <Box className={cls.string}>"hours"</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    CHECKBOX: {
      name: "Checkbox",
      icon: getColumnIconPath({column: FIELD_TYPES.CHECKBOX}),
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <p className={cls.fieldTitle}>
          {typeof item?.icon === "string" ? <img src={item?.icon} width={13} height={13} alt="" /> : item?.icon}
          {item?.attributes?.[`label_${i18n.language}`] || item?.label} property
        </p>
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>not</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>if</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;<Box className={cls.string}>"Checked"</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;<Box className={cls.string}>"Unchecked"</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>ifs</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>, <Box className={cls.string}>"Yes"</Box>, true, <Box className={cls.string}>"No"</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    SWITCH: {
      name: "Switch",
      icon: getColumnIconPath({column: FIELD_TYPES.SWITCH}),
      content: <Box display="flex" flexDirection="column" gap="8px" marginTop="8px">
        <p className={cls.fieldTitle}>
          {typeof item?.icon === "string" ? <img src={item?.icon} width={13} height={13} alt="" /> : item?.icon}
          {item?.attributes?.[`label_${i18n.language}`] || item?.label} property
        </p>
        <Box display="flex" flexDirection="column" gap="4px">
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>not</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>if</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;<Box className={cls.string}>"On"</Box>
            <Box className={cls.punctuation}>,</Box>&nbsp;<Box className={cls.string}>"Off"</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
          <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px" >
            <Box className={cls.function}>ifs</Box>
            <Box className={cls.punctuation}>(</Box>
            <Box className={cls.typeBadge}>{item?.attributes?.[`label_${i18n.language}`] || item?.label}</Box>, <Box className={cls.string}>"Enabled"</Box>, true, <Box className={cls.string}>"Disabled"</Box>
            <Box className={cls.punctuation}>)</Box>
          </Box>
        </Box>
      </Box>
    },
    IFS: {
      name: "ifs",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <ExampleBlock>
          <Box className={cls.function}>ifs</Box>
          <Box className={cls.punctuation}>(</Box>
          true, 1, true, 2, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 1
        </ExampleBlock>
        <ExampleBlock>
          <Box className={cls.function}>ifs</Box>
          <Box className={cls.punctuation}>(</Box>
          false, 1, false, 2, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </ExampleBlock>
      </Box>
    },
    IF: {
      name: "if(cond, a, b)",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>if</Box>
          <Box className={cls.punctuation}>(</Box>
          true
          <Box className={cls.punctuation}>,</Box>
          &nbsp;1
          <Box className={cls.punctuation}>,</Box>
          &nbsp;2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 1
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>if</Box>
          <Box className={cls.punctuation}>(</Box>
          false
          <Box className={cls.punctuation}>,</Box>
          &nbsp;1
          <Box className={cls.punctuation}>,</Box>
          &nbsp;2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 2
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.typeBadge}>Checked</Box>
          <Box className={cls.operator}>
            ==
          </Box>
          true
          &nbsp;
          <Box className={cls.punctuation}>?</Box>
          &nbsp;
          <Box className={cls.string}>"Complete"</Box>
          &nbsp;
          <Box className={cls.punctuation}>:</Box>
          &nbsp;
          <Box className={cls.string}>"Incomplete"</Box>
        </Box>
      </Box>
    },
    EMPTY: {
      name: "empty",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>empty</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>""</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>empty</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"abc"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= false
        </Box>
      </Box>
    },
    LENGTH: {
      name: "length",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>length</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 5
        </Box>
      </Box>
    },
    FORMAT: {
      name: "format",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>format</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Price: {0}"</Box>
          <Box className={cls.punctuation}>,</Box>
          &nbsp;10
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"Price: 10"</Box>
        </Box>
      </Box>
    },
    EQUAL: {
      name: "equal",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>equal</Box>
          <Box className={cls.punctuation}>(</Box>
          2, 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    UNEQUAL: {
      name: "unequal",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>unequal</Box>
          <Box className={cls.punctuation}>(</Box>
          2, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= false
        </Box>
      </Box>
    },
    LET: {
      name: "let",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>let</Box>
          <Box className={cls.punctuation}>(</Box>
          x, 2, add(x, 3)
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 5
        </Box>
      </Box>
    },
    LETS: {
      name: "lets",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>lets</Box>
          <Box className={cls.punctuation}>(</Box>
          x, 2, y, 3, add(x, y)
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 5
        </Box>
      </Box>
    },
    TRUE: {
      name: "true",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">true</Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.typeBadge}>Checked</Box>
          <Box className={cls.operator}>==</Box>
          true
        </Box>
      </Box>
    },
    FALSE: {
      name: "false",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">false</Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.typeBadge}>Checked</Box>
          <Box className={cls.operator}>==</Box>
          false
        </Box>
      </Box>
    },
    NOT: {
      name: "not",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>not</Box>
          <Box className={cls.punctuation}>(</Box>
          true
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= false
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>not</Box>
          <Box className={cls.punctuation}>(</Box>
          2&nbsp;
          <Box className={cls.operator}>&gt;</Box>
          &nbsp;3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    AND: {
      name: "and",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>and</Box>
          <Box className={cls.punctuation}>(</Box>
          true, true, true
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>and</Box>
          <Box className={cls.punctuation}>(</Box>
          3&nbsp;<Box className={cls.operator}>&gt;</Box>&nbsp;2, 2&nbsp;<Box className={cls.operator}>&lt;</Box>&nbsp;3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= false
        </Box>
      </Box>
    },
    OR: {
      name: "or",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>or</Box>
          <Box className={cls.punctuation}>(</Box>
          true, false, false
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>or</Box>
          <Box className={cls.punctuation}>(</Box>
          3&nbsp;<Box className={cls.operator}>&gt;</Box>&nbsp;2, 2&nbsp;<Box className={cls.operator}>&lt;</Box>&nbsp;3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    
    DATEADD: {
      name: "dateAdd(date, amount, unit)",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>dateAdd</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>,</Box>
          3, <Box className={cls.string}>"days"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    DATESUBTRACT: {
      name: "dateSubtract(date, amount, unit)",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>dateSubtract</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>,</Box>
          1, <Box className={cls.string}>"month"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    DATEBETWEEN: {
      name: "dateBetween(a, b, unit)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>dateBetween</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.function}>now</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"days"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    DATERANGE: {
      name: "dateRange(start, end)",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>dateRange</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.function}>dateStart</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.function}>dateEnd</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    DATESTART: {
      name: "dateStart(range)",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>dateStart</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"month"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    DATEEND: {
      name: "dateEnd(range)",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>dateEnd</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"week"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    TIMESTAMP: {
      name: "timestamp()",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>timestamp</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.function}>now</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 1690000000
        </Box>
      </Box>
    },
    FROMTIMESTAMP: {
      name: "fromTimestamp(ms)",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>fromTimestamp</Box>
          <Box className={cls.punctuation}>(</Box>
          1690000000
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    FORMATDATE: {
      name: "formatDate(date, pattern, [timezone])",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>formatDate</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"YYYY-MM-DD"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    PARSEDATE: {
      name: "parseDate(isoText)",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>parseDate</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"2024-01-01"</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    NOW: {
      name: "now()",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>now</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    TODAY: {
      name: "today()",
      icon: menuIcons.calendar,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>today</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    AT: {
      name: "at(list, index)",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>at</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3], 1
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 2
        </Box>
      </Box>
    },
    FIRST: {
      name: "first(list)",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>first</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3]
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 1
        </Box>
      </Box>
    },
    LAST: {
      name: "last(list)",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>last</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3]
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    SORT: {
      name: "sort(list, [expr])",
      icon: menuIcons.list,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>sort</Box>
          <Box className={cls.punctuation}>(</Box>
          [3, 1, 2]
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [1, 2, 3]
        </Box>
      </Box>
    },
    SLICE: {
      name: "slice(list, start, [end])",
      icon: menuIcons.list,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>slice</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3, 4], 1, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [2, 3]
        </Box>
      </Box>
    },
    REVERSE: {
      name: "reverse(list)",
      icon: menuIcons.list,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>reverse</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3]
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [3, 2, 1]
        </Box>
      </Box>
    },
    FINDINDEX: {
      name: "findIndex(list, predicate)",
      icon: menuIcons.list,
      content: <Box>

      </Box>
    },
    FILTER: {
      name: "filter(list, predicate)",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>filter</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3], x&nbsp;<Box className={cls.operator}>&gt;</Box>&nbsp;1
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [2, 3]
        </Box>
      </Box>
    },
    TONUMBER: {
      name: "toNumber(text)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>toNumber</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"42"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 42
        </Box>
      </Box>
    },
    ADD: {
      name: "add(a, b)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>add</Box>
          <Box className={cls.punctuation}>(</Box>
          2, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 5
        </Box>
      </Box>
    },
    SUBTRACT: {
      name: "subtract(a, b)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>subtract</Box>
          <Box className={cls.punctuation}>(</Box>
          5, 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    DIVIDE: {
      name: "divide(a, b)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>divide</Box>
          <Box className={cls.punctuation}>(</Box>
          10, 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 5
        </Box>
      </Box>
    },
    MULTIPLE: {
      name: "multiple(a, b)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>multiple</Box>
          <Box className={cls.punctuation}>(</Box>
          2, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 6
        </Box>
      </Box>
    },
    MOD: {
      name: "mod(a, b)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>mod</Box>
          <Box className={cls.punctuation}>(</Box>
          7, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 1
        </Box>
      </Box>
    },
    POW: {
      name: "pow(a, b)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>pow</Box>
          <Box className={cls.punctuation}>(</Box>
          2, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 8
        </Box>
      </Box>
    },
    MIN: {
      name: "min(a, b, ...)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>min</Box>
          <Box className={cls.punctuation}>(</Box>
          1, 3, 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 1
        </Box>
      </Box>
    },
    MAX: {
      name: "max(a, b, ...)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>max</Box>
          <Box className={cls.punctuation}>(</Box>
          1, 3, 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    SUM: {
      name: "sum(a, b, ...)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>sum</Box>
          <Box className={cls.punctuation}>(</Box>
          1, 2, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 6
        </Box>
      </Box>
    },
    MEDIAN: {
      name: "median(a, b, ...)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>median</Box>
          <Box className={cls.punctuation}>(</Box>
          1, 2, 100
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 2
        </Box>
      </Box>
    },
    MEAN: {
      name: "mean(a, b)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>mean</Box>
          <Box className={cls.punctuation}>(</Box>
          2, 4
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    ABS: {
      name: "abs(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>abs</Box>
          <Box className={cls.punctuation}>(</Box>
          -5
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 5
        </Box>
      </Box>
    },
    ROUND: {
      name: "round(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>round</Box>
          <Box className={cls.punctuation}>(</Box>
          2.7
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    CEIL: {
      name: "ceil(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>ceil</Box>
          <Box className={cls.punctuation}>(</Box>
          2.1
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    FLOOR: {
      name: "floor(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>floor</Box>
          <Box className={cls.punctuation}>(</Box>
          2.9
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 2
        </Box>
      </Box>
    },
    SQRT: {
      name: "sqrt(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>sqrt</Box>
          <Box className={cls.punctuation}>(</Box>
          9
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    CBRT: {
      name: "cbrt(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>cbrt</Box>
          <Box className={cls.punctuation}>(</Box>
          27
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    EXP: {
      name: "exp(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>exp</Box>
          <Box className={cls.punctuation}>(</Box>
          1
          <Box className={cls.punctuation}>)</Box>
          &nbsp;≈ 2.718
        </Box>
      </Box>
    },
    LN: {
      name: "ln(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>ln</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.function}>e</Box>
          <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 1
        </Box>
      </Box>
    },
    LOG10: {
      name: "log10(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>log10</Box>
          <Box className={cls.punctuation}>(</Box>
          100
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 2
        </Box>
      </Box>
    },
    LOG2: {
      name: "log2(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>log2</Box>
          <Box className={cls.punctuation}>(</Box>
          8
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
    SIGN: {
      name: "sign(a)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>sign</Box>
          <Box className={cls.punctuation}>(</Box>
          -5
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= -1
        </Box>
      </Box>
    },
    PI: {
      name: "pi()",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>pi</Box>
          <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          &nbsp;≈ 3.14159
        </Box>
      </Box>
    },
    E: {
      name: "e()",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>e</Box>
          <Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          &nbsp;≈ 2.71828
        </Box>
      </Box>
    },
    NAME: {
      name: "name(person)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>name</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Person</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    
    SUBSTRING: {
      name: "substring(text, start, end)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>substring</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>,</Box>
          0, 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"He"</Box>
        </Box>
      </Box>
    },
    CONTAINS: {
      name: "contains(text, search)",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>contains</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"He"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    TEST: {
      name: "test(text, regex)",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>test</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"H.*o"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    MATCH: {
      name: "match(text, regex)",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>match</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"l+"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"ll"</Box>
        </Box>
      </Box>
    },
    REPLACE: {
      name: "replace(text, search, value)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>replace</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"l"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"L"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"HeLlo"</Box>
        </Box>
      </Box>
    },
    REPLACEALL: {
      name: "replaceAll(text, search, value)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>replaceAll</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"l"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"L"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"HeLLo"</Box>
        </Box>
      </Box>
    },
    LOWER: {
      name: "lower(text)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>lower</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"AbC"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"abc"</Box>
        </Box>
      </Box>
    },
    UPPER: {
      name: "upper(text)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>upper</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"abc"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"ABC"</Box>
        </Box>
      </Box>
    },
    TRIM: {
      name: "trim(text)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>trim</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"  a  "</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"a"</Box>
        </Box>
      </Box>
    },
    REPEAT: {
      name: "repeat(text, n)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>repeat</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"a"</Box>, 3
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"aaa"</Box>
        </Box>
      </Box>
    },
    CONCAT: {
      name: "concat(a, b, ...)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>concat</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"Hello"</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>" "</Box>
          <Box className={cls.punctuation}>,</Box>
          <Box className={cls.string}>"World"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"Hello World"</Box>
        </Box>
      </Box>
    },
    JOIN: {
      name: "join(list, sep)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>join</Box>
          <Box className={cls.punctuation}>(</Box>
          [<Box className={cls.string}>"a"</Box>, <Box className={cls.string}>"b"</Box>], <Box className={cls.string}>"-"</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= <Box className={cls.string}>"a-b"</Box>
        </Box>
      </Box>
    },
    SPLIT: {
      name: "split(text, sep)",
      icon: menuIcons.menu,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>split</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.string}>"a,b"</Box>, <Box className={cls.string}>","</Box>
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [<Box className={cls.string}>"a"</Box>, <Box className={cls.string}>"b"</Box>]
        </Box>
      </Box>
    },
    MINUTE: {
      name: "minute(date)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>minute</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.function}>now</Box><Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    HOUR: {
      name: "hour(date)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>hour</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.function}>now</Box><Box className={cls.punctuation}>(</Box><Box className={cls.punctuation}>)</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    DAY: {
      name: "day(date)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>day</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    
    WEEK: {
      name: "week(date)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>week</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    MONTH: {
      name: "month(date)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>month</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    YEAR: {
      name: "year(date)",
      icon: menuIcons.hash,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>year</Box>
          <Box className={cls.punctuation}>(</Box>
          <Box className={cls.typeBadge}>Date</Box>
          <Box className={cls.punctuation}>)</Box>
        </Box>
      </Box>
    },
    
    UNIQUE: {
      name: "unique(list)",
      icon: menuIcons.list,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>unique</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 1, 2]
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [1, 2]
        </Box>
      </Box>
    },
    INCLUDES: {
      name: "includes(list, value)",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>includes</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3], 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    SOME: {
      name: "some(list, predicate)",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>some</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3], x&nbsp;<Box className={cls.operator}>&gt;</Box>&nbsp;2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    EVERY: {
      name: "every(list, predicate)",
      icon: menuIcons.checkbox,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>every</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3], x&nbsp;<Box className={cls.operator}>&gt;</Box>&nbsp;0
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= true
        </Box>
      </Box>
    },
    MAP: {
      name: "map(list, expr)",
      icon: menuIcons.list,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>map</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2], x * 2
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [2, 4]
        </Box>
      </Box>
    },
    FLAT: {
      name: "flat(list)",
      icon: menuIcons.list,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>flat</Box>
          <Box className={cls.punctuation}>(</Box>
          [[1], [2]]
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= [1, 2]
        </Box>
      </Box>
    },
    COUNT: {
      name: "count(list)",
      icon: menuIcons.formula,
      content: <Box display="flex" flexDirection="column" gap="4px" marginTop="8px">
        <Box className={cls.exampleWrapper} border="1px solid rgba(84, 72, 49, 0.08)" borderRadius="5px" fontSize="11px" padding="6px">
          <Box className={cls.function}>count</Box>
          <Box className={cls.punctuation}>(</Box>
          [1, 2, 3]
          <Box className={cls.punctuation}>)</Box>
          &nbsp;= 3
        </Box>
      </Box>
    },
  }

  
  return {
    examples,
  }
}
