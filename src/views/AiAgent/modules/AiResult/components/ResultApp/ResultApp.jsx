
import clsx from "clsx";
import cls from "./styles.module.scss";
import { forwardRef } from "react";

export const ResultApp = forwardRef(({ className, srcDoc, loading }, ref) => {
  return (
    <div className={clsx(cls.generatedUi, className)}>
      {loading && (
        <div className={cls.loading}>
          <div className={cls.spinner} />
        </div>
      )}
      {srcDoc && (
        <iframe
          ref={ref}
          id="preview"
          title="Preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          style={{ width: "100%", height: "100%", border: 0 }}
        />
      )}
    </div>
  );
});

ResultApp.displayName = "ResultApp";