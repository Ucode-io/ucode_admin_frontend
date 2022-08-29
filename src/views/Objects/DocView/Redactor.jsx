import { CKEditor } from "@ckeditor/ckeditor5-react"
import "./redactorOverriders.scss"
import Editor from "ckeditor5-custom-build"
import { forwardRef } from "react"
import { useWatch } from "react-hook-form"
import { useMemo } from "react"


const Redactor = forwardRef(({ control, fields }, ref) => {

  const value = useWatch({
    control,
    name: "html",
  })
  
  const computedFields = useMemo(() => {
    return fields?.map(field => ({
      label: field.label,
      value: `{ ${field.label} }`
    })) ?? []
  }, [fields])
  

  return (
    <>
      <div className="ck-editor">
        <CKEditor
          editor={Editor}
          config={{
            variables: {
              list: computedFields
            },
          }}
        //   config={{
            
        //     plugins: [Timestamp],
        //     toolbar: ['timestamp'],
        //     // variablePlugin: { sourceFile: 'defaultvars.json' }
        // }}
          data={value ?? ''}
          onReady={(editor) => {
            editor.ui
              .getEditableElement()
              .parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
              )

            const wrapper = document.createElement("div")
            wrapper.classList.add("ck-editor__editable-container")
            editor.ui.getEditableElement().parentNode.appendChild(wrapper)
            wrapper.appendChild(editor.ui.getEditableElement())
            ref.current = editor
          }}
          onError={(error, { willEditorRestart }) => {
            // If the editor is restarted, the toolbar element will be created once again.
            // The `onReady` callback will be called again and the new toolbar will be added.
            // This is why you need to remove the older toolbar.
            if (willEditorRestart) {
              ref.current.ui.view.toolbar.element.remove()
            }
          }}
          // onChange={(event, editor) => {
          //   onChange(editor.getData())
          // }}
        ></CKEditor>
      </div>
    </>
  )
})

export default Redactor
