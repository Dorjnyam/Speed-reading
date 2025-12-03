'use client';

interface ProgressBarProps {
  progress: number;
  currentWordIndex: number;
  totalWords: number;
  remainingTime: number;
  currentWPM: number;
  totalWordsRead: number;
  readingTime: number;
  isPlaying: boolean;
  onJumpToPosition: (index: number) => void;
}

export function ProgressBar({
  progress,
  currentWordIndex,
  totalWords,
  remainingTime,
  currentWPM,
  totalWordsRead,
  readingTime,
  isPlaying,
  onJumpToPosition
}: ProgressBarProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Reading Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Word Position */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>
            Word {currentWordIndex + 1} of {totalWords}
          </span>
          <span>{remainingTime}s remaining</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentWPM}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Current WPM</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {totalWordsRead}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Words Read</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTime(readingTime)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Time Reading</div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Jump
          </span>
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => onJumpToPosition(0)}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Start
            </button>
            <button
              type="button"
              onClick={() => onJumpToPosition(Math.floor(totalWords * 0.25))}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => onJumpToPosition(Math.floor(totalWords * 0.5))}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => onJumpToPosition(Math.floor(totalWords * 0.75))}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              75%
            </button>
          </div>
        </div>

        {/* Position Slider */}
        <input
          type="range"
          value={currentWordIndex}
          max={totalWords - 1}
          min={0}
          onChange={(e) => onJumpToPosition(Number(e.target.value))}
          disabled={isPlaying}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
        />
      </div>
    </div>
  );
}

