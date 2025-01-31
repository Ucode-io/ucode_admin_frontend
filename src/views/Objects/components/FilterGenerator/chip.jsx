import {forwardRef} from "react";
import {Flex} from "@chakra-ui/react";
import {ChevronDownIcon, CloseIcon} from "@chakra-ui/icons";

export const Chip = forwardRef(({value, onClearButtonClick, showCloseIcon, children, ...props}, ref) => (
  <Flex
    ref={ref}
    alignItems='center'
    columnGap='4px'
    border="1px solid #EAECF0"
    borderRadius={32}
    color="#FFFFFF70"
    py='1px'
    px='8px'
    cursor='pointer'
    {...props}
  >
    <div style={{color: "#909EAB"}}>{children}</div>
    {Boolean(showCloseIcon) && (
      <CloseIcon
        color="#909EAB"
        width='9px'
        height='9px'
        ml='4px'
        onClick={(ev) => {
          ev.stopPropagation();
          onClearButtonClick(ev);
        }}
        _hover={{color: "#c00000"}}
      />
    )}
    <ChevronDownIcon color="#909EAB" fontSize='18px' />
  </Flex>
));
