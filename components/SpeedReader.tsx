'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/solid';
import { useSpeedReader } from '@/hooks/useSpeedReader';
import { ProgressBar } from './ProgressBar';

interface SpeedReaderProps {
  text: string;
}

export function SpeedReader({ text }: SpeedReaderProps) {
  const t = useTranslations();
  const {
    isPlaying,
    currentWordIndex,
    wpm,
    chunkSize,
    setChunkSize,
    showContext,
    setShowContext,
    pauseOnPunctuation,
    setPauseOnPunctuation,
    readingTime,
    hasText,
    totalWords,
    currentWord,
    progress,
    remainingTime,
    totalWordsRead,
    toggleReading,
    resetReading,
    adjustWPM,
    jumpToPosition,
    words
  } = useSpeedReader(text);

  // Calculate dynamic font size based on word length
  const wordFontSize = useMemo(() => {
    if (!currentWord) return 'clamp(3rem, 12vw, 6rem)';
    
    const wordLength = currentWord.length;
    if (wordLength > 30) {
      return 'clamp(1rem, 6vw, 2.5rem)';
    } else if (wordLength > 20) {
      return 'clamp(1.5rem, 8vw, 3.5rem)';
    } else if (wordLength > 15) {
      return 'clamp(2rem, 10vw, 4.5rem)';
    } else if (wordLength > 10) {
      return 'clamp(2.5rem, 11vw, 5rem)';
    } else {
      return 'clamp(3rem, 12vw, 6rem)';
    }
  }, [currentWord]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Ignore if typing in input fields
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable ||
        (target as HTMLInputElement).type === 'range'
      ) {
        return;
      }

      // Use event.key for better compatibility
      switch (event.key) {
        case ' ':
        case 'Space':
          event.preventDefault();
          toggleReading();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          resetReading();
          break;
        case 'ArrowUp':
          event.preventDefault();
          adjustWPM(25);
          break;
        case 'ArrowDown':
          event.preventDefault();
          adjustWPM(-25);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentWordIndex > 0) {
            jumpToPosition(currentWordIndex - 1);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentWordIndex < totalWords - 1) {
            jumpToPosition(currentWordIndex + 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [toggleReading, resetReading, adjustWPM, jumpToPosition, currentWordIndex, totalWords]);

  const getPreviousWord = () => words[currentWordIndex - 1] || '';
  const getNextWord = () => words[currentWordIndex + 1] || '';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Reader Display */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-gray-700">
        <div className="text-center space-y-8">
          {/* Focus Point and Word Display */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-1 h-1 bg-red-500 rounded-full opacity-30" />
            </div>

            <div
              className={`font-mono font-bold text-gray-900 dark:text-white tracking-wider leading-none min-h-[120px] flex items-center justify-center px-4 overflow-hidden ${
                isPlaying ? 'animate-pulse' : ''
              }`}
            >
              {currentWord ? (
                <span
                  className="relative inline-block text-white break-words max-w-full text-center"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    fontSize: wordFontSize,
                    lineHeight: '1.2'
                  }}
                >
                  {currentWord.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </span>
              ) : (
                <span className="text-gray-400 dark:text-gray-600 text-4xl">
                  {t('speedReader.noTextSelected')}
                </span>
              )}
            </div>

            {/* Word context */}
            {showContext && currentWord && (
              <div className="mt-6 space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 space-x-4 flex flex-wrap items-center justify-center gap-2 px-4">
                  <span className="opacity-60 break-words max-w-xs">{getPreviousWord()}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold break-words max-w-md">
                    {currentWord}
                  </span>
                  <span className="opacity-60 break-words max-w-xs">{getNextWord()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              disabled={!hasText}
              onClick={toggleReading}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isPlaying ? (
                <>
                  <PauseIcon className="w-6 h-6" />
                  <span>{t('speedReader.pause')}</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-6 h-6" />
                  <span>{t('speedReader.play')}</span>
                </>
              )}
            </button>

            <button
              disabled={!hasText}
              onClick={resetReading}
              className="flex items-center space-x-2 px-6 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>{t('speedReader.reset')}</span>
            </button>
          </div>

          {/* Speed Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* WPM Control */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('speedReader.wordsPerMinute')}
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => adjustWPM(-25)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="25"
                    value={wpm}
                    onChange={(e) => adjustWPM(Number(e.target.value) - wpm)}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <button
                    type="button"
                    onClick={() => adjustWPM(25)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {wpm}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    WPM
                  </span>
                </div>
              </div>

              {/* Chunk Size Control */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('speedReader.wordsAtOnce')}
                </label>
                <select
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 word</option>
                  <option value={2}>2 words</option>
                  <option value={3}>3 words</option>
                  <option value={4}>4 words</option>
                </select>
              </div>

              {/* Reading Options */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('speedReader.options')}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showContext}
                      onChange={(e) => setShowContext(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('speedReader.showContext')}
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pauseOnPunctuation}
                      onChange={(e) => setPauseOnPunctuation(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('speedReader.pauseOnPunctuation')}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressBar
          progress={progress}
          currentWordIndex={currentWordIndex}
          totalWords={totalWords}
          remainingTime={remainingTime}
          currentWPM={wpm}
          totalWordsRead={totalWordsRead}
          readingTime={readingTime}
          isPlaying={isPlaying}
          onJumpToPosition={jumpToPosition}
        />

        {/* Text Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('speedReader.textPreview')}
          </h3>
          <div className="max-h-48 overflow-y-auto text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {!hasText ? (
              <p className="italic">{t('speedReader.noTextPreview')}</p>
            ) : (
              <div>
                {words
                  .slice(
                    Math.max(0, currentWordIndex - 10),
                    currentWordIndex + 20
                  )
                  .map((word, index) => {
                    const actualIndex =
                      index + Math.max(0, currentWordIndex - 10);
                    return (
                      <span
                        key={actualIndex}
                        className={`mr-1 px-1 rounded ${
                          actualIndex === currentWordIndex
                            ? 'bg-blue-200 dark:bg-blue-900 font-semibold'
                            : actualIndex < currentWordIndex
                            ? 'opacity-60'
                            : ''
                        }`}
                      >
                        {word}{' '}
                      </span>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          {t('speedReader.keyboardShortcuts')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              Space
            </kbd>
            <span className="text-gray-600 dark:text-gray-400">
              {t('speedReader.playPause')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              R
            </kbd>
            <span className="text-gray-600 dark:text-gray-400">
              {t('speedReader.reset')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              ↑/↓
            </kbd>
            <span className="text-gray-600 dark:text-gray-400">
              {t('speedReader.adjustSpeed')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              ←/→
            </kbd>
            <span className="text-gray-600 dark:text-gray-400">
              {t('speedReader.navigate')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
              Esc
            </kbd>
            <span className="text-gray-600 dark:text-gray-400">
              {t('speedReader.loadNewText')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

