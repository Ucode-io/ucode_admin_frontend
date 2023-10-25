import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import Paragraph from "@editorjs/paragraph";
import FontSize from "editorjs-inline-font-size-tool";
import ColorPlugin from "editorjs-text-color-plugin";
import AlignmentTuneTool from "editorjs-text-alignment-blocktune";
import NestedList from "@editorjs/nested-list";
import FootnotesTune from "@editorjs/footnotes";
import OpenseaTool from "@editorjs/opensea";
import Underline from "@editorjs/underline";
import Telegram from "editorjs-telegram";
import Iframe from "@hammaadhrasheedh/editorjs-iframe";
import Alert from "editorjs-alerticons";
import noteFileService from "../services/noteFileService";
import BreakLine from "editorjs-break-line";
import TextVariantTune from "@moxrbe/text-variant-tune";

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
  breakLine: {
    class: BreakLine,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+ENTER",
  },
  // ToggleBlock: ToggleBlock,
  // warning: Warning,
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
  quote: {
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: false,
    },
  },
  marker: Marker,
  checklist: CheckList,
  NestedList: NestedList,
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
  // personality: {
  //   class: Personality,
  //   // config: {
  //   //   endpoint: 'http://localhost:8008/uploadFile'
  //   // }
  // },
  underline: Underline,
};

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  breakLine: {
    class: BreakLine,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+ENTER",
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  // ToggleBlock: ToggleBlock,
  // warning: Warning,
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
  quote: {
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: false,
    },
  },
  marker: Marker,
  checklist: CheckList,
  NestedList: NestedList,
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
  // personality: {
  //   class: Personality,
  //   // config: {
  //   //   endpoint: 'http://localhost:8008/uploadFile'
  //   // }
  // },
  underline: Underline,
  telegram: Telegram,
  iframe: Iframe,
  alert: {
    class: Alert,
    defaultValue: "awdkmawlkdmawlkdmawlk",
  },
  // columns: {
  //   class: editorjsColumns,
  //   config: {
  //     tools,
  //   },
  // },
};
