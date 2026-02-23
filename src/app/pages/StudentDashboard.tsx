import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';
import { getQuestions, generateOGEVariant } from '../data/questions';
import { FileUploader } from '../components/FileUploader';
import { LogOut, Moon, Sun, BookOpen, Target, TrendingDown, BarChart3, Filter, Shuffle, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { getTaskProgress, getWeakPoints, uploadFile } = useProgress();
  
  const [selectedSource, setSelectedSource] = useState<'fipi' | 'doshinsky'>('fipi');
  const [selectedTask, setSelectedTask] = useState<number>(2);
  const [filterMode, setFilterMode] = useState<'all' | 'new' | 'incorrect' | 'hideCorrect' | 'favorites'>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const startPractice = () => {
    navigate(`/questions/${selectedTask}?source=${selectedSource}&filter=${filterMode}`);
  };

  const generateVariant = () => {
    const variant = generateOGEVariant(selectedSource);
    localStorage.setItem('currentVariant', JSON.stringify(variant));
    toast.success('Вариант ОГЭ сгенерирован! Включены все 13 заданий.');
    navigate('/questions/variant?source=' + selectedSource);
  };

  const weakPoints = getWeakPoints();

  // Расчет общего прогресса
  const allTaskProgress = Array.from({ length: 11 }, (_, i) => i + 2).map(taskNum => {
    const progress = getTaskProgress(taskNum);
    return {
      taskNum,
      ...progress,
      percentage: progress.total > 0 ? (progress.correct / progress.total) * 100 : 0,
    };
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b-2 border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Личный кабинет ученика
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.name}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-400/10 to-blue-400/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Source Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Источник заданий
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant={selectedSource === 'fipi' ? 'default' : 'outline'}
                    className={`w-full justify-start h-12 rounded-xl ${
                      selectedSource === 'fipi'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : ''
                    }`}
                    onClick={() => setSelectedSource('fipi')}
                  >
                    База ФИПИ
                  </Button>
                  
                  <Button
                    variant={selectedSource === 'doshinsky' ? 'default' : 'outline'}
                    className={`w-full justify-start h-12 rounded-xl ${
                      selectedSource === 'doshinsky'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : ''
                    }`}
                    onClick={() => setSelectedSource('doshinsky')}
                  >
                    Р. Дощинский
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Task Number Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Номер задания
                  </h3>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 13 }, (_, i) => i + 1).map((num) => (
                    <Button
                      key={num}
                      variant={selectedTask === num ? 'default' : 'outline'}
                      className={`h-12 rounded-xl ${
                        selectedTask === num
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                          : ''
                      } ${
                        num === 1 || num === 13
                          ? 'border-orange-400 dark:border-orange-600'
                          : ''
                      }`}
                      onClick={() => setSelectedTask(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                
                {(selectedTask === 1 || selectedTask === 13) && (
                  <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl">
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                      ⚠️ Ручная проверка учителем
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Filter Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Фильтр заданий
                  </h3>
                </div>
                
                <Select value={filterMode} onValueChange={(val: any) => setFilterMode(val)}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все задания</SelectItem>
                    <SelectItem value="new">Только новые</SelectItem>
                    <SelectItem value="incorrect">Решенные неверно</SelectItem>
                    <SelectItem value="hideCorrect">Скрыть решенные правильно</SelectItem>
                    <SelectItem value="favorites">Только избранное</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-3"
            >
              <Button
                onClick={startPractice}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                Начать практику
              </Button>
              
              <Button
                onClick={generateVariant}
                variant="outline"
                className="w-full h-14 rounded-xl border-2 text-lg"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                Собрать вариант ОГЭ
              </Button>

              {(selectedTask === 1 || selectedTask === 13) && (
                <Button
                  variant="outline"
                  className="w-full h-14 rounded-xl border-2 border-orange-300 dark:border-orange-700 text-lg"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Загрузить файл
                </Button>
              )}
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Прогресс ученика
                  </h3>
                </div>

                <div className="space-y-4">
                  {allTaskProgress.map((task, index) => (
                    <motion.div
                      key={task.taskNum}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Задание {task.taskNum}
                        </span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            ✓ {task.correct}
                          </span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            ✗ {task.incorrect}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[60px] text-right">
                            {task.percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={task.percentage} className="h-3 rounded-full" colorByValue={true} />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Weak Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Слабые места
                  </h3>
                </div>

                {weakPoints.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Начните решать задания, чтобы увидеть статистику
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {weakPoints.slice(0, 5).map((weak, index) => (
                      <motion.div
                        key={weak.taskNumber}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl"
                      >
                        <div>
                          <span className="font-bold text-gray-900 dark:text-gray-100">
                            Задание {weak.taskNumber}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {weak.incorrectCount} неверных ответов
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => {
                            setSelectedTask(weak.taskNumber);
                            setFilterMode('incorrect');
                          }}
                        >
                          Практиковать
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Загрузить файл</DialogTitle>
          </DialogHeader>
          <FileUploader
            taskNumber={selectedTask}
            onUpload={(file) => {
              uploadFile(selectedTask, file);
              setShowUploadDialog(false);
              toast.success('Файл успешно загружен!');
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}