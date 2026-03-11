import { Box } from "@mui/material";
import style from "./style.module.scss";
import { useSelector } from "react-redux";
import MinioHeader from "./components/MinioHeader";
import MinioFilterBlock from "./components/MinioFilterBlock";
import { useMinioObjectListQuery } from "../../../../services/fileService";
import FileUploadModal from "./components/FileUploadModal";
import { useEffect, useState } from "react";
import MinioFiles from "./components/Miniofiles";
import { store } from "../../../../store";
import { useSearchParams } from "react-router-dom";
import menuService from "../../../../services/menuService";

const MinioPage = ({ modal = false }) => {
  const [searchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const menuIdFromStore = useSelector((state) => state.settingsModal.menuId);

  const menuId = modal ? menuIdFromStore : searchParams.get("menuId");

  useEffect(() => {
    if (menuId) {
      menuService
        .getByID({
          menuId,
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, [menuId]);

  const [selectedCards, setSelectedCards] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [fileModalIsOpen, setFileModalIsOpen] = useState(null);
  const [size, setSize] = useState(style.miniocontainersmall);
  const [sort, setSort] = useState("asc");
  const [offset, setOffset] = useState(0);
  const [list, setList] = useState([]);
  const limit = 20;

  const company = store.getState().company;

  useEffect(() => {
    setOffset(0);
    setList([]);
  }, [menuItem?.attributes?.path, company.projectId]);

  const { data: minios, isLoading } = useMinioObjectListQuery({
    params: {
      folder_name: menuItem?.attributes?.path,
      // sort: sort,
      project_id: company.projectId,
      limit,
      offset,
    },
    queryParams: {
      onSuccess: (res) => {
        setList((prev) => (offset === 0 ? res?.files || [] : [...prev, ...(res?.files || [])]));
      },
    },
  });

  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollHeight, scrollTop, clientHeight } = e.target.documentElement;
      if (
        scrollHeight - (scrollTop + clientHeight) < 100 &&
        list?.length < minios?.count &&
        !isLoading
      ) {
        setOffset((prev) => prev + limit);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [list?.length, minios?.count, isLoading]);

  const openModal = () => {
    setFileModalIsOpen(true);
  };

  const closeModal = () => {
    setFileModalIsOpen(null);
  };

  const removeCards = (title) => {
    setSelectedCards([]);
  };

  const selectAllCards = () => {
    if (!selectAll) {
      setSelectedCards(list);
    } else {
      setSelectedCards([]);
    }
    setSelectAll(!selectAll);
  };

  return (
    <>
      <Box className={style.minio}>
        <MinioHeader
          menuItem={menuItem}
          openModal={openModal}
          minios={{ ...minios, files: list }}
          selectedCards={selectedCards}
        />

        <MinioFilterBlock
          menuItem={menuItem}
          selectAllCards={selectAllCards}
          selectedCards={selectedCards}
          removeCards={removeCards}
          setSort={setSort}
          sort={sort}
          setSize={setSize}
          size={size}
        />
        <MinioFiles
          modal={modal}
          minios={{ ...minios, files: list }}
          setSelectedCards={setSelectedCards}
          selectedCards={selectedCards}
          size={size}
        />
      </Box>

      {fileModalIsOpen && (
        <FileUploadModal closeModal={closeModal} menuItem={menuItem} />
      )}
    </>
  );
};

export default MinioPage;
