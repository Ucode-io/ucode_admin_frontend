import cls from "./styles.module.scss";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Switch,
} from "@chakra-ui/react";
import { useBoardSubGroupProps } from "./useBoardSubGroupProps";
import { getColumnIcon } from "../../icons";

export const SubGroup = ({
  onBackClick,
  title,
  view,
  fieldsMap,
  viewUpdateMutation,
}) => {
  const { handleUpdateSubGroup, search, setSearch, renderFields } =
    useBoardSubGroupProps({
      viewUpdateMutation,
      view,
      fieldsMap,
    });

  return (
    <div>
      <Box mb="10px">
        <Button
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={onBackClick}
        >
          <Box color="#475467" fontSize={14} fontWeight={600}>
            {title}
          </Box>
        </Button>
        <InputGroup my="10px">
          <InputLeftElement>
            <Image src="/img/search-lg.svg" alt="search" />
          </InputLeftElement>
          <Input
            placeholder={"Seaarch by filled name"}
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </InputGroup>
        <div className={cls.labels}>
          {renderFields.map((item) => {
            return (
              <div>
                <div className={cls.label}>
                  <span className={cls.text}>
                    {fieldsMap[item]?.type &&
                      getColumnIcon({
                        column: { type: fieldsMap[item]?.type },
                      })}
                    {fieldsMap[item]?.attributes?.field_permission?.label}
                  </span>
                  <Switch
                    ml="auto"
                    checked={view?.attributes?.sub_group_by_id === item}
                    onChange={(ev) =>
                      handleUpdateSubGroup(item, ev.target.checked)
                    }
                    disabled={view?.group_fields?.[0] === item}
                    isChecked={view?.attributes?.sub_group_by_id === item}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </div>
  );
};
