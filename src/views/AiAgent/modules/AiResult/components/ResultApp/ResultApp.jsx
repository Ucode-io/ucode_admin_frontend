
import clsx from "clsx";
import cls from "./styles.module.scss";
import { forwardRef } from "react";
import { useResultAppProps } from "./useResultAppProps";

export const ResultApp = forwardRef(({ className }, ref) => {
  useResultAppProps();

  return (
    <div className={clsx(cls.generatedUi, className)}>
      <iframe
        ref={ref}
        id="preview"
        src="/iframe.html"
        sandbox="allow-scripts"
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
});

ResultApp.displayName = "ResultApp";
