import { useSelector } from "react-redux";

export const usePermission = ({tableSlug, type}) => {
  const permissions2 = useSelector((state) => state?.permissions?.permissions);
  
    const role = useSelector((state) => state.auth.roleInfo);
    if (!tableSlug || role?.name === "DEFAULT ADMIN") return true;
  
    if (typeof type === "object") {
      if (
        permissions2?.[tableSlug]?.[type[0]] &&
        permissions2?.[tableSlug]?.[type[1]]
      )
        return true;
  
      return false;
    } else {
      if (permissions2?.[tableSlug]?.[type]) return true;
      return false;
    }
};
