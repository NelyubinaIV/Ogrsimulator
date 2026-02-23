import { Outlet } from 'react-router';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ProgressProvider } from '../contexts/ProgressContext';
import { Toaster } from './Toaster';

export function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
            <Outlet />
          </div>
          <Toaster />
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}