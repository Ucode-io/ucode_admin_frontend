import {useSelector} from "react-redux";
import {Box, Tooltip} from "@chakra-ui/react";

export const SidebarAppTooltip = ({id, title, children}) => {
  const highlightedMenu = useSelector((state) => state.main.sidebarHighlightedMenu);

  return (
    <BaseTooltip isOpen={Boolean(highlightedMenu)} highlighted={highlightedMenu === id} title={title}>
      {children}
    </BaseTooltip>
  );
};

export const SidebarActionTooltip = ({id, title, children}) => {
  const highlightedAction = useSelector((state) => state.main.sidebarHighlightedAction);

  return (
    <BaseTooltip isOpen={Boolean(highlightedAction)} highlighted={highlightedAction === id} title={title}>
      {children}
    </BaseTooltip>
  );
};

const BaseTooltip = ({isOpen, highlighted, title, children}) => (
  <Tooltip
    isOpen={isOpen}
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