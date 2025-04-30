import React, {useState} from "react";
import {
  SidebarActionTooltip,
  SidebarAppTooltip,
} from "@/components/LayoutSidebar/sidebar-app-tooltip";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Chatwoot, {useChatwoot} from "../ProfilePanel/Chatwoot";
import MaterialUIProvider from "../../providers/MaterialUIProvider";
import {Box, Button, Menu} from "@mui/material";
import "./style.scss";

function DocsChatwootModal({
  permissions = {},
  getActionProps = () => {},
  sidebarIsOpen = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const {originalButtonFunction} = useChatwoot();
  return (
    <>
      <MaterialUIProvider>
        <button className="docsBtn" onClick={handleOpen}>
          <HelpOutlineIcon
            style={{color: "#A1A09C", width: "22px", height: "22px"}}
          />
        </button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <Box sx={{height: "80px", width: "208px", padding: "8px 4px"}}>
            {Boolean(permissions?.gitbook_button) && (
              <Box
                as="a"
                href="https://ucode.gitbook.io/ucode-docs"
                target="_blank"
                color="#32302B"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 8px",
                  height: "28px",
                  background: "#fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                  "&:hover": {
                    background: "#F3F3F3",
                  },
                }}>
                <SidebarActionTooltip id="documentation" title="Documentation">
                  <Box
                    w={sidebarIsOpen ? "100%" : 36}
                    h={36}
                    alignItems="center"
                    justifyContent="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    mb={sidebarIsOpen ? 0 : 0}
                    {...getActionProps("documentation")}>
                    <img src="/img/documentation.svg" alt="merge" />
                  </Box>
                </SidebarActionTooltip>

                <Box>Help & Documentation</Box>
              </Box>
            )}

            {Boolean(permissions?.chatwoot_button) && (
              <Box
                onClick={originalButtonFunction}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 8px",
                  height: "28px",
                  background: "#fff",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "#32302B",
                  "&:hover": {
                    background: "#F3F3F3",
                  },
                  marginTop: "6px",
                }}>
                <SidebarActionTooltip id="chat" title="Chat">
                  <Chatwoot open={sidebarIsOpen} {...getActionProps("chat")} />
                </SidebarActionTooltip>
                <Box>Get Ucode Support</Box>
              </Box>
            )}
          </Box>
        </Menu>
      </MaterialUIProvider>
    </>
  );
}

export default DocsChatwootModal;
