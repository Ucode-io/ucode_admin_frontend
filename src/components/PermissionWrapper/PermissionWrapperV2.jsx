import { useSelector } from "react-redux";

const PermissionWrapperV2 = ({ children, tabelSlug = "", type }) => {
  const permissions = useSelector((state) => state.auth.permissions);
  // if (!tabelSlug) return children;

  if (!tabelSlug) return null

  if (!permissions[tabelSlug][type]) return null;

  return children;
};

export default PermissionWrapperV2;
