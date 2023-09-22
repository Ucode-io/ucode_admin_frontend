import { HiOutlineDatabase } from "react-icons/hi"
import {SiMongodb, SiPostgresql} from "react-icons/si"


export const resourceTypes = [
  {
    label: 'Not decided',
    value: 0,
    icon: HiOutlineDatabase
  },
  {
    label: 'MongoDB',
    value: 1,
    icon: SiMongodb
  },
  {
    label: 'Clickhouse',
    value: 2,
    icon: HiOutlineDatabase
  },
  {
    label: 'PosgreSQL',
    value: 3,
    icon: SiPostgresql
  }
]

export const serviceTypes = [
  {
    label: 'Not specified',
    value: 0
  },
  {
    label: 'Builder service',
    value: 1
  },
  {
    label: 'Analytics service',
    value: 2
  }
]


export const getResourceTypeByID = (type) => {
  return resourceTypes.find(el => el.value === type)?.label
}

export const getResourceTypeIconID = (type) => {
  return resourceTypes.find(el => el.value === type)?.icon
}

export const getServiceTypeByID = (service) => {
  return serviceTypes.find(el => el.value === service)?.label
}