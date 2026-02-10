import { getFileIcon } from "@/utils/getFileIcon";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import cls from "./styles.module.scss";
import clsx from "clsx";

export const GlobalSearch = ({
  searchQuery,
  searchResults,
  handleGlobalSearch,
  jumpToCode,
  expandedFiles,
  toggleFile,
}) => {

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className={cls.highlighted}>
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    );
  };


  return <div className={cls.search}>
    <div className={cls.searchInputWrapper}>
      <input
        className={cls.searchInput}
        value={searchQuery}
        autoFocus
        onChange={(e) => handleGlobalSearch(e.target.value)}
        type="text"
        placeholder="Search"
      />
    </div>

    <div className={cls.searchResults}>
      {searchResults.length === 0 && searchQuery && (
        <div className={cls.noResults}>No results found</div>
      )}
      {searchResults.map((group) => (
        <div key={group.filePath} className={cls.searchResult}>
          <span
            className={cls.searchResultPath}
            onClick={() => toggleFile(group.filePath)}
          >
            <span
              className={clsx(cls.searchResultPathArrow, {
                [cls.expanded]: expandedFiles[group.filePath],
              })}
            >
              <KeyboardArrowDownIcon fontSize="small" />
            </span>
            <span className={cls.searchResultPathName}>
              <span>{getFileIcon(group.filePath)}</span>
              <span>{group.filePath?.split("/").pop()}</span>
            </span>
            <span className={cls.searchResultPathParent}>
              {group.filePath?.split("/").slice(0, -1).join("/")}
            </span>
            <span className={cls.searchResultPathMatches}>
              {group.matches.length}
            </span>
          </span>
          {expandedFiles[group.filePath] && (
            <div className={cls.searchResultMatches}>
              {group.matches.map((match, idx) => (
                <div
                  key={idx}
                  onClick={() => jumpToCode(group.file, match.lineNumber)}
                  className={cls.searchResultMatch}
                >
                  <div className={cls.searchResultMatchLine}>
                    {match.lineNumber}
                  </div>
                  <div className={cls.searchResultMatchContent}>
                    <div className={cls.searchResultMatchLineContent}>
                      {highlightMatch(match.lineContent, searchQuery)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
}