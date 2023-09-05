import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { useResourceListQuery } from "../../../../services/resourceService";
import {
  useQueryByIdQuery,
  useQueryCreateMutation,
  useQueryDeleteMutation,
  useQueryUpdateMutation,
  useRunQueryMutation,
} from "../../../../services/query.service";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { Box, Button } from "@mui/material";
import Header, { HeaderExtraSide, HeaderLeftSide } from "../Header";
import { store } from "../../../../store";
import RingLoaderWithWrapper from "../../../Loaders/RingLoader/RingLoaderWithWrapper";
import QueryForRest from "./Detail/QueryForRest";
import QueryBody from "./Detail/QueryBody";
import styles from "./style.module.scss";
import HFTextField from "../../../FormElements/HFTextField";
import QueryForClickHouse from "./Detail/QueryForClickHouse";
import QuerySettings from "./Detail/QuerySettings";

const flex = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
};

const Queries = () => {
  const [queryParams] = useSearchParams();
  const [commitViewIsOpen, setCommitViewIsOpen] = useState(false);
  const { queryId } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [responseQuery, setResponseQuery] = useState();
  const company = store.getState().company;

  const form = useForm({
    defaultValues: {
      body: {
        params: [
          {
            key: "",
            value: "",
          },
        ],
        headers: [
          {
            key: "",
            value: "",
          },
        ],
        cookies: [
          {
            key: "",
            value: "",
          },
        ],
      },
    },
  });

  const { data: resourcesList } = useResourceListQuery({
    queryParams: {
      select: (res) =>
        res.resources?.map((resource) => ({
          ...resource,
          label: resource.resource_type,
          value: resource.id,
          component: (
            <QueryForClickHouse form={form} responseQuery={responseQuery} />
          ),
        })),
    },
  });

  const types = useMemo(() => {
    const resourcesCustom = [
      {
        label: "REST",
        value: "REST",
        component: (
          <QueryForRest
            form={form}
            responseQuery={responseQuery}
            control={form.control}
          />
        ),
      },
    ];

    return resourcesCustom.concat(resourcesList);
  }, [resourcesList]);

  const { isLoading } = useQueryByIdQuery({
    id: queryId,
    queryParams: {
      enabled: Boolean(queryId),
      onSuccess: form.reset,
      cacheTime: false,
    },
  });

  useEffect(() => {
    setResponseQuery("");
  }, [form.watch("query_type")]);

  useEffect(() => {
    if (!Boolean(queryId)) {
      form.reset({
        title: "NEW QUERY",
        project_id: company.projectId,
        folder_id: queryParams.get("folder_id"),
        body: {
          base_url: "",
          body: "",
          params: [
            {
              key: "",
              value: "",
            },
          ],
          headers: [
            {
              key: "",
              value: "",
            },
          ],
          cookies: [
            {
              key: "",
              value: "",
            },
          ],
          resource: "",
          path: "",
        },
        commit_id: "",
        version_id: "",
        commit_info: {
          project_id: "",
          created_at: "",
        },
        variables: [],
      });
      setResponseQuery("");
    }
  }, [queryId]);

  const { mutate: updateQuery } = useQueryUpdateMutation({
    onSuccess: (res) => {
      dispatch(showAlert("Success", "success"));
      queryClient.refetchQueries(["QUERIES"]);
    },
  });

  const changeTypeOfString = (string) => {
    if (isNaN(Number(string))) {
      return string;
    } else {
      return Number(string);
    }
  };

  const { mutate: createQuery } = useQueryCreateMutation({
    onSuccess: (res) => {
      dispatch(showAlert("Success", "success"));
      queryClient.refetchQueries(["QUERIES"]);
    },
  });

  const onSubmit = (values) => {
    if (!!values.id) {
      updateQuery({
        ...values,
        project_id: company.projectId,
      });
    } else {
      createQuery({
        ...values,
        project_id: company.projectId,
        folder_id: queryParams.get("folder_id"),
      });
    }
  };

  const { mutate: runQuery, isLoading: runLoading } = useRunQueryMutation({
    onSuccess: (res) => {
      setResponseQuery(JSON.parse(res.res));
      dispatch(showAlert("Успешно выполнено", "success"));
    },
  });

  const { mutate: deleteTemplate } = useQueryDeleteMutation({
    onSuccess: (res) => {
      dispatch(showAlert("Удалено", "success"));
      queryClient.refetchQueries(["QUERIES"]);
    },
  });

  const openCommitView = () => {
    setCommitViewIsOpen(true);
  };

  const closeCommitView = () => {
    setCommitViewIsOpen(false);
  };

  return (
    <FormProvider {...form}>
      <Box className={styles.query}>
        <Header color="#000" border="none">
          <HeaderLeftSide flex={1}>
            <Controller
              name="title"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <HFTextField
                  control={form.control}
                  name="title"
                  className={styles.input}
                />
              )}
            />
          </HeaderLeftSide>

          <HeaderExtraSide h="full" mr="30px" gap="15px">
            {/* <Menu>
              <MenuButton
                as={IconButton}
                colorScheme="gray"
                variant="outline"
                p={0}
                icon={<FiMoreHorizontal size="20px" />}
              />

              <MenuList>
                <MenuItem
                  color="red"
                  onClick={() => {
                    deleteTemplate({
                      id: queryId,
                      projectId,
                    });
                  }}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu> */}

            <Button
              variant="contained"
              isLoading={runLoading}
              onClick={() =>
                runQuery({
                  body: form.getValues("body"),
                  commit_id: "",
                  commit_info: {
                    author_id: "string",
                    commit_type: "string",
                    created_at: "string",
                    guid: "string",
                    name: "string",
                    project_id: "string",
                    updated_at: "string",
                    version_ids: ["string"],
                    version_infos: [
                      {
                        author_id: "string",
                        created_at: "string",
                        desc: "string",
                        is_current: true,
                        updated_at: "string",
                        version: "string",
                        version_id: "string",
                      },
                    ],
                  },
                  description: "",
                  environment_id: company.environmentId,
                  folder_id: form.getValues("folder_id"),
                  id: queryId,
                  resource_id: form.getValues("query_type"),
                  project_id: company.projectId,
                  query_type: types.find(
                    (item) => item.value === form.getValues("query_type")
                  ).label,
                  title: form.getValues("title"),
                  variables: form.getValues("variables")?.map((variable) => {
                    return {
                      key: variable.key,
                      value: variable.value,
                    };
                  }),
                  version_id: "",
                })
              }
            >
              Run
            </Button>

            <Button variant="contained" onClick={form.handleSubmit(onSubmit)}>
              Save
            </Button>
          </HeaderExtraSide>
        </Header>

        <Box style={flex}>
          <Box flex={1} height="calc(100vh - 50px)" overflow="scroll">
            {isLoading ? (
              <RingLoaderWithWrapper />
            ) : (
              <QueryBody
                types={types}
                resourcesList={resourcesList}
                form={form}
                control={form.control}
                responseQuery={responseQuery}
              />
            )}
          </Box>

          <Box height="calc(100vh - 50px)" width="300px" minWidth="300px">
            <QuerySettings form={form} />
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default Queries;
