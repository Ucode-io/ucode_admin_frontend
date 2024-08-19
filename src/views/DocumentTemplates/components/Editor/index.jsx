import { DocumentEditor } from "@onlyoffice/document-editor-react";
import useId from "../../../../hooks/useId";
import { useEffect } from "react";
import { useDocxTemplateByIdQuery } from "../../../../services/docxTemplateService";

const Editor = ({ onDownLoad, id: idFromProps, url }) => {
  const localId = useId()

  const id = idFromProps ?? localId

  const editorInstance = window.DocEditor?.instances?.[id];


  useEffect(() =>{
    return () => {
      editorInstance?.destroyEditor()
    }
  }, [])

  // const onCreateTemplateClick = () => {
  //   editorInstance.downloadAs('docx')
  // };

  return (
    <>
      <DocumentEditor
        id={id}
        documentServerUrl="http://37.27.196.85:8084/"
        config={{
          document: {
            fileType: "docx",
            key: id,
            title: " ",
            url: url ?? "https://cec.ustozim.uz/api/v1/files/d4ab31bfcc55b9748f9093a17cc820b9",
          },
          documentType: "word",
          editorConfig: {
            // mode: 'view',
            mode: "edit",
            customization: {
              autosave: false,
            },
          },
          events: {
            // onDocumentReady: () => {
            //   const editor = window.DocEditor.instances.editorContainer
            //   handleEditorReady(editor);
            // },
            onDownloadAs: (e) => {
              onDownLoad(e)
            },
          },
        }}
      />
    </>
  );
};

export default Editor;
