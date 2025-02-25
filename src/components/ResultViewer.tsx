import Image from 'next/image';

interface ResultViewerProps {
  imageUrl: string;
  originalImageUrl?: string;
  onReset: () => void;
}

export default function ResultViewer({ imageUrl, originalImageUrl, onReset }: ResultViewerProps) {
  const handleDownload = () => {
    // Создаем ссылку для скачивания
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = imageUrl.split('/').pop() || 'enhanced-image';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 card">
      <h2 className="text-2xl font-bold mb-4 text-center">Готово! Ваше изображение улучшено</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {originalImageUrl && (
          <div className="flex-1">
            <p className="text-center mb-2 font-medium">Оригинал</p>
            <div className="relative w-full h-64 border border-gray-200 rounded overflow-hidden">
              <Image 
                src={originalImageUrl} 
                alt="Оригинальное изображение" 
                fill
                style={{ objectFit: 'contain' }} 
              />
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <p className="text-center mb-2 font-medium">Улучшенное изображение</p>
          <div className="relative w-full h-64 border border-gray-200 rounded overflow-hidden">
            <Image 
              src={imageUrl} 
              alt="Улучшенное изображение" 
              fill
              style={{ objectFit: 'contain' }} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <button 
          onClick={handleDownload} 
          className="btn bg-green-500 hover:bg-green-600"
        >
          Скачать изображение
        </button>
        <button 
          onClick={onReset} 
          className="btn bg-blue-500 hover:bg-blue-600"
        >
          Редактировать новое изображение
        </button>
      </div>
    </div>
  );
}