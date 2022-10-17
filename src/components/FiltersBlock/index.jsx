import "./style.scss";

const FiltersBlock = ({ children, extra, ...props }) => {
  return (
    <div
      className="FiltersBlock"
      style={{ height: props.summary ? "70px" : "" }}
      {...props}
    >
      <div className="side">{children}</div>
      <div className="side"> {extra}</div>
    </div>
  );
};

export default FiltersBlock;
