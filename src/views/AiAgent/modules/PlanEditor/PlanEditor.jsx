import { useState, useRef, useEffect } from "react";
import { Save, Database, Layout, FileDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import cls from "./styles.module.scss";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});
turndownService.use(gfm);

const PlanEditor = ({ plan, setPlan, onSubmit }) => {
  const [activeTab, setActiveTab] = useState("frontend"); // 'frontend' | 'backend'
  const editableRef = useRef(null);

  // currentContent derived from activeTab
  const currentContent = activeTab === "frontend" ? plan.frontend_plan : plan.backend_plan;

  const getMarkdownFromHtml = () => {
    if (editableRef.current) {
      return turndownService.turndown(editableRef.current.innerHTML);
    }
    return "";
  };

  const handleSaveToState = (targetTab = activeTab) => {
    const newMarkdown = getMarkdownFromHtml();
    setPlan((prev) => ({
      ...prev,
      [`${targetTab}_plan`]: newMarkdown,
    }));
    return newMarkdown;
  };

  const handleTabSwitch = (newTab) => {
    if (newTab === activeTab) return;
    // Save current changes before switching
    handleSaveToState(activeTab);
    setActiveTab(newTab);
  };

  const handleLogPlan = () => {
    // Save current content first
    const currentMd = handleSaveToState(activeTab);

    // Construct the full plan object with the latest update
    const updatedPlan = {
      ...plan,
      [`${activeTab}_plan`]: currentMd
    };

    console.log("Current Plan:", updatedPlan);
    if (onSubmit) onSubmit(updatedPlan);
  };

  // We use key={activeTab} to force React to re-mount the editable div 
  // with new initial content when tab changes.
  // This prevents React reconciliation issues with contentEditable.

  return (
    <div className={cls.container}>
      <div className={cls.header}>
        <div className={cls.tabs}>
          <button
            className={`${cls.tab} ${activeTab === "frontend" ? cls.active : ""}`}
            onClick={() => handleTabSwitch("frontend")}
          >
            <Layout size={18} />
            Frontend Plan
          </button>
          <button
            className={`${cls.tab} ${activeTab === "backend" ? cls.active : ""}`}
            onClick={() => handleTabSwitch("backend")}
          >
            <Database size={18} />
            Backend Plan
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={cls.saveBtn}
            onClick={() => {
              // Save first to ensure we export latest
              const currentMd = getMarkdownFromHtml();
              const blob = new Blob([currentMd], { type: "text/markdown" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${activeTab}_plan.md`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <FileDown size={18} />
            Export MD
          </button>
          <button className={cls.saveBtn} onClick={handleLogPlan}>
            {/* <Save size={18} /> */}
            Accept
          </button>
        </div>
      </div>

      <div className={cls.editorWrapper}>
        <div className={cls.previewContainer}>
          <div
            className={cls.markdownBody}
            contentEditable
            suppressContentEditableWarning={true}
            ref={editableRef}
            key={activeTab} // Force remount on tab change
            style={{ outline: "none", minHeight: "100%" }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentContent || ""}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanEditor;
