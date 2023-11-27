import AppsIcon from "@mui/icons-material/Apps";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LinkIcon from "@mui/icons-material/Link";
import {Box, Button, CircularProgress, Menu, Switch} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useQueryClient} from "react-query";
import {Container, Draggable} from "react-smooth-dnd";
import constructorViewService from "../../services/constructorViewService";
import {applyDrag} from "../../utils/applyDrag";
import {columnIcons} from "../../utils/constants/columnIcons";
import WebIcon from "@mui/icons-material/Web";
import DnsIcon from "@mui/icons-material/Dns";

export default function TableViewGroupByButton({currentView, fieldsMap}) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateView = (data) => {
    setIsLoading(true);
    constructorViewService
      .update(data)
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const visibleFields = useMemo(() => {
    return currentView?.columns?.map((id) => fieldsMap[id]) ?? [];
  }, [currentView?.columns, fieldsMap]);

  const unVisibleFields = useMemo(() => {
    return allFields.filter(
      (field) => !currentView?.columns?.includes(field.id)
    );
  }, [allFields, currentView?.columns]);

  const onSwitchChange = (value, field) => {
    const updatedView = {
      ...currentView,
      attributes: {
        ...currentView?.attributes,
        group_by_columns: value
          ? [...currentView?.attributes?.group_by_columns, field?.id]
          : currentView?.attributes?.group_by_columns?.filter(
              (id) => id !== field?.id
            ),
      },
    };
    updateView(updatedView);
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(visibleFields, dropResult);
    if (result) {
      const updatedView = {
        ...currentView,
        columns: result.map((el) => el.id),
      };

      updateView(updatedView);
    }
  };

  const disableAll = () => {
    const updatedView = {
      ...currentView,
      attributes: {
        ...currentView?.attributes,
        group_by_columns: [],
      },
    };

    updateView(updatedView);
  };

  const isGroupBy = useMemo(() => {
    return currentView?.attributes?.group_by_columns?.length > 0;
  }, [currentView?.attributes?.group_by_columns]);

  return (
    <div>
      <Button
        variant={`${isGroupBy ? "outlined" : "text"}`}
        style={{
          gap: "5px",
          color: isGroupBy ? "rgb(0, 122, 255)" : "#A8A8A8",
          borderColor: isGroupBy ? "rgb(0, 122, 255)" : "#A8A8A8",
        }}
        onClick={handleClick}
      >
        {isLoading ? (
          <Box sx={{display: "flex", width: "22px", height: "22px"}}>
            <CircularProgress
              style={{
                width: "22px",
                height: "22px",
              }}
            />
          </Box>
        ) : (
          <WebIcon
            style={{
              color: isGroupBy ? "rgb(0, 122, 255)" : "#A8A8A8",
              width: "22px",
              height: "22px",
            }}
          />
        )}
        Group
        {isGroupBy > 0 && (
          <span>{currentView?.attributes?.group_by_columns?.length}</span>
        )}
        {isGroupBy && (
          <button
            style={{
              border: "none",
              background: "none",
              outline: "none",
              cursor: "pointer",
              padding: "0",
              margin: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isGroupBy ? "rgb(0, 122, 255)" : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              disableAll();
            }}
          >
            <CloseRoundedIcon
              style={{
                color: isGroupBy ? "rgb(0, 122, 255)" : "#A8A8A8",
              }}
            />
          </button>
        )}
      </Button>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        <div
          style={{
            minWidth: 200,
            maxHeight: 300,
            overflowY: "auto",
            padding: "10px 14px",
          }}
        >
          <div>
            <Container
              onDrop={onDrop}
              dropPlaceholder={{className: "drag-row-drop-preview"}}
            >
              {visibleFields?.map((column, index) => (
                <Draggable key={column?.id}>
                  <div
                    key={column?.id}
                    style={{
                      display: "flex",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        border: 0,
                        // borderBottom: "1px solid #eee",
                        paddingLeft: 0,
                        paddingRight: 0,
                        padding: "8px 0px",
                        margin: "-1px -1px 0 0",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {columnIcons(column?.type) ?? <LinkIcon />}
                      </div>
                      {column?.label}
                    </div>
                    <div
                      style={{
                        width: 70,
                        border: 0,
                        // borderBottom: "1px solid #eee",
                        paddingLeft: 0,
                        paddingRight: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        padding: "8px 0px",
                        margin: "-1px -1px 0 0",
                      }}
                    >
                      <Switch
                        size="small"
                        checked={currentView?.attributes?.group_by_columns?.includes(
                          column?.id
                        )}
                        onChange={(e) => {
                          onSwitchChange(e.target.checked, column);
                        }}
                      />
                    </div>
                  </div>
                </Draggable>
              ))}

              {/* {unVisibleFields?.map((column, index) => (
                <div
                  key={column.id}
                  style={{
                    display: "flex",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      border: 0,
                      // borderBottom: "1px solid #eee",
                      paddingLeft: 0,
                      paddingRight: 0,
                      padding: "8px 0px",
                      margin: "-1px -1px 0 0",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {columnIcons(column.type) ?? <LinkIcon />}
                    </div>
                    {column.label}
                  </div>
                  <div
                    style={{
                      width: 70,
                      border: 0,
                      // borderBottom: "1px solid #eee",
                      paddingLeft: 0,
                      paddingRight: 0,
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      padding: "8px 0px",
                      margin: "-1px -1px 0 0",
                    }}
                  >
                    <Switch
                      size="small"
                      checked={false}
                      onChange={(e) => {
                        onSwitchChange(e.target.checked, column);
                      }}
                    />
                  </div>
                </div>
              ))} */}
            </Container>
          </div>
        </div>
      </Menu>
    </div>
  );
}
