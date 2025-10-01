import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { useNavigate } from "react-router-dom"

export const useHeaderProps = () => {

  const navigate = useNavigate();

  const { tableSlug } = useViewContext();

  const tableLan = useGetLang("Table");

  return {
    navigate,
    tableSlug,
    tableLan,
  }
}