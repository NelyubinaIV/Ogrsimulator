import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Question {
  id: string;
  taskNumber: number;
  source: 'fipi' | 'doshinsky';
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface UserProgress {
  userId: string;
  completedQuestions: {
    [questionId: string]: {
      correct: boolean;
      timestamp: number;
      attempts: number;
    };
  };
  favorites: string[];
  uploadedFiles: {
    [taskNumber: string]: {
      filename: string;
      uploadDate: number;
      url: string;
    }[];
  };
}

interface ProgressContextType {
  progress: UserProgress | null;
  markQuestionComplete: (questionId: string, correct: boolean) => void;
  toggleFavorite: (questionId: string) => void;
  uploadFile: (taskNumber: number, file: { filename: string; url: string }) => void;
  getTaskProgress: (taskNumber: number) => { total: number; correct: number; incorrect: number };
  getWeakPoints: () => { taskNumber: number; incorrectCount: number }[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`progress_${user.id}`);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        const newProgress: UserProgress = {
          userId: user.id,
          completedQuestions: {},
          favorites: [],
          uploadedFiles: {},
        };
        setProgress(newProgress);
      }
    } else {
      setProgress(null);
    }
  }, [user]);

  useEffect(() => {
    if (progress && user) {
      localStorage.setItem(`progress_${user.id}`, JSON.stringify(progress));
    }
  }, [progress, user]);

  const markQuestionComplete = (questionId: string, correct: boolean) => {
    if (!progress) return;

    setProgress(prev => {
      if (!prev) return prev;
      
      const existing = prev.completedQuestions[questionId];
      return {
        ...prev,
        completedQuestions: {
          ...prev.completedQuestions,
          [questionId]: {
            correct,
            timestamp: Date.now(),
            attempts: existing ? existing.attempts + 1 : 1,
          },
        },
      };
    });
  };

  const toggleFavorite = (questionId: string) => {
    if (!progress) return;

    setProgress(prev => {
      if (!prev) return prev;
      
      const isFavorite = prev.favorites.includes(questionId);
      return {
        ...prev,
        favorites: isFavorite
          ? prev.favorites.filter(id => id !== questionId)
          : [...prev.favorites, questionId],
      };
    });
  };

  const uploadFile = (taskNumber: number, file: { filename: string; url: string }) => {
    if (!progress) return;

    setProgress(prev => {
      if (!prev) return prev;
      
      const taskKey = taskNumber.toString();
      const existing = prev.uploadedFiles[taskKey] || [];
      
      return {
        ...prev,
        uploadedFiles: {
          ...prev.uploadedFiles,
          [taskKey]: [
            ...existing,
            {
              ...file,
              uploadDate: Date.now(),
            },
          ],
        },
      };
    });
  };

  const getTaskProgress = (taskNumber: number) => {
    if (!progress) return { total: 0, correct: 0, incorrect: 0 };

    let total = 0;
    let correct = 0;
    let incorrect = 0;

    Object.entries(progress.completedQuestions).forEach(([questionId, data]) => {
      const qTaskNumber = parseInt(questionId.split('_')[1]);
      if (qTaskNumber === taskNumber) {
        total++;
        if (data.correct) correct++;
        else incorrect++;
      }
    });

    return { total, correct, incorrect };
  };

  const getWeakPoints = () => {
    if (!progress) return [];

    const taskStats: { [key: number]: { correct: number; incorrect: number } } = {};

    Object.entries(progress.completedQuestions).forEach(([questionId, data]) => {
      const taskNumber = parseInt(questionId.split('_')[1]);
      if (taskNumber >= 2 && taskNumber <= 12) {
        if (!taskStats[taskNumber]) {
          taskStats[taskNumber] = { correct: 0, incorrect: 0 };
        }
        if (data.correct) taskStats[taskNumber].correct++;
        else taskStats[taskNumber].incorrect++;
      }
    });

    return Object.entries(taskStats)
      .map(([taskNumber, stats]) => ({
        taskNumber: parseInt(taskNumber),
        incorrectCount: stats.incorrect,
        total: stats.correct + stats.incorrect,
        percentage: (stats.incorrect / (stats.correct + stats.incorrect)) * 100,
      }))
      .filter(item => item.incorrectCount > 0)
      .sort((a, b) => b.percentage - a.percentage);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markQuestionComplete,
        toggleFavorite,
        uploadFile,
        getTaskProgress,
        getWeakPoints,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
