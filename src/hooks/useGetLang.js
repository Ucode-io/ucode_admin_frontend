import { useEffect, useState } from "react";
import { getAllFromDB } from "../utils/languageDB";

export const useGetLang = (category = "global") => {

  const [lang, setLang] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setLang(formattedData?.find((item) => item?.key === category));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [category]);

  return lang;

};
