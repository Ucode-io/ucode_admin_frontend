export const MessageType = (item) => {
  switch (true) {
    case item?.includes("jpg"):
      return "photo";
    case item?.includes("png"):
      return "photo";
    case item?.includes("MP4"):
      return "video";
    case item?.includes("mov"):
      return "video";
    case item?.includes("heic"):
      return "video";
    case item?.includes("pdf"):
      return "document";
    case item?.includes("docx"):
      return "document";
    default:
      return "text";
  }
};
