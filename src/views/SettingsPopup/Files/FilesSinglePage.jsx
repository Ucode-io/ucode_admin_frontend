import {Box} from "@mui/material";
import {useSelector} from "react-redux";

import style from "./style.module.scss";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {useForm} from "react-hook-form";
import {useQueryClient} from "react-query";
import DescriptionIcon from "@mui/icons-material/Description";
import {useEffect, useState} from "react";
import MinioSinglePageHeader from "./MinioSinglePageHeader";
import menuService from "../../../services/menuService";
import {store} from "../../../store";
import {
  useFileDeleteMutation,
  useFileGetByIdQuery,
  useFileUpdateMutation,
} from "../../../services/fileService";
import {showAlert} from "../../../store/alert/alert.thunk";
import MinioForm from "./MInioForm";
const cdnURL = import.meta.env.VITE_CDN_BASE_URL;

const FilesSinglePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);

  const {fileId} = useParams();

  const fileID = fileId || searchParams.get("fileId");

  const {control, watch, reset, getValues} = useForm({});

  const {mutate: updateFile, isLoading: updateLoading} = useFileUpdateMutation({
    onSuccess: () => {
      queryClient.refetchQueries(["MINIO_OBJECT"]);
      store.dispatch(showAlert("Успешно", "success"));
      navigate(-1);
    },
  });

  const {mutate: deleteFile, isLoading: deleteLoading} = useFileDeleteMutation({
    onSuccess: () => {
      store.dispatch(showAlert("Успешно", "success"));
      queryClient.refetchQueries(["MINIO_OBJECT"]);
      navigate(-1);
    },
  });

  const deleteFileElements = (id) => {
    deleteFile(id);
  };

  const onSubmit = (data) => {
    updateFile({...getValues(), id: file?.id});
  };

  const {data: file, isLoading} = useFileGetByIdQuery({
    fileId: fileID,
    queryParams: {
      enabled: Boolean(fileID),
      onSuccess: (res) => {
        reset(res);
      },
    },
  });

  const url = `${cdnURL}${watch("link")}`;

  const parts = file?.file_name_download?.split(".") || ".";
  const extension = parts[parts?.length - 1]?.toUpperCase();

  return (
    <>
      <Box className={style.minio}>
        <MinioSinglePageHeader
          menuItem={menuItem}
          file={file}
          onSubmit={onSubmit}
          deleteFileElements={deleteFileElements}
        />

        {extension === "PNG" || extension === "JPEG" || extension === "JPG" ? (
          <Box className={style.image}>
            <img alt="sorry" src={url} />
          </Box>
        ) : (
          <Box className={style.file}>
            <DescriptionIcon />
          </Box>
        )}
        <MinioForm control={control} file={file} />
      </Box>
    </>
  );
};

export default FilesSinglePage;
