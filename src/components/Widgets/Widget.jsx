import Card from "../Card/index";
// import { Home } from "@material-ui/icons"
import AnimatedNumber from "react-animated-number";

const Widget = ({ Icon, number, title }) => {
  return (
    <Card style={{ flex: 1 }}>
      <div className="w-full flex items-center justify-between gap-1">
        <div className="info-block">
          <h3 className="number">
            <AnimatedNumber
              value={number}
              style={{
                transition: "linear",
                fontSize: 24,
                transitionProperty: "background-color, color, opacity",
              }}
              duration={500}
              formatValue={(n) => new Intl.NumberFormat().format(n)}
            />
          </h3>
          <p className="subtitle">{title ?? "---"}</p>
        </div>

        <div className="icon-block">{Icon && <Icon className="icon" />}</div>
      </div>
    </Card>
  );
};

export default Widget;
