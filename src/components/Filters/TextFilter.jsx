import FilterDropdown from "./FilterDropdown"
import Sorter from "./Sorter"

const TextFilter = ({
  title,
  filterOptions,
  onFilter,
  sorter,
  onSort,
  style,
  ...props
}) => (
  <div className="flex justify-between items-center" style={style}>
    <div className="flex items-center gap-2.5 justify-between w-full whitespace-nowrap">
      {title}
      {sorter && <Sorter onChange={onSort} />}
    </div>
    {filterOptions && filterOptions.length ? (
      <FilterDropdown options={filterOptions} onFilter={onFilter} {...props} />
    ) : (
      <></>
    )}
  </div>
)

export default TextFilter
