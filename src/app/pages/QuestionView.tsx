import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { Question } from '../contexts/ProgressContext';
import { getQuestions } from '../data/questions';
import { ArrowLeft, ArrowRight, ChevronLeft, Check, X, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

export function QuestionView() {
  const navigate = useNavigate();
  const { taskNumber } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { progress, markQuestionComplete, toggleFavorite } = useProgress();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const source = searchParams.get('source') as 'fipi' | 'doshinsky' | null;
    const filter = searchParams.get('filter') || 'all';
    const isVariant = taskNumber === 'variant';

    let filteredQuestions: Question[] = [];

    if (isVariant) {
      const savedVariant = localStorage.getItem('currentVariant');
      if (savedVariant) {
        filteredQuestions = JSON.parse(savedVariant);
      }
    } else {
      const taskNum = parseInt(taskNumber || '2');
      filteredQuestions = getQuestions(taskNum, source || undefined);

      // Apply filters
      if (progress && filter !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => {
          const completed = progress.completedQuestions[q.id];
          
          if (filter === 'new') {
            return !completed;
          } else if (filter === 'incorrect') {
            return completed && !completed.correct;
          } else if (filter === 'hideCorrect') {
            return !completed || !completed.correct;
          } else if (filter === 'favorites') {
            return progress.favorites.includes(q.id);
          }
          return true;
        });
      }
    }

    setQuestions(filteredQuestions);
  }, [taskNumber, searchParams, user, navigate, progress]);

  const currentQuestion = questions[currentIndex];
  const progressPercentage = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    // Сортируем выбранные ответы для правильного сравнения
    const userAnswer = selectedAnswer.split(',').filter(Boolean).sort().join(',');
    const correctAnswer = currentQuestion.correctAnswer.split(',').filter(Boolean).sort().join(',');
    const correct = userAnswer === correctAnswer;
    
    setIsCorrect(correct);
    setShowResult(true);
    markQuestionComplete(currentQuestion.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setShowExplanation(false);
    } else {
      navigate(-1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer('');
      setShowResult(false);
      setShowExplanation(false);
    }
  };

  const handleToggleFavorite = () => {
    if (currentQuestion) {
      toggleFavorite(currentQuestion.id);
    }
  };

  const isFavorite = currentQuestion && progress?.favorites.includes(currentQuestion.id);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Нет доступных вопросов с выбранными фильтрами
          </p>
          <Button onClick={() => navigate(-1)}>
            Вернуться назад
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header with Progress */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b-2 border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Назад
            </Button>

            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Вопрос {currentIndex + 1} из {questions.length}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={`rounded-full ${isFavorite ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600' : ''}`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Прогресс выполнения
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3 rounded-full" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-8 md:p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl">
            {/* Question Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                {currentQuestion.taskNumber}
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Задание {currentQuestion.taskNumber}
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Источник: {currentQuestion.source === 'fipi' ? 'База ФИПИ' : 'Р. Дощинский'}
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <p className="text-lg md:text-xl text-gray-900 dark:text-gray-100 leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options ? (
                // Multiple choice with checkboxes
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Card
                      key={index}
                      className={`p-4 cursor-pointer border-2 transition-all duration-200 ${
                        selectedAnswer.includes(index.toString())
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                      }`}
                      onClick={() => {
                        const indexStr = index.toString();
                        if (selectedAnswer.includes(indexStr)) {
                          setSelectedAnswer(selectedAnswer.split(',').filter(i => i !== indexStr).join(','));
                        } else {
                          setSelectedAnswer(selectedAnswer ? selectedAnswer + ',' + indexStr : indexStr);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedAnswer.includes(index.toString())}
                          className="mt-1"
                        />
                        <span className="flex-1 text-gray-900 dark:text-gray-100">
                          {option}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                // Text input
                <Input
                  type="text"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Введите ваш ответ"
                  className="h-16 text-lg rounded-xl border-2"
                  disabled={showResult}
                />
              )}
            </div>

            {/* Result */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-2xl mb-6 ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                    : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {isCorrect ? (
                    <>
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xl font-bold text-green-700 dark:text-green-400">
                        Правильно!
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xl font-bold text-red-700 dark:text-red-400">
                        Неправильно
                      </span>
                    </>
                  )}
                </div>
                
                {!isCorrect && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Правильный ответ: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                  </p>
                )}
              </motion.div>
            )}

            {/* Explanation */}
            {currentQuestion.explanation && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="w-full justify-start h-14 rounded-xl border-2"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  {showExplanation ? 'Скрыть объяснение' : 'Показать объяснение'}
                </Button>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl"
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1 h-14 rounded-xl border-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Назад
              </Button>

              {!showResult ? (
                <Button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg"
                >
                  Проверить ответ
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      Следующий вопрос
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    'Завершить'
                  )}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}