import { useState, useRef } from 'react';
import Image from 'next/image';

interface FileUploaderProps {
  onFileUploaded: (filePath: string, fileName: string) => void;
}

export default function FileUploader({ onFileUploaded }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFile = async (file: File) => {
    // Проверяем, что загружен файл изображения
    if (!file.type.match('image.*')) {
      setError('Пожалуйста, загрузите изображение (JPEG, PNG, GIF, и т.д.)');
      return;
    }
    
    // Сбрасываем предыдущую ошибку
    setError(null);
    setIsUploading(true);
    
    // Создаем превью
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Загружаем файл на сервер
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка загрузки файла');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Передаем информацию о загруженном файле родительскому компоненту
        onFileUploaded(data.filePath, data.fileName);
      } else {
        throw new Error(data.error || 'Ошибка загрузки файла');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при загрузке файла');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${isUploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {preview ? (
          <div className="relative w-full h-64 mx-auto mb-4">
            <Image 
              src={preview} 
              alt="Предпросмотр изображения" 
              fill
              style={{ objectFit: 'contain' }} 
            />
          </div>
        ) : (
          <div className="text-6xl text-gray-300 mb-4">
            📁
          </div>
        )}
        
        <p className="mb-2 text-gray-700">
          {isUploading ? 'Загрузка...' : 'Перетащите изображение сюда или'}
        </p>
        
        <button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="btn mt-2"
        >
          Выберите файл
        </button>
        
        {error && (
          <p className="mt-3 text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}