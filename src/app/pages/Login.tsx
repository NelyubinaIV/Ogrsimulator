import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogIn, Moon, Sun, ArrowLeft, User, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    if (success) {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Назад
        </Button>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 md:p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Вход в систему
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Введите свои учетные данные для доступа
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                  Логин
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Введите логин"
                    className="pl-12 h-14 rounded-xl border-2 bg-white dark:bg-gray-800 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Пароль
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="pl-12 h-14 rounded-xl border-2 bg-white dark:bg-gray-800 text-lg"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Войти
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
