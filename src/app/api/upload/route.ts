import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Функция для получения уникального имени файла
const getUniqueFileName = (originalFileName: string) => {
  const extension = path.extname(originalFileName);
  const baseName = path.basename(originalFileName, extension);
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '');
  const uniqueId = uuidv4().slice(0, 8);
  return `${sanitizedBaseName}-${uniqueId}${extension}`;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Создаем уникальное имя файла
    const uniqueFileName = getUniqueFileName(file.name);
    
    // Путь для сохранения файла
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, uniqueFileName);
    
    // Создаем директорию для загрузок, если она не существует
    await mkdir(uploadDir, { recursive: true });
    
    // Преобразуем файл в буфер и записываем его
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Возвращаем путь к файлу и имя файла
    return NextResponse.json({
      success: true,
      fileName: uniqueFileName,
      filePath: `/uploads/${uniqueFileName}`
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
