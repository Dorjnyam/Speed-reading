'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import {
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { getSupportedFormats } from '@/lib/fileProcessor';

interface FileUploaderProps {
  onTextLoaded: (text: string) => void;
}

export function FileUploader({ onTextLoaded }: FileUploaderProps) {
  const t = useTranslations();
  const { isProcessing, error, progress, processFile } = useFileProcessor();
  const [isDragOver, setIsDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const supportedFormats = getSupportedFormats();

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      await processFileUpload(files[0]);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!dropZoneRef.current?.contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const processFileUpload = async (file: File) => {
    setLocalError(null);

    try {
      const text = await processFile(file);
      onTextLoaded(text);
      setTextInput('');
    } catch (err: any) {
      setLocalError(err.message || t('fileUploader.fileProcessingError'));
    }
  };

  const loadTextContent = () => {
    if (textInput.trim()) {
      onTextLoaded(textInput.trim());
      setTextInput('');
    }
  };

  const displayError = localError || error;

  return (
    <div className="space-y-4">
      {/* File Drop Zone */}
      <div
        ref={dropZoneRef}
        className={`file-drop-zone ${isDragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <DocumentArrowUpIcon className="h-12 w-12 text-gray-400" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('fileUploader.uploadDocument')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('fileUploader.dragDrop')}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="btn-primary"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
            >
              {!isProcessing ? (
                t('fileUploader.chooseFile')
              ) : (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('fileUploader.processing')}
                </span>
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{t('fileUploader.processing')}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full progress-bar transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {t('fileUploader.fileProcessingError')}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {displayError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Supported Formats */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t('fileUploader.supportedFormats')}
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              <ul className="list-disc list-inside space-y-1">
                {supportedFormats.map((format) => (
                  <li key={format.extension}>
                    <span className="font-mono">{format.extension}</span> -{' '}
                    {format.description}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs">{t('fileUploader.maxFileSize')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Text Input Alternative */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
          <span className="px-3 text-sm text-gray-500 dark:text-gray-400">
            {t('fileUploader.orPasteText')}
          </span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
        </div>

        <div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t('fileUploader.pasteTextPlaceholder')}
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {textInput.split(' ').filter((w) => w.length > 0).length}{' '}
              {t('fileUploader.words')}
            </span>

            {textInput.trim() && (
              <button
                type="button"
                className="btn-primary text-sm py-1 px-3"
                onClick={loadTextContent}
              >
                {t('fileUploader.loadText')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

