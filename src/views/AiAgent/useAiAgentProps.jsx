import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatedUiActions } from "@/store/generatedUi/generatedUi.slice";
import mcpService from "@/services/mcp/mcp.service";
import { useNavigate, useParams } from "react-router-dom";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";

// import { resp } from "./mockProject";

export const useAiAgentProps = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const generatedUiData = useSelector((state) => state.generatedUi.generatedUi);

  const dispatch = useDispatch();

  const generatedUiRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  const files = generatedUiData?.project_files || [];
  const env = generatedUiData?.project_env;
  const projectId = generatedUiData?.id;

  const handleUpdateCode = (changedFiles) => {
    mcpService.updateProject(
      {
        id,
        project_files: changedFiles.map((item) => ({
          ...item,
        })),
      },
      id,
    );
  };

  const onSubmit = ({ context, images = [] }) => {
    if (!prompt.trim()) return;

    if (projectId) {
      setIsLoading(true);

      mcpService
        .updateFrontend(
          {
            prompt,
            context,
            image_urls: images,
          },
          projectId,
        )
        .then((res) => {
          const updatedFiles = res?.updated_files;

          if (updatedFiles?.length && files?.length) {
            const newFiles = [...files];

            updatedFiles?.forEach((f) => {
              const updatedFileIndex = newFiles?.findIndex(
                (file) => file.path === f.path,
              );

              newFiles[updatedFileIndex] = {
                ...newFiles[updatedFileIndex],
                content: f.content,
              };
            });

            dispatch(generatedUiActions.updateFiles(newFiles));

            setPrompt("");
          }
          setIsLoading(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(true);

      mcpService
        .generateFrontend({
          prompt,
          image_urls: images,
        })
        .then((res) => {
          const responseData = res?.id
            ? res
            : res?.data?.id
              ? res?.data
              : res?.data?.data?.id
                ? res?.data?.data
                : null;

          dispatch(generatedUiActions.setGeneratedUi(responseData));
          setPrompt("");
          navigate(`/ai-agent/${responseData?.id}`);
        })
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    if (id) {
      mcpService.getProject(id).then((res) => {
        dispatch(generatedUiActions.setGeneratedUi(res));
      });
    }

    return () => {
      dispatch(generatedUiActions.resetGeneratedUi());
      dispatch(editorActions.resetCodeEditor());
    };
  }, [id]);

  return {
    generatedUiRef,
    isLoading,
    files,
    onSubmit,
    prompt,
    setPrompt,
    env,
    handleUpdateCode,
    hasProject: !!id,
    chatVisible,
    setChatVisible,
  };
};
