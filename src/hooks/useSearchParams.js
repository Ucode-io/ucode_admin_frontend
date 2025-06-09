
import { useCallback } from "react";
import { useSearchParams as useSearchParamsReact } from "react-router-dom";


const useSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParamsReact();

  const updateSearchParam = useCallback((key, value, ...rest) => {
    // Создаем копию текущих параметров
    const newSearchParams = new URLSearchParams(searchParams);
    // Устанавливаем новый параметр
    newSearchParams.set(key, value);
    // Добавляем остальные
    if(rest.length) {
      rest.forEach((el) => {
        console.log({el})
        newSearchParams.set(el.key, el.value);
      })
    }
    // Обновляем параметры в URL
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  return [searchParams, setSearchParams, updateSearchParam]
}


export default useSearchParams