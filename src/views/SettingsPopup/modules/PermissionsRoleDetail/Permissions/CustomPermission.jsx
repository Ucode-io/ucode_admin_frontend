import { Box } from "@mui/material";
import { CTableCell, CTableHeadRow } from "../../../../../components/CTable";
import { CustomCheckbox } from "../../../components/CustomCheckbox";

const style = {
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  color: "#475467",
};

const CustomPermissionRow = ({ watch, setValue }) => {
  const handleChange = (e, type) => {
    setValue(`data.global_permission.${type}`, e.target.checked);
  };

  return (
    <>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>ChatAI</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.chat")}
              onChange={(e) => handleChange(e, "chat")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Chatwoot</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.chatwoot_button")}
              onChange={(e) => handleChange(e, "chatwoot_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Documentation</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.gitbook_button")}
              onChange={(e) => handleChange(e, "gitbook_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Menu button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.menu_button")}
              onChange={(e) => handleChange(e, "menu_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Settings button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.settings_button")}
              onChange={(e) => handleChange(e, "settings_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      {/* <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Projects button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.projects_button")}
              onChange={(e) => handleChange(e, "projects_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Environments button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.environments_button")}
              onChange={(e) => handleChange(e, "environments_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>API keys button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.api_keys_button")}
              onChange={(e) => handleChange(e, "api_keys_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Redirects button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.redirects_button")}
              onChange={(e) => handleChange(e, "redirects_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Menu setting button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.menu_setting_button")}
              onChange={(e) => handleChange(e, "menu_setting_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Profile settings button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.profile_settings_button")}
              onChange={(e) => handleChange(e, "profile_settings_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Project Button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.project_button")}
              onChange={(e) => handleChange(e, "project_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          {" "}
          <Box sx={style}>Sms Button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.sms_button")}
              onChange={(e) => handleChange(e, "sms_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow>
      <CTableHeadRow>
        <CTableCell>
          <Box sx={style}>Version Button</Box>
        </CTableCell>
        <CTableCell>
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CustomCheckbox
              checked={watch("data.global_permission.version_button")}
              onChange={(e) => handleChange(e, "version_button")}
            />
          </Box>
        </CTableCell>
      </CTableHeadRow> */}
    </>
  );
};

export default CustomPermissionRow;
