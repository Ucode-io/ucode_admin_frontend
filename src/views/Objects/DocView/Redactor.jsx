import { forwardRef, useCallback, useRef, useState } from "react"
import { createReactEditorJS } from "react-editor-js"
import styles from "./style.module.scss"
import { EDITOR_JS_TOOLS } from "./tools"
import DragDrop from 'editorjs-drag-drop';
import "./redactorOverriders.scss"
import { useWatch } from "react-hook-form";

const Redactor = forwardRef(({ control }, ref) => {
  const ReactEditorJS = createReactEditorJS()
  const editorCore = useRef(null)
  const value = useWatch({
    control,
    name: "html",
  })

  const handleInitialize = useCallback((instance) => {
    editorCore.current = instance
    ref.current = instance
  }, [ref])

  const handleReady = () => {
    const editor = editorCore.current._editorJS
    // new Undo({ editor })
    new DragDrop(editor)
  }
  
  return (
    <div className={styles.page}>
      <ReactEditorJS
        onInitialize={handleInitialize}
        onReady={handleReady}
        defaultValue={value}
        tools={EDITOR_JS_TOOLS}
        // onChange={setBlocks}
        minHeight={1000}
        holder="editorjs"
      />
    </div>
  )
})

export default Redactor
