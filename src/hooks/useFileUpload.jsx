import fileService from "@/services/fileService";
import { useEffect, useRef, useState } from "react";

export const useFileUpload = () => {

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

  const handlePickClick = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const onFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // const newImages = files.map((file) => ({
    //   file: file,
    //   url: URL.createObjectURL(file),
    //   name: file.name,
    //   id: Date.now() + Math.random(),
    // }));

    const formDataFiles = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return formData;
    });

    const res = await Promise.all(formDataFiles.map((formData) => fileService.folderUpload(formData))).then((res) => {
      return res
    });

    const cdnUrl = import.meta.env.VITE_CDN_BASE_URL

    setImages((prev) => [...prev, ...res.map(item => ({url: cdnUrl + item?.link, id: item?.id, name: item?.title}))]);

    e.target.value = "";
  };

  const removeImage = (idToRemove) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === idToRemove);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter((img) => img.id !== idToRemove);
    });
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);


  return {
    fileInputRef,
    images,
    handlePickClick,
    onFileUpload,
    removeImage
  }

}