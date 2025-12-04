'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  BookOpenIcon,
  SunIcon,
  MoonIcon,
  BoltIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FileUploader } from './FileUploader';
import { SpeedReader } from './SpeedReader';

export function MainPage() {
  const t = useTranslations();
  const { theme, toggleTheme } = useTheme();
  const [currentText, setCurrentText] = useState('');

  const handleTextExtracted = (text: string) => {
    setCurrentText(text);
  };

  const loadNewText = () => {
    setCurrentText('');
  };

  // Keyboard shortcut for ESC to load new text
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Ignore if typing in input fields
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // ESC key to load new text (only when text is loaded)
      if (event.key === 'Escape' && currentText) {
        event.preventDefault();
        loadNewText();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpenIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {t('app.title')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {t('app.subtitle')}
                </p>
              </div>
            </div>

            {/* Language Switcher and Theme Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
              <LanguageSwitcher />

              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        {!currentText && (
          <div className="text-center space-y-6 sm:space-y-8 mb-8 sm:mb-12">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white px-2">
                {t('pages.index.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                {t('pages.index.subtitle')}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <BoltIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('pages.index.lightningFast')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('pages.index.lightningFastDesc')}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <DocumentTextIcon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('pages.index.multipleFormats')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('pages.index.multipleFormatsDesc')}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <EyeIcon className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('pages.index.betterFocus')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('pages.index.betterFocusDesc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Section */}
        {!currentText && (
          <div className="mb-8">
            <FileUploader onTextLoaded={handleTextExtracted} />
          </div>
        )}

        {/* Speed Reader Component */}
        {currentText && (
          <div>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {t('speedReader.readingSession')}
                </h2>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {currentText.split(/\s+/).length} {t('pages.index.words')}
                </div>
              </div>
              <button
                type="button"
                onClick={loadNewText}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>{t('speedReader.loadNewText')}</span>
              </button>
            </div>

            <SpeedReader text={currentText} />
          </div>
        )}

        {/* Tips Section */}
        {!currentText && (
          <div className="mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {t('pages.index.speedReadingTips')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{num}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {t(`pages.index.tip${num}Title`)}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t(`pages.index.tip${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[4, 5, 6].map((num) => (
                    <div key={num} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{num}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {t(`pages.index.tip${num}Title`)}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t(`pages.index.tip${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                Speed Reader
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
              {t('pages.index.footerDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
              <span>Built with Next.js & React</span>
              <span className="hidden sm:inline">•</span>
              <span>RSVP Technology</span>
              <span className="hidden sm:inline">•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

