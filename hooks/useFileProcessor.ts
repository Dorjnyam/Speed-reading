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
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 100);

      // Validate file
      if (!isFileSupported(file)) {
        throw new Error('Unsupported file format. Please use PDF, DOCX, or TXT files.');
      }

      try {
        validateFileSize(file);
      } catch (err: any) {
        throw err;
      }

      // Process file via API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-file', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'File processing failed');
      }

      const data = await response.json();
      return data.text;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
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

