import { useEffect, useRef, useState } from "react";
import mcpService from "./service/mcp.service";
import { useDispatch, useSelector } from "react-redux";
import { generatedUiActions } from "@/store/generatedUi/generatedUi.slice";
import { resp } from "./mockProject";

// import { resp } from "./mockProject";

export const useAiAgentProps = () => {
  const generatedUiData = useSelector(
    (state) => state.generatedUi.generatedUi,
  );

  const dispatch = useDispatch();

  const generatedUiRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const files = generatedUiData?.files || [];
  const env = generatedUiData?.env;
  const projectId = generatedUiData?.project_id;


  const handleUpdateCode = (changedFiles) => {
    mcpService.updateFrontendCode({
      files: changedFiles
    })
  }

  const onSubmit = ({ context, type }) => {

    if (!prompt.trim()) return;

    if(type === "update") {

      if(!projectId) {
        console.error("Project id not found")
        return;
      }

      setIsLoading(true);

      mcpService.updateFrontend({
        prompt,
        // context
      }, projectId)
      .then(() => {
        console.log("updated")
      })
      .finally(() => setIsLoading(false));

    } else {

      setIsLoading(true);

      mcpService
        .generateFrontend({
          prompt,
        })
        .then((res) => {
          console.log(res)

          dispatch(
            generatedUiActions.setGeneratedUi(res),
          );
          setPrompt("");
        })
        .finally(() => setIsLoading(false));

    }

  };

  useEffect(() => {
    mcpService.getFrontend().then(() => {
      console.log("Frontend loaded")
      // dispatch(
      //   generatedUiActions.setGeneratedUi(resp.data),
      // )
    })
  }, [])

  return {
    generatedUiRef,
    isLoading,
    files,
    onSubmit,
    prompt,
    setPrompt,
    env,
    handleUpdateCode,
  };
};
