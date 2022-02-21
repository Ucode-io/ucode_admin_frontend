const IconButton = ({ icon, color = "blue", className, ...props }) => {
  return (
    <div className={`inline-block  ${className}`}>
      <div
        className={`
          icon-button
          transition
          focus:outline-none
          focus:ring 
          focus:z-40
          focus:border-${color}-300
          bg-${color}-100`}
        {...props}
      >
        <div className={`flex fill-current text-${color}-600`}>
          {{
            ...icon,
            props: {
              ...icon.props,
              style: { ...icon.props.style, fontSize: 20 },
            },
          }}
        </div>
      </div>
    </div>
  );
};

export default IconButton;
