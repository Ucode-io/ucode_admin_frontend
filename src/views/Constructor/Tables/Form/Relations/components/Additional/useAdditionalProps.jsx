import { useTranslation } from "react-i18next"
import { useGetLang } from "@/hooks/useGetLang";

export const useAdditionalProps = () => {
  const { i18n } = useTranslation();
  const tableLan = useGetLang("Table")

  return {
    i18n,
    tableLan
  }
}
