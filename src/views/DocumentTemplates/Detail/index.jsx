import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Button } from "@mui/material";
import Editor from "../components/Editor";
import useId from "../../../hooks/useId";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import {
  useDocxTemplateByIdQuery,
  useDocxTemplateCreateMutation,
  useDocxTemplateUpdateMutation,
} from "../../../services/docxTemplateService";
import { useQueryClient } from "react-query";
import { showAlert } from "../../../store/alert/alert.thunk";
import { useForm } from "react-hook-form";
import RingLoaderWithWrapper from "../../../components/Loaders/RingLoader/RingLoaderWithWrapper";

const breadCrumbItems = [
  { label: "ЭДО", link: "" },
  { label: "Список шаблонов", link: "" },
  { label: "Новый шаблон", link: "" },
];

const DocumentTemplateDetail = () => {
  const editorId = useId();
  const { appId, tableSlug, templateId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fileUrl, setFileUrl] = useState();

  const [btnIsLoading, setBtnIsLoading] = useState(false);

  const onSaveClick = () => {
    setBtnIsLoading(true);
    const editorInstance = window.DocEditor?.instances?.[editorId];
    editorInstance?.downloadAs("docx");
  };

  const { register, getValues, reset } = useForm();

  const { isLoading } = useDocxTemplateByIdQuery({
    id: templateId,
    querySettings: {
      enabled: Boolean(templateId),
      cacheTime: false,
      onSuccess: (res) => {
        reset({ title: res?.title });
        setFileUrl(res.file_url);
      },
    },
  });

  const { mutate: createTemplate } = useDocxTemplateCreateMutation({
    onSuccess: (res) => {
      queryClient.removeQueries("DOCX_TEMPLATES");
      navigate(
        `/main/${appId}/object/${tableSlug}/templates?templateId=${res?.id}`,
        { replace: true }
      );
      showAlert("Successfully created", "success");
    },
    onError: () => {
      setBtnIsLoading(false);
    },
  });

  const { mutate: updateTemplate } = useDocxTemplateUpdateMutation({
    onSuccess: () => {
      queryClient.removeQueries("DOCX_TEMPLATES");
      navigate(
        `/main/${appId}/object/${tableSlug}/templates?templateId=${templateId}`,
        { replace: true }
      );
      showAlert("Successfully updated", "success");
    },
    onError: () => {
      setBtnIsLoading(false);
    },
  });

  const onDownload = (e) => {
    const url = e?.data?.url;

    const data = {
      file_url: url,
      id: templateId,
      table_slug: tableSlug,
      title: getValues()?.title,
    };

    if (templateId) updateTemplate(data);
    else createTemplate(data);
  };

  if (isLoading) return <RingLoaderWithWrapper style={{ height: "100vh" }} />;

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.homeButton}>
          <img src="/img/homeIcon.svg" alt="" />
        </div>

        {breadCrumbItems?.map((item, index) => (
          <>
            <div className={styles.arrowIcon}>
              <KeyboardArrowRightIcon
                sx={{ color: "#D0D5DD", height: "19px" }}
              />
            </div>
            <div
              className={`${styles.item} ${index === breadCrumbItems?.length - 1 ? styles.active : ""}`}
            >
              {item.label}
            </div>
          </>
        ))}
      </div>

      <div className={styles.titleBlock}>
        {/* <h3 className={styles.title}>Новый шаблон</h3> */}
        <input
          {...register("title")}
          className={styles.titleInput}
          placeholder="Введите название шаблона"
        />

        <div className={styles.buttons}>
          <LoadingButton
            onClick={onSaveClick}
            variant="contained"
            loading={btnIsLoading}
            className={styles.primaryButton}
          >
            Сохранить
          </LoadingButton>
          <Button
            variant="outlined"
            className={styles.secondaryButton}
            onClick={() =>
              navigate(
                `/main/${appId}/object/${tableSlug}/templates?templateId=${templateId}`,
                { replace: true }
              )
            }
          >
            Отменить
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <Editor
          id={editorId}
          onDownLoad={onDownload}
          url={fileUrl ? `https://${fileUrl}` : null}
        />
      </div>
    </div>
  );
};

export default DocumentTemplateDetail;
