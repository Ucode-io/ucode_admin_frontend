import { generateLangaugeText } from "@/utils/generateLanguageText";
import { Image, Input, InputGroup, InputLeftElement, Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiltersSwitch } from "./components/FilterSwitch";

export const FilterPopover = ({ children, tableLan }) => {
  const ref = useRef();
  const [search, setSearch] = useState("");
  const {i18n} = useTranslation();

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent px="4px" py="8px" ref={ref}>
        <InputGroup mb="8px">
          <InputLeftElement>
            <Image src="/img/search-lg.svg" alt="search" />
          </InputLeftElement>
          <Input
            placeholder={
              generateLangaugeText(
                tableLan,
                i18n?.language,
                "Seaarch by filled name"
              ) || "Search by filled name"
            }
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </InputGroup>
        <FiltersSwitch search={search} />
      </PopoverContent>
    </Popover>
  );
};