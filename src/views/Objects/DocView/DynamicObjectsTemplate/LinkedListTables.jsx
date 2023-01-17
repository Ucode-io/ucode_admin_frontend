import {
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import FRow from "../../../../components/FormElements/FRow";
import useDebounce from "../../../../hooks/useDebounce";
import constructorObjectService from "../../../../services/constructorObjectService";
import constructorRelationService from "../../../../services/constructorRelationService";
import styles from "./style.module.scss";

function LinkedListTables({
  selectedOutputTable,
  setSelectedOutputTable,
  selectedOutputObject,
  setSelectedOutputObject,
  templates,
  selectedTemplate,
  selectedLinkedObject,
  setSelectedLinkedObject,
}) {
  const { tableSlug } = useParams();
  const outputTableSlug = selectedOutputTable?.split("#")?.[1];
  const subttitleFieldSlug = selectedOutputTable?.split("#")?.[2];
  const [debouncedValue, setDebouncedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  // =============GET RELATION TABLE SLUG==============//
  const { data: computedValue = [] } = useQuery(
    ["GET_RELATION_OBJECT_LIST", tableSlug],
    () => {
      // if (!selectedTable?.slug) return null;
      return constructorRelationService.getList({
        table_slug: "file",
        relation_table_slug: "file",
      });
    },
    {
      select: (res) => {
        const relations = res?.relations.filter((item) => {
          return item?.type === "Many2One" && item?.table_from?.slug === "file";
        });
        const computedValue = relations.map((item) => ({
          label: item?.title,
          value: `${item?.id}#${item?.table_to?.slug}#${
            item?.table_to?.subtitle_field_slug ?? ""
          }`,
        }));

        return computedValue;
      },
    }
  );

  const { data: computedObject = [] } = useQuery(
    ["GET_OBJECT_LIST", outputTableSlug, computedValue, debouncedValue],
    () => {
      if (outputTableSlug === undefined) return null;
      return constructorObjectService.getList(outputTableSlug, {
        data: {
          view_fields: [subttitleFieldSlug],
          search: debouncedValue.trim(),
          limit: 10,
          offset: 0,
        },
      });
    },

    {
      enabled: !!selectedOutputTable,
      select: (res) => {
        const computedObject = res?.data?.response.map((item) => ({
          label: item?.[selectedOutputTable?.split("#")?.[2]],
          value: `${item?.guid}#${res?.table_slug}`,
        }));

        return computedObject;
      },
    }
  );

  // ==============GET LINKED OBJECT LIST==============//
  const { data: computedRelations = [] } = useQuery(
    ["GET_RELATION_OBJECTS", tableSlug],
    () => {
      // if (!selectedTable?.slug) return null;
      return constructorRelationService.getList({
        table_slug: tableSlug,
        relation_table_slug: tableSlug,
      });
    },
    {
      select: (res) => {
        const computedRelations = res?.relations
          .filter((item) => {
            return item?.table_to?.slug === tableSlug;
          })
          .map((el) => ({
            label: el?.table_from?.label,
            value: `${el?.table_from?.id}#${el?.table_from?.slug}`,
          }));

        return computedRelations;
      },
    }
  );

  const getComputedObjectVal = useMemo(() => {
    const getSelectTedTemplate = templates.find((item) => {
      return item?.guid === selectedTemplate?.guid;
    });
    const val =
      computedValue &&
      computedValue?.find((item) => {
        return (
          item?.value.split("#")?.[1] === getSelectTedTemplate?.output_object
        );
      });

    return val?.value;
  }, [computedValue, templates, selectedTemplate]);

  const getComputedRelationObjects = useMemo(() => {
    const getSelectTedTemplate = templates.find((item) => {
      return item?.guid === selectedTemplate?.guid;
    });

    const result =
      computedRelations &&
      computedRelations?.find((item) => {
        return (
          item?.value?.split("#")?.[1] === getSelectTedTemplate?.linked_object
        );
      });
    return result && result?.value;
  }, [templates, computedRelations]);

  const handleTableChange = (event) => {
    setSelectedLinkedObject(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedOutputTable(event.target.value);
  };
  const handleChangeObject = (event) => {
    setSelectedOutputObject(event);
  };

  useEffect(() => {
    setSelectedOutputTable(getComputedObjectVal);
  }, [getComputedObjectVal]);

  useEffect(() => {
    setSelectedLinkedObject(
      getComputedRelationObjects ? getComputedRelationObjects : tableSlug
    );
  }, [selectedTemplate, getComputedRelationObjects]);

  return (
    <div className={styles.docListTables}>
      <FRow label={"Linked Table"}>
        <Select
          fullWidth
          id="demo-simple-select"
          value={selectedLinkedObject}
          onChange={handleTableChange}
          size="small"
        >
          {computedRelations?.map((item) => (
            <MenuItem value={item?.value}>{item?.label}</MenuItem>
          ))}
        </Select>
      </FRow>
      <FRow label={"Output Table"}>
        <Select
          fullWidth
          id="demo-simple-select"
          value={selectedOutputTable}
          onChange={handleChange}
          size="small"
        >
          {computedValue?.map((item) => (
            <MenuItem value={item?.value}>{item?.label}</MenuItem>
          ))}
        </Select>
      </FRow>
      {selectedOutputTable ? (
        <FRow label={"Output Object"}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label"></InputLabel>
            <Autocomplete
              inputValue={inputValue}
              options={computedObject}
              value={selectedOutputObject}
              renderInput={(params) => <TextField {...params} size="small" />}
              onChange={(event, newValue) => {
                handleChangeObject(newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                inputChangeHandler(newInputValue);
              }}
            />
            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedOutputObject}
              onChange={handleChangeObject}
              size="small"
            >
              {computedObject?.map((item) => (
                <MenuItem value={item?.value}>{item?.label}</MenuItem>
              ))}
            </Select> */}
          </FormControl>
        </FRow>
      ) : (
        ""
      )}
    </div>
  );
}

export default LinkedListTables;
