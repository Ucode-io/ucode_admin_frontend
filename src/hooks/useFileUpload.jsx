import fileService from "@/services/fileService";
import { useState, useRef, useEffect } from "react";
// Не забудьте импортировать ваш fileService

export const useFileUpload = () => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handlePickClick = (e) => {
    e?.stopPropagation(); // Опциональная проверка
    fileInputRef.current?.click();
  };

  // --- Универсальная функция загрузки (используется везде) ---
  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    // Опционально: Фильтрация только картинок
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    const formDataFiles = imageFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return formData;
    });

    try {
      const res = await Promise.all(
        formDataFiles.map((formData) => fileService.folderUpload(formData)),
      );

      const cdnUrl = import.meta.env.VITE_CDN_BASE_URL;

      setImages((prev) => [
        ...prev,
        ...res.map((item) => ({
          url: cdnUrl + item?.link,
          id: item?.id,
          name: item?.title,
        })),
      ]);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // 1. Обработчик для Input
  const onFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    uploadFiles(files);
    e.target.value = "";
  };

  // 2. Обработчики для Drag & Drop
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Проверка, чтобы не сбрасывать стейт при наведении на дочерние элементы
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  };

  // 3. Обработчик для Paste (Ctrl+V)
  const onPaste = (e) => {
    const items = e.clipboardData.items;
    const files = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      // Предотвращаем вставку самого файла как текста (если это div contenteditable)
      // e.preventDefault();
      uploadFiles(files);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const removeImage = (idToRemove) => {
    setImages((prev) => {
      // Примечание: revokObjectURL нужен только если вы создаете blob: ссылки.
      // Если вы используете CDN ссылки, это не обязательно, но не повредит.
      return prev.filter((img) => img.id !== idToRemove);
    });
  };

  useEffect(() => {
    // Очистка (актуальна если были созданы URL.createObjectURL)
    return () => {
      // images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, []);

  return {
    fileInputRef,
    images,
    isDragging, // Состояние для подсветки UI
    handlePickClick,
    onFileUpload: onFileInputChange, // Старое имя для совместимости
    removeImage,
    // Новые пропсы для контейнера
    dragDropProps: {
      onDragOver,
      onDragLeave,
      onDrop,
    },
    onPaste,
  };
};