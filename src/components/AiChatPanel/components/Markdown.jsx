import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import cls from "../styles.module.scss";

/** Renders assistant message text as GitHub-flavoured Markdown. */
export const Markdown = ({ children, className = "" }) => (
  <div className={`${cls.markdown} ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
        table: (props) => (
          <div className={cls.tableWrap}>
            <table {...props} />
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);

export default Markdown;
