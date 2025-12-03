'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export function useSpeedReader(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wpm, setWpm] = useState(300);
  const [chunkSize, setChunkSize] = useState(1);
  const [showContext, setShowContext] = useState(true);
  const [pauseOnPunctuation, setPauseOnPunctuation] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [readingTime, setReadingTime] = useState(0);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const punctuationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Process text into words
  const words = text
    .split(/\s+/)
    .filter((word) => word.trim().length > 0)
    .map((word) => word.trim());

  const hasText = words.length > 0;
  const totalWords = words.length;

  const currentWord =
    chunkSize === 1
      ? words[currentWordIndex] || ''
      : words
          .slice(currentWordIndex, currentWordIndex + chunkSize)
          .join(' ');

  const progress = totalWords === 0 ? 0 : (currentWordIndex / totalWords) * 100;

  const remainingTime = Math.round(
    ((totalWords - currentWordIndex) / wpm) * 60
  );

  const totalWordsRead = currentWordIndex;

  // Clear all intervals and timeouts
  const clearAllTimers = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (punctuationTimeoutRef.current) {
      clearTimeout(punctuationTimeoutRef.current);
      punctuationTimeoutRef.current = null;
    }
  }, []);

  const stopReading = useCallback(() => {
    clearAllTimers();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, [clearAllTimers]);

  const startReading = useCallback(() => {
    // Clear all existing timers
    clearAllTimers();

    // Don't start if not supposed to be playing
    if (!isPlayingRef.current) {
      return;
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    const currentStartTime = startTime || Date.now();
    if (!startTime) {
      setStartTime(currentStartTime);
    }

    const interval = 60000 / wpm;

    const advanceWord = () => {
      // Double check if still playing
      if (!isPlayingRef.current) {
        clearAllTimers();
        return;
      }

      setCurrentWordIndex((prevIndex) => {
        if (prevIndex >= totalWords - chunkSize) {
          stopReading();
          return prevIndex;
        }

        const currentWord = words[prevIndex] || '';
        const hasPunctuation =
          pauseOnPunctuation && /[.!?;:]$/.test(currentWord);

        const nextIndex = prevIndex + chunkSize;

        // Update reading time
        setReadingTime((Date.now() - currentStartTime) / 1000);

        // If punctuation detected, pause longer but don't stop
        if (hasPunctuation && nextIndex < totalWords - chunkSize) {
          // Clear current interval
          clearAllTimers();
          
          // Resume after pause
          punctuationTimeoutRef.current = setTimeout(() => {
            // Check if still playing before resuming
            if (isPlayingRef.current) {
              intervalIdRef.current = setInterval(advanceWord, interval);
            }
          }, interval * 1.5);
          
          return nextIndex;
        }

        return nextIndex;
      });
    };

    intervalIdRef.current = setInterval(advanceWord, interval);
  }, [totalWords, chunkSize, wpm, pauseOnPunctuation, startTime, words, stopReading, clearAllTimers]);

  const toggleReading = useCallback(() => {
    if (!hasText) return;

    setIsPlaying((prev) => {
      const newValue = !prev;
      isPlayingRef.current = newValue;
      if (newValue) {
        // Use requestAnimationFrame to ensure state is updated
        requestAnimationFrame(() => {
          startReading();
        });
      } else {
        stopReading();
      }
      return newValue;
    });
  }, [hasText, startReading, stopReading]);

  const resetReading = useCallback(() => {
    // Stop reading first
    clearAllTimers();
    setIsPlaying(false);
    isPlayingRef.current = false;
    
    // Reset all state
    setCurrentWordIndex(0);
    setStartTime(null);
    setReadingTime(0);
  }, [clearAllTimers]);

  const adjustWPM = useCallback(
    (amount: number) => {
      setWpm((prev) => {
        const newWPM = prev + amount;
        if (newWPM >= 100 && newWPM <= 1000) {
          // If playing, stop and restart with new WPM
          const wasPlaying = isPlayingRef.current;
          if (wasPlaying) {
            // Clear timers but keep playing state
            clearAllTimers();
            // Use requestAnimationFrame to ensure state is updated before restarting
            requestAnimationFrame(() => {
              // Check if still supposed to be playing
              if (isPlayingRef.current) {
                startReading();
              }
            });
          }
          return newWPM;
        }
        return prev;
      });
    },
    [startReading, clearAllTimers]
  );

  const jumpToPosition = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalWords) {
        setCurrentWordIndex(index);
      }
    },
    [totalWords]
  );

  // Sync isPlayingRef with isPlaying state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Reset when text changes
  useEffect(() => {
    resetReading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return {
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
  };
}
