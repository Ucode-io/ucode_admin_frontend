import { useEffect, useState } from "react";

export const useInspect = ({files = []}) => {

  const [selectedContexts, setSelectedContexts] = useState([]);

  const handleRemoveContext = (index) => {
    setSelectedContexts((prev) => prev.filter((_, i) => i !== index));
  };

  function resolvePath(input) {
    if(!input) return null
    const match = input.match(/^([a-zA-Z0-9_-]+)\.([a-z0-9-]+)$/);
    if (!match) return null;

    const [, folder, name] = match;

    const pascalName = name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    return `src/${folder}/${pascalName}.jsx`;
  }

  function findElementPositionInFile({ content, id, tag }) {
    const lines = content?.split("\n");

    if (id) {
      const idPattern = new RegExp(`id=["']${id}["']`);

      if (lines?.length === 0 || !lines) return;

      for (let i = 0; i < lines.length; i++) {
        if (idPattern.test(lines[i])) {
          return {
            line: i + 1, // Monaco: 1-based
            column: lines[i].indexOf("id=") + 1,
            reason: "id",
          };
        }
      }
    }

    if (tag) {
      const tagPattern = new RegExp(`<${tag.toLowerCase()}[\\s>]`);

      if (lines?.length === 0 || !lines) return;

      for (let i = 0; i < lines?.length; i++) {
        if (tagPattern?.test(lines[i])) {
          return {
            line: i + 1,
            column: lines[i].indexOf("<") + 1,
            reason: "tag",
          };
        }
      }
    }

    // 3️⃣ Fallback — начало компонента
    for (let i = 0; i < lines.length; i++) {
      if (/function\s+\w+|const\s+\w+\s*=/.test(lines[i])) {
        return {
          line: i + 1,
          column: 1,
          reason: "component-root",
        };
      }
    }

    return null;
  }

  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type === "INSPECT_SELECT") {
        const inspected = e.data;

        const file = files?.find(
          (f) => f.path === resolvePath(inspected?.filePath),
        );

        const pos = findElementPositionInFile({
          content: file?.content,
          tag: inspected?.tag,
          id: inspected?.id,
        });

        setSelectedContexts((prev) => [
          ...prev,
          {
            ...pos,
            target_file: file?.path,
            tag: inspected?.tag,
            target_element_id: inspected?.id,
            code_fragment: file?.content,
            name: inspected?.name,
          },
        ]);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return {
    handleRemoveContext,
    selectedContexts,
    setSelectedContexts
  }
}