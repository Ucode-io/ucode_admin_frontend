import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BiBookContent } from "react-icons/bi";
import { FiShare2 } from "react-icons/fi";
import { useQueryClient } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useNoteByIdQuery,
  useNoteCreateMutation,
  useNoteUpdateMutation,
} from "../../../../../services/noteService";
import { store } from "../../../../../store";
import { useGetSingleObjectDocumentQuery } from "../../../../../services/templateNoteShareService";
import { showAlert } from "../../../../../store/alert/alert.thunk";
import { useDispatch } from "react-redux";
import { Box, Button } from "@mui/material";
import Header, { HeaderExtraSide, HeaderLeftSide } from "../../Header";
import HFTextField from "../../../../FormElements/HFTextField";
import ButtonTabs from "../Components/ButtonTabs";
import EditorJs from "../Components/EditorJS";
import styles from "./style.module.scss";
import NoteSettings from "./NoteSettings";

const tabs = [
  {
    id: 1,
    icon: BiBookContent,
    title: "Table of contents",
  },
  {
    id: 4,
    icon: FiShare2,
    title: "Share",
  },
];

const center = {
  display: "flex",
  alighItems: "center",
  justifyContent: "center",
};

const Note = () => {
  const form = useForm();
  const { projectId, noteId, folderId } = useParams();
  const company = store.getState().company;
  const [queryParams, setQueryParams] = useSearchParams();
  const selectedTabIndex = Number(queryParams.get("tab") ?? 0);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const token = queryParams.get("token");

  const { isLoading } = useNoteByIdQuery({
    envId: company.environmentId,
    id: noteId,
    params: { "project-id": projectId },
    queryParams: {
      enabled: Boolean(noteId) || Boolean(token),
      onSuccess: form.reset,
      cacheTime: false,
    },
  });

  const { data: createdShareDocument = {}, isLoading: loadingFromTokenDoc } =
    useGetSingleObjectDocumentQuery({
      params: {
        "project-id": projectId,
      },
      data: {
        token: token,
      },
      queryParams: {
        onSuccess: (res) =>
          res.data
            ? form.reset({
                json: res.data.json,
                title: res.data.title,
              })
            : null,
        enabled: Boolean(token),
      },
    });

  useEffect(() => {
    if (!Boolean(noteId)) {
      form.reset({
        folderId: folderId,
        commit_id: "",
        json: {},
        project_id: projectId,
        title: "NEW NOTE",
        tables: [],
      });
    }
  }, [noteId]);

  const tabSelectHandler = (index) => {
    setQueryParams({
      tab: index,
    });
  };

  const { mutate: updateNote } = useNoteUpdateMutation({
    onSuccess: (res) => {
      dispatch(showAlert("Success", "success"));
      queryClient.refetchQueries(["NOTES"]);
    },
  });

  const { mutate: createNote } = useNoteCreateMutation({
    onSuccess: (res) => {
      queryClient.refetchQueries(["NOTES"]);
    },
  });

  const onSubmit = (values) => {
    if (!!values.id) {
      updateNote({
        ...values,
      });
    } else {
      createNote({
        ...values,
        project_id: projectId,
        folder_id: folderId,
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Box backgroundColor="white" height={"100%"}>
        <Header border="none">
          <HeaderLeftSide flex={1}>
            <HFTextField
              control={form.control}
              name="title"
              className={styles.input}
            />
          </HeaderLeftSide>

          <HeaderExtraSide height="100%">
            <Button variant="contained" onClick={form.handleSubmit(onSubmit)}>
              Save changes
            </Button>
          </HeaderExtraSide>

          <HeaderExtraSide height="100%">
            <ButtonTabs
              width="350px"
              selectedTabIndex={selectedTabIndex}
              ml="auto"
              tabs={tabs}
              onSelect={tabSelectHandler}
            />
          </HeaderExtraSide>
        </Header>

        <Box style={center}>
          <Box flex={1}>
            <EditorJs
              control={form.control}
              name={"json"}
              isLoading={isLoading}
              loadingFromTokenDoc={loadingFromTokenDoc}
            />
          </Box>

          <Box height="calc(100vh - 50px)" width="350px" minW="350px">
            {token ? (
              ""
            ) : (
              <NoteSettings selectedTabIndex={selectedTabIndex} form={form} />
            )}
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default Note;
