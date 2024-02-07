export const ActivityFeedColors = (name) => {
  switch (name) {
    case "GET":
      return "#61affe";
    case "POST":
      return "#49cc90";
    case "CREATE":
      return "#49cc90";
    case "LOGIN":
      return "#49cc90";
    case "UPDATE":
      return "#fca130";
    case "DELETE":
      return "#f93e3e";
    default:
      return "-";
  }
};
export const ActivityFeedBackground = (name) => {
  switch (name) {
    case "GET":
      return "rgba(97,175,254,.1)";
    case "POST":
      return "rgba(73,204,144,.1)";
    case "CREATE":
      return "rgba(73,204,144,.1)";
    case "LOGIN":
      return "rgba(73,204,144,.1)";
    case "UPDATE":
      return "rgba(252,161,48,.1)";
    case "DELETE":
      return "rgba(249,62,62,.1)";
    default:
      return "-";
  }
};

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "transparent",
    width: "100%",
    display: "flex",
    alignItems: "center",
    // border: "0px solid #fff",
    minWidth: "200px",
    outline: "none",
    maxHeight: "35px",
    minHeight: "35px"
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
    // border: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    display: "flex",
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? "#007AFF" : provided.background,
    color: state.isSelected ? "#fff" : provided.color,
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};