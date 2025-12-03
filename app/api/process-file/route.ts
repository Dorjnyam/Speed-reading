import { NextRequest, NextResponse } from 'next/server';
import { processFile, isFileSupported, validateFileSize } from '@/lib/fileProcessor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл олдсонгүй / No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    if (!isFileSupported(file)) {
      return NextResponse.json(
        { error: 'Дэмжигдээгүй файлын төрөл / Unsupported file type' },
        { status: 400 }
      );
    }

    try {
      validateFileSize(file);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Process file
    const text = await processFile(file);

    // Validate extracted text
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Файлд текст олдсонгүй / No text content found in the file' },
        { status: 400 }
      );
    }

    // Clean up the text
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]+/g, ' ')
      .trim();

    if (cleanText.length < 10) {
      return NextResponse.json(
        { error: 'Файлд хангалтгүй текст байна / File contains insufficient text content' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: cleanText });
  } catch (error: any) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Файл боловсруулах алдаа / File processing error' },
      { status: 500 }
    );
  }
}

