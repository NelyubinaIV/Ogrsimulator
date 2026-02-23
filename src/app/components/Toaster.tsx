import { Toaster as Sonner } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

export function Toaster() {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
          color: theme === 'dark' ? '#f3f4f6' : '#111827',
        },
      }}
    />
  );
}
