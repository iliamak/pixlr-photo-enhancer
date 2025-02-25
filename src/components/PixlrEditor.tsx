import { useEffect, useRef, useState } from 'react';
import { Editor } from '@pixlrlte/pixlr-sdk';

interface PixlrEditorProps {
  imageUrl: string;
  fileName: string;
  onEditComplete: (editedImageUrl: string, editedFileName: string) => void;
  onCancel: () => void;
}

export default function PixlrEditor({ imageUrl, fileName, onEditComplete, onCancel }: PixlrEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let editor: Editor | null = null;
    let mounted = true;
    
    const initPixlr = async () => {
      try {
        setLoading(true);
        
        // Получаем JWT токен с нашего API
        const tokenResponse = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode: 'embedded',
            origin: window.location.origin,
          }),
        });
        
        if (!tokenResponse.ok) {
          throw new Error('Не удалось получить токен для редактора');
        }
        
        const { token } = await tokenResponse.json();
        
        if (!iframeRef.current) {
          throw new Error('Iframe еще не инициализирован');
        }
        
        // Подключаем Pixlr Editor
        editor = await Editor.connect(token, iframeRef.current);
        
        // Функция для загрузки изображения
        const loadImage = async (url: string) => {
          try {
            // Получаем изображение по URL
            const response = await fetch(url);
            const blob = await response.blob();
            
            // Создаем File объект из blob
            const file = new File([blob], fileName, { type: blob.type });
            
            // Открываем файл в редакторе
            for await (const editedFile of editor!.open(file)) {
              if (!mounted) break;
              
              // Если редактирование закончено и есть результирующий файл
              if (editedFile) {
                // Загружаем отредактированное изображение на сервер
                const formData = new FormData();
                formData.append('file', editedFile);
                
                const saveResponse = await fetch('/api/save', {
                  method: 'POST',
                  body: formData,
                });
                
                if (!saveResponse.ok) {
                  throw new Error('Не удалось сохранить отредактированное изображение');
                }
                
                const saveData = await saveResponse.json();
                
                if (saveData.success) {
                  onEditComplete(saveData.filePath, saveData.fileName);
                }
              }
            }
          } catch (err: any) {
            if (mounted) {
              setError(err.message || 'Произошла ошибка при редактировании изображения');
            }
          }
        };
        
        // Загружаем изображение в редактор
        await loadImage(imageUrl);
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Не удалось инициализировать редактор Pixlr');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initPixlr();
    
    return () => {
      mounted = false;
      editor = null;
    };
  }, [imageUrl, fileName, onEditComplete]);
  
  const handleCancel = () => {
    onCancel();
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-gray-100 p-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Редактор изображения</h2>
        <button 
          onClick={handleCancel}
          className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Отмена
        </button>
      </div>
      
      <div className="flex-1 relative border-2 border-blue-400">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3">Загрузка редактора...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center text-red-500 p-6 max-w-md">
              <p className="text-xl mb-3">😕 Ошибка</p>
              <p>{error}</p>
              <button 
                onClick={handleCancel}
                className="mt-4 btn bg-red-500 hover:bg-red-600"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          src="about:blank"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}