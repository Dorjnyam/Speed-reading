// PDF processing (server-only)
export async function processPDF(file: File): Promise<string> {
  try {
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse.default(buffer);
    
    if (!data || !data.text) {
      throw new Error('PDF файлд текст олдсонгүй. / No text found in PDF file.');
    }
    
    return data.text;
  } catch (error: any) {
    console.error('PDF processing error:', error);
    if (error.message?.includes('No text found')) {
      throw error;
    }
    throw new Error(`PDF файл боловсруулах алдаа. TXT эсвэл DOCX формат ашиглахыг зөвлөж байна. / PDF processing error. Please try TXT or DOCX format.`);
  }
}

// DOCX processing
export async function processDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX processing warnings:', result.messages);
    }
    
    return result.value || '';
  } catch (error: any) {
    console.error('DOCX processing error:', error);
    throw new Error(`DOCX файл боловсруулах алдаа. / DOCX processing error: ${error.message}`);
  }
}

// TXT processing
export async function processTXT(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text || '';
  } catch (error: any) {
    console.error('TXT processing error:', error);
    throw new Error(`Текст файл унших алдаа. / Text file reading error: ${error.message}`);
  }
}

// Main file processor
export async function processFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await processPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await processDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await processTXT(file);
    } else {
      throw new Error('Дэмжигдээгүй файлын төрөл. / Unsupported file type');
    }
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
}

export function getSupportedFormats() {
  return [
    {
      extension: '.pdf',
      mimeType: 'application/pdf',
      description: 'PDF Documents'
    },
    {
      extension: '.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      description: 'Word Documents'
    },
    {
      extension: '.txt',
      mimeType: 'text/plain',
      description: 'Text Files'
    }
  ];
}

export function isFileSupported(file: File): boolean {
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const supportedExtensions = ['.pdf', '.docx', '.txt'];
  const fileName = file.name.toLowerCase();
  
  return (
    supportedTypes.includes(file.type.toLowerCase()) ||
    supportedExtensions.some(ext => fileName.endsWith(ext))
  );
}

export function validateFileSize(file: File, maxSizeMB: number = 50): boolean {
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    throw new Error(
      `File size (${fileSizeMB.toFixed(1)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
    );
  }
  return true;
}

