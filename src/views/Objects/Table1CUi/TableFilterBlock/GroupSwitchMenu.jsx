import {Box, Menu, MenuItem, Typography} from "@mui/material";
import React, {useMemo} from "react";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";
import constructorViewService from "../../../../services/constructorViewService";
import {useNavigate, useParams} from "react-router-dom";
import {useQueryClient} from "react-query";

function GroupSwitchMenu({
  columns = [],
  toggleColumnVisibility = () => {},
  setColumns,
  anchorEl,
  handleClose,
  open,
  view,
  fieldsMap,
}) {
  const {tableSlug} = useParams();
  const queryClient = useQueryClient();

  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const updateView = (data) => {
    console.log("datadatadatadata", data);
    // setIsLoading(true);
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: data,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  const unVisibleFields = useMemo(() => {
    return allFields.filter((field) => {
      if (field?.type === "LOOKUP" || field?.type === "LOOKUPS") {
        return !view?.columns?.includes(field.relation_id);
      } else {
        return !view?.columns?.includes(field.id);
      }
    });
  }, [allFields, view?.columns]);

  const visibleFields = useMemo(() => {
    return (
      view?.columns
        ?.map((id) => fieldsMap[id])
        .filter((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return el?.relation_id;
          } else {
            return el?.id;
          }
        }) ?? []
    );
  }, [view?.columns, fieldsMap]);

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <Box sx={{width: "360px"}}>
        <MenuItem
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: "1px solid #d0d5dd",
          }}>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#101828",
              fontWeight: 500,
            }}>
            Показать все
          </Typography>
          <IOSSwitch
            checked={visibleFields.length === allFields.length}
            onChange={(e) => {
              updateView(
                e.target.checked
                  ? allFields.map((el) => {
                      if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
                        return el.relation_id;
                      } else {
                        return el.id;
                      }
                    })
                  : []
              );
            }}
          />
        </MenuItem>
        {visibleFields.map((column, index) => (
          <MenuItem
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
            }}>
            <Typography
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              {column.label}
            </Typography>

            {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
              <IOSSwitch
                size="small"
                checked={view?.columns?.includes(column?.relation_id)}
                onChange={(e) => {
                  updateView(
                    e.target.checked
                      ? [...view?.columns, column?.relation_id]
                      : view?.columns?.filter(
                          (el) => el !== column?.relation_id
                        )
                  );
                }}
              />
            ) : (
              <IOSSwitch
                size="small"
                checked={view?.columns?.includes(column?.id)}
                onChange={(e) => {
                  updateView(
                    e.target.checked
                      ? [...view?.columns, column?.id]
                      : view?.columns?.filter((el) => el !== column?.id)
                  );
                }}
              />
            )}
          </MenuItem>
        ))}
        {unVisibleFields.map((column, index) => (
          <MenuItem
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 14px",
            }}>
            <Typography
              sx={{color: "#101828", fontWeight: 500, fontSize: "14px"}}>
              {column.label}
            </Typography>
            {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
              <IOSSwitch
                size="small"
                checked={view?.columns?.includes(column?.relation_id)}
                onChange={(e) => {
                  updateView(
                    e.target.checked
                      ? [...view?.columns, column?.relation_id]
                      : view?.columns?.filter(
                          (el) => el !== column?.relation_id
                        )
                  );
                }}
              />
            ) : (
              <IOSSwitch
                size="small"
                checked={view?.columns?.includes(column?.id)}
                onChange={(e) => {
                  updateView(
                    e.target.checked
                      ? [...view?.columns, column?.id]
                      : view?.columns?.filter((el) => el !== column?.id)
                  );
                }}
              />
            )}
          </MenuItem>
        ))}
      </Box>
    </Menu>
  );
}

export default GroupSwitchMenu;
