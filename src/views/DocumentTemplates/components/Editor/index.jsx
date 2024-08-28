import { DocumentEditor } from "@onlyoffice/document-editor-react";
import useId from "../../../../hooks/useId";
import { useEffect, useMemo, useState } from "react";
import { useDocxTemplateByIdQuery } from "../../../../services/docxTemplateService";
import { SignJWT } from 'jose';

async function generateToken(data) {

  // Your secret key (in Uint8Array format)
  const secret = new TextEncoder().encode('my_jwt_secret');

  // Generate the token
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm in the header
    .setIssuedAt() // Set the 'iat' claim to the current time
    .setExpirationTime('2h') // Set expiration time (e.g., 2 hours)
    .sign(secret); // Sign the token with the secret key

  return token;
}

const Editor = ({ onDownLoad, id: idFromProps, url }) => {
  const localId = useId()
  const [token, setToken] = useState(null);

  const id = idFromProps ?? localId

  const editorInstance = window.DocEditor?.instances?.[id];

  const config = useMemo(() => {
    return {
      "document": {
        "fileType": "docx",
        "key": id,
        "title": " ",
        "url": url ?? "https://cec.ustozim.uz/api/v1/files/d4ab31bfcc55b9748f9093a17cc820b9",
      },
      "documentType": "word",
      "editorConfig": {
        "mode": "edit",
        "customization": {
          "autosave": false,
        },
      },
    }
  }, [url, id])

  useEffect(() => {
    const generate = async () => {
      const result = await generateToken(config);
      setToken(result);
    };

    generate();
  }, [config]);

  console.log("TOKEN123 ==>", token)

  useEffect(() =>{
    return () => {
      editorInstance?.destroyEditor()
    }
  }, [])

  // const onCreateTemplateClick = () => {
  //   editorInstance.downloadAs('docx')
  // };

  if(!token) return null

  return (
    <>
      <DocumentEditor
        id={id}
        documentServerUrl="https://onlyoffice.udevs.io"
        config={{
          ...config,
          token,
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
