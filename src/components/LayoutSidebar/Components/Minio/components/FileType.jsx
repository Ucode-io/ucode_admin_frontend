const FileTypes = ({ item }) => {
  switch (item) {
    case "PNG":
      return "PNG";
    case "JPG":
      return "JPG";
    case "GPEG":
      return "GPEG";
    case "PDF":
      return "PDF";
    case "TXT":
      return "TXT";
    case "SVG":
      return "SVG";
    case "XLSX":
      return "XLSX";
    case "DOCS":
      return "DOCS";
    case "XLS":
      return "XLS";
    case "CVC":
      return "CVC";
    case "MP4":
      return "MP4";
    case "MP3":
      return "MP3";
    case "TEXT":
      return "TEXT";
    case "PKG":
      return "PKG";
    case "TORRENT":
      return "TORRENT";
    default:
      return "DOC";
  }
};

export default FileTypes;
