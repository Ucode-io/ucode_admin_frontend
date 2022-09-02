import { useSelector } from "react-redux";

const PermissionWrapperV2 = ({ children, tabelSlug = "", type }) => {
  const permissions = useSelector((state) => state.auth.permissions);
  if (!tabelSlug) return children;

  if (!tabelSlug) return null;

  if (typeof type === "object") {
    if (permissions?.[tabelSlug]?.[type[0]] && permissions?.[tabelSlug]?.[type[1]])
      return children;

    return null;
  } else {
    if (permissions?.[tabelSlug]?.[type]) return children;
    return null;
  }
};

export default PermissionWrapperV2;
