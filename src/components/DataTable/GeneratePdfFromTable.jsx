import React from 'react'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Menu, MenuItem } from '@mui/material';
import styles from './GeneratePdfFromTable.module.scss'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import constructorObjectService from '../../services/constructorObjectService';

export default function GeneratePdfFromTable({ row }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { appId, tableSlug, id: objectId } = useParams();

  const loginTableSlug = useSelector((state) => state.auth.loginTableSlug);
  const userId = useSelector((state) => state.auth.userId);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation()
    setAnchorEl(null);
  };

  const {
    data: { templates, templateFields } = { templates: [], templateFields: [] },
  } = useQuery(
    ["GET_DOCUMENT_TEMPLATE_LIST", tableSlug],
    () => {
      const data = {
        table_slug: tableSlug,
      };

      data[`${loginTableSlug}_ids`] = [userId];

      return constructorObjectService.getList("template", {
        data,
      });
    },
    {
      select: ({ data }) => {
        const templates = data?.response ?? [];
        const templateFields = data?.fields ?? [];

        return {
          templates,
          templateFields,
        };
      },
    }
  );

  const navigateToDocumentEditPage = (template, e) => {
    const state = {
      toDocsTab: true,
      template: template,
      objectId,
    };

    handleClose(e);
    navigate(`/main/${appId}/object/${tableSlug}`, { state });
  };

  return (
    <div className={styles.wrapper}>
      <button
        color="info"
        onClick={(e) =>
          handleClick(e)
        }
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        maxWidth="32px"
      >
        <PictureAsPdfIcon color="info" />
      </button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {templates?.map((template, index) => (
          <MenuItem
            onClick={(e) => navigateToDocumentEditPage(template, e)}
            key={template.id}
          >
            {template.title}
          </MenuItem>


        ))}
      </Menu>
    </div>
  )
}
