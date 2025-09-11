import constructorFieldService from "../services/constructorFieldService";
import constructorRelationService from "../services/constructorRelationService";
import { FIELD_TYPES } from "./constants/fieldTypes";

const deleteField = ({ column, tableSlug, callback = () => {} }) => {
  if (
    column?.type === FIELD_TYPES.LOOKUP ||
    column?.type === FIELD_TYPES.LOOKUPS
  ) {
    constructorRelationService
      .delete(column?.relation_id, tableSlug)
      .then(callback);
  } else {
    constructorFieldService.delete(column, tableSlug).then(callback);
  }
};

export default deleteField