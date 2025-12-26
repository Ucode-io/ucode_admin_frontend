import clsx from "clsx"
import cls from "./styles.module.scss"
import { forwardRef } from "react"

export const GeneratedUi = forwardRef(({className}, ref) => {
  return <div className={clsx(cls.generatedUi, className)} ref={ref}>
    <section id="generated-ui" >
      <h1 id="generated-ui-title" data-test="generated-ui-title">Generated UI</h1>
      <p id="generated-ui-description" data-test="generated-ui-description">Generated UI will be displayed here</p>
    </section>
  </div> 
});

GeneratedUi.displayName = "GeneratedUi";
