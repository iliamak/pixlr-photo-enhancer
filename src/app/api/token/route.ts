import { NextRequest, NextResponse } from 'next/server';
import { createToken, PixlrPayloadJWT } from '@/utils/pixlr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, origin, openUrl, saveUrl, follow } = body;
    
    let payload: PixlrPayloadJWT;
    
    if (mode === 'embedded') {
      payload = {
        mode: 'embedded',
        origin: origin || request.headers.get('origin') || '',
        settings: {
          workspace: 'light',
          accent: 'blue',
          // Отключаем ненужные инструменты для упрощения интерфейса
          disabledTools: [
            'cutout', 'liquify', 'add-text', 'add-element', 'frame',
            'marquee', 'lasso', 'wand', 'clone', 'disperse', 'pen',
            'fill', 'draw', 'shape', 'eraser', 'replace', 'gradient', 'text'
          ],
          // Разрешаем только нужные форматы экспорта
          exportFormats: ['jpeg', 'png', 'webp']
        }
      };
    } else {
      // HTTP режим требует URL для открытия и сохранения
      if (!openUrl || !saveUrl) {
        return NextResponse.json(
          { error: 'openUrl and saveUrl are required for HTTP mode' },
          { status: 400 }
        );
      }
      
      payload = {
        mode: 'http',
        openUrl,
        saveUrl,
        follow: follow ?? true,
        settings: {
          workspace: 'light',
          accent: 'blue',
          disabledTools: [
            'cutout', 'liquify', 'add-text', 'add-element', 'frame',
            'marquee', 'lasso', 'wand', 'clone', 'disperse', 'pen',
            'fill', 'draw', 'shape', 'eraser', 'replace', 'gradient', 'text'
          ],
          exportFormats: ['jpeg', 'png', 'webp']
        }
      };
    }
    
    const token = await createToken(payload);
    
    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate token' },
      { status: 500 }
    );
  }
}
