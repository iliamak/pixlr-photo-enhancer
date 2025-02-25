import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    const extension = path.extname(file.name);
    const uniqueFileName = `edited-${uuidv4().slice(0, 8)}${extension}`;
    
    // Путь для сохранения файла
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, uniqueFileName);
    
    // Создаем директорию для загрузок, если она не существует
    await mkdir(uploadDir, { recursive: true });
    
    // Преобразуем файл в буфер и записываем его
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Возвращаем пути к файлу
    return NextResponse.json({
      success: true,
      fileName: uniqueFileName,
      filePath: `/uploads/${uniqueFileName}`,
      fullUrl: `${request.nextUrl.origin}/uploads/${uniqueFileName}`
    });
  } catch (error: any) {
    console.error('Error saving file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save file' },
      { status: 500 }
    );
  }
}
