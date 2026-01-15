import { useRef, useState } from "react";
import { mockProject } from "./mockProject";
import mcpService from "./service/mcp.service";

const fileTypeToLanguage = {
  html: "html",
  css: "css",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  cjs: "cjs",
  lock: "lock",
};

// const customMessages = [
//   {
//     from: "user",
//     text: "Create a modern dashboard design and landing page for SaaS. Mobile app interface and e-commerce product card",
//   },
//   {
//     from: "ai",
//     text: "Dashboard design",
//   },
//   {
//     from: "user",
//     text: "Generate a landing page for SaaS",
//   },
//   {
//     from: "ai",
//     text: "Landing page design",
//   },
//   {
//     from: "user",
//     text: "Design a mobile app interface",
//   },
//   {
//     from: "ai",
//     text: "Mobile app interface design",
//   },
//   {
//     from: "user",
//     text: "Build an e-commerce product card",
//   },
//   {
//     from: "ai",
//     text: "E-commerce product card design",
//   },
// ];

const files = mockProject.reduce((acc, file) => {
  acc[file.path] = {
    path: file.path,
    language:
      file.language ||
      fileTypeToLanguage[
        file.path.split(".")[file.path.split(".").length - 1]
      ] ||
      file.path.split(".")[file.path.split(".").length - 1],
    value: file.content,
  };
  return acc;
}, {});

function formatFiles(files) {
  return files.reduce((acc, file) => {
    acc[file.path] = {
      path: file.path,
      language:
        file.language ||
        fileTypeToLanguage[
          file.path.split(".")[file.path.split(".").length - 1]
        ] ||
        file.path.split(".")[file.path.split(".").length - 1],
      value: file.content,
    };
    return acc;
  }, {});
}

function sanitizeAIJson(text) {
  if (typeof text !== "string") return text;

  return text
    .replace(/^\s*```json\s*/i, "")
    .replace(/^\s*```\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

export const useAiAgentProps = () => {
  const generatedUiRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    mcpService
      .generateFrontend({
        prompt,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("generatedUiData", res?.content?.[0]?.text);
      })
      .finally(() => setIsLoading(false));
  };

  let generatedUiData = null;

  try {
    generatedUiData = JSON.parse(
      sanitizeAIJson(localStorage.getItem("generatedUiData")),
    );
  } catch (e) {
    console.log(e);
  }

  const files = formatFiles(generatedUiData?.files) || [];
  const env = generatedUiData?.env;

  return {
    generatedUiRef,
    isLoading,
    files,
    onSubmit,
    prompt,
    setPrompt,
    env,
  };
};
