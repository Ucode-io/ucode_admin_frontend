import { forwardRef, useCallback, useRef, useState } from "react"
import { createReactEditorJS } from "react-editor-js"
import styles from "./style.module.scss"
import { EDITOR_JS_TOOLS } from "./tools"
import DragDrop from 'editorjs-drag-drop';
import "./redactorOverriders.scss"
import edjsParser from 'editorjs-parser'
import request from "../../../utils/request";
import { useWatch } from "react-hook-form";

const parser = new edjsParser();

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

  // const handleSave = useCallback(async () => {
  //   const savedData = await editorCore.current.save();

  //   let html = parser.parse(savedData);
  //   request.post('html-to-pdf', { data: {}, html: `<div style="padding: 30px" >${html}</div>` })

  //   console.log("HTML ===>", ` <div style="padding: 30px" >${html}</div>`)
  // }, [])

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
