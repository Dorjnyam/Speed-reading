'use client';

import { useState, useCallback } from 'react';
import { isFileSupported, validateFileSize } from '@/lib/fileProcessor';

export function useFileProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const process = useCallback(async (file: File): Promise<string> => {
    setIsProcessing(true);
    setError(null);
    setProgress(10); // Initial progress

    try {
      // Validate file
      if (!isFileSupported(file)) {
        setProgress(0);
        throw new Error('Unsupported file format. Please use PDF, DOCX, or TXT files.');
      }

      setProgress(20);

      // Validate file size
      try {
        validateFileSize(file);
      } catch (err: any) {
        setProgress(0);
        throw err;
      }

      setProgress(30);

      // Process file via API
      const formData = new FormData();
      formData.append('file', file);

      setProgress(50);

      const response = await fetch('/api/process-file', {
        method: 'POST',
        body: formData,
      });

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        setProgress(0);
        throw new Error(errorData.error || 'File processing failed');
      }

      const data = await response.json();
      setProgress(100);
      
      return data.text;
    } catch (err: any) {
      setProgress(0); // Reset on error
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
      // Reset progress after delay
      setTimeout(() => {
        setProgress(0);
      }, 2000);
    }
  }, []);

  return {
    isProcessing,
    error,
    progress,
    processFile: process
  };
}

