import { NextRequest, NextResponse } from 'next/server';
import { processFile, isFileSupported, validateFileSize } from '@/lib/fileProcessor';

// Simple rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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
