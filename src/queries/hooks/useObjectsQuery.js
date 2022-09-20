import { useMutation, useQuery } from "react-query";
import constructorObjectService from "../../services/constructorObjectService";


const useObjectsQuery = ({ tableSlug, queryPayload = {}, data }) => {
  
  const query = useQuery(['GET_OBJECT_LIST_QUERY', tableSlug, queryPayload], () => {
    if (!tableSlug) return null
    return constructorObjectService.getList(tableSlug, {
      data: queryPayload,
    })
  })

  sd

  const updateMutation = useMutation(() => {
    return constructorObjectService.update(tableSlug, data)
  })

  const createMutation = useMutation(() => {
    return constructorObjectService.create(tableSlug, data)
  })

  return { query, updateMutation, createMutation }
}
 
export default useObjectsQuery;