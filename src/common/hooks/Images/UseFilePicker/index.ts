import { useState, useRef, useEffect } from "react";

export const useFilePicker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isClicking = useRef(false);

  const pickFile = () => {
    if (isClicking.current) {
      isClicking.current = true;
      inputRef.current?.click();
      setTimeout(() => (isClicking.current = false), 500);
    }
  };

  const resizeImage = (file: File, targetSize = 512): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas context not available");

        canvas.width = targetSize;
        canvas.height = targetSize;

        const ratio = Math.min(targetSize / img.width, targetSize / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        const xOffset = (targetSize - newWidth) / 2;
        const yOffset = (targetSize - newHeight) / 2;

        ctx.clearRect(0, 0, targetSize, targetSize);

        ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

        resolve(canvas.toDataURL("image/png", 0.8));
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      resizeImage(selectedFile, 256).then((resizedDataUrl) => {
        setFile(selectedFile);
        setFileDataUrl(resizedDataUrl);
      });
    } else {
      setFile(null);
      setFileDataUrl(null);
      alert("Por favor, selecione uma imagem válida.");
    }
  };

  useEffect(() => {
    let previewUrl: string | undefined;
    if (file) previewUrl = URL.createObjectURL(file);
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file]);

  return { file, fileDataUrl, inputRef, pickFile, onFileChange };
};
