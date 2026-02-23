import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { BookOpen, Target, TrendingUp, Zap, Moon, Sun, LogIn } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';

export function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const lifehacks = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Стратегия выполнения',
      description: 'Начинайте с заданий, которые даются легче всего. Это повысит уверенность и сэкономит время.',
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Работа с текстом',
      description: 'Внимательно читайте текст минимум 2 раза. Подчеркивайте ключевые моменты и делайте пометки.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Управление временем',
      description: 'Отводите на каждое задание не более 5-7 минут. Оставьте 30 минут на проверку в конце.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Проверка ответов',
      description: 'Всегда проверяйте свои ответы. Особое внимание уделите заданиям с развернутым ответом.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
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

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        
        {/* Diagonal Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent transform -rotate-12" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent transform rotate-12" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50" />
              <h1 className="relative text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ОГЭ 2026
              </h1>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-light">
            Платформа для подготовки к экзамену по русскому языку
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Практикуйтесь с реальными заданиями ФИПИ, отслеживайте свой прогресс и улучшайте результаты
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Войти в личный кабинет
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {[
            { title: 'База ФИПИ', description: 'Актуальные задания из официального банка ФИПИ', color: 'from-blue-500 to-cyan-500' },
            { title: 'Р. Дощинский', description: 'Дополнительные материалы для углубленной подготовки', color: 'from-purple-500 to-pink-500' },
            { title: 'Отслеживание прогресса', description: 'Детальная статистика по каждому заданию', color: 'from-green-500 to-emerald-500' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card className="relative p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl hover:scale-105 transition-transform duration-300 overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500`} />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Lifehacks Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Лайфхаки для сдачи ОГЭ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Проверенные советы для успешной сдачи экзамена
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lifehacks.map((lifehack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 h-full">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                      {lifehack.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                        {lifehack.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {lifehack.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 border-0 rounded-3xl shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готовы начать подготовку?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Войдите в личный кабинет и начните практиковаться прямо сейчас
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-2xl shadow-xl font-semibold"
            >
              Войти в систему
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
