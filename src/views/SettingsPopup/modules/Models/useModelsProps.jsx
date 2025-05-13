import {useState} from "react";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import constructorTableService, {
  useTablesListQuery,
} from "@/services/constructorTableService";
import {useQueryClient} from "react-query";

export const useModelsProps = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchText, setSearchText] = useState("");
  const [loader, setLoader] = useState(false);

  const projectId = useSelector((state) => state.auth.projectId);
  const queryClient = useQueryClient();

  const {data: tables} = useTablesListQuery({
    params: {
      search: searchText,
    },
  });

  const navigateToEditForm = (id, slug) => {
    navigate(`${location.pathname}/${id}/`);
  };

  const deleteTable = async (id) => {
    setLoader(true);
    constructorTableService
      .delete(id, projectId)
      .then(() => {
        queryClient.refetchQueries(["TABLES"]);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return {
    tables,
    loader,
    setSearchText,
    navigateToEditForm,
    deleteTable,
  };
};
