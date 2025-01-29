import {useSelector} from "react-redux";
import {Box, Tooltip} from "@chakra-ui/react";

export const SidebarTooltip = ({id, title, children}) => {
  const highlightedMenu = useSelector((state) => state.main.sidebarHighlightedMenu);
  const highlighted = highlightedMenu === id;

  return (
    <Tooltip
      isOpen={Boolean(highlightedMenu)}
      className='chakra-tooltip'
      label={
        <Box
          bg={highlighted ? "#101828" : "#344054"}
          transition='margin 100ms ease-out, background 100ms ease-out'
          py={6}
          px={12}
          borderRadius={8}
          color='#fff'
          fontSize={12}
          ml={highlighted ? 6 : 16}
        >
          {title}
        </Box>
      }
      placement='right'
    >
      {children}
    </Tooltip>
  )
};