import { Dialog, DialogContent } from "@mui/material";
import MicrofrontendComponent from "../MicrofrontendComponent";
import cls from "./styles.module.scss";
import { useQuery } from "react-query";
import microfrontendService from "../../services/microfrontendService";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import useSearchParams from "../../hooks/useSearchParams";
import { useEffect } from "react";

export const MicroFrontendPopup = ({
  open,
  handleClose,
  microFrontendId,
  itemId,
}) => {
  const [searchParams, setSearchParams, updateSearchParam] = useSearchParams();

  useEffect(() => {
    if (open) {
      searchParams.set("id", itemId);
      setSearchParams(searchParams, { replace: true });
    }
  }, [itemId, open]);

  const { data, isLoading } = useQuery(
    ["GET_MICROFRONTEND_BY_ID", microFrontendId, open],
    () => {
      return microfrontendService.getById(microFrontendId);
    },
    {
      enabled: !!microFrontendId && open,
    }
  );

  const link = data?.url
    ? `https://${data?.url}/assets/remoteEntry.js`
    : undefined;

  if (!link) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={cls.dialog}
      PaperProps={{
        sx: {
          borderRadius: "12px !important",
          maxWidth: "1150px !important",
          width: "100% !important",
        },
      }}
    >
      <DialogContent className={cls.dialogContent} sx={{ padding: 0 }}>
        {isLoading ? (
          <RingLoaderWithWrapper style={{ height: "100%" }} />
        ) : (
          <MicrofrontendComponent link={link} />
        )}
      </DialogContent>
    </Dialog>
  );
};
