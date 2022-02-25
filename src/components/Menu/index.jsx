import { useState, useEffect } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./index.scss";

function Menu({
  title,
  children,
  className,
  isExpanded = false,
  onChange = function () {},
  ...rest
}) {
  const [expand, setExpand] = useState(isExpanded);

  useEffect(() => {
    setExpand(isExpanded);
  }, [isExpanded]);

  return (
    <div {...rest} className={`${className} w-full rounded-sm `}>
      <div
        className={`flex w-full p-3 justify-between cursor-pointer
        ${expand && "bg-background_3 mb-2"}
        rounded-md
        hover:bg-primary-100
        transition ease-out
        duration-500
        sidebarItem flex items-center delay-100 space-x-3 text-gray-700 px-4 py-2  leading-6 hover:text-black font-medium hover:bg-background_2 focus:shadow-outline
        `}
        onClick={onChange}
      >
        <div className={``}>{title}</div>
        <div
          className={`${
            expand ? "-rotate-180" : "rotate-0"
          }  transform transition duration-300 ease-in-out`}
        >
          <ExpandMoreIcon />
        </div>
      </div>

      <div className="flex flex-col space-y-2 children">
        {expand && children}
      </div>
    </div>
  );
}

export default Menu;
