'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUploader from '@/components/FileUploader';
import PixlrEditor from '@/components/PixlrEditor';
import ResultViewer from '@/components/ResultViewer';

enum Step {
  UPLOAD,
  EDIT,
  RESULT
}

export default function EnhancePage() {
  const [step, setStep] = useState<Step>(Step.UPLOAD);
  const [originalImagePath, setOriginalImagePath] = useState<string>('');
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [enhancedImagePath, setEnhancedImagePath] = useState<string>('');
  const [enhancedFileName, setEnhancedFileName] = useState<string>('');

  // Обработчик загрузки файла
  const handleFileUploaded = (filePath: string, fileName: string) => {
    setOriginalImagePath(filePath);
    setOriginalFileName(fileName);
    setStep(Step.EDIT);
  };

  // Обработчик завершения редактирования
  const handleEditComplete = (filePath: string, fileName: string) => {
    setEnhancedImagePath(filePath);
    setEnhancedFileName(fileName);
    setStep(Step.RESULT);
  };

  // Обработчик отмены редактирования
  const handleEditCancel = () => {
    setStep(Step.UPLOAD);
  };

  // Обработчик сброса результата
  const handleReset = () => {
    setOriginalImagePath('');
    setOriginalFileName('');
    setEnhancedImagePath('');
    setEnhancedFileName('');
    setStep(Step.UPLOAD);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-blue-500 hover:underline">
            ← На главную
          </Link>
          <h1 className="text-3xl font-bold text-center">Улучшение фото</h1>
          <div className="w-24"></div> {/* Пустое пространство для выравнивания */}
        </div>
      </header>

      <main>
        {step === Step.UPLOAD && (
          <div className="card p-8">
            <h2 className="text-2xl font-medium mb-6 text-center">Загрузите изображение для улучшения</h2>
            <FileUploader onFileUploaded={handleFileUploaded} />
          </div>
        )}

        {step === Step.EDIT && originalImagePath && (
          <div className="h-[70vh]">
            <PixlrEditor 
              imageUrl={originalImagePath}
              fileName={originalFileName}
              onEditComplete={handleEditComplete}
              onCancel={handleEditCancel}
            />
          </div>
        )}

        {step === Step.RESULT && enhancedImagePath && (
          <ResultViewer 
            imageUrl={enhancedImagePath}
            originalImageUrl={originalImagePath}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}