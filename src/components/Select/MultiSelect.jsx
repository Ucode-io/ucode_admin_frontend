import { ClickAwayListener } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import {
  StatusMenuContainer,
  SelectArrow,
  StatusMenuList,
  StatusMenuOptionContainer,
} from './styles'
import CheckBox from '../Checkbox/CheckBox'
import { useTranslation } from 'react-i18next'
import { LocationOn } from '@material-ui/icons'
import axios from '../../utils/axios'

const Arrow = () => (
  <svg
    height='20'
    width='20'
    viewBox='0 0 20 20'
    aria-hidden='true'
    focusable='false'
    className='css-tj5bde-Svg'
  >
    <path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z' />
  </svg>
)
export function StatusMenuOption({ data, onChange, values }) {
  const handleChange = (e) => {
    if (e.target.checked) {
      onChange([...values, data])
    } else {
      const filteredValues = values.filter(
        (el) => el.value.id !== data?.value?.id
      )
      onChange(filteredValues)
    }
  }

  return (
    <StatusMenuOptionContainer>
      <CheckBox
        checked={!!values.find((el) => el?.value?.id === data?.value?.id)}
        onChange={handleChange}
        label={data?.label}
      />
    </StatusMenuOptionContainer>
  )
}
const handleFormatOptions = (list) => {
  return list && list.length
    ? list.map((elm) => ({ label: elm.name, value: elm }))
    : []
}
function MultiSelect({
  value: values,
  url = '/city',
  params = '',
  queryName = 'name',
  onFetched = (res) => res.cities,
  formatOptions = handleFormatOptions,
  onChange,
  value,
  children,
  queryParams,
  isMulti,
  isClearable,
  icon = <LocationOn />,
  placeholder,
  ...props
}) {
  const { t } = useTranslation()
  const [openMenu, setOpenMenu] = useState(false)
  const [options, setOptions] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)

  const resetValues = () => {
    if (options?.length) {
      onChange(options)
    }
  }

  useEffect(() => {
    if (params?.includes('undefined') || params?.includes('null')) return null
    getOptions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, queryParams])

  const getOptions = () => {
    setLoading(true)
    axios
      .get(url + (params ? `/${params}` : ''))
      .then((res) => setOptions(formatOptions(onFetched(res))))
      .finally(() => setLoading(false))
  }

  return (
    <StatusMenuContainer
      openMenu={openMenu}
      onClick={() => setOpenMenu(true)}
      hasValue={!!values?.length}
    >
      <span>{icon}</span>
      {placeholder}
      <SelectArrow hasValue={!!values?.length}>
        {values?.length ? <span>{values.length}</span> : <Arrow />}
      </SelectArrow>
      {openMenu ? (
        <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
          <StatusMenuList noOptions={!options?.length}>
            <div>
              <button type='button' onClick={resetValues}>
                {options?.length ? 'Hammasi' : 'Topilmadi'}
              </button>
              {options?.map((item) => (
                <StatusMenuOption
                  onChange={onChange}
                  values={values || []}
                  key={item.id}
                  data={item}
                />
              ))}
            </div>
          </StatusMenuList>
        </ClickAwayListener>
      ) : (
        ''
      )}
    </StatusMenuContainer>
  )
}

export default MultiSelect
