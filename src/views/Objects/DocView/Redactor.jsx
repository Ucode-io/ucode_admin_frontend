import { forwardRef, useCallback, useMemo, useRef } from "react"
import { createReactEditorJS } from "react-editor-js"
import styles from "./style.module.scss"
import { EDITOR_JS_TOOLS } from "./tools"
import DragDrop from 'editorjs-drag-drop';
import "./redactorOverriders.scss"
import { useWatch } from "react-hook-form";
import TestInlinePlugin from "./RedactorPlugins/TestInlinePlugin";

const Redactor = forwardRef(({ control, fields }, ref) => {
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

  const computedTools = useMemo(() => {
    return {
      ...EDITOR_JS_TOOLS,
      testInline: {
        class: TestInlinePlugin,
        config: {
          fields
        }
      },
    }
  }, [fields])
  
  return (
    <div className={styles.page}>
      <ReactEditorJS
        onInitialize={handleInitialize}
        onReady={handleReady}
        defaultValue={`<head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><p class="paragraph"> Test template address:&nbsp;<span><b><i>|| Фамилия || dfgdf kgdfm ldkfmg ldkfmgldkfmgldkfmg dfllkfmldgfd</i></b></span> </p><h2>dfgdd fgdfg <span>|| Имя ||</span>&nbsp;&nbsp;</h2>`}
        tools={computedTools}
        minHeight={1000}
        // style={{ width: 10 }}
        config={{name: 'asdasd'}}
        holder="editorjs"
      >
      </ReactEditorJS>
    </div>
  )
})

export default Redactor
