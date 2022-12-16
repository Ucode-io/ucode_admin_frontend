import "./style.scss";

const FiltersBlock = ({ children, extra, ...props }) => {
  return (
    <div className="FiltersBlock" {...props}>
      <div className="side">{children}</div>
      <div className="side"> {extra}</div>
    </div>
  );
};

export default FiltersBlock;
