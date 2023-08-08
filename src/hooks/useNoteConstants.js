import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import Paragraph from "@editorjs/paragraph";
import FontSize from "editorjs-inline-font-size-tool";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
import ToggleBlock from "editorjs-toggle-block";
import NestedList from "@editorjs/nested-list";
import TextVariantTune from "@editorjs/text-variant-tune";
import FootnotesTune from "@editorjs/footnotes";
import OpenseaTool from "@editorjs/opensea";
import Personality from "@editorjs/personality";
import Underline from "@editorjs/underline";
import editorjsColumns from "@lokeshpahal/editorjs-columns-imp";
import Telegram from "editorjs-telegram";
import Iframe from "@hammaadhrasheedh/editorjs-iframe";
import Alert from "editorjs-alerticons";
import noteFileService from "../services/noteFileService";

function encodeFileToBase64(file, callback) {
  var reader = new FileReader();
  reader.onloadend = function () {
    var base64Data = reader.result.split(",")[1];
    var encodedData = "data:image/png;base64," + base64Data;
    callback(encodedData);
  };
  reader.readAsDataURL(file);
}

const tools = {
  embed: Embed,
  alert: Alert,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  // list: {
  //   class: List,
  //   inlineToolbar: true
  // },
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    config: {
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData();
          formData.append("file", file);

          return await noteFileService.upload(formData).then((res) => {
            return {
              success: 1,
              file: {
                url:
                  import.meta.env.VITE_CDN_BASE_URL + "ucode/" + res.filename,
              },
            };
          });
        },
      },
    },
  },
  raw: Raw,
  header: {
    class: Header,
    inlineToolbar: true,
    tunes: ["textVariant"],
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ["textVariant", "footnotes"],
  },
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  NestedList: NestedList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  fontSize: FontSize,
  Color: ColorPlugin,
  anyTuneName: {
    class: AlignmentTuneTool,
    config: {
      default: "left",
      blocks: {
        header: "center",
        list: "left",
      },
    },
  },

  footnotes: {
    class: FootnotesTune,
  },
  textVariant: TextVariantTune,
  opensea: {
    class: OpenseaTool,
  },
  personality: {
    class: Personality,
    // config: {
    //   endpoint: 'http://localhost:8008/uploadFile'
    // }
  },
  underline: Underline,
};

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  // list: {
  //   class: List,
  //   inlineToolbar: true
  // },
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: {
    class: Image,
    config: {
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData();
          formData.append("file", file);

          return await noteFileService.upload(formData).then((res) => {
            return {
              success: 1,
              file: {
                url:
                  import.meta.env.VITE_CDN_BASE_URL + "ucode/" + res.filename,
              },
            };
          });
        },
      },
    },
  },
  raw: Raw,
  header: {
    class: Header,
    inlineToolbar: true,
    tunes: ["textVariant"],
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ["textVariant", "footnotes"],
  },
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  NestedList: NestedList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  fontSize: FontSize,
  Color: ColorPlugin,
  anyTuneName: {
    class: AlignmentTuneTool,
    config: {
      default: "left",
      blocks: {
        header: "center",
        list: "left",
      },
    },
  },
  footnotes: {
    class: FootnotesTune,
  },
  textVariant: TextVariantTune,

  opensea: {
    class: OpenseaTool,
  },
  personality: {
    class: Personality,
    // config: {
    //   endpoint: 'http://localhost:8008/uploadFile'
    // }
  },
  underline: Underline,
  telegram: Telegram,
  iframe: Iframe,
  alert: {
    class: Alert,
    defaultValue: "awdkmawlkdmawlkdmawlk",
  },
  columns: {
    class: editorjsColumns,
    config: {
      tools,
    },
  },
};
