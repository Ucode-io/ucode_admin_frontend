import { Box } from "@mui/material";
import style from "./style.module.scss";
import { useSelector } from "react-redux";
import MinioHeader from "./components/MinioHeader";
import MinioFilterBlock from "./components/MinioFilterBlock";
import { useMinioObjectListQuery } from "../../../../services/fileService";
import FileUploadModal from "./components/FileUploadModal";
import { useState } from "react";
import MinioFiles from "./components/Miniofiles";

const MinioPage = () => {
  const menuItem = useSelector((state) => state.menu.menuItem);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [fileModalIsOpen, setFileModalIsOpen] = useState(null);
  const [size, setSize] = useState(style.miniocontainersmall);
  const [sort, setSort] = useState("asc");

  const { data: minios, isLoading } = useMinioObjectListQuery({
    folderName: menuItem?.label,
    params: {
      folder_name: menuItem?.label,
      sort: sort,
    },
  });

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
      setSelectedCards(minios?.objects);
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
          minios={minios}
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
          minios={minios}
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
