import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { StudentDetailReport } from '../components/StudentDetailReport';
import { LogOut, Moon, Sun, Users, FileText, TrendingUp, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentData {
  id: string;
  name: string;
  completedTasks: number;
  totalTasks: number;
  accuracy: number;
  uploadedFiles: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Загрузка данных всех студентов
    const loadStudentData = () => {
      const studentIds = ['1', '2', '3', '4'];
      const studentNames = [
        'Иванов Петр Сергеевич',
        'Смирнова Анна Владимировна',
        'Кузнецов Дмитрий Александрович',
        'Петрова Мария Ивановна'
      ];
      
      const studentData: StudentData[] = studentIds.map((id, index) => {
        const progress = localStorage.getItem(`progress_${id}`);
        if (progress) {
          const data = JSON.parse(progress);
          const completed = Object.keys(data.completedQuestions).length;
          const correct = Object.values(data.completedQuestions).filter((q: any) => q.correct).length;
          const accuracy = completed > 0 ? (correct / completed) * 100 : 0;
          const uploadedFiles = Object.values(data.uploadedFiles || {}).flat().length;

          return {
            id,
            name: studentNames[index],
            completedTasks: completed,
            totalTasks: 100,
            accuracy,
            uploadedFiles,
          };
        }
        return {
          id,
          name: studentNames[index],
          completedTasks: 0,
          totalTasks: 100,
          accuracy: 0,
          uploadedFiles: 0,
        };
      });

      setStudents(studentData);
    };

    loadStudentData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalStudents = students.length;
  const avgAccuracy = students.reduce((sum, s) => sum + s.accuracy, 0) / (students.length || 1);
  const totalUploaded = students.reduce((sum, s) => sum + s.uploadedFiles, 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b-2 border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Панель администратора
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Всего учеников</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalStudents}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Средняя точность</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {avgAccuracy.toFixed(0)}%
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Файлов на проверку</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalUploaded}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Список учеников
              </h2>
              <Button
                variant="outline"
                className="rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт отчета
              </Button>
            </div>

            <div className="overflow-x-auto rounded-2xl border-2 border-gray-200 dark:border-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-bold">Ученик</TableHead>
                    <TableHead className="font-bold">Выполнено заданий</TableHead>
                    <TableHead className="font-bold">Точность</TableHead>
                    <TableHead className="font-bold">Файлы на проверку</TableHead>
                    <TableHead className="font-bold">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    >
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{student.completedTasks}</span>
                          <span className="text-gray-400">/</span>
                          <span className="text-gray-500">{student.totalTasks}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${student.accuracy}%` }}
                            />
                          </div>
                          <span className="font-medium">{student.accuracy.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.uploadedFiles > 0 ? (
                          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                            {student.uploadedFiles}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setSelectedStudent({ id: student.id, name: student.name })}
                        >
                          Подробнее
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>

        {/* Files for Review */}
        {totalUploaded > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-6"
          >
            <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Файлы на проверку
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Задания 1 и 13 требуют ручной проверки
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                Всего файлов на проверку: <span className="font-bold">{totalUploaded}</span>
              </p>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Student Detail Report */}
      {selectedStudent && (
        <StudentDetailReport
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          open={selectedStudent !== null}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}