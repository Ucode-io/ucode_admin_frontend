import { useState } from "react";

export const useFunctionsLogProps = () => {

  const [inputValue, setInputValue] = useState("");

  const [activeFn, setActiveFn] = useState({});

  const [functionValue, setFunctionValue] = useState(null)

  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const changeHandler = (newValue) => {
    setFunctionValue(newValue);
  };

  const onRowClick = (element) => {
    setActiveFn(element);
  };


  return {
    inputValue,
    setInputValue,
    functionValue,
    pageCount,
    setPageCount,
    currentPage,
    setCurrentPage,
    changeHandler,
    count: 0,
    functionOptions: [],
    data: [],
    onRowClick,
    activeFn,
    isLoading: false,
  }
}