import AsyncSelect from "react-select/async";

export default function Async() {
  const fetchOptions = () => {
    return new Promise((resolve, reject) => {
      var timer = setTimeout(() => {
        clearTimeout(timer);
        resolve([
          { label: "option 1", value: "option 1" },
          { label: "option 2", value: "option 2" },
        ]);
      }, 500);
    });
  };

  const changeHandler = (e) => {
    console.log(e);
  };

  const inputChangeHandler = (e) => {
    console.log(e);
  };

  return (
    <AsyncSelect
      isMulti
      isClearable
      cacheOptions
      defaultOptions
      loadOptions={fetchOptions}
      onChange={changeHandler}
      onInputChane={inputChangeHandler}
    />
  );
}
